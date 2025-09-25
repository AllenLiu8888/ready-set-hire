// Interview API Service
// CN: 面试 API 服务
import { apiRequest } from './apiClient.js'

/**
 * Function to insert a new interview into the database.
 * CN: 向数据库插入新面试的函数
 * 
 * @param {object} interview - The interview data to insert.
 * CN: @param {object} interview - 要插入的面试数据
 * @returns {Promise<object>} - The created interview object returned by the API.
 * CN: @returns {Promise<object>} - API 返回的已创建面试对象
 */
export async function createInterview(interview) {
  return apiRequest('/interview', 'POST', interview);
}

/**
 * Function to list all interviews associated with the current user.
 * CN: 列出与当前用户关联的所有面试的函数
 * 
 * @returns {Promise<Array>} - An array of interview objects.
 * CN: @returns {Promise<Array>} - 面试对象数组
 */
export async function getInterviews() {
  return apiRequest('/interview');
}

/**
 * Function to get a single interview by its ID.
 * CN: 根据 ID 获取单个面试的函数
 * The url is slightly different from usual RESTFul ...
 * CN: URL 与通常的 RESTful 略有不同...
 * See the operators section https://docs.postgrest.org/en/v12/references/api/tables_views.html
 * CN: 请参阅操作符部分 https://docs.postgrest.org/en/v12/references/api/tables_views.html
 * @param {string} id - The ID of the interview to retrieve.
 * CN: @param {string} id - 要检索的面试 ID
 * @returns {Promise<object>} - The interview object matching the ID.
 * CN: @returns {Promise<object>} - 匹配 ID 的面试对象
 */
export async function getInterview(id) {
  return apiRequest(`/interview?id=eq.${id}`);
}

/**
 * Function to update an interview by its ID.
 * CN: 根据 ID 更新面试的函数
 * 
 * @param {string} id - The ID of the interview to update.
 * CN: @param {string} id - 要更新的面试 ID
 * @param {object} interview - The interview data to update.
 * CN: @param {object} interview - 要更新的面试数据
 * @returns {Promise<object>} - The updated interview object returned by the API.
 * CN: @returns {Promise<object>} - API 返回的已更新面试对象
 */
export async function updateInterview(id, interview) {
  return apiRequest(`/interview?id=eq.${id}`, 'PATCH', interview);
}

/**
 * Function to delete an interview by its ID.
 * CN: 根据 ID 删除面试的函数
 * 
 * @param {string} id - The ID of the interview to delete.
 * CN: @param {string} id - 要删除的面试 ID
 * @returns {Promise<void>} - No content returned.
 * CN: @returns {Promise<void>} - 无返回内容
 */
export async function deleteInterview(id) {
  return apiRequest(`/interview?id=eq.${id}`, 'DELETE');
}