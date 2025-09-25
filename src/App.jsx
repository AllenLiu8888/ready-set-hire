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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="interviews" >
          <Route index element={<InterviewsPage />} />
          <Route path="interviews/:id/edit" element={<EditInterviewDrawer />} />
          <Route path="interviews/create" element={<EditInterviewDrawer />} />
        </Route>
        <Route path="questions" >
          <Route index element={<QuestionsPage />} />
          <Route path="questions/:id/edit" element={<EditQuestionDrawer />} />
          <Route path="questions/create" element={<EditQuestionDrawer />} />
        </Route>
        <Route path="applicants" >
          <Route index element={<ApplicantsPage />} />
          <Route path="applicants/:id/edit" element={<EditApplicantDrawer />} />
          <Route path="applicants/create" element={<EditApplicantDrawer />} />
        </Route>
      </Route>
      <Route path="home" element={<Navigate to="/" replace />} />
      {/* Take Interview Routes - Outside of main layout */}
      <Route path="take/:applicantId" element={<WelcomeTakeInterview />} />
      <Route path="take/:applicantId/interview" element={<TakeInterviewPage />} />
      <Route path="take/:applicantId/complete" element={<InterviewCompletePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
