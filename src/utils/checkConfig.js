// Configuration checker utility
import { getConfigStatus } from '../services/config.js'

// Check and display configuration status in development
export function checkConfigInDev() {
  if (import.meta.env.DEV) {
    const status = getConfigStatus()
    
    if (status.valid) {
      console.log('ReadySetHire API Configuration:', status.message)
    } else {
      console.group('ReadySetHire Configuration Issues')
      console.warn(status.message)
      console.log('Configuration details:', status.details)
      console.log('To fix this:')
      console.log('1. Open your .env.local file')
      console.log('2. Get your JWT token from Blackboard My Grades')
      console.log('3. Set VITE_JWT_TOKEN to your actual token')
      console.log('4. Set VITE_USERNAME to your student ID')
      console.log('5. Restart the development server')
      console.groupEnd()
    }
    
    return status.valid
  }
  
  return true // Don't check in production
}
