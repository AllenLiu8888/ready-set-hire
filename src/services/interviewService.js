// Interview API Service
import { apiRequest } from './apiClient.js'

/**
 * Function to insert a new interview into the database.
 *
 * @param {object} interview - The interview data to insert.
 * @returns {Promise<object>} - The created interview object returned by the API.
 */
export async function createInterview(interview) {
  return apiRequest('/interview', 'POST', interview);
}

/**
 * Function to list all interviews associated with the current user.
 *
 * @returns {Promise<Array>} - An array of interview objects.
 */
export async function getInterviews() {
  return apiRequest('/interview');
}

/**
 * Function to get a single interview by its ID.
 * The url is slightly different from usual RESTFul ...
 * See the operators section https://docs.postgrest.org/en/v12/references/api/tables_views.html
 * @param {string} id - The ID of the interview to retrieve.
 * @returns {Promise<object>} - The interview object matching the ID.
 */
export async function getInterview(id) {
  return apiRequest(`/interview?id=eq.${id}`);
}

/**
 * Function to update an interview by its ID.
 *
 * @param {string} id - The ID of the interview to update.
 * @param {object} interview - The interview data to update.
 * @returns {Promise<object>} - The updated interview object returned by the API.
 */
export async function updateInterview(id, interview) {
  return apiRequest(`/interview?id=eq.${id}`, 'PATCH', interview);
}

/**
 * Function to delete an interview by its ID.
 *
 * @param {string} id - The ID of the interview to delete.
 * @returns {Promise<void>} - No content returned.
 */
export async function deleteInterview(id) {
  return apiRequest(`/interview?id=eq.${id}`, 'DELETE');
}