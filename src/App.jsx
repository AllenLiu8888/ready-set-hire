// =============================================================================
// Main Application Component - Route configuration and page structure
// CN: 主应用组件 - 路由配置和页面结构
// =============================================================================
// This component defines the application's routing structure, organizing pages
// into admin management sections and public interview flows.
// CN: 该组件定义应用程序的路由结构，将页面组织为管理员管理部分和公共面试流程。
// =============================================================================

import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/AppLayout.jsx'
import InterviewsPage from './pages/interviews/InterviewsPage.jsx'
import QuestionsPage from './pages/questions/QuestionsPage.jsx'
import ApplicantsPage from './pages/applicants/ApplicantsPage.jsx'
import TakeInterviewPage from './pages/take-interview/TakeInterviewPage.jsx'
import WelcomeTakeInterview from './pages/take-interview/WelcomeTakeInterview.jsx'
import InterviewCompletePage from './pages/take-interview/InterviewCompletePage.jsx'
import NotFoundPage from './pages/NotFound.jsx'
import DashboardPage from './pages/Dashboard.jsx'
import EditInterviewDrawer from './pages/interviews/EditInterviewDrawer.jsx'
import EditQuestionDrawer from './pages/questions/CreateQuestionDrawer.jsx'
import EditApplicantDrawer from './pages/applicants/CreateApplicantDrawer.jsx'

/**
 * Main Application component with routing configuration
 * CN: 带路由配置的主应用组件
 */
function App() {
  return (
    <Routes>
      {/* =================================================================== */}
      {/* Admin Management Routes - Nested within main layout */}
      {/* CN: 管理员管理路由 - 嵌套在主布局中 */}
      {/* =================================================================== */}
      <Route path="/" element={<Layout />}>
        {/* Dashboard - Main overview page */}
        {/* CN: 仪表板 - 主概览页面 */}
        <Route index element={<DashboardPage />} />
        
        {/* Interview Management Routes */}
        {/* CN: 面试管理路由 */}
        <Route path="interviews" >
          <Route index element={<InterviewsPage />} />
          <Route path="interviews/:id/edit" element={<EditInterviewDrawer />} />
          <Route path="interviews/create" element={<EditInterviewDrawer />} />
        </Route>
        
        {/* Question Management Routes */}
        {/* CN: 问题管理路由 */}
        <Route path="questions" >
          <Route index element={<QuestionsPage />} />
          <Route path="questions/:id/edit" element={<EditQuestionDrawer />} />
          <Route path="questions/create" element={<EditQuestionDrawer />} />
        </Route>
        
        {/* Applicant Management Routes */}
        {/* CN: 候选人管理路由 */}
        <Route path="applicants" >
          <Route index element={<ApplicantsPage />} />
          <Route path="applicants/:id/edit" element={<EditApplicantDrawer />} />
          <Route path="applicants/create" element={<EditApplicantDrawer />} />
        </Route>
      </Route>
      
      {/* =================================================================== */}
      {/* Public Interview Routes - Outside of main layout */}
      {/* CN: 公共面试路由 - 主布局之外 */}
      {/* =================================================================== */}
      
      {/* Legacy home redirect */}
      {/* CN: 旧版主页重定向 */}
      <Route path="home" element={<Navigate to="/" replace />} />
      
      {/* Interview taking flow for applicants */}
      {/* CN: 候选人面试流程 */}
      <Route path="take/:applicantId" element={<WelcomeTakeInterview />} />
      <Route path="take/:applicantId/interview" element={<TakeInterviewPage />} />
      <Route path="take/:applicantId/complete" element={<InterviewCompletePage />} />
      
      {/* 404 Not Found fallback */}
      {/* CN: 404未找到回退 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
