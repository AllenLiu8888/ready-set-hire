// Applicant API Service
// CN: 候选人 API 服务
import { apiRequest } from './apiClient.js'

/**
 * Function to insert a new applicant into the database.
 * CN: 向数据库插入新候选人的函数
 * 
 * @param {object} applicant - The applicant data to insert.
 * CN: @param {object} applicant - 要插入的候选人数据
 * @returns {Promise<object>} - The created applicant object returned by the API.
 * CN: @returns {Promise<object>} - API 返回的已创建候选人对象
 */
export async function createApplicant(applicant) {
  return apiRequest('/applicant', 'POST', applicant);
}

/**
 * Function to list all applicants, optionally filtered by interview_id.
 * CN: 列出所有候选人的函数，可选择按 interview_id 过滤
 * 
 * @param {string} [interviewId] - Optional interview ID to filter applicants.
 * CN: @param {string} [interviewId] - 可选的面试 ID 用于过滤候选人
 * @returns {Promise<Array>} - An array of applicant objects.
 * CN: @returns {Promise<Array>} - 候选人对象数组
 */
export async function getApplicants(interviewId = null) {
  const endpoint = interviewId 
    ? `/applicant?interview_id=eq.${interviewId}`
    : '/applicant';
  return apiRequest(endpoint);
}

/**
 * Function to get a single applicant by its ID.
 * CN: 根据 ID 获取单个候选人的函数
 * 
 * @param {string} id - The ID of the applicant to retrieve.
 * CN: @param {string} id - 要检索的候选人 ID
 * @returns {Promise<object>} - The applicant object matching the ID.
 * CN: @returns {Promise<object>} - 匹配 ID 的候选人对象
 */
export async function getApplicant(id) {
  return apiRequest(`/applicant?id=eq.${id}`);
}

/**
 * Function to update an applicant by its ID.
 * CN: 根据 ID 更新候选人的函数
 * 
 * @param {string} id - The ID of the applicant to update.
 * CN: @param {string} id - 要更新的候选人 ID
 * @param {object} applicant - The applicant data to update.
 * CN: @param {object} applicant - 要更新的候选人数据
 * @returns {Promise<object>} - The updated applicant object returned by the API.
 * CN: @returns {Promise<object>} - API 返回的已更新候选人对象
 */
export async function updateApplicant(id, applicant) {
  return apiRequest(`/applicant?id=eq.${id}`, 'PATCH', applicant);
}

/**
 * Function to delete an applicant by its ID.
 * CN: 根据 ID 删除候选人的函数
 * 
 * @param {string} id - The ID of the applicant to delete.
 * CN: @param {string} id - 要删除的候选人 ID
 * @returns {Promise<void>} - No content returned.
 * CN: @returns {Promise<void>} - 无返回内容
 */
export async function deleteApplicant(id) {
  return apiRequest(`/applicant?id=eq.${id}`, 'DELETE');
}
