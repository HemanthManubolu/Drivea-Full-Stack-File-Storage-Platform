import { createClerkClient, getAuth } from "@clerk/express";
import { sql } from "../config/db.js";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
const userFields = "id, clerk_user_id, name, email, storage_used, storage_limit, created_at, updated_at";

const getVerifiedPrimaryEmail = (clerkUser) => {
    const primary = clerkUser.emailAddresses.find((address) => address.id === clerkUser.primaryEmailAddressId);
    if (!primary || primary.verification?.status !== "verified") return null;
    return primary.emailAddress.toLowerCase();
};

const profileName = (clerkUser) => {
    const primaryEmail = clerkUser.emailAddresses.find((address) => address.id === clerkUser.primaryEmailAddressId)?.emailAddress;
    return [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim()
        || clerkUser.username
        || primaryEmail?.split("@")[0]
        || "Drivea user";
};

const accountLinkConflict = () => {
    const error = new Error("This email is already linked to another Drivea account.");
    error.status = 409;
    return error;
};

// A Clerk user ID is immutable and cannot be reissued. Reclaiming a mapping is
// safe only after Clerk definitively confirms its previous identity was deleted.
// Network/API failures are deliberately not treated as deletion.
const isDeletedClerkUser = async (clerkUserId) => {
    try {
        await clerkClient.users.getUser(clerkUserId);
        return false;
    } catch (error) {
        if (error.status === 404) return true;
        throw error;
    }
};

const syncDriveaUser = async ({ clerkUserId, clerkUser }) => {
    const email = getVerifiedPrimaryEmail(clerkUser);
    if (!email) {
        const error = new Error("A verified email address is required to use Drivea.");
        error.status = 403;
        throw error;
    }

    const name = profileName(clerkUser);
    const [byClerkId] = await sql`SELECT ${sql.unsafe(userFields)} FROM users WHERE clerk_user_id = ${clerkUserId}`;
    if (byClerkId) {
        const [updated] = await sql`
            UPDATE users SET name = ${name}, email = ${email}, updated_at = NOW()
            WHERE id = ${byClerkId.id}
            RETURNING ${sql.unsafe(userFields)}
        `;
        return updated;
    }

    // A verified-email match preserves pre-Clerk files and folders without trusting
    // a browser-supplied identity. An existing active Clerk mapping is never replaced.
    const [byEmail] = await sql`SELECT id, clerk_user_id FROM users WHERE email = ${email}`;
    if (byEmail) {
        if (byEmail.clerk_user_id && byEmail.clerk_user_id !== clerkUserId) {
            if (!(await isDeletedClerkUser(byEmail.clerk_user_id))) {
                throw accountLinkConflict();
            }

            const [relinked] = await sql`
                UPDATE users SET clerk_user_id = ${clerkUserId}, name = ${name}, email = ${email}, updated_at = NOW()
                WHERE id = ${byEmail.id} AND clerk_user_id = ${byEmail.clerk_user_id}
                RETURNING ${sql.unsafe(userFields)}
            `;
            if (relinked) return relinked;

            // A concurrent request changed the row. Re-read the authoritative
            // mapping instead of overwriting another account's identity.
            const [concurrentlyLinked] = await sql`SELECT ${sql.unsafe(userFields)} FROM users WHERE clerk_user_id = ${clerkUserId}`;
            if (concurrentlyLinked) return concurrentlyLinked;
            throw accountLinkConflict();
        }
        const [linked] = await sql`
            UPDATE users SET clerk_user_id = ${clerkUserId}, name = ${name}, updated_at = NOW()
            WHERE id = ${byEmail.id} AND clerk_user_id IS NULL
            RETURNING ${sql.unsafe(userFields)}
        `;
        if (linked) return linked;
    }

    const storageLimit = Number(process.env.MAX_STORAGE_PER_USER || 1073741824);
    const [created] = await sql`
        INSERT INTO users (clerk_user_id, name, email, storage_limit)
        VALUES (${clerkUserId}, ${name}, ${email}, ${storageLimit})
        ON CONFLICT (clerk_user_id) WHERE clerk_user_id IS NOT NULL
        DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, updated_at = NOW()
        RETURNING ${sql.unsafe(userFields)}
    `;
    return created;
};

// Clerk validates the session token. Controllers keep using the internal Drivea UUID,
// so every existing owner_id relationship remains intact.
export const protect = async (req, res, next) => {
    try {
        const auth = getAuth(req);
        if (!auth.isAuthenticated || !auth.userId) {
            return res.status(401).json({ error: "Unauthorized." });
        }

        const clerkUser = await clerkClient.users.getUser(auth.userId);
        const user = await syncDriveaUser({ clerkUserId: auth.userId, clerkUser });
        req.user = { ...user, clerkUserId: auth.userId };
        return next();
    } catch (error) {
        if (error.status) return res.status(error.status).json({ error: error.message });
        return res.status(401).json({ error: "Unable to verify your session." });
    }
};
