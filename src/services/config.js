// API Configuration for ReadySetHire
// CN: ReadySetHire 的 API 配置

// Load environment variables with validation
// CN: 加载环境变量并进行验证
const JWT_TOKEN = import.meta.env.VITE_JWT_TOKEN
const USERNAME = import.meta.env.VITE_USERNAME
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Validate required environment variables
// CN: 验证必需的环境变量
if (!JWT_TOKEN || JWT_TOKEN === 'YOUR_JWT_TOKEN_HERE') {
  console.error('JWT Token is missing or not configured properly')
  console.error('Please set VITE_JWT_TOKEN in your .env.local file')
  console.error('Get your token from Blackboard My Grades - A2 JSON Web Token column')
}

if (!USERNAME || USERNAME === 's1234567') {
  console.error('Username is missing or not configured properly')
  console.error('Please set VITE_USERNAME to your actual student ID in .env.local')
}

if (!API_BASE_URL) {
  console.error('API Base URL is missing')
  console.error('Please set VITE_API_BASE_URL in your .env.local file')
}

// Export configuration object
// CN: 导出配置对象
export const config = {
  // API endpoints and authentication
  // CN: API 端点和认证
  api: {
    baseUrl: API_BASE_URL || 'https://comp2140a2.uqcloud.net/api',
    token: JWT_TOKEN,
    username: USERNAME,
  }
}

// Helper function to check if configuration is valid
// CN: 检查配置是否有效的辅助函数
export function isConfigValid() {
  return Boolean(
    config.api.token && 
    config.api.token !== 'YOUR_JWT_TOKEN_HERE' &&
    config.api.username && 
    config.api.username !== 's1234567' &&
    config.api.baseUrl
  )
}

// Helper function to get configuration status
// CN: 获取配置状态的辅助函数
export function getConfigStatus() {
  const valid = isConfigValid()
  
  return {
    valid,
    message: valid 
      ? 'API configuration is valid'
      : 'API configuration is incomplete. Please check your .env.local file.',
    details: {
      hasToken: Boolean(config.api.token && config.api.token !== 'YOUR_JWT_TOKEN_HERE'),
      hasUsername: Boolean(config.api.username && config.api.username !== 's1234567'),
      hasBaseUrl: Boolean(config.api.baseUrl)
    }
  }
}
