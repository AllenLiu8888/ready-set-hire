// Interview utility functions for localStorage and data mapping

/**
 * Get interview title by ID from localStorage
 * 
 * @param {number|string} interviewId - The interview ID to look up
 * @returns {string} - The interview title or fallback text
 */
export function getInterviewTitleById(interviewId) {
  try {
    // Get interviews from localStorage
    const interviewsData = localStorage.getItem('interviews')
    
    if (!interviewsData) {
      return `Interview ID: ${interviewId}` // Fallback if no data
    }
    
    const interviews = JSON.parse(interviewsData)
    
    // Find the interview by ID (handle both string and number IDs)
    const interview = interviews.find(
      interview => interview.id === interviewId || interview.id === parseInt(interviewId, 10)
    )
    
    if (interview) {
      // Return formatted title with job role
      return `${interview.title} (${interview.job_role})`
    } else {
      // Fallback if interview not found
      return `Interview ID: ${interviewId}`
    }
  } catch (error) {
    // Handle JSON parsing errors or other issues
    console.error('Error getting interview title:', error)
    return `Interview ID: ${interviewId}`
  }
}

/**
 * Get all interviews from localStorage
 * 
 * @returns {Array} - Array of interview objects or empty array
 */
export function getInterviewsFromStorage() {
  try {
    const interviewsData = localStorage.getItem('interviews')
    return interviewsData ? JSON.parse(interviewsData) : []
  } catch (error) {
    console.error('Error getting interviews from storage:', error)
    return []
  }
}

/**
 * Store interviews in localStorage
 * 
 * @param {Array} interviews - Array of interview objects
 */
export function storeInterviews(interviews) {
  try {
    localStorage.setItem('interviews', JSON.stringify(interviews))
  } catch (error) {
    console.error('Error storing interviews:', error)
  }
}
