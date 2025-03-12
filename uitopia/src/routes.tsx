import { Routes, Route, Navigate } from "react-router-dom";
import PageHome from "./pages/Home/PageHome";
// import PermissionCheckWrapper from "./PermissionCheckWrapper";

import PageSignin from "./pages/Authentication/PageSignin";
import PageSignup from "./pages/Authentication/PageSignup";
import PageAccommodation from "./pages/Accommodation/PageAccommodation";
import PageTransportation from "./pages/Transportation/PageTransportation";
import PageEntertainment from "./pages/Entertainment/PageEntertainment";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<PageHome />} />
        <Route path="/signin" element={<PageSignin />} />
        <Route path="/signup" element={<PageSignup />} />
        <Route path="/accommodations" element={<PageAccommodation />} />
        <Route path="/transportations" element={<PageTransportation />} />
        <Route path="/entertainment" element={<PageEntertainment />} />
    </Routes>
);

export default AppRoutes;
