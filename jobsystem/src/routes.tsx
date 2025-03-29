import { Routes, Route } from "react-router-dom";
import PageHome from "./pages/Home/PageHome";
import PageLanding from "./pages/Landing/PageLanding";
// import PermissionCheckWrapper from "./PermissionCheckWrapper";

import PageSignin from "./pages/Authentication/PageSignin";
import PageSignup from "./pages/Authentication/PageSignup";

// features
import PageAIInterview from "./pages/AIInterview/PageAIInterview";
import PageCVEvaluation from "./pages/CVEvaluation/PageCVEvaluation";
import PageTechnicalQuiz from "./pages/TechnicalQuiz/PageTechnicalQuiz";
import PageLiveCoding from "./pages/LiveCoding/PageLiveCoding";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<PageLanding />} />
        <Route path="/signin" element={<PageSignin />} />
        <Route path="/signup" element={<PageSignup />} />
        <Route path="/ai-interview" element={<PageAIInterview />} />
        <Route path="/cv-evaluation" element={<PageCVEvaluation />} />
        <Route path="/technical-quiz" element={<PageTechnicalQuiz />} />
        <Route path="/live-coding" element={<PageLiveCoding />} />
    </Routes>
);

export default AppRoutes;
