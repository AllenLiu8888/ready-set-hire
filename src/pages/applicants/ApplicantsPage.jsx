// =============================================================================
// Applicants Management Page - CRUD operations for interview candidates
// =============================================================================
// This page manages interview applicants including creation, editing, deletion,
// invitation link generation, and status tracking with real-time updates.
// =============================================================================

import { tv } from 'tailwind-variants';
import { RefreshCcw, Trash2, Link, Users, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import CreateApplicantDrawer from './CreateApplicantDrawer.jsx';
import EditApplicantDrawer from './EditApplicantDrawer.jsx';
import ConfirmAlert from '../../components/shared/alerts/ConfirmAlert.jsx';
import SuccessAlert from '../../components/shared/alerts/SuccessAlert.jsx';
import ViewAnswersModal from '../../components/shared/modals/ViewAnswersModal.jsx';

// Import API services and utilities
import { getApplicants, deleteApplicant } from '../../services';
import { getInterviewTitleById } from '../../utils/interviewUtils';

// =============================================================================
// Tailwind Variants for Dynamic Styling
// =============================================================================

const ApplicantsStatus = tv({
  base: 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
  variants: {
    status: {
      'Not Started': 'bg-yellow-50 text-yellow-600',
      'Completed': 'bg-blue-50 text-blue-600',
    },
  },
})

export default function ApplicantsPage() {
  // =============================================================================
  // Component State Management
  // =============================================================================
  
  // State management for applicants data and UI states
  const [applicants, setApplicants] = useState([]) // Store applicants list
  const [loading, setLoading] = useState(true) // Loading state
  const [error, setError] = useState(null) // Error state

  // State for delete confirmation dialog
  const [showConfirm, setShowConfirm] = useState(false) // Control confirm dialog
  const [applicantToDelete, setApplicantToDelete] = useState(null) // Applicant to be deleted

  // State for success notification
  const [successMessage, setSuccessMessage] = useState('') // Success message content
  const [showSuccess, setShowSuccess] = useState(false) // Control success alert visibility

  // State for view answers modal (Rubric 1.8)
  const [showViewAnswers, setShowViewAnswers] = useState(false) // Control view answers modal
  const [selectedApplicant, setSelectedApplicant] = useState(null) // Selected applicant for viewing answers
  // Function to fetch applicants from API
  const fetchApplicants = async () => {
    try {
      setLoading(true) // Start loading
      setError(null) // Clear previous errors

      // Call API service to get applicants
      const data = await getApplicants()
      
      // Update state with fetched data
      setApplicants(data)
    } catch (err) {
      // Handle errors
      console.error('Failed to fetch applicants:', err)
      setError('Failed to load applicants. Please try again.')
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

  // Function to handle applicant creation success
  const handleApplicantCreated = () => {
    fetchApplicants() // Refresh the list
    showSuccessNotification('Applicant created successfully!') // Show success message
  }

  // Function to handle applicant update success
  const handleApplicantUpdated = () => {
    fetchApplicants() // Refresh the list
    showSuccessNotification('Applicant updated successfully!') // Show success message
  }

  // Function to handle delete button click - shows confirmation dialog
  const handleDeleteClick = (applicant) => {
    setApplicantToDelete(applicant) // Store applicant to delete
    setShowConfirm(true) // Show confirmation dialog
  }

  // Function to handle confirmed deletion
  const handleConfirmDelete = async () => {
    if (!applicantToDelete) return

    try {
      console.log('Deleting applicant:', applicantToDelete.id, `${applicantToDelete.firstname} ${applicantToDelete.surname}`)
      
      // Call API service to delete applicant
      await deleteApplicant(applicantToDelete.id)
      
      console.log('Delete API call successful')
      
      // Remove from local state (optimistic update)
      setApplicants(prev => prev.filter(applicant => applicant.id !== applicantToDelete.id))
      
      // Clean up state
      setApplicantToDelete(null)
      setShowConfirm(false)
      
      // Show success message
      console.log('Applicant deleted successfully:', `${applicantToDelete.firstname} ${applicantToDelete.surname}`)
      showSuccessNotification(`Applicant "${applicantToDelete.firstname} ${applicantToDelete.surname}" deleted successfully!`)
      
    } catch (err) {
      // Handle deletion errors with detailed logging
      console.error('Failed to delete applicant:', err)
      console.error('Applicant details:', {
        id: applicantToDelete.id,
        name: `${applicantToDelete.firstname} ${applicantToDelete.surname}`,
        error: err.message
      })
      
      // Show detailed error message
      alert(`Failed to delete applicant "${applicantToDelete.firstname} ${applicantToDelete.surname}": ${err.message}`)
      
      // Keep dialog open so user can try again
      // setShowConfirm(false) // Don't close on error
    }
  }

  // Function to handle dialog close
  const handleCloseConfirm = () => {
    setShowConfirm(false)
    setApplicantToDelete(null)
  }

  // Function to generate interview invitation link
  const generateInvitationLink = (applicantId) => {
    // Generate the take interview URL for the applicant
    const baseUrl = window.location.origin
    const inviteLink = `${baseUrl}/take/${applicantId}`
    
    // Copy to clipboard
    navigator.clipboard.writeText(inviteLink).then(() => {
      showSuccessNotification('Interview link copied to clipboard!')
    }).catch((err) => {
      console.error('Failed to copy link:', err)
      alert('Failed to copy link to clipboard')
    })
  }

  // Function to handle view answers button click (Rubric 1.8)
  const handleViewAnswers = (applicant) => {
    setSelectedApplicant(applicant)
    setShowViewAnswers(true)
  }

  // Function to close view answers modal
  const handleCloseViewAnswers = () => {
    setShowViewAnswers(false)
    setSelectedApplicant(null)
  }

  // Effect hook to fetch data when component mounts
  useEffect(() => {
    fetchApplicants()
  }, []) // Empty dependency array means this runs once on mount

  // Early return for loading state
  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCcw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-2 text-gray-600">Loading applicants...</p>
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
              onClick={fetchApplicants}
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
          <h1 className="text-3xl font-semibold text-gray-900">Applicants</h1>
          <p className="mt-2 text-base text-gray-700">
            A list of all the applicants in your account including their title, role, description and status.
          </p>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={fetchApplicants} // Add click handler to refresh data
            disabled={loading} // Disable while loading
            className="rounded-md bg-white px-3 py-2 text-center font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-200 hover:text-gray-500 disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}/> Refresh
            </div>
          </button>

          <CreateApplicantDrawer onApplicantCreated={handleApplicantCreated} /> {/* Pass callback to refresh and show success */}
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
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Contact
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Interview
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {/* Show empty state if no applicants */}
                  {applicants.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-8 h-8 text-gray-300" />
                          <p>No applicants found</p>
                          <p className="text-sm">Create your first applicant to get started</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // Map through real applicants data from API
                    applicants.map((applicant) => (
                      <tr key={applicant.id}>
                        <td className="py-4 px-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                          {applicant.title} {applicant.firstname} {applicant.surname}
                        </td> 
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{applicant.phone_number}</span>
                            <span className="text-sm text-gray-500">{applicant.email_address}</span>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {/* Display interview title from localStorage with error handling */}
                          {getInterviewTitleById(applicant.interview_id)}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          <span className={ApplicantsStatus({ status: applicant.interview_status })}>
                            {applicant.interview_status}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-center text-sm font-medium whitespace-nowrap">  
                          {/* View answers button (Rubric 1.8) - available for all applicants */}
                          <button
                            type="button"
                            onClick={() => handleViewAnswers(applicant)}
                            className="rounded-sm bg-green-50 px-2 py-1 text-sm font-semibold text-green-600 shadow-xs hover:bg-green-100 mr-2"
                            title={`View interview questions and answers (${applicant.interview_status})`}
                          >
                            <div className='flex items-center gap-2'>
                              <Eye className="w-4 h-4"/>
                              View Answers
                            </div>
                          </button>
                          
                          {/* Copy interview link button */}
                          <button
                            type="button"
                            onClick={() => generateInvitationLink(applicant.id)} // Generate and copy invitation link
                            className="rounded-sm bg-zinc-50 px-2 py-1 text-sm font-semibold text-zinc-600 shadow-xs hover:bg-zinc-100 mr-2"
                          >
                            <div className='flex items-center gap-2'>
                              <Link className="w-4 h-4"/>
                              Copy Link
                            </div>
                          </button>
                          
                          {/* Pass applicant data to edit drawer */}
                          <EditApplicantDrawer 
                            applicant={applicant} 
                            onApplicantUpdated={handleApplicantUpdated}
                          />
                          
                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(applicant)} // Use new click handler
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
          title="Delete Applicant"
          message={`Are you sure you want to delete "${applicantToDelete?.firstname} ${applicantToDelete?.surname}"? This action cannot be undone.`}
        />
      )}

      {/* View Answers Modal (Rubric 1.8) */}
      {showViewAnswers && selectedApplicant && (
        <ViewAnswersModal
          applicant={selectedApplicant}
          onClose={handleCloseViewAnswers}
        />
      )}
    </div>
  )
}
