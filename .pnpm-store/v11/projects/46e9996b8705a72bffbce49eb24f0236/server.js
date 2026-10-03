import express from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { initDB } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import folderRouter from "./routes/folderRoutes.js";
import fileRouter from "./routes/fileRoutes.js";
import trashRouter from "./routes/trashRoutes.js";
import shareRouter from "./routes/shareRoutes.js";

const app = express()

// CORS must answer a browser preflight before Clerk attempts to parse it. Support
// common quoted .env values while still allowlisting only exact trusted origins.
const allowedOrigins = (process.env.ORIGINS || process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim().replace(/^['"]|['"]$/g, "").replace(/\/$/, ""))
    .filter(Boolean);

const corsOptions = {
    origin(origin, callback) {
        // Requests without an Origin are non-browser clients (health checks, etc.).
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

// Applied at the app level so cors responds to every OPTIONS preflight with the
// allowlisted origin before Clerk sees an unauthenticated OPTIONS request.
app.use(cors(corsOptions));

// Runs before API routes to verify Clerk Authorization bearer tokens.
app.use(clerkMiddleware({
    authorizedParties: allowedOrigins,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
}));

// Middlewares
app.use(express.json({limit: "100mb"}))

// Root API
app.get("/", (_req, res) => res.send("Server is Running"))

// App API routes
app.use("/api/auth", authRouter)
app.use("/api/folders", folderRouter)
app.use("/api/files", fileRouter)
app.use("/api/trash", trashRouter)
app.use("/api/shares", shareRouter)

// Error Handling Middleware
app.use((err, _req, res, _next)=>{
    res.status(err.status || 500).json({error: err.message || "Something went wrong!" })
})

const port = process.env.PORT || 3000;

// Initialize DB connection then start server
initDB().then(()=>{
    app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`)
    })
})

