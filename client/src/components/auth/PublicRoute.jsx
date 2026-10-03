import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { Spinner } from "../ui/Spinner";

// Prevent Clerk's prebuilt auth pages from being shown once a session exists.
// Drivea's protected route still waits for /api/auth/me before rendering data.
const PublicRoute = () => {
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Spinner size="lg" className="text-orange-600" />
            </div>
        );
    }

    return isSignedIn ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
