// =============================================================================
// View Answers Modal - Display interview questions and applicant answers
// =============================================================================
// This component provides a modal interface for viewing applicant's interview
// answers, showing each question with the corresponding response.
// =============================================================================

import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { X, MessageCircle, FileText } from 'lucide-react'

// Import API services
import { getQuestions, getApplicantAnswers } from '../../../services'

/**
 * Modal component for viewing applicant's interview answers
 */
export default function ViewAnswersModal({ applicant, onClose }) {
  // =============================================================================
  // Component State Management
  // =============================================================================
  
  const [open, setOpen] = useState(true) // Modal open state
  const [loading, setLoading] = useState(true) // Loading state
  const [questions, setQuestions] = useState([]) // Interview questions
  const [answers, setAnswers] = useState([]) // Applicant answers
  const [error, setError] = useState(null) // Error state

  // =============================================================================
  // Data Fetching Functions
  // =============================================================================

  /**
   * Fetch interview questions and applicant answers
   */
  const fetchQuestionsAndAnswers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch questions for the interview
      const questionsData = await getQuestions()
      const interviewQuestions = questionsData.filter(
        question => question.interview_id === applicant.interview_id
      )

      // Fetch applicant's answers
      const answersData = await getApplicantAnswers()
      const applicantAnswers = answersData.filter(
        answer => answer.applicant_id === applicant.id
      )

      setQuestions(interviewQuestions)
      setAnswers(applicantAnswers)

    } catch (err) {
      console.error('Failed to fetch questions and answers:', err)
      setError('Failed to load interview data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [applicant])

  // =============================================================================
  // Lifecycle Effects
  // =============================================================================

  useEffect(() => {
    if (applicant) {
      fetchQuestionsAndAnswers()
    }
  }, [applicant, fetchQuestionsAndAnswers])

  // =============================================================================
  // Event Handlers
  // =============================================================================

  /**
   * Handle modal close
   */
  const handleClose = () => {
    setOpen(false)
    if (onClose) {
      onClose()
    }
  }

  /**
   * Get answer for a specific question
   */
  const getAnswerForQuestion = (questionId) => {
    const answer = answers.find(ans => ans.question_id === questionId)
    return answer?.answer || 'No answer provided'
  }

  // =============================================================================
  // Render Loading State
  // =============================================================================

  if (loading) {
    return (
      <Dialog open={open} onClose={handleClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-3xl w-full bg-white rounded-lg p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading interview data...</p>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    )
  }

  // =============================================================================
  // Render Error State
  // =============================================================================

  if (error) {
    return (
      <Dialog open={open} onClose={handleClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-3xl w-full bg-white rounded-lg p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchQuestionsAndAnswers}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    )
  }

  // =============================================================================
  // Main Render
  // =============================================================================

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/30" />
      
      {/* Modal container */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-4xl w-full bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Interview Answers
              </DialogTitle>
              <p className="mt-1 text-sm text-gray-600">
                {applicant.title} {applicant.firstname} {applicant.surname} - 
                Status: <span className="font-medium">{applicant.interview_status}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {questions.length === 0 ? (
              // No questions state
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No questions found for this interview.</p>
              </div>
            ) : (
              // Questions and answers list
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    {/* Question header */}
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            Question {index + 1}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {question.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-700">{question.question}</p>
                      </div>
                    </div>

                    {/* Answer section */}
                    <div className="ml-11">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <h4 className="text-sm font-medium text-gray-900">Answer:</h4>
                      </div>
                      <div className="bg-gray-50 rounded-md p-3">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {getAnswerForQuestion(question.id)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500"
            >
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
