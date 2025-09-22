import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/AppLayout.jsx'
const DashboardPage = () => (
  <section className="space-y-4">
    <header>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-base-content/70">Summary cards and quick actions will live here.</p>
    </header>
    <div className="rounded-lg border border-dashed border-base-300 bg-base-100 p-6 text-sm text-base-content/70">
      TODO: Populate dashboard metrics and quick links.
    </div>
  </section>
)

const InterviewsPage = () => (
  <section className="space-y-4">
    <header>
      <h1 className="text-2xl font-semibold">Interviews</h1>
      <p className="text-base-content/70">Manage interview templates and statuses.</p>
    </header>
    <div className="rounded-lg border border-dashed border-base-300 bg-base-100 p-6 text-sm text-base-content/70">
      TODO: Replace with interviews table and form modal.
    </div>
  </section>
)

const QuestionsPage = () => (
  <section className="space-y-4">
    <header>
      <h1 className="text-2xl font-semibold">Questions</h1>
      <p className="text-base-content/70">Maintain reusable interview questions.</p>
    </header>
    <div className="rounded-lg border border-dashed border-base-300 bg-base-100 p-6 text-sm text-base-content/70">
      TODO: Implement questions list and filters.
    </div>
  </section>
)

const ApplicantsPage = () => (
  <section className="space-y-4">
    <header>
      <h1 className="text-2xl font-semibold">Applicants</h1>
      <p className="text-base-content/70">Track applicant progress and invitations.</p>
    </header>
    <div className="rounded-lg border border-dashed border-base-300 bg-base-100 p-6 text-sm text-base-content/70">
      TODO: Display applicants directory and invitation tools.
    </div>
  </section>
)

const TakeInterviewPage = () => (
  <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-10">
    <header className="space-y-2 text-center">
      <h1 className="text-3xl font-semibold">Interview Session</h1>
      <p className="text-base-content/70">
        Candidate-facing layout will guide responses one question at a time.
      </p>
    </header>
    <div className="rounded-lg border border-dashed border-base-300 bg-base-100 p-6 text-sm text-base-content/70">
      TODO: Build welcome screen, recorder, and completion flow.
    </div>
  </div>
)

const NotFoundPage = () => (
  <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
    <h1 className="text-3xl font-semibold">404</h1>
    <p className="text-base-content/70">We couldn&apos;t find the page you were looking for.</p>
    <a className="btn btn-primary" href="/">
      Back to Dashboard
    </a>
  </div>
)

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
