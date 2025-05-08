import { Routes, Route } from "react-router-dom";
import PageLanding from "./pages/Landing/PageLanding";
// import PermissionCheckWrapper from "./PermissionCheckWrapper";

// authentication
import PageSignin from "./pages/Authentication/PageSignin";
import PageSignup from "./pages/Authentication/PageSignup";

// features
// ai interview
import PageAIInterview from "./pages/AIInterview/PageAIInterview";

// cv evaluation
import PageCVEvaluation from "./pages/CVEvaluation/PageCVEvaluation";

// quizzes
import PageQuiz from "./pages/Quizz/PageQuiz";
import PageTechnicalQuiz from "./pages/Quizz/PageTechnicalQuiz";
import PageCaseQuiz from "./pages/Quizz/PageCaseQuiz";
import PagePersonalityQuiz from "./pages/Quizz/PagePersonalityQuiz";

// live coding
import PageLiveCoding from "./pages/LiveCoding/PageLiveCoding";
import CustomHeader from "./components/molecules/CustomHeader";
import Layout from "./components/molecules/Layout";
import PageQuizDetail from "./pages/Quizz/PageQuizDetail";

const AppRoutes = () => (
    <Routes>
        <Route path="/signin" element={<PageSignin />} />
        <Route path="/signin/:role" element={<PageSignin />} />
        <Route path="/signup/:role" element={<PageSignup />} />
        <Route path="/" element={<Layout />}>
            <Route path="/" element={<PageLanding />} />
            {/* authentication */}
            {/* ai interview */}
            <Route path="/ai-interview" element={<PageAIInterview />} />
            {/* cv evaluation */}
            <Route path="/cv-evaluation" element={<PageCVEvaluation />} />
            {/* quiz */}
            {/* dont know if i should nest this */}
            <Route path="/quiz" element={<PageQuiz />} />
            <Route path="/quiz/technical" element={<PageTechnicalQuiz />} />
            <Route path="/quiz/case" element={<PageCaseQuiz />} />
            <Route path="/quiz/personality" element={<PagePersonalityQuiz />} />
            <Route path="/quiz/technical/:quizId" element={<PageQuizDetail />} />
            <Route path="/quiz/case/:quizId" element={<PageQuizDetail />} />
            <Route path="/quiz/personality/:quizId" element={<PageQuizDetail />} />

            {/* live coding */}
            <Route path="/live-coding" element={<PageLiveCoding />} />
        </Route>
    </Routes>
);

export default AppRoutes;
