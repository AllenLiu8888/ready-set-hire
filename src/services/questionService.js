// Question API Service
import { apiRequest } from './apiClient.js'

/**
 * Function to insert a new question into the database.
 * 
 * @param {object} question - The question data to insert.
 * @returns {Promise<object>} - The created question object returned by the API.
 */
export async function createQuestion(question) {
  return apiRequest('/question', 'POST', question);
}

/**
 * Function to list all questions, optionally filtered by interview_id.
 * 
 * @param {string} [interviewId] - Optional interview ID to filter questions.
 * @returns {Promise<Array>} - An array of question objects.
 */
export async function getQuestions(interviewId = null) {
  const endpoint = interviewId 
    ? `/question?interview_id=eq.${interviewId}`
    : '/question';
  return apiRequest(endpoint);
}

/**
 * Function to get a single question by its ID.
 * 
 * @param {string} id - The ID of the question to retrieve.
 * @returns {Promise<object>} - The question object matching the ID.
 */
export async function getQuestion(id) {
  return apiRequest(`/question?id=eq.${id}`);
}

/**
 * Function to update a question by its ID.
 * 
 * @param {string} id - The ID of the question to update.
 * @param {object} question - The question data to update.
 * @returns {Promise<object>} - The updated question object returned by the API.
 */
export async function updateQuestion(id, question) {
  return apiRequest(`/question?id=eq.${id}`, 'PATCH', question);
}

/**
 * Function to delete a question by its ID.
 * 
 * @param {string} id - The ID of the question to delete.
 * @returns {Promise<void>} - No content returned.
 */
export async function deleteQuestion(id) {
  return apiRequest(`/question?id=eq.${id}`, 'DELETE');
}
