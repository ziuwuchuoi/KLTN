import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./stores/useAuthStore";

const PermissionCheckWrapper = ({ requiredRoles = ["candidate"] }) => {
    const { user, admin } = useAuthStore();
    const location = useLocation();
    const path = encodeURIComponent(location.pathname);

    if (!user && !admin) {
        const role = user ? "candidate" : "admin";
        return <Navigate to={`/signin/${role}?redirect=${path}`} replace />;
    }

    const allRoles = [...(user?.roles ?? []), admin?.role];
    const hasRequiredRole = allRoles.some((role) => requiredRoles.includes(role));

    if (!hasRequiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default PermissionCheckWrapper;
