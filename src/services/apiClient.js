// Unified API Client for ReadySetHire
import { config } from './config.js'

/**
 * Helper function to handle API requests.
 * It sets the Authorization token and optionally includes the request body.
 *
 * @param {string} endpoint - The API endpoint to call.
 * @param {string} [method='GET'] - The HTTP method to use (GET, POST, PATCH, DELETE).
 * @param {object} [body=null] - The request body to send, typically for POST or PATCH.
 * @returns {Promise<object>} - The JSON response from the API.
 * @throws Will throw an error if the HTTP response is not OK.
 */
export async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method, // Set the HTTP method (GET, POST, PATCH, DELETE)
    headers: {
      'Content-Type': 'application/json', // Indicate that we are sending JSON data
      'Authorization': `Bearer ${config.api.token}` // Include the JWT token for authentication
    },
  };

  // If the method is POST or PATCH, we want the response to include the full representation
  if (method === 'POST' || method === 'PATCH') {
    options.headers['Prefer'] = 'return=representation';
  }

  // Handle body and username for different methods
  if (body) {
    // For POST/PATCH, include body with username
    options.body = JSON.stringify({ ...body, username: config.api.username });
  } else if (method === 'DELETE') {
    // For DELETE, send only username in body (required by PostgREST)
    options.body = JSON.stringify({ username: config.api.username });
  }

  // Make the API request and check if the response is OK
  const response = await fetch(`${config.api.baseUrl}${endpoint}`, options);
  
  if (!response.ok) {
    // Create more detailed error message
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  
  // Handle empty responses (common for DELETE operations)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    // Return empty object for non-JSON responses (like DELETE)
    return {};
  }
}