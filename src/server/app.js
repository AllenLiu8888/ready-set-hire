import fetch from 'node-fetch';

// Base URL for the Interview App RESTful API
const API_BASE_URL = 'https://comp2140a2.uqcloud.net/api';

// JWT token for authorization, replace with your actual token from My Grades in Blackboard
// From the A2 JSON Web Token column, view Feedback to show your JWT
const JWT_TOKEN = 'YOUR TOKEN HERE';

// Your UQ student username, used for row-level security to retrieve your records
const USERNAME = 's4767262';

/**
 * Helper function to handle API requests.
 * It sets the Authorization token and optionally includes the request body.
 * 
 * @param {string} endpoint - The API endpoint to call.
 * @param {string} [method='GET'] - The HTTP method to use (GET, POST, PATCH).
 * @param {object} [body=null] - The request body to send, typically for POST or PATCH.
 * @returns {Promise<object>} - The JSON response from the API.
 * @throws Will throw an error if the HTTP response is not OK.
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method, // Set the HTTP method (GET, POST, PATCH)
    headers: {
      'Content-Type': 'application/json', // Indicate that we are sending JSON data
      'Authorization': `Bearer ${JWT_TOKEN}` // Include the JWT token for authentication
    },
  };

  // If the method is POST or PATCH, we want the response to include the full representation
  if (method === 'POST' || method === 'PATCH') {
    options.headers['Prefer'] = 'return=representation';
  }

  // If a body is provided, add it to the request and include the username
  if (body) {
    options.body = JSON.stringify({ ...body, username: USERNAME });
  }

  // Make the API request and check if the response is OK
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  // Return the response as a JSON object
  return response.json();
}

/**
 * Function to insert a new project into the database.
 * 
 * @param {object} project - The project data to insert.
 * @returns {Promise<object>} - The created project object returned by the API.
 */
async function createInterview(interview) {
  return apiRequest('/interview', 'POST', interview);
}

/**
 * Function to list all projects associated with the current user.
 * 
 * @returns {Promise<Array>} - An array of project objects.
 */
async function getInterviews() {
  return apiRequest('/interview');
}

/**
 * Function to get a single project by its ID.
 * The url is slightly different from usual RESTFul ...
 * See the operators section https://docs.postgrest.org/en/v12/references/api/tables_views.html
 * @param {string} id - The ID of the project to retrieve.
 * @returns {Promise<object>} - The project object matching the ID.
 */
async function getInterview(id) {
  return apiRequest(`/interview?id=eq.${id}`);
}

/**
 * Main function to demonstrate API usage.
 * 
 * Creates a new interview, lists all interviews, and retrieves a single interview by ID.
 */
async function main() {
  try {
    // Create a new interview with specific details
    const newInterview = {
      title: 'Front-end Developer Interview',
      job_role: 'Mid-level Front-end Developer',
      description: 'Interview focusing on React, JavaScript fundamentals, and responsive design principles.',
      status: 'Draft', // The interview is not published initially (Draft status)
    };
    const createdInterview = await createInterview(newInterview);
    console.log('Created Interview:', createdInterview);

    // Retrieve and list all interviews associated with your account
    const allInterviews = await getInterviews();
    console.log('All Interviews:', allInterviews);

    // If there are interviews, retrieve the first one by its ID
    if (allInterviews.length > 0) {
      const singleInterview = await getInterview(allInterviews[0].id);
      console.log('Single Interview:', singleInterview);
    }

    // Further functionality for other endpoints like /question can be added here...

  } catch (error) {
    console.error('Error:', error.message); // Log any errors that occur
  }
}

// Execute the main function
main();
