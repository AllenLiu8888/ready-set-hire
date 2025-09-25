// Question API Service
// CN: 题目 API 服务
import { apiRequest } from './apiClient.js'

/**
 * Function to insert a new question into the database.
 * CN: 向数据库插入新题目的函数
 * 
 * @param {object} question - The question data to insert.
 * CN: @param {object} question - 要插入的题目数据
 * @returns {Promise<object>} - The created question object returned by the API.
 * CN: @returns {Promise<object>} - API 返回的已创建题目对象
 */
export async function createQuestion(question) {
  return apiRequest('/question', 'POST', question);
}

/**
 * Function to list all questions, optionally filtered by interview_id.
 * CN: 列出所有题目的函数，可选择按 interview_id 过滤
 * 
 * @param {string} [interviewId] - Optional interview ID to filter questions.
 * CN: @param {string} [interviewId] - 可选的面试 ID 用于过滤题目
 * @returns {Promise<Array>} - An array of question objects.
 * CN: @returns {Promise<Array>} - 题目对象数组
 */
export async function getQuestions(interviewId = null) {
  const endpoint = interviewId 
    ? `/question?interview_id=eq.${interviewId}`
    : '/question';
  return apiRequest(endpoint);
}

/**
 * Function to get a single question by its ID.
 * CN: 根据 ID 获取单个题目的函数
 * 
 * @param {string} id - The ID of the question to retrieve.
 * CN: @param {string} id - 要检索的题目 ID
 * @returns {Promise<object>} - The question object matching the ID.
 * CN: @returns {Promise<object>} - 匹配 ID 的题目对象
 */
export async function getQuestion(id) {
  return apiRequest(`/question?id=eq.${id}`);
}

/**
 * Function to update a question by its ID.
 * CN: 根据 ID 更新题目的函数
 * 
 * @param {string} id - The ID of the question to update.
 * CN: @param {string} id - 要更新的题目 ID
 * @param {object} question - The question data to update.
 * CN: @param {object} question - 要更新的题目数据
 * @returns {Promise<object>} - The updated question object returned by the API.
 * CN: @returns {Promise<object>} - API 返回的已更新题目对象
 */
export async function updateQuestion(id, question) {
  return apiRequest(`/question?id=eq.${id}`, 'PATCH', question);
}

/**
 * Function to delete a question by its ID.
 * CN: 根据 ID 删除题目的函数
 * 
 * @param {string} id - The ID of the question to delete.
 * CN: @param {string} id - 要删除的题目 ID
 * @returns {Promise<void>} - No content returned.
 * CN: @returns {Promise<void>} - 无返回内容
 */
export async function deleteQuestion(id) {
  return apiRequest(`/question?id=eq.${id}`, 'DELETE');
}
