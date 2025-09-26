// =============================================================================
// Application Entry Point - React application bootstrap
// =============================================================================
// This file initializes the React application, sets up routing, and performs
// development environment configuration checks.
// =============================================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { checkConfigInDev } from './utils/checkConfig.js'

// =============================================================================
// Development Configuration Check
// =============================================================================

// Check API configuration in development
checkConfigInDev()

// =============================================================================
// React Application Rendering
// =============================================================================

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Router wrapper for navigation */}
    {}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
