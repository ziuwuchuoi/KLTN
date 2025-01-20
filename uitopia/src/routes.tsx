// import { Routes, Route, Navigate } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import PermissionCheckWrapper from "./PermissionCheckWrapper";
// import PageLogin from "./pages/PageLogin";
// import PageSignup from "./pages/PageSignup";
// import PageChat from "./pages/chat/PageChat";
// import PageLanding from "./pages/landing/PageLanding";
// import PageAssistant from "./pages/assistant/PageAssistant";
// import PageKnowledge from "./pages/knowledge/PageKnowledge";
// import PageOrchestration from "./pages/orchestration/PageOrchestration";
// import PageUserManagement from "./pages/admin/PageUserManagement";
// import PageUserAnalysis from "./pages/admin/PageUserAnalysis";

// import TabKnowledgeLibrary from "./pages/knowledge/TabKnowledgeLibrary";
// import TabKnowledgeBuild from "./pages/knowledge/TabKnowledgeBuild";
// import TabKnowledgeRefine from "./pages/knowledge/TabKnowledgeRefine";
// import TabAssistantBuild from "./pages/assistant/TabAssistantBuild";
// import TabAssistantLibrary from "./pages/assistant/TabAssistantLibrary";
// import TabAssistantValidate from "./pages/assistant/TabAssitantValidate";

// const AppRoutes = () => (
//     <Routes>
//         <Route element={<HomePage />}>
//             {/* Public Routes */}
//             <Route path="/login" element={<PageLogin />} />
//             <Route path="/signup" element={<PageSignup />} />

//             {/* Protected Routes */}
//             <Route
//                 element={
//                     <PermissionCheckWrapper
//                         requiredRoles={["user", "admin", "activeUser", "innovator", "coordinator"]}
//                     />
//                 }
//             >
//                 <Route path="/" element={<Navigate to="/chat" />} />4
//                 <Route path="/home" element={<PageLanding />} />
//                 <Route path="/chat" element={<PageChat />} />
//                 <Route path="/chat/:chat_id" element={<PageChat />} />
//                 {/* Assistant routes with nested children */}
//                 <Route path="/assistant" element={<PageAssistant />}>
//                     {/* index route -> /assistant */}
//                     <Route index element={<TabAssistantLibrary />} />
//                     {/* build route -> /assistant/:assistant_id */}
//                     <Route path=":assistant_id" element={<TabAssistantBuild />} />
//                     <Route path=":assistant_id/preview" element={<TabAssistantValidate />} />
//                 </Route>
//                 <Route path="/orchestration" element={<PageOrchestration />} />
//                 {/* Knowledge routes with nested children */}
//                 <Route path="/knowledge" element={<PageKnowledge />}>
//                     {/* index route -> /knowledge */}
//                     <Route index element={<TabKnowledgeLibrary />} />
//                     {/* knowledge build -> /knowledge/:knowledge_id */}
//                     <Route path=":knowledge_id" element={<TabKnowledgeBuild />} />
//                     <Route path=":knowledge_id/preview" element={<TabKnowledgeBuild />} />
//                     {/* knowledge refine -> /knowledge/:knowledge_id/refine */}
//                     <Route path=":knowledge_id/refine/:file_id" element={<TabKnowledgeRefine />} />
//                 </Route>
//             </Route>

//             <Route element={<PermissionCheckWrapper requiredRoles={["admin"]} />}>
//                 <Route path="/team" element={<PageUserManagement />} />
//             </Route>
//             {/* Admin Routes */}
//             <Route element={<PermissionCheckWrapper requiredRoles={["admin", "coordinator"]} />}>
//                 <Route path="/analysis" element={<PageUserAnalysis />} />
//             </Route>
//         </Route>
//     </Routes>
// );

// export default AppRoutes;
