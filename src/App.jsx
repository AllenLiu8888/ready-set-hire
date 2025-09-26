// =============================================================================
// Main Application Component - Route configuration and page structure
// =============================================================================
// This component defines the application's routing structure, organizing pages
// into admin management sections and public interview flows.
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
 * Main Application component with routing configuration.
 */
function App() {
  return (
    <Routes>
      {/* =================================================================== */}
      {/* Admin Management Routes - Nested within main layout */}
      {/* =================================================================== */}
      <Route path="/" element={<Layout />}>
        {/* Dashboard - Main overview page */}
        <Route index element={<DashboardPage />} />
        
        {/* Interview Management Routes */}
        <Route path="interviews" >
          <Route index element={<InterviewsPage />} />
          <Route path="interviews/:id/edit" element={<EditInterviewDrawer />} />
          <Route path="interviews/create" element={<EditInterviewDrawer />} />
        </Route>
        
        {/* Question Management Routes */}
        <Route path="questions" >
          <Route index element={<QuestionsPage />} />
          <Route path="questions/:id/edit" element={<EditQuestionDrawer />} />
          <Route path="questions/create" element={<EditQuestionDrawer />} />
        </Route>
        
        {/* Applicant Management Routes */}
        <Route path="applicants" >
          <Route index element={<ApplicantsPage />} />
          <Route path="applicants/:id/edit" element={<EditApplicantDrawer />} />
          <Route path="applicants/create" element={<EditApplicantDrawer />} />
        </Route>
      </Route>
      
      {/* =================================================================== */}
      {/* Public Interview Routes - Outside of main layout */}
      {/* =================================================================== */}
      
      {/* Legacy home redirect */}
      <Route path="home" element={<Navigate to="/" replace />} />
      
      {/* Interview taking flow for applicants */}
      <Route path="take/:applicantId" element={<WelcomeTakeInterview />} />
      <Route path="take/:applicantId/interview" element={<TakeInterviewPage />} />
      <Route path="take/:applicantId/complete" element={<InterviewCompletePage />} />
      
      {/* 404 Not Found fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
