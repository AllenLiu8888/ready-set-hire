// =============================================================================
// Edit Interview Drawer - Modal form for editing existing interview templates
// =============================================================================
// This component provides a modal interface for editing existing interview templates,
// including form validation, data pre-filling, and API integration for updates.
// =============================================================================

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { SquarePen } from 'lucide-react';
import { X } from 'lucide-react';
import TextInput from '../../components/form/TextInput';
import TextAreaInput from '../../components/form/TextAreaInput';
import SelectInput from '../../components/form/SelectInput';
import ActionButton from '../../components/form/ActionButton';
import DividerContainer from '../../components/form/DividerContainer';

// Import API service for updating interviews
import { updateInterview } from '../../services';


export default function EditInterviewDrawer({ interview, onInterviewUpdated }) {
  // UI state management
  const [open, setOpen] = useState(false) // Dialog open/close state
  const [loading, setLoading] = useState(false) // Form submission loading state
  
  // Form data state - initialized from props or empty
  const [formData, setFormData] = useState({
    title: '',           // Interview title
    job_role: '',        // Job role
    description: '',     // Interview description
    status: 'Draft'      // Interview status
  })

  // Available interview status options - matches API requirements
  const InterviewStatus = [
    { value: 'Published', label: 'Published' },  // Published interviews are active
    { value: 'Draft', label: 'Draft' },          // Draft interviews are not visible to applicants
    { value: 'Archived', label: 'Archived' },    // Archived interviews are closed
  ]

  // Effect to populate form when interview prop changes
  useEffect(() => {
    if (interview) {
      setFormData({
        title: interview.title || '',
        job_role: interview.job_role || '',
        description: interview.description || '',
        status: interview.status || 'Draft'
      })
    }
  }, [interview]) // Re-run when interview prop changes

  // Handle form input changes - updates formData state
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,           // Keep existing fields
      [field]: value     // Update the specific field
    }))
  }

  // Handle form submission - updates existing interview via API
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent default form submission

    // Ensure we have an interview to update
    if (!interview || !interview.id) {
      alert('No interview selected for editing')
      return
    }

    // Basic validation - ensure required fields are filled
    if (!formData.title.trim() || !formData.job_role.trim() || !formData.status) { // trim() method removes whitespace from both ends of string
      alert('Please fill in all required fields: Title, Job Role, and Status')
      return
    }

    try {
      setLoading(true) // Start loading

      // Call API service to update interview
      const updatedInterview = await updateInterview(interview.id, formData)
      
      // Success handling
      console.log('Interview updated successfully:', updatedInterview)
      
      // Close the dialog
      setOpen(false)
      
      // Notify parent component to refresh data
      if (onInterviewUpdated) {
        onInterviewUpdated()
      }
      
      // Success notification will be handled by parent component
      
    } catch (error) {
      // Error handling
      console.error('Failed to update interview:', error)
      
      // TODO: Add beautiful error notification with TailwindCSS
      alert('Failed to update interview. Please try again.')
      
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

  // Don't render edit button if no interview provided
  if (!interview) {
    return null
  }

  return (
    <>
      {/* <button
        type="button"
        className="block rounded-md bg-slate-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <div className="flex items-center gap-2" onClick={() => setOpen(true)}>
          <CirclePlus className="w-4 h-4"/>  Add Interview
        </div>
      </button> */}
      <button
        type="button"
        className="rounded-sm bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-400 shadow-xs hover:bg-blue-100 mr-2">
        <div className='flex items-center gap-2' onClick={() => setOpen(true)}>
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
                          <DialogTitle className="text-3xl font-semibold text-gray-900">Edit Interview</DialogTitle>
                          <p className="text-base text-gray-500">
                            Get started by filling in the information below to edit your interview.
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
                        placeholder="Interview Title" 
                        type="text" 
                        id="interview-title" 
                        name="interview-title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                      />
                      
                      {/* Job Role input - required field */}
                      <TextInput 
                        label="Job Role" 
                        placeholder="Job Role (e.g. Senior Front-end Developer)" 
                        type="text" 
                        id="interview-job-role" 
                        name="interview-job-role"
                        value={formData.job_role}
                        onChange={(e) => handleInputChange('job_role', e.target.value)}
                        required
                      />
                      
                      {/* Description textarea - optional field */}
                      <TextAreaInput 
                        label="Description" 
                        placeholder="Interview description and requirements" 
                        id="interview-description" 
                        name="interview-description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                      />
                      
                      {/* Status select - can be changed during editing */}
                      <SelectInput 
                        label="Status" 
                        placeholder="Select Interview Status" 
                        id="interview-status" 
                        name="interview-status" 
                        options={InterviewStatus}
                        value={formData.status}
                        onChange={(value) => handleInputChange('status', value)}
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
