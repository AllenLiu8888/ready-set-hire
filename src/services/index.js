// Services Export Index
// CN: 服务导出索引

// Export API client
// CN: 导出 API 客户端
export { apiRequest } from './apiClient.js'

// Export all interview services
// CN: 导出所有面试服务
export {
  createInterview,
  getInterviews,
  getInterview,
  updateInterview,
  deleteInterview
} from './interviewService.js'

// Export all question services
// CN: 导出所有题目服务
export {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion
} from './questionService.js'

// Export all applicant services
// CN: 导出所有候选人服务
export {
  createApplicant,
  getApplicants,
  getApplicant,
  updateApplicant,
  deleteApplicant
} from './applicantService.js'

// Export all applicant answer services
// CN: 导出所有候选人答案服务
export {
  createApplicantAnswer,
  getApplicantAnswers,
  getApplicantAnswer,
  updateApplicantAnswer,
  deleteApplicantAnswer
} from './applicantAnswerService.js'
