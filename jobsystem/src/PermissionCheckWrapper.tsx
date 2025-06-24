import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./stores/useAuthStore";

const PermissionCheckWrapper = ({ requiredRoles = ["candidate"] }) => {
    const { token, role } = useAuthStore();
    const location = useLocation();
    const path = encodeURIComponent(location.pathname);

    if (!token || !role) {
        return <Navigate to={`/signin/candidate?redirect=${path}`} replace />;
    }

    const hasRequiredRole = requiredRoles.includes(role);

    if (!hasRequiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default PermissionCheckWrapper;
