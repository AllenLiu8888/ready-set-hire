import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/AppLayout.jsx'
import InterviewsPage from './pages/interviews/InterviewsPage.jsx'
import QuestionsPage from './pages/questions/QuestionsPage.jsx'
import ApplicantsPage from './pages/applicants/ApplicantsPage.jsx'
import TakeInterviewPage from './pages/take-interview/TakeInterviewPage.jsx'
import NotFoundPage from './pages/NotFound.jsx'
import DashboardPage from './pages/Dashboard.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="interviews" element={<InterviewsPage />} />
        <Route path="questions" element={<QuestionsPage />} />
        <Route path="applicants" element={<ApplicantsPage />} />
      </Route>
      <Route path="take/:applicantId" element={<TakeInterviewPage />} />
      <Route path="home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
