import {useAuthStore} from "@/store/authStore";
import {Navigate} from "react-router";

export function ProtectedRoute({children}: { children: React.ReactNode }) {
    const token = useAuthStore((s) => s.token);

    if (!token) {
        return <Navigate to="/" replace/>;
    }

    return <>{children}</>;
}
