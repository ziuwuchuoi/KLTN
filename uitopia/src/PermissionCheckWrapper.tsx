// import React from "react";
// import { Outlet, Navigate, useLocation } from "react-router-dom";
// import { useAuthStore } from "./stores/useAuthStore";

// const PermissionCheckWrapper = ({ requiredRoles = ["user"] }) => {
//     const { user } = useAuthStore();
//     const location = useLocation();

//     if (!user) {
//         // Append intended path as a "redirect" query parameter in the login URL
//         return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
//     }

//     if (!requiredRoles.includes(user.role)) {
//         return <Navigate to="/chat" replace />;
//     }

//     return <Outlet />;
// };

// export default PermissionCheckWrapper;
