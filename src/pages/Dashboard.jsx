// =============================================================================
// Dashboard Page - Overview of all system data
// =============================================================================
// This page provides a comprehensive overview of the interview management system,
// displaying statistics, recent activities, and quick navigation actions.
// =============================================================================

import { useState, useEffect } from 'react'
import { 
  Briefcase, 
  Users, 
  HelpCircle, 
  AlertTriangle,
  BarChart3,
  ArrowRight,
  RefreshCw
} from 'lucide-react'
import { Link } from 'react-router-dom'

// Import API services
import { getInterviews, getQuestions, getApplicants } from '../services'
import { getInterviewTitleById } from '../utils/interviewUtils'

// Status badge component
const StatusBadge = ({ type, children }) => {
  const baseClasses = 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium'
  
  const typeClasses = {
    'interview-published': 'bg-green-50 text-green-600',
    'interview-draft': 'bg-yellow-50 text-yellow-600',
    'interview-archived': 'bg-red-50 text-red-600',
    'applicant-completed': 'bg-blue-50 text-blue-600',
    'applicant-pending': 'bg-yellow-50 text-yellow-600',
  }
  
  const className = `${baseClasses} ${typeClasses[type] || 'bg-gray-50 text-gray-600'}`
  
  return (
    <span className={className}>
      {children}
    </span>
  )
}

const DashboardPage = () => {
  // =============================================================================
  // Component State Management
  // =============================================================================
  
  // State management for dashboard data
  const [interviews, setInterviews] = useState([]) // All interviews data
  const [questions, setQuestions] = useState([]) // All questions data
  const [applicants, setApplicants] = useState([]) // All applicants data
  const [loading, setLoading] = useState(true) // Loading state for data fetching
  const [error, setError] = useState(null) // Error state for failed requests
  const [lastUpdated, setLastUpdated] = useState(null) // Timestamp of last data update

  // =============================================================================
  // Data Fetching Functions
  // =============================================================================

  // Function to fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching dashboard data...')
      
      // Fetch data from all endpoints in parallel
      const [interviewsData, questionsData, applicantsData] = await Promise.all([
        getInterviews(),
        getQuestions(), 
        getApplicants()
      ])
      
      setInterviews(interviewsData)
      setQuestions(questionsData)
      setApplicants(applicantsData)
      setLastUpdated(new Date())
      
      console.log('Dashboard data loaded successfully')
      
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Effect to fetch data when component mounts
  useEffect(() => {
    fetchDashboardData()
  }, [])

  // =============================================================================
  // Data Processing and Statistics
  // =============================================================================

  // Calculate statistics
  const stats = {
    interviews: {
      total: interviews.length,
      published: interviews.filter(i => i.status === 'Published').length,
      draft: interviews.filter(i => i.status === 'Draft').length,
      archived: interviews.filter(i => i.status === 'Archived').length,
    },
    questions: {
      total: questions.length,
      easy: questions.filter(q => q.difficulty === 'Easy').length,
      intermediate: questions.filter(q => q.difficulty === 'Intermediate').length,
      advanced: questions.filter(q => q.difficulty === 'Advanced').length,
    },
    applicants: {
      total: applicants.length,
      completed: applicants.filter(a => a.interview_status === 'Completed').length,
      pending: applicants.filter(a => a.interview_status === 'Not Started').length,
    }
  }

  // Calculate completion rate
  const completionRate = stats.applicants.total > 0 
    ? Math.round((stats.applicants.completed / stats.applicants.total) * 100)
    : 0

  // Get recent activities (last items from each category)
  const recentInterviews = interviews.slice(0, 5)
  const recentApplicants = applicants.slice(0, 5)

  // =============================================================================
  // Conditional Rendering - Loading and Error States
  // =============================================================================

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-5">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">System overview and statistics</p>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-5">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">System overview and statistics</p>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <p className="mt-4 text-red-600 text-lg">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // =============================================================================
  // Main Dashboard Render
  // =============================================================================

  return (
    <div className="space-y-8">
      {/* =================================================================== */}
      {/* Dashboard Header Section */}
      {}
      {/* =================================================================== */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-500">
              System overview and statistics
              {lastUpdated && (
                <span className="ml-2 text-gray-400">
                  • Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* Statistics Cards Section */}
      {}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Interviews Overview */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Briefcase className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Interviews</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.interviews.total}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-500">Published:</span>
                <span className="font-medium text-green-600">{stats.interviews.published}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-500">Draft:</span>
                <span className="font-medium text-yellow-600">{stats.interviews.draft}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Archived:</span>
                <span className="font-medium text-red-600">{stats.interviews.archived}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Overview */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Questions</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.questions.total}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-500">Easy:</span>
                <span className="font-medium text-green-600">{stats.questions.easy}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-500">Intermediate:</span>
                <span className="font-medium text-yellow-600">{stats.questions.intermediate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Advanced:</span>
                <span className="font-medium text-red-600">{stats.questions.advanced}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Applicants Overview */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Applicants</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.applicants.total}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-500">Completed:</span>
                <span className="font-medium text-blue-600">{stats.applicants.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Pending:</span>
                <span className="font-medium text-yellow-600">{stats.applicants.pending}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completion Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">{completionRate}%</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm text-gray-500">
              {stats.applicants.completed} of {stats.applicants.total} applicants completed
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* Recent Activity Section */}
      {}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Interviews */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-indigo-600" />
                Recent Interviews
              </h3>
              <Link
                to="/interviews"
                className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
              >
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentInterviews.length > 0 ? (
              recentInterviews.map((interview) => (
                <div key={interview.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{interview.title}</p>
                      <p className="text-sm text-gray-500">{interview.job_role}</p>
                    </div>
                    <StatusBadge type={`interview-${interview.status.toLowerCase()}`}>
                      {interview.status}
                    </StatusBadge>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <Briefcase className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No interviews yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Users className="mr-2 h-5 w-5 text-green-600" />
                Recent Applicants
              </h3>
              <Link
                to="/applicants"
                className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
              >
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentApplicants.length > 0 ? (
              recentApplicants.map((applicant) => (
                <div key={applicant.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {applicant.firstname} {applicant.surname}
                      </p>
                      <p className="text-sm text-gray-500">
                        {getInterviewTitleById(applicant.interview_id) || 'Loading...'}
                      </p>
                    </div>
                    <StatusBadge 
                      type={applicant.interview_status === 'Completed' ? 'applicant-completed' : 'applicant-pending'}
                    >
                      {applicant.interview_status}
                    </StatusBadge>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <Users className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No applicants yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* Quick Actions Section */}
      {}
      {/* =================================================================== */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              to="/interviews"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <div className="flex-shrink-0">
                <Briefcase className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Manage Interviews</p>
                <p className="text-sm text-gray-500">Create and edit interview templates</p>
              </div>
            </Link>

            <Link
              to="/questions"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <div className="flex-shrink-0">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Manage Questions</p>
                <p className="text-sm text-gray-500">Add and organize interview questions</p>
              </div>
            </Link>

            <Link
              to="/applicants"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Manage Applicants</p>
                <p className="text-sm text-gray-500">Review and track candidates</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
