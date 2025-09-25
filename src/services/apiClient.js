// Unified API Client for ReadySetHire
// CN: ReadySetHire 的统一 API 客户端
import { config } from './config.js'

/**
 * Helper function to handle API requests.
 * CN: 处理 API 请求的辅助函数
 * It sets the Authorization token and optionally includes the request body.
 * CN: 设置授权令牌并可选地包含请求主体
 * 
 * @param {string} endpoint - The API endpoint to call.
 * CN: @param {string} endpoint - 要调用的 API 端点
 * @param {string} [method='GET'] - The HTTP method to use (GET, POST, PATCH, DELETE).
 * CN: @param {string} [method='GET'] - 要使用的 HTTP 方法（GET、POST、PATCH、DELETE）
 * @param {object} [body=null] - The request body to send, typically for POST or PATCH.
 * CN: @param {object} [body=null] - 要发送的请求主体，通常用于 POST 或 PATCH
 * @returns {Promise<object>} - The JSON response from the API.
 * CN: @returns {Promise<object>} - 来自 API 的 JSON 响应
 * @throws Will throw an error if the HTTP response is not OK.
 * CN: @throws 如果 HTTP 响应不正常，将抛出错误
 */
export async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method, // Set the HTTP method (GET, POST, PATCH, DELETE)
    // CN: 设置 HTTP 方法（GET、POST、PATCH、DELETE）
    headers: {
      'Content-Type': 'application/json', // Indicate that we are sending JSON data
      // CN: 指示我们正在发送 JSON 数据
      'Authorization': `Bearer ${config.api.token}` // Include the JWT token for authentication
      // CN: 包含用于身份验证的 JWT 令牌
    },
  };

  // If the method is POST or PATCH, we want the response to include the full representation
  // CN: 如果方法是 POST 或 PATCH，我们希望响应包含完整的表示
  if (method === 'POST' || method === 'PATCH') {
    options.headers['Prefer'] = 'return=representation';
  }

  // Handle body and username for different methods
  // CN: 为不同方法处理主体和用户名
  if (body) {
    // For POST/PATCH, include body with username
    // CN: 对于 POST/PATCH，包含带用户名的主体
    options.body = JSON.stringify({ ...body, username: config.api.username });
  } else if (method === 'DELETE') {
    // For DELETE, send only username in body (required by PostgREST)
    // CN: 对于 DELETE，仅在主体中发送用户名（PostgREST 要求）
    options.body = JSON.stringify({ username: config.api.username });
  }

  // Make the API request and check if the response is OK
  // CN: 发起 API 请求并检查响应是否正常
  const response = await fetch(`${config.api.baseUrl}${endpoint}`, options);
  
  if (!response.ok) {
    // Create more detailed error message
    // CN: 创建更详细的错误消息
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  
  // Handle empty responses (common for DELETE operations)
  // CN: 处理空响应（DELETE 操作常见）
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    // Return empty object for non-JSON responses (like DELETE)
    // CN: 对于非 JSON 响应（如 DELETE）返回空对象
    return {};
  }
}