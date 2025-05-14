import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./stores/useAuthStore";

const PermissionCheckWrapper = ({ requiredRoles = ["candidate"] }) => {
    const { user } = useAuthStore();
    const location = useLocation();

    if (!user) {
        const redirectRole = "candidate";
        const redirectPath = `/signin/${redirectRole}?redirect=${encodeURIComponent(location.pathname)}`;
        return <Navigate to={redirectPath} replace />;
    }

    const hasRequiredRole = user.roles?.some((role) => requiredRoles.includes(role));
    if (!hasRequiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default PermissionCheckWrapper;
