// =============================================================================
// Edit Question Drawer - Modal form for editing existing interview questions
// =============================================================================
// This component provides a modal interface for editing existing interview questions,
// including form validation, data pre-filling, and API integration for updates.
// =============================================================================

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { X } from 'lucide-react';
import { SquarePen } from 'lucide-react';
import TextAreaInput from '../../components/form/TextAreaInput';
import SelectInput from '../../components/form/SelectInput';
import ActionButton from '../../components/form/ActionButton';
import DividerContainer from '../../components/form/DividerContainer';

// Import API services
import { updateQuestion, getInterviews } from '../../services';

export default function EditQuestionDrawer({ question, onQuestionUpdated }) {
  // UI state management
  const [open, setOpen] = useState(false) // Dialog open/close state
  const [loading, setLoading] = useState(false) // Form submission loading state
  
  // Form data state - initialized from props or empty
  const [formData, setFormData] = useState({
    question: '',       // Question content
    interview_id: '',   // Interview ID
    difficulty: 'Easy'  // Question difficulty
  })

  // Interviews data from API
  const [interviews, setInterviews] = useState([])
  const [interviewsLoading, setInterviewsLoading] = useState(false)

  // Available question difficulty options - matches API requirements
  const QuestionDifficulty = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ]

  // Effect to populate form when question prop changes
  useEffect(() => {
    if (question) {
      setFormData({
        question: question.question || '',
        interview_id: question.interview_id?.toString() || '',
        difficulty: question.difficulty || 'Easy'
      })
    }
  }, [question]) // Re-run when question prop changes

  // Fetch interviews when component mounts or dialog opens
  const fetchInterviews = async () => {
    try {
      setInterviewsLoading(true)
      const data = await getInterviews()
      
      // Transform interviews data for SelectInput
      const interviewOptions = data.map(interview => ({
        value: interview.id.toString(),
        label: `${interview.title} (${interview.job_role})`
      }))
      
      setInterviews(interviewOptions)
    } catch (err) {
      console.error('Failed to fetch interviews:', err)
      // Fallback to empty array if API fails
      setInterviews([])
    } finally {
      setInterviewsLoading(false)
    }
  }

  // Effect to fetch interviews when dialog opens
  useEffect(() => {
    if (open && interviews.length === 0) {
      fetchInterviews()
    }
  }, [open, interviews.length])

  // Handle form input changes - updates formData state
  const handleInputChange = (field, value) => {
    // Debug: Log input changes
    console.log('Input change:', { field, value, valueType: typeof value })
    
    setFormData(prev => ({
      ...prev,           // Keep existing fields
      [field]: value     // Update the specific field
    }))
  }

  // Handle form submission - updates existing question via API
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent default form submission

    // Ensure we have a question to update
    if (!question || !question.id) {
      alert('No question selected for editing')
      return
    }

    // Basic validation - ensure required fields are filled
    if (!formData.question.trim() || !formData.interview_id || !formData.difficulty) {
      alert('Please fill in all required fields: Question, Interview, and Difficulty')
      return
    }

    try {
      setLoading(true) // Start loading

      // Debug: Log form data before sending
      console.log('Updating question data:', formData)

      // Prepare data for API - convert interview_id to number
      const questionData = {
        ...formData,
        interview_id: parseInt(formData.interview_id, 10)
      }

      // Call API service to update question
      const updatedQuestion = await updateQuestion(question.id, questionData)
      
      // Success handling
      console.log('Question updated successfully:', updatedQuestion)
      
      // Close the dialog
      setOpen(false)
      
      // Notify parent component to refresh data
      if (onQuestionUpdated) {
        onQuestionUpdated()
      }
      
      // Success notification will be handled by parent component
      
    } catch (error) {
      // Error handling
      console.error('Failed to update question:', error)
      
      // TODO: Add beautiful error notification with TailwindCSS  
      alert('Failed to update question. Please try again.')
      
    } finally {
      setLoading(false) // Always stop loading
    }
  }

  // Handle dialog close - prevent close during submission
  const handleClose = () => {
    if (!loading) { // Only allow close if not submitting
      setOpen(false)
    }
  }

  // Don't render edit button if no question provided
  if (!question) {
    return null
  }
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)} // Move onClick to button level
        className="rounded-sm bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-400 shadow-xs hover:bg-blue-100 mr-2"
      >
        <div className='flex items-center gap-2'>
          <SquarePen className="w-4 h-4"/>
        </div>
      </button>
      <Dialog open={open} onClose={handleClose} className="relative z-10">
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
                transition
                className="shadow-xl/30 pointer-events-auto w-screen max-w-4xl transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <form onSubmit={handleSubmit} className="relative flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  {/* Form Container */}
                  <div className="flex-1">
                    {/* Header */}
                    <div className="bg-slate-100 px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between space-x-3">
                        <div className="space-y-1 pt-8 pb-4 ">
                          <DialogTitle className="text-3xl font-semibold text-gray-900">Edit Question</DialogTitle>
                          <p className="text-base text-gray-500">
                            Get started by filling in the information below to edit your question.
                          </p>
                        </div>
                        <div className="flex h-7 items-center">
                          <button
                            type="button"
                            onClick={handleClose} // Use handleClose instead of setOpen directly
                            disabled={loading} // Disable close button during submission
                            className="relative rounded-md text-gray-400 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <X aria-hidden="true" className="size-6 text-gray-900" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <DividerContainer>
                      {/* Interview selection - required field */}
                      <SelectInput 
                        label="Interview" 
                        placeholder={interviewsLoading ? "Loading interviews..." : "Select Interview"} 
                        id="question-interview" 
                        name="question-interview" 
                        options={interviews}
                        value={formData.interview_id}
                        onChange={(value) => handleInputChange('interview_id', value)}
                        required
                      />
                      
                      {/* Question content - required field */}
                      <TextAreaInput 
                        label="Question" 
                        placeholder="Enter your question here..." 
                        id="question-content" 
                        name="question-content"
                        value={formData.question}
                        onChange={(e) => handleInputChange('question', e.target.value)}
                        required
                      />
                      
                      {/* Difficulty selection - required field */}
                      <SelectInput 
                        label="Difficulty" 
                        placeholder="Select Question Difficulty" 
                        id="question-difficulty" 
                        name="question-difficulty" 
                        options={QuestionDifficulty}
                        value={formData.difficulty}
                        onChange={(value) => handleInputChange('difficulty', value)}
                        required
                      />
                    </DividerContainer>
                  </div>
                  {/* Action buttons */}
                  <ActionButton 
                    ActionContent={loading ? "Updating..." : "Update"} // Dynamic button text
                    type="submit" // Make it a submit button
                    disabled={loading} // Disable during submission
                  />
                </form>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}
