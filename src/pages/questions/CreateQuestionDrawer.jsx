// =============================================================================
// Create Question Drawer - Modal form for adding new interview questions
// =============================================================================
// This component provides a modal interface for creating new interview questions,
// including difficulty selection, interview association, and API integration.
// =============================================================================

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { X } from 'lucide-react';
import { MessageCirclePlus } from 'lucide-react';
import TextAreaInput from '../../components/form/TextAreaInput';
import SelectInput from '../../components/form/SelectInput';
import ActionButton from '../../components/form/ActionButton';
import DividerContainer from '../../components/form/DividerContainer';

// Import API services
import { createQuestion, getInterviews } from '../../services';

export default function CreateQuestionDrawer({ onQuestionCreated }) {
  // UI state management
  const [open, setOpen] = useState(false) // Dialog open/close state
  const [loading, setLoading] = useState(false) // Form submission loading state
  
  // Form data state - stores all question fields
  const [formData, setFormData] = useState({
    question: '',       // Question content
    interview_id: '',   // Interview ID
    difficulty: 'Easy'  // Default difficulty
  })

  // Interviews data from API
  const [interviews, setInterviews] = useState([])
  const [interviewsLoading, setInterviewsLoading] = useState(false)

  // Available question difficulty options
  const QuestionDifficulty = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ]

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

  // Handle form submission - creates new question via API
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent default form submission

    // Basic validation - ensure required fields are filled
    if (!formData.question.trim() || !formData.interview_id || !formData.difficulty) {
      alert('Please fill in all required fields: Question, Interview, and Difficulty')
      return
    }

    try {
      setLoading(true) // Start loading

      // Debug: Log form data before sending
      console.log('Submitting question data:', formData)

      // Prepare data for API - convert interview_id to number
      const questionData = {
        ...formData,
        interview_id: parseInt(formData.interview_id, 10)
      }

      // Call API service to create question
      const newQuestion = await createQuestion(questionData)
      
      // Success handling
      console.log('Question created successfully:', newQuestion)
      
      // Reset form data to initial state
      setFormData({
        question: '',
        interview_id: '',
        difficulty: 'Easy'
      })
      
      // Close the dialog
      setOpen(false)
      
      // Notify parent component to refresh data
      if (onQuestionCreated) {
        onQuestionCreated()
      }
      
      // Success notification will be handled by parent component
      
    } catch (error) {
      // Error handling
      console.error('Failed to create question:', error)
      
      // TODO: Add beautiful error notification with TailwindCSS
      alert('Failed to create question. Please try again.')
      
    } finally {
      setLoading(false) // Always stop loading
    }
  }

  // Handle dialog close - also reset form if needed
  const handleClose = () => {
    if (!loading) { // Only allow close if not submitting
      setOpen(false)
    }
  }
  return (
    <div>
      <button
        type="button"
        className="block rounded-md bg-slate-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <div className="flex items-center gap-2" onClick={() => setOpen(true)}>
          <MessageCirclePlus className="w-4 h-4"/>  Add Question
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
                          <DialogTitle className="text-3xl font-semibold text-gray-900">New Question</DialogTitle>
                          <p className="text-base text-gray-500">
                            Get started by filling in the information below to create your new question.
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
                    ActionContent={loading ? "Creating..." : "Create"} // Dynamic button text
                    type="submit" // Make it a submit button
                    disabled={loading} // Disable during submission
                  />
                </form>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
