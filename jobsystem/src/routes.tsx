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
import PageQuizDetail from "./pages/Quizz/PageQuizDetail";
import PageCodeProblems from "./pages/LiveCoding/PageLiveCoding";
import PageProblemCodingDetail from "./pages/LiveCoding/PageProblemCodingDetail";
import PageJobs from "./pages/Job/PageJob";
import PageJobDetail from "./pages/Job/PageJobDetail";
import PageTestSetOverview from "./pages/TestSet/PageTestsetOverview";
import PageTestSetTaking from "./pages/TestSet/PageTestsetTaking";
import PageTestSetCompleted from "./pages/TestSet/PageTestsetCompleted";

// dashboard pages (admin only)
import PageDashboard from "./pages/Dashboard/PageDashboard";
import TabAnalysis from "./pages/Dashboard/TabAnalysis";
import TabCandidate from "./pages/Dashboard/TabCandidate";
import TabRecruiter from "./pages/Dashboard/TabRecruiter";

// dashboard pages (recruiters)
import TabApplication from "./pages/Dashboard/TabApplication";
import TabJobDescription from "./pages/Dashboard/TabJobDescription";
import TabTestset from "./pages/Dashboard/TabTestSet";

// permission wrapper
import PermissionCheckWrapper from "./PermissionCheckWrapper";
import PageUnauthorized from "./pages/Landing/PageUnauthorized";

// profile
import PageProfile from "./pages/Profile/PageProfile";

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
                <Route path="evaluate-cv" element={<PageCVEvaluation />} />

                {/* Regular Quizzes */}
                <Route path="quiz" element={<PageQuiz />} />
                <Route path="quiz/technical" element={<PageTechnicalQuiz />} />
                <Route path="quiz/technical/:quizId" element={<PageQuizDetail />} />

                {/* Regular Coding Problem */}
                <Route path="code" element={<PageCodeProblems />} />
                <Route path="code/:codingId" element={<PageProblemCodingDetail />} />

                {/* TestSet Routes */}
                <Route path="testset/:testSetId/:jdId/overview" element={<PageTestSetOverview />} />
                <Route path="testset/:testSetId/:jdId/take" element={<PageTestSetTaking />} />
                <Route path="testset/:testSetId/:jdId/completed" element={<PageTestSetCompleted />} />

                {/* TestSet Quiz and Code Routes */}
                <Route path="testset/quiz/:quizId" element={<PageQuizDetail />} />
                <Route path="testset/code/:codingId" element={<PageProblemCodingDetail />} />

                {/* Jobs */}
                <Route path="jobs" element={<PageJobs />} />
                <Route path="jobs/:jobId" element={<PageJobDetail />} />

                {/* Landing (optional for user) */}
                <Route path="home" element={<PageLanding />} />
                <Route path="profile" element={<PageProfile />} />
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
                <Route path="testsets" element={<TabTestset />} />
            </Route>
        </Route>

        <Route path="/unauthorized" element={<PageUnauthorized />} />
    </Routes>
);

export default AppRoutes;
