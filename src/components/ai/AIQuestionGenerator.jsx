// =============================================================================
// AI Question Generator Component
// =============================================================================
// This component provides a user interface for AI-powered interview question
// generation. It handles configuration validation, API calls, and user feedback.
// =============================================================================

import { useState } from 'react'
import { Sparkles, Loader2, AlertTriangle, CheckCircle } from 'lucide-react'
import { generateAndCreateQuestions, isAIQuestionGenerationAvailable, getAIConfigStatus } from '../../services/aiQuestionService'

/**
 * AI Question Generator Component
 *
 * @param {Object} props - Component props
 * @param {Object} props.interview - Interview object
 * @param {Function} props.onQuestionsGenerated - Callback when questions are generated
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 */
export default function AIQuestionGenerator({ 
  interview, 
  onQuestionsGenerated, 
  size = 'md',
  disabled = false 
}) {
  // =============================================================================
  // Component State Management
  // =============================================================================
  
  const [isGenerating, setIsGenerating] = useState(false) // AI generation in progress
  const [showConfig, setShowConfig] = useState(false) // Show configuration panel
  const [lastError, setLastError] = useState(null) // Last error message
  const [lastSuccess, setLastSuccess] = useState(null) // Last success message

  // Check if AI is available
  const isAIAvailable = isAIQuestionGenerationAvailable()
  const configStatus = getAIConfigStatus()

  // =============================================================================
  // Event Handlers
  // =============================================================================

  // Handle question generation
  const handleGenerateQuestions = async () => {
    if (!interview || isGenerating || disabled) return

    try {
      setIsGenerating(true)
      setLastError(null)
      setLastSuccess(null)

      console.log('Starting AI question generation for interview:', interview.title)

      // Generate and create questions
      const createdQuestions = await generateAndCreateQuestions(interview, 8)

      console.log('AI question generation completed successfully')
      setLastSuccess(`Successfully generated ${createdQuestions.length} questions!`)

      // Notify parent component
      if (onQuestionsGenerated) {
        onQuestionsGenerated(createdQuestions)
      }

      // Auto-hide success message after 3 seconds
      setTimeout(() => setLastSuccess(null), 3000)

    } catch (error) {
      console.error('AI question generation failed:', error)
      setLastError(error.message)
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => setLastError(null), 5000)
    } finally {
      setIsGenerating(false)
    }
  }

  // =============================================================================
  // UI Configuration and Styling
  // =============================================================================
  
  // Button size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  // =============================================================================
  // Conditional Rendering Logic
  // =============================================================================

  // If AI is not configured, show config button
  if (!isAIAvailable) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowConfig(!showConfig)}
          className={`rounded-sm bg-zinc-50 px-2 py-1 text-sm font-semibold text-zinc-600 shadow-xs hover:bg-zinc-100 mr-2 ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={disabled}
          title="AI question generation is not configured"
        >
          <div className='flex items-center gap-2'>
            <AlertTriangle className="w-4 h-4" />
            <span>AI Setup Required</span>
          </div>
        </button>
        {/* Configuration Info Popup */}
        {showConfig && (
          <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 z-10">
            <h4 className="font-medium text-gray-900 mb-2">AI Configuration Required</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>To enable AI question generation, add these environment variables to your <code className="bg-gray-100 px-1 rounded">.env.local</code> file:</p>
              <div className="bg-gray-50 p-2 rounded font-mono text-xs">
                <div>VITE_AI_API_KEY=your_api_key_here</div>
                <div>VITE_AI_API_ENDPOINT=https://api.openai.com/v1/chat/completions</div>
                <div>VITE_AI_API_MODEL=gpt-3.5-turbo</div>
              </div>
              <p className="text-gray-500">
                Supports OpenAI, Azure OpenAI, or any OpenAI-compatible API.
              </p>
              <div className="mt-3">
                <strong>Current Status:</strong>
                <ul className="text-xs mt-1 space-y-1">
                  <li>API Key: {configStatus.hasApiKey ? 'Configured' : 'Missing'}</li>
                  <li>Endpoint: {configStatus.endpoint}</li>
                  <li>Model: {configStatus.model}</li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => setShowConfig(false)}
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-500"
            >
              Close
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Main Generate Button */}
      <button
        onClick={handleGenerateQuestions}
        disabled={isGenerating || disabled}
        className={`rounded-sm bg-purple-50 px-2 py-1 text-sm font-semibold text-purple-600 shadow-xs hover:bg-purple-100 mr-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={`Generate interview questions using AI for "${interview?.job_role || 'this position'}"`}
      >
        <div className='flex items-center gap-2'>
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>
            {isGenerating ? 'Generating...' : 'AI Questions'}
          </span>
        </div>
      </button>

      {/* Status Messages */}
      {(lastSuccess || lastError) && (
        <div className="absolute top-full mt-2 left-0 z-10">
          {lastSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-md text-sm flex items-center space-x-2 shadow-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{lastSuccess}</span>
            </div>
          )}
          
          {lastError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-md text-sm flex items-start space-x-2 shadow-sm max-w-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Generation Failed</div>
                <div className="text-xs mt-1">{lastError}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Debug Info (development only) */}
      {import.meta.env.DEV && showConfig && (
        <div className="absolute top-full mt-2 right-0 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs w-64 z-10">
          <strong>AI Debug Info:</strong>
          <ul className="mt-2 space-y-1">
            <li>Available: {isAIAvailable ? 'Yes' : 'No'}</li>
            <li>API Key: {configStatus.hasApiKey ? 'Configured' : 'Missing'}</li>
            <li>Endpoint: {configStatus.endpoint}</li>
            <li>Model: {configStatus.model}</li>
          </ul>
          <button
            onClick={() => setShowConfig(false)}
            className="mt-2 text-indigo-600 hover:text-indigo-500"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Compact version for table actions
 */
export function AIQuestionGeneratorCompact({ interview, onQuestionsGenerated }) {
  return (
    <AIQuestionGenerator
      interview={interview}
      onQuestionsGenerated={onQuestionsGenerated}
      size="sm"
    />
  )
}

/**
 * Full-width version for dedicated sections
 */
export function AIQuestionGeneratorFull({ interview, onQuestionsGenerated }) {
  return (
    <div className="w-full">
      <AIQuestionGenerator
        interview={interview}
        onQuestionsGenerated={onQuestionsGenerated}
        size="lg"
      />
    </div>
  )
}
