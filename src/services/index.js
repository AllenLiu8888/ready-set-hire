// Services Export Index

// Export API client
export { apiRequest } from './apiClient.js'

// Export all interview services
export {
  createInterview,
  getInterviews,
  getInterview,
  updateInterview,
  deleteInterview
} from './interviewService.js'

// Export all question services
export {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion
} from './questionService.js'

// Export all applicant services
export {
  createApplicant,
  getApplicants,
  getApplicant,
  updateApplicant,
  deleteApplicant
} from './applicantService.js'

// Export all applicant answer services
export {
  createApplicantAnswer,
  getApplicantAnswers,
  getApplicantAnswer,
  updateApplicantAnswer,
  deleteApplicantAnswer
} from './applicantAnswerService.js'

// Export AI services
export {
  generateInterviewQuestions,
  generateAndCreateQuestions,
  isAIQuestionGenerationAvailable,
  getAIConfigStatus
} from './aiQuestionService.js'
