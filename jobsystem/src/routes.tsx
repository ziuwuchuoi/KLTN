import { Routes, Route } from "react-router-dom";
import PageHome from "./pages/Home/PageHome";
// import PermissionCheckWrapper from "./PermissionCheckWrapper";

import PageSignin from "./pages/Authentication/PageSignin";
import PageSignup from "./pages/Authentication/PageSignup";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<PageHome />} />
        <Route path="/signin" element={<PageSignin />} />
        <Route path="/signup" element={<PageSignup />} />
    </Routes>
);

export default AppRoutes;
