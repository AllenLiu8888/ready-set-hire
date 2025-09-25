// =============================================================================
// Application Entry Point - React application bootstrap
// CN: 应用程序入口点 - React应用程序引导
// =============================================================================
// This file initializes the React application, sets up routing, and performs
// development environment configuration checks.
// CN: 该文件初始化React应用程序，设置路由，并执行开发环境配置检查。
// =============================================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { checkConfigInDev } from './utils/checkConfig.js'

// =============================================================================
// Development Configuration Check
// CN: 开发配置检查
// =============================================================================

// Check API configuration in development
// CN: 在开发环境中检查 API 配置
checkConfigInDev()

// =============================================================================
// React Application Rendering
// CN: React应用程序渲染
// =============================================================================

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Router wrapper for navigation */}
    {/* CN: 用于导航的路由器包装器 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
