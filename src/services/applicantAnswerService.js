// Applicant Answer API Service
import { apiRequest } from './apiClient.js'

/**
 * Function to insert a new applicant answer into the database.
 *
 * @param {object} answer - The answer data to insert.
 * @returns {Promise<object>} - The created answer object returned by the API.
 */
export async function createApplicantAnswer(answer) {
  return apiRequest('/applicant_answer', 'POST', answer);
}

/**
 * Function to list all answers, optionally filtered by applicant_id.
 *
 * @param {string} [applicantId] - Optional applicant ID to filter answers.
 * @returns {Promise<Array>} - An array of answer objects.
 */
export async function getApplicantAnswers(applicantId = null) {
  const endpoint = applicantId 
    ? `/applicant_answer?applicant_id=eq.${applicantId}`
    : '/applicant_answer';
  return apiRequest(endpoint);
}

/**
 * Function to get a single answer by its ID.
 *
 * @param {string} id - The ID of the answer to retrieve.
 * @returns {Promise<object>} - The answer object matching the ID.
 */
export async function getApplicantAnswer(id) {
  return apiRequest(`/applicant_answer?id=eq.${id}`);
}

/**
 * Function to update an answer by its ID.
 *
 * @param {string} id - The ID of the answer to update.
 * @param {object} answer - The answer data to update.
 * @returns {Promise<object>} - The updated answer object returned by the API.
 */
export async function updateApplicantAnswer(id, answer) {
  return apiRequest(`/applicant_answer?id=eq.${id}`, 'PATCH', answer);
}

/**
 * Function to delete an answer by its ID.
 *
 * @param {string} id - The ID of the answer to delete.
 * @returns {Promise<void>} - No content returned.
 */
export async function deleteApplicantAnswer(id) {
  return apiRequest(`/applicant_answer?id=eq.${id}`, 'DELETE');
}
