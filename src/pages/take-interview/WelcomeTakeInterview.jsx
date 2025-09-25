// =============================================================================
// Welcome Take Interview Page - Applicant pre-interview information display
// CN: 欢迎参加面试页面 - 候选人面试前信息展示
// =============================================================================
// This page displays applicant information and interview details before starting
// the actual interview process, providing context and instructions to candidates.
// CN: 该页面在开始实际面试流程前显示候选人信息和面试详情，为候选人提供背景和说明。
// =============================================================================

import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Building, Clock, FileText, ChevronRight } from 'lucide-react'

// Import API services for getting applicant and interview data
// CN: 导入获取候选人和面试数据的 API 服务
import { getApplicant, getQuestions } from '../../services'
import { getInterviewTitleById } from '../../utils/interviewUtils'

export default function WelcomeTakeInterview() {
  const { applicantId } = useParams() // Get applicant ID from URL / CN: 从URL获取候选人ID
  const navigate = useNavigate()

  // State management
  // CN: 状态管理
  const [applicant, setApplicant] = useState(null) // Applicant data / CN: 候选人数据
  const [interview, setInterview] = useState(null) // Interview data / CN: 面试数据
  const [questionsCount, setQuestionsCount] = useState(0) // Number of questions / CN: 题目数量
  const [loading, setLoading] = useState(true) // Loading state / CN: 加载状态
  const [error, setError] = useState(null) // Error state / CN: 错误状态

  // Function to fetch applicant and interview data
  // CN: 获取候选人和面试数据的函数
  const fetchWelcomeData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get applicant data
      // CN: 获取候选人数据
      const applicantData = await getApplicant(applicantId)
      if (!applicantData || applicantData.length === 0) {
        throw new Error('Applicant not found')
      }
      
      const currentApplicant = Array.isArray(applicantData) ? applicantData[0] : applicantData
      setApplicant(currentApplicant)

      // Get interview title from localStorage (stored by admin pages)
      // CN: 从localStorage获取面试标题（由管理页面存储）
      const interviewTitle = getInterviewTitleById(currentApplicant.interview_id)
      
      // Create interview object with basic info
      // CN: 创建包含基本信息的面试对象
      setInterview({
        id: currentApplicant.interview_id,
        title: interviewTitle,
        // TODO: Get full interview details if needed
        // CN: TODO: 如需要可获取完整面试详情
        description: 'Complete this interview by answering all questions. You can record audio responses and provide written notes.'
      })

      // Get questions count for this interview
      // CN: 获取该面试的题目数量
      const questionsData = await getQuestions()
      const filteredQuestions = questionsData.filter(q => q.interview_id === currentApplicant.interview_id)
      setQuestionsCount(filteredQuestions.length)

      if (filteredQuestions.length === 0) {
        throw new Error('No questions found for this interview')
      }

    } catch (err) {
      console.error('Failed to fetch welcome data:', err)
      setError(err.message || 'Failed to load interview information. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [applicantId])

  // Effect to fetch data when component mounts
  // CN: 组件挂载时获取数据的副作用
  useEffect(() => {
    if (applicantId) {
      fetchWelcomeData()
    } else {
      setError('Invalid interview link')
      setLoading(false)
    }
  }, [applicantId, fetchWelcomeData])

  // Handle start interview
  // CN: 处理开始面试
  const handleStartInterview = () => {
    // Navigate to the actual interview page
    // CN: 导航到实际的面试页面
    navigate(`/take/${applicantId}/interview`)
  }

  // Early return for loading state
  // CN: 加载状态的早期返回
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading interview information...</p>
        </div>
      </div>
    )
  }

  // Early return for error state
  // CN: 错误状态的早期返回
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Interview
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thank you for your interest in this position. Please review the information below and start your interview when ready.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Applicant Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-indigo-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-600" />
                Your Information
              </h2>
            </div>
            <div className="p-6 space-y-5">
              {/* Name */}
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg text-gray-900">
                    {applicant?.title} {applicant?.firstname} {applicant?.surname}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="text-lg text-gray-900">{applicant?.email_address}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="text-lg text-gray-900">{applicant?.phone_number}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Interview Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building className="w-5 h-5 mr-2 text-green-600" />
                Interview Details
              </h2>
            </div>
            <div className="p-6 space-y-5">
              {/* Interview Title */}
              <div className="flex items-start space-x-3">
                <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Job Role</p>
                  <p className="text-lg text-gray-900">{interview?.title}</p>
                </div>
              </div>

              {/* Questions Count */}
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Number of Questions</p>
                  <p className="text-lg text-gray-900">{questionsCount} questions</p>
                </div>
              </div>

              {/* Estimated Time */}
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Estimated Time</p>
                  <p className="text-lg text-gray-900">{Math.ceil(questionsCount * 3)} - {Math.ceil(questionsCount * 5)} minutes</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Interview Instructions and Important Notes */}
        <div className="mt-10 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Interview Instructions & Important Notes</h3>
          <ul className="space-y-3 text-blue-800">
            <li className="flex items-start space-x-3">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Complete this interview by answering all questions. </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>You can record audio responses for each question or provide written answers.</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>You can navigate between questions and review your answers before submitting.</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Once you submit the interview, your responses cannot be changed.</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Please ensure you have a stable internet connection throughout the interview.</span>
            </li>
          </ul>
        </div>

        {/* Start Interview Button */}
        <div className="mt-10 text-center">
          <button
            onClick={handleStartInterview}
            disabled={applicant?.interview_status === 'Completed'}
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {applicant?.interview_status === 'Completed' ? 'Interview Already Completed' : 'Start Interview'}
            {applicant?.interview_status !== 'Completed' && (
              <ChevronRight className="ml-2 -mr-1 w-5 h-5" />
            )}
          </button>
          
          {applicant?.interview_status === 'Completed' && (
            <p className="mt-4 text-sm text-gray-500">
              You have already completed this interview. Thank you for your participation.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
