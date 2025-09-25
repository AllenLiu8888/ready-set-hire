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

  // If a body is provided, add it to the request and include the username
  // CN: 如果提供了主体，将其添加到请求中并包含用户名
  if (body) {
    options.body = JSON.stringify({ ...body, username: config.api.username });
  }

  // Make the API request and check if the response is OK
  // CN: 发起 API 请求并检查响应是否正常
  const response = await fetch(`${config.api.baseUrl}${endpoint}`, options);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  // Return the response as a JSON object
  // CN: 将响应作为 JSON 对象返回
  return response.json();
}