import fetch from 'node-fetch';

// 面试应用 RESTful API 的基础 URL
// CN: 面试应用 RESTful API 的基础 URL
const API_BASE_URL = 'https://comp2140a2.uqcloud.net/api';

// JWT token for authorization, replace with your actual token from My Grades in Blackboard
// CN: 用于授权的 JWT 令牌，请替换为您从 Blackboard My Grades 中获取的实际令牌
// From the A2 JSON Web Token column, view Feedback to show your JWT
// CN: 从 A2 JSON Web Token 列中，查看反馈以显示您的 JWT
const JWT_TOKEN = 'YOUR TOKEN HERE';

// Your UQ student username, used for row-level security to retrieve your records
// CN: 您的 UQ 学生用户名，用于行级安全以检索您的记录
const USERNAME = 's4767262';

/**
 * Helper function to handle API requests.
 * CN: 处理 API 请求的辅助函数
 * It sets the Authorization token and optionally includes the request body.
 * CN: 设置授权令牌并可选地包含请求主体
 * 
 * @param {string} endpoint - The API endpoint to call.
 * CN: @param {string} endpoint - 要调用的 API 端点
 * @param {string} [method='GET'] - The HTTP method to use (GET, POST, PATCH).
 * CN: @param {string} [method='GET'] - 要使用的 HTTP 方法（GET、POST、PATCH）
 * @param {object} [body=null] - The request body to send, typically for POST or PATCH.
 * CN: @param {object} [body=null] - 要发送的请求主体，通常用于 POST 或 PATCH
 * @returns {Promise<object>} - The JSON response from the API.
 * CN: @returns {Promise<object>} - 来自 API 的 JSON 响应
 * @throws Will throw an error if the HTTP response is not OK.
 * CN: @throws 如果 HTTP 响应不正常，将抛出错误
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method, // Set the HTTP method (GET, POST, PATCH)
    // CN: 设置 HTTP 方法（GET、POST、PATCH）
    headers: {
      'Content-Type': 'application/json', // Indicate that we are sending JSON data
      // CN: 指示我们正在发送 JSON 数据
      'Authorization': `Bearer ${JWT_TOKEN}` // Include the JWT token for authentication
      // CN: 包含用于身份验证的 JWT 令牌
    },
  };

  // If the method is POST or PATCH, we want the response to include the full representation
  // CN: 如果方法是 POST 或 PATCH，我们希望响应包含完整的表示
  if (method === 'POST' || method === 'PATCH') {
    options.headers['Prefer'] = 'return=representation';
  }

  // If a body is provided, add it to the request and include the username
  // CN: 如果提供了主体，将其添加到请求中并包含用户名
  if (body) {
    options.body = JSON.stringify({ ...body, username: USERNAME });
  }

  // Make the API request and check if the response is OK
  // CN: 发起 API 请求并检查响应是否正常
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  // Return the response as a JSON object
  // CN: 将响应作为 JSON 对象返回
  return response.json();
}

/**
 * Function to insert a new project into the database.
 * CN: 向数据库插入新面试的函数
 * 
 * @param {object} project - The project data to insert.
 * CN: @param {object} interview - 要插入的面试数据
 * @returns {Promise<object>} - The created project object returned by the API.
 * CN: @returns {Promise<object>} - API 返回的已创建面试对象
 */
async function createInterview(interview) {
  return apiRequest('/interview', 'POST', interview);
}

/**
 * Function to list all projects associated with the current user.
 * CN: 列出与当前用户关联的所有面试的函数
 * 
 * @returns {Promise<Array>} - An array of project objects.
 * CN: @returns {Promise<Array>} - 面试对象数组
 */
async function getInterviews() {
  return apiRequest('/interview');
}

/**
 * Function to get a single project by its ID.
 * CN: 根据 ID 获取单个面试的函数
 * The url is slightly different from usual RESTFul ...
 * CN: URL 与通常的 RESTful 略有不同...
 * See the operators section https://docs.postgrest.org/en/v12/references/api/tables_views.html
 * CN: 请参阅操作符部分 https://docs.postgrest.org/en/v12/references/api/tables_views.html
 * @param {string} id - The ID of the project to retrieve.
 * CN: @param {string} id - 要检索的面试 ID
 * @returns {Promise<object>} - The project object matching the ID.
 * CN: @returns {Promise<object>} - 匹配 ID 的面试对象
 */
async function getInterview(id) {
  return apiRequest(`/interview?id=eq.${id}`);
}

/**
 * Main function to demonstrate API usage.
 * CN: 演示 API 使用的主函数
 * 
 * Creates a new interview, lists all interviews, and retrieves a single interview by ID.
 * CN: 创建新面试、列出所有面试并按 ID 检索单个面试
 */
async function main() {
  try {
    // Create a new interview with specific details
    // CN: 创建具有特定详细信息的新面试
    const newInterview = {
      title: 'Front-end Developer Interview',
      job_role: 'Mid-level Front-end Developer',
      description: 'Interview focusing on React, JavaScript fundamentals, and responsive design principles.',
      status: 'Draft', // The interview is not published initially (Draft status)
      // CN: 面试最初未发布（草稿状态）
    };
    const createdInterview = await createInterview(newInterview);
    console.log('Created Interview:', createdInterview);

    // Retrieve and list all interviews associated with your account
    // CN: 检索并列出与您的账户关联的所有面试
    const allInterviews = await getInterviews();
    console.log('All Interviews:', allInterviews);

    // If there are interviews, retrieve the first one by its ID
    // CN: 如果有面试，按 ID 检索第一个
    if (allInterviews.length > 0) {
      const singleInterview = await getInterview(allInterviews[0].id);
      console.log('Single Interview:', singleInterview);
    }

    // Further functionality for other endpoints like /question can be added here...
    // CN: 可以在这里添加其他端点（如 /question）的进一步功能...

  } catch (error) {
    console.error('Error:', error.message); // Log any errors that occur
    // CN: 记录发生的任何错误
  }
}

// Execute the main function
// CN: 执行主函数
main();
