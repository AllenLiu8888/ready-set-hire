import { Routes, Route, Navigate } from 'react-router-dom'

const DashboardPage = () => <div className="p-6">Dashboard</div>
const InterviewsPage = () => <div className="p-6">Interviews</div>
const QuestionsPage = () => <div className="p-6">Questions</div>
const ApplicantsPage = () => <div className="p-6">Applicants</div>
const TakeInterviewPage = () => <div className="p-6">Take Interview</div>
const NotFoundPage = () => <div className="p-6">Page Not Found</div>

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/interviews" element={<InterviewsPage />} />
      <Route path="/questions" element={<QuestionsPage />} />
      <Route path="/applicants" element={<ApplicantsPage />} />
      <Route path="/take/:applicantId" element={<TakeInterviewPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
