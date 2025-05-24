import { Routes, Route, Navigate } from "react-router-dom";

// layout
import Layout from "./components/molecules/Layout";

// public pages
import PageSignin from "./pages/Authentication/PageSignin";
import PageSignup from "./pages/Authentication/PageSignup";
import PageLanding from "./pages/Landing/PageLanding";

// protected pages
import PageAIInterview from "./pages/AIInterview/PageAIInterview";
import PageCVEvaluation from "./pages/CVEvaluation/PageCVEvaluation";
import PageQuiz from "./pages/Quizz/PageQuiz";
import PageTechnicalQuiz from "./pages/Quizz/PageTechnicalQuiz";
import PageCaseQuiz from "./pages/Quizz/PageCaseQuiz";
import PagePersonalityQuiz from "./pages/Quizz/PagePersonalityQuiz";
import PageQuizDetail from "./pages/Quizz/PageQuizDetail";
import PageLiveCoding from "./pages/LiveCoding/PageLiveCoding";

// dashboard pages (admin only)
import PageDashboard from "./pages/Dashboard/PageDashboard";
import TabAnalysis from "./pages/Dashboard/TabAnalysis";
import TabCandidate from "./pages/Dashboard/TabCandidate";
import TabRecruiter from "./pages/Dashboard/TabRecruiter";

// permission wrapper
import PermissionCheckWrapper from "./PermissionCheckWrapper";
import PageUnauthorized from "./pages/Landing/PageUnauthorized";
import TabApplication from "./pages/Dashboard/TabApplication";
import TabJobDescription from "./pages/Dashboard/TabJobDescription";
import PageProblemCodingDetail from "./pages/LiveCoding/PageProblemCodingDetail";

const AppRoutes = () => (
    <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<PageSignin />} />
        <Route path="/signin/:role" element={<PageSignin />} />
        <Route path="/signup/:role" element={<PageSignup />} />

        {/* Authenticated Routes: user, admin, candidate */}
        <Route element={<PermissionCheckWrapper requiredRoles={["admin", "recruiter", "candidate"]} />}>
            <Route path="/" element={<Layout />}>
                <Route index element={<PageLanding />} />
                <Route path="ai-interview" element={<PageAIInterview />} />
                <Route path="cv-evaluation" element={<PageCVEvaluation />} />

                {/* Quizzes */}
                <Route path="quiz" element={<PageQuiz />} />
                <Route path="quiz/technical" element={<PageTechnicalQuiz />} />
                <Route path="quiz/case" element={<PageCaseQuiz />} />
                <Route path="quiz/personality" element={<PagePersonalityQuiz />} />
                <Route path="quiz/technical/:quizId" element={<PageQuizDetail />} />
                <Route path="quiz/case/:quizId" element={<PageQuizDetail />} />
                <Route path="quiz/personality/:quizId" element={<PageQuizDetail />} />

                {/* Live Coding */}
                <Route path="live-coding" element={<PageLiveCoding />} />
                <Route path="live-coding/:codingId" element={<PageProblemCodingDetail />} />

                {/* Landing (optional for user) */}
                <Route path="home" element={<PageLanding />} />
            </Route>
        </Route>

        {/* Admin-only Routes */}
        <Route element={<PermissionCheckWrapper requiredRoles={["admin", "recruiter"]} />}>
            <Route path="/dashboard" element={<PageDashboard />}>
                <Route path="analysis" element={<TabAnalysis />} />
                <Route path="candidates" element={<TabCandidate />} />
                <Route path="recruiters" element={<TabRecruiter />} />
                <Route path="applications" element={<TabApplication />} />
                <Route path="jobdescriptions" element={<TabJobDescription />} />
            </Route>
        </Route>

        <Route path="/unauthorized" element={<PageUnauthorized />} />
    </Routes>
);

export default AppRoutes;
