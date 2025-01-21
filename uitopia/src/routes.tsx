import { Routes, Route} from "react-router-dom";
import PageHome from "./pages/PageHome";
import PageSignIn from "./pages/authentication/PageSignIn";
import PageSignUp from "./pages/authentication/PageSignUp";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<PageHome />} />
        <Route path="/signin" element={<PageSignIn />} />
        <Route path="/signup" element={<PageSignUp />} />
    </Routes>
);

export default AppRoutes;

