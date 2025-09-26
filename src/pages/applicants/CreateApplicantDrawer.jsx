// =============================================================================
// Create Applicant Drawer - Modal form for adding new interview candidates
// =============================================================================
// This component provides a modal interface for creating new applicants,
// including form validation, interview selection, and API integration.
// =============================================================================

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { UserPlus } from 'lucide-react';
import { X } from 'lucide-react';
import TextInput from '../../components/form/TextInput'; 
import ActionButton from '../../components/form/ActionButton';
import DividerContainer from '../../components/form/DividerContainer';
import SelectInput from '../../components/form/SelectInput';

// Import API services for creating applicants and getting interviews
import { createApplicant, getInterviews } from '../../services';

export default function CreateApplicantDrawer({ onApplicantCreated }) {
  // UI state management
  const [open, setOpen] = useState(false) // Dialog open/close state
  const [loading, setLoading] = useState(false) // Form submission loading state
  
  // Form data state - stores all applicant fields
  const [formData, setFormData] = useState({
    title: '',              // Applicant title (Mr, Ms, Dr, etc.)
    firstname: '',          // First name
    surname: '',            // Last name
    phone_number: '',       // Phone number
    email_address: '',      // Email address
    interview_id: '',       // Interview ID
    interview_status: 'Not Started'  // Default status
  })

  // Available interviews and status options from API
  const [interviews, setInterviews] = useState([]) // Store interviews from API
  const [interviewsLoading, setInterviewsLoading] = useState(true) // Loading state for interviews

  // Available interview status options - matches API requirements
  const InterviewStatus = [
    { value: 'Not Started', label: 'Not Started' },  // New applicant
    { value: 'Completed', label: 'Completed' },      // Completed interview
  ]

  // Function to fetch interviews for the dropdown
  const fetchInterviews = async () => {
    try {
      setInterviewsLoading(true)
      const data = await getInterviews()
      
      // Transform interview data to format needed for SelectInput
      const interviewOptions = data.map(interview => ({
        value: interview.id,
        label: `${interview.title} (${interview.job_role})`
      }))
      
      setInterviews(interviewOptions)
    } catch (error) {
      console.error('Failed to fetch interviews:', error)
      // TODO: Add beautiful error notification
    } finally {
      setInterviewsLoading(false)
    }
  }

  // Effect to fetch interviews when component mounts
  useEffect(() => {
    fetchInterviews()
  }, [])

  // Handle form input changes - updates formData state
  const handleInputChange = (field, value) => {
    // Debug: Log input changes
    console.log('Input change:', { field, value, valueType: typeof value })
    
    setFormData(prev => ({
      ...prev,           // Keep existing fields
      [field]: value     // Update the specific field
    }))
  }

  // Handle form submission - creates new applicant via API
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent default form submission

    // Basic validation - ensure required fields are filled
    if (!formData.title.trim() || !formData.firstname.trim() || !formData.surname.trim() || !formData.email_address.trim() || !formData.interview_id) {
      alert('Please fill in all required fields: Title, First Name, Last Name, Phone Number, Email Address, and Interview')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email_address.trim())) {
      alert('Please enter a valid email address')
      return
    }

    try {
      setLoading(true) // Start loading

      // Debug: Log form data before sending
      console.log('Submitting applicant form data:', formData)
      console.log('Form data type check:', {
        title: typeof formData.title,
        firstname: typeof formData.firstname,
        surname: typeof formData.surname,
        phone_number: typeof formData.phone_number,
        email_address: typeof formData.email_address,
        interview_id: typeof formData.interview_id,
        interview_status: typeof formData.interview_status
      })

      // Call API service to create applicant
      const newApplicant = await createApplicant(formData)
      
      // Success handling
      console.log('Applicant created successfully:', newApplicant)
      
      // Reset form data to initial state
      setFormData({
        title: '',
        firstname: '',
        surname: '',
        phone_number: '',
        email_address: '',
        interview_id: '',
        interview_status: 'Not Started'
      })
      
      // Close the dialog
      setOpen(false)
      
      // Notify parent component to refresh data
      if (onApplicantCreated) {
        onApplicantCreated()
      }
      
      // Success notification will be handled by parent component
      
    } catch (error) {
      // Error handling
      console.error('Failed to create applicant:', error)
      
      // TODO: Add beautiful error notification with TailwindCSS  
      alert('Failed to create applicant. Please try again.')
      
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
          <UserPlus className="w-4 h-4"/>  Add Applicant
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
                          <DialogTitle className="text-3xl font-semibold text-gray-900">New Applicant</DialogTitle>
                          <p className="text-base text-gray-500">
                            Get started by filling in the information below to create your new applicant.
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
                      {/* Title input - required field */}
                      <TextInput 
                        label="Title" 
                        placeholder="Mr, Ms, Dr" 
                        type="text" 
                        id="applicant-title" 
                        name="applicant-title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                      />
                      
                      {/* First name input - required field */}
                      <TextInput 
                        label="First Name" 
                        placeholder="First Name" 
                        type="text" 
                        id="applicant-firstname" 
                        name="applicant-firstname"
                        value={formData.firstname}
                        onChange={(e) => handleInputChange('firstname', e.target.value)}
                        required
                      />
                      
                      {/* Last name input - required field */}
                      <TextInput 
                        label="Last Name" 
                        placeholder="Last Name" 
                        type="text" 
                        id="applicant-lastname" 
                        name="applicant-lastname"
                        value={formData.surname}
                        onChange={(e) => handleInputChange('surname', e.target.value)}
                        required
                      />
                      
                      {/* Phone number input - required field */}
                      <TextInput 
                        label="Phone Number" 
                        placeholder="+61 xxx xxx xxx" 
                        type="tel" 
                        id="applicant-phone-number" 
                        name="applicant-phone-number"
                        value={formData.phone_number}
                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      />
                      
                      {/* Email address input - required field */}
                      <TextInput 
                        label="Email Address" 
                        placeholder="example@email.com" 
                        type="email" 
                        id="applicant-email-address" 
                        name="applicant-email-address"
                        value={formData.email_address}
                        onChange={(e) => handleInputChange('email_address', e.target.value)}
                        required
                      />
                      
                      {/* Interview select - required field with loading state */}
                      <SelectInput 
                        label="Interview" 
                        placeholder={interviewsLoading ? "Loading interviews..." : "Select Interview"} 
                        id="applicant-interview" 
                        name="applicant-interview" 
                        options={interviews}
                        value={formData.interview_id}
                        onChange={(value) => handleInputChange('interview_id', value)}
                        required
                        disabled={interviewsLoading}
                      />
                      
                      {/* Interview status select - defaults to "Not Started" */}
                      <SelectInput 
                        label="Interview Status" 
                        placeholder="Select Interview Status" 
                        id="applicant-interview-status" 
                        name="applicant-interview-status" 
                        options={InterviewStatus}
                        value={formData.interview_status}
                        onChange={(value) => handleInputChange('interview_status', value)}
                        required
                      />
                    </DividerContainer>
                  </div>
                  {/* Action buttons */}
                  <ActionButton 
                    ActionContent={loading ? "Creating..." : "Create"} // Dynamic button text
                    type="submit" // Make it a submit button
                    disabled={loading || interviewsLoading} // Disable during submission or while loading interviews
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
