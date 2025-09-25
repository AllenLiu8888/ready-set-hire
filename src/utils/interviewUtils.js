// Interview utility functions for localStorage and data mapping
// CN: 用于localStorage和数据映射的面试工具函数

/**
 * Get interview title by ID from localStorage
 * CN: 根据ID从localStorage获取面试标题
 * 
 * @param {number|string} interviewId - The interview ID to look up
 * CN: @param {number|string} interviewId - 要查找的面试ID
 * @returns {string} - The interview title or fallback text
 * CN: @returns {string} - 面试标题或回退文本
 */
export function getInterviewTitleById(interviewId) {
  try {
    // Get interviews from localStorage
    // CN: 从localStorage获取面试数据
    const interviewsData = localStorage.getItem('interviews')
    
    if (!interviewsData) {
      return `Interview ID: ${interviewId}` // Fallback if no data
    }
    
    const interviews = JSON.parse(interviewsData)
    
    // Find the interview by ID (handle both string and number IDs)
    // CN: 根据ID查找面试（处理字符串和数字ID）
    const interview = interviews.find(
      interview => interview.id === interviewId || interview.id === parseInt(interviewId, 10)
    )
    
    if (interview) {
      // Return formatted title with job role
      // CN: 返回包含职位角色的格式化标题
      return `${interview.title} (${interview.job_role})`
    } else {
      // Fallback if interview not found
      // CN: 如果未找到面试则使用回退文本
      return `Interview ID: ${interviewId}`
    }
  } catch (error) {
    // Handle JSON parsing errors or other issues
    // CN: 处理JSON解析错误或其他问题
    console.error('Error getting interview title:', error)
    return `Interview ID: ${interviewId}`
  }
}

/**
 * Get all interviews from localStorage
 * CN: 从localStorage获取所有面试数据
 * 
 * @returns {Array} - Array of interview objects or empty array
 * CN: @returns {Array} - 面试对象数组或空数组
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
 * CN: 将面试数据存储到localStorage
 * 
 * @param {Array} interviews - Array of interview objects
 * CN: @param {Array} interviews - 面试对象数组
 */
export function storeInterviews(interviews) {
  try {
    localStorage.setItem('interviews', JSON.stringify(interviews))
  } catch (error) {
    console.error('Error storing interviews:', error)
  }
}
