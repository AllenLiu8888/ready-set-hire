// Applicant API Service
import { apiRequest } from './apiClient.js'

/**
 * Function to insert a new applicant into the database.
 *
 * @param {object} applicant - The applicant data to insert.
 * @returns {Promise<object>} - The created applicant object returned by the API.
 */
export async function createApplicant(applicant) {
  return apiRequest('/applicant', 'POST', applicant);
}

/**
 * Function to list all applicants, optionally filtered by interview_id.
 *
 * @param {string} [interviewId] - Optional interview ID to filter applicants.
 * @returns {Promise<Array>} - An array of applicant objects.
 */
export async function getApplicants(interviewId = null) {
  const endpoint = interviewId 
    ? `/applicant?interview_id=eq.${interviewId}`
    : '/applicant';
  return apiRequest(endpoint);
}

/**
 * Function to get a single applicant by its ID.
 *
 * @param {string} id - The ID of the applicant to retrieve.
 * @returns {Promise<object>} - The applicant object matching the ID.
 */
export async function getApplicant(id) {
  return apiRequest(`/applicant?id=eq.${id}`);
}

/**
 * Function to update an applicant by its ID.
 *
 * @param {string} id - The ID of the applicant to update.
 * @param {object} applicant - The applicant data to update.
 * @returns {Promise<object>} - The updated applicant object returned by the API.
 */
export async function updateApplicant(id, applicant) {
  return apiRequest(`/applicant?id=eq.${id}`, 'PATCH', applicant);
}

/**
 * Function to delete an applicant by its ID.
 *
 * @param {string} id - The ID of the applicant to delete.
 * @returns {Promise<void>} - No content returned.
 */
export async function deleteApplicant(id) {
  return apiRequest(`/applicant?id=eq.${id}`, 'DELETE');
}
