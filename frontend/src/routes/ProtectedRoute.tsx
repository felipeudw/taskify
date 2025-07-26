import {Navigate} from "react-router";
import {useAuthStore} from "@/store/authStore";
import type {JSX} from "react";

export function ProtectedRoute({children}: { children: JSX.Element }) {
    const token = useAuthStore((state) => state.token);
    if (!token) {
        return <Navigate to="/login" replace/>;
    }
    return children;
}
