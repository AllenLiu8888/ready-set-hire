// =============================================================================
// Interview Complete Page - Success screen after interview submission
// CN: 面试完成页面 - 面试提交后的成功界面
// =============================================================================
// This page displays completion confirmation after an applicant successfully
// submits their interview, showing summary information and next steps.
// CN: 该页面在候选人成功提交面试后显示完成确认，展示摘要信息和下一步骤。
// =============================================================================

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Check, User, Briefcase, Clock, Mail } from 'lucide-react'
import { getApplicant } from '../../services'
import { getInterviewTitleById } from '../../utils/interviewUtils'

export default function InterviewCompletePage() {
  const { applicantId } = useParams()
  
  // State for applicant and interview data
  // CN: 候选人和面试数据状态
  const [applicant, setApplicant] = useState(null)
  const [interviewTitle, setInterviewTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch applicant and interview data
  // CN: 获取候选人和面试数据
  const fetchCompletionData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get applicant information
      // CN: 获取候选人信息
      const applicantArray = await getApplicant(applicantId)
      console.log('Applicant array:', applicantArray)
      
      if (!applicantArray || applicantArray.length === 0) {
        throw new Error('Applicant not found')
      }
      
      const applicantData = applicantArray[0] // PostgREST returns array, get first item
      console.log('Applicant data:', applicantData)
      setApplicant(applicantData)

      // Get interview title from localStorage cache
      // CN: 从localStorage缓存获取面试标题
      if (applicantData.interview_id) {
        const title = getInterviewTitleById(applicantData.interview_id)
        console.log('Interview title:', title)
        setInterviewTitle(title)
      }

    } catch (err) {
      console.error('Failed to fetch completion data:', err)
      setError('Failed to load interview completion details')
    } finally {
      setLoading(false)
    }
  }, [applicantId])

  useEffect(() => {
    fetchCompletionData()
  }, [fetchCompletionData])

  // Loading state
  // CN: 加载状态
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading completion details...</p>
        </div>
      </div>
    )
  }

  // Error state
  // CN: 错误状态
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-500"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Success Icon */}
        <div className="text-center mb-10">
          <div className="rounded-full bg-green-100 p-8 mx-auto w-32 h-32 flex items-center justify-center mb-8">
            <Check className="w-16 h-16 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Interview Completed!
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Thank you for participating in our interview process.
          </p>
        </div>

        {/* Interview Details Card */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
            Interview Summary
          </h2>
          
          <div className="space-y-4">
            {/* Applicant Name */}
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-sm text-gray-500">Applicant:</span>
                <p className="font-medium text-gray-900">
                  {applicant?.firstname} {applicant?.surname}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-sm text-gray-500">Email:</span>
                <p className="font-medium text-gray-900">{applicant?.email_address}</p>
              </div>
            </div>

            {/* Interview Title */}
            <div className="flex items-center space-x-3">
              <Briefcase className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-sm text-gray-500">Job Role:</span>
                <p className="font-medium text-gray-900">{interviewTitle || 'Loading...'}</p>
              </div>
            </div>

            {/* Completion Time */}
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-sm text-gray-500">Completed:</span>
                <p className="font-medium text-gray-900">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            What happens next?
          </h3>
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>Our team will carefully review your interview responses</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>We'll send you an email with the results within 3-5 business days</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>If you have any questions, feel free to reply to the email notification</p>
            </div>
          </div>
        </div>


        {/* Close Page Instructions */}
        <div className="text-center">
          <p className="text-gray-500">
            You can now close this tab or window.
          </p>
        </div>

        {/* Footer Thank You */}
        <div className="text-center mt-10 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Thank you for your interest in joining our team. We appreciate the time you've invested in this interview process.
          </p>
        </div>
      </div>
    </div>
  )
}
