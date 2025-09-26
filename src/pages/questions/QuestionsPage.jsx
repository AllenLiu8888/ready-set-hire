// =============================================================================
// Questions Management Page - CRUD operations for interview questions
// =============================================================================
// This page manages interview questions including creation, editing, deletion,
// difficulty categorization, and interview association with real-time updates.
// =============================================================================

import { RefreshCcw, CircleQuestionMark } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { tv } from 'tailwind-variants';
import { useState, useEffect } from 'react';
import EditQuestionDrawer from './EditQuestionDrawer.jsx';
import CreateQuestionDrawer from './CreateQuestionDrawer.jsx';
import ConfirmAlert from '../../components/shared/alerts/ConfirmAlert.jsx';
import SuccessAlert from '../../components/shared/alerts/SuccessAlert.jsx';

// Import API services
import { getQuestions, deleteQuestion } from '../../services';
import { getInterviewTitleById } from '../../utils/interviewUtils';


const QuestionsDifficulty = tv({
  base: 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
  variants: {
    status: {
      'Easy': 'bg-green-50 text-green-600',
      'Intermediate': 'bg-yellow-50 text-yellow-600',
      'Advanced': 'bg-red-50 text-red-600',
    },
  },
})

export default function QuestionsPage() {
  // State management for questions data and UI states
  const [questions, setQuestions] = useState([]) // Store questions list
  const [loading, setLoading] = useState(true) // Loading state
  const [error, setError] = useState(null) // Error state
  
  // State for delete confirmation dialog
  const [showConfirm, setShowConfirm] = useState(false) // Control confirm dialog
  const [questionToDelete, setQuestionToDelete] = useState(null) // Question to be deleted
  
  // State for success notification
  const [successMessage, setSuccessMessage] = useState('') // Success message content
  const [showSuccess, setShowSuccess] = useState(false) // Control success alert visibility

  // Function to fetch questions from API
  const fetchQuestions = async () => {
    try {
      setLoading(true) // Start loading
      setError(null) // Clear previous errors

      // Call API service to get questions
      const data = await getQuestions()
      
      // Update state with fetched data
      setQuestions(data)
    } catch (err) {
      // Handle errors
      console.error('Failed to fetch questions:', err)
      setError('Failed to load questions. Please try again.')
    } finally {
      // Always stop loading regardless of success/failure
      setLoading(false)
    }
  }

  // Function to show success notification
  const showSuccessNotification = (message) => {
    setSuccessMessage(message)
    setShowSuccess(true)
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
      setSuccessMessage('')
    }, 3000)
  }

  // Function to handle success alert close
  const handleCloseSuccess = () => {
    setShowSuccess(false)
    setSuccessMessage('')
  }

  // Function to handle question creation success
  const handleQuestionCreated = () => {
    fetchQuestions() // Refresh the list
    showSuccessNotification('Question created successfully!') // Show success message
  }

  // Function to handle question update success
  const handleQuestionUpdated = () => {
    fetchQuestions() // Refresh the list
    showSuccessNotification('Question updated successfully!') // Show success message
  }

  // Function to handle delete button click - shows confirmation dialog
  const handleDeleteClick = (question) => {
    setQuestionToDelete(question) // Store question to delete
    setShowConfirm(true) // Show confirmation dialog
  }

  // Function to handle confirmed deletion
  const handleConfirmDelete = async () => {
    if (!questionToDelete) return

    try {
      console.log('Deleting question:', questionToDelete.id, questionToDelete.question)
      
      // Call API service to delete question
      await deleteQuestion(questionToDelete.id)
      
      console.log('Delete API call successful')
      
      // Remove from local state (optimistic update)
      setQuestions(prev => prev.filter(question => question.id !== questionToDelete.id))
      
      // Clean up state
      setQuestionToDelete(null)
      setShowConfirm(false)
      
      // Show success message
      console.log('Question deleted successfully:', questionToDelete.question)
      showSuccessNotification(`Question deleted successfully!`)
      
    } catch (err) {
      // Handle deletion errors with detailed logging
      console.error('Failed to delete question:', err)
      console.error('Question details:', {
        id: questionToDelete.id,
        question: questionToDelete.question,
        error: err.message
      })
      
      // Show detailed error message
      alert(`Failed to delete question: ${err.message}`)
      
      // Keep dialog open so user can try again
      // setShowConfirm(false) // Don't close on error
    }
  }

  // Function to handle dialog close
  const handleCloseConfirm = () => {
    setShowConfirm(false)
    setQuestionToDelete(null)
  }

  // Effect hook to fetch data when component mounts
  useEffect(() => {
    fetchQuestions()
  }, []) // Empty dependency array means this runs once on mount

  // Early return for loading state
  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCcw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-2 text-gray-600">Loading questions...</p>
          </div>
        </div>
      </div>
    )
  }

  // Early return for error state
  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchQuestions}
              className="rounded-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Success notification - floating at top */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <SuccessAlert message={successMessage} onClose={handleCloseSuccess} />
        </div>
      )}
      
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-semibold text-gray-900">Questions</h1>
          <p className="mt-2 text-base text-gray-700">
            A list of all the questions in your account including their title, role, description and status.
          </p>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={fetchQuestions} // Add click handler to refresh data
            disabled={loading} // Disable while loading
            className="rounded-md bg-white px-3 py-2 text-center font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-200 hover:text-gray-500 disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}/> Refresh
            </div>
          </button>
          <CreateQuestionDrawer onQuestionCreated={handleQuestionCreated} /> {/* Pass callback to refresh and show success */}
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg">
              <table className="relative min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Question
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Interview
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Difficulty
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {/* Show empty state if no questions */}
                  {questions.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 text-gray-300"><CircleQuestionMark /></div>
                          <p>No questions found</p>
                          <p className="text-sm">Create your first question to get started</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // Map through real questions data from API
                    questions.map((question) => (
                      <tr key={question.id}>
                        <td className="py-4 px-auto text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                          {question.question}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {/* Display interview title from localStorage with error handling */}
                          {getInterviewTitleById(question.interview_id)}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          <span className={QuestionsDifficulty({ status: question.difficulty })}>{question.difficulty}</span>
                        </td>
                        <td className="py-4 px-4 text-center text-sm font-medium whitespace-nowrap">
                          {/* Pass question data to edit drawer */}
                          <EditQuestionDrawer 
                            question={question} 
                            onQuestionUpdated={handleQuestionUpdated}
                          />
                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(question)} // Use new click handler
                            className="rounded-sm bg-red-50 px-2 py-1 text-sm font-semibold text-red-600 shadow-xs hover:bg-red-100 ml-2"
                          >
                            <div className='flex items-center gap-2'>
                              <Trash2 className="w-4 h-4"/>
                            </div>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation dialog for delete action */}
      {showConfirm && (
        <ConfirmAlert
          open={showConfirm}
          onClose={handleCloseConfirm}
          onConfirm={handleConfirmDelete}
          title="Delete Question"
          message={`Are you sure you want to delete this question? This action cannot be undone.`}
        />
      )}
    </div>
  )
}
