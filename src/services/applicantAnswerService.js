// Applicant Answer API Service
// CN: 候选人答案 API 服务
import { apiRequest } from './apiClient.js'

/**
 * Function to insert a new applicant answer into the database.
 * CN: 向数据库插入新候选人答案的函数
 * 
 * @param {object} answer - The answer data to insert.
 * CN: @param {object} answer - 要插入的答案数据
 * @returns {Promise<object>} - The created answer object returned by the API.
 * CN: @returns {Promise<object>} - API 返回的已创建答案对象
 */
export async function createApplicantAnswer(answer) {
  return apiRequest('/applicant_answer', 'POST', answer);
}

/**
 * Function to list all answers, optionally filtered by applicant_id.
 * CN: 列出所有答案的函数，可选择按 applicant_id 过滤
 * 
 * @param {string} [applicantId] - Optional applicant ID to filter answers.
 * CN: @param {string} [applicantId] - 可选的候选人 ID 用于过滤答案
 * @returns {Promise<Array>} - An array of answer objects.
 * CN: @returns {Promise<Array>} - 答案对象数组
 */
export async function getApplicantAnswers(applicantId = null) {
  const endpoint = applicantId 
    ? `/applicant_answer?applicant_id=eq.${applicantId}`
    : '/applicant_answer';
  return apiRequest(endpoint);
}

/**
 * Function to get a single answer by its ID.
 * CN: 根据 ID 获取单个答案的函数
 * 
 * @param {string} id - The ID of the answer to retrieve.
 * CN: @param {string} id - 要检索的答案 ID
 * @returns {Promise<object>} - The answer object matching the ID.
 * CN: @returns {Promise<object>} - 匹配 ID 的答案对象
 */
export async function getApplicantAnswer(id) {
  return apiRequest(`/applicant_answer?id=eq.${id}`);
}

/**
 * Function to update an answer by its ID.
 * CN: 根据 ID 更新答案的函数
 * 
 * @param {string} id - The ID of the answer to update.
 * CN: @param {string} id - 要更新的答案 ID
 * @param {object} answer - The answer data to update.
 * CN: @param {object} answer - 要更新的答案数据
 * @returns {Promise<object>} - The updated answer object returned by the API.
 * CN: @returns {Promise<object>} - API 返回的已更新答案对象
 */
export async function updateApplicantAnswer(id, answer) {
  return apiRequest(`/applicant_answer?id=eq.${id}`, 'PATCH', answer);
}

/**
 * Function to delete an answer by its ID.
 * CN: 根据 ID 删除答案的函数
 * 
 * @param {string} id - The ID of the answer to delete.
 * CN: @param {string} id - 要删除的答案 ID
 * @returns {Promise<void>} - No content returned.
 * CN: @returns {Promise<void>} - 无返回内容
 */
export async function deleteApplicantAnswer(id) {
  return apiRequest(`/applicant_answer?id=eq.${id}`, 'DELETE');
}
