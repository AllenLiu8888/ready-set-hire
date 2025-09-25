// AI Question Generator Component
// CN: AI问题生成器组件
import { useState } from 'react'
import { Sparkles, Loader2, AlertTriangle, CheckCircle } from 'lucide-react'
import { generateAndCreateQuestions, isAIQuestionGenerationAvailable, getAIConfigStatus } from '../../services/aiQuestionService'

/**
 * AI Question Generator Component
 * CN: AI问题生成器组件
 * 
 * @param {Object} props - Component props
 * CN: @param {Object} props - 组件属性
 * @param {Object} props.interview - Interview object
 * CN: @param {Object} props.interview - 面试对象
 * @param {Function} props.onQuestionsGenerated - Callback when questions are generated
 * CN: @param {Function} props.onQuestionsGenerated - 问题生成时的回调
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 * CN: @param {string} props.size - 按钮大小
 */
export default function AIQuestionGenerator({ 
  interview, 
  onQuestionsGenerated, 
  size = 'md',
  disabled = false 
}) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [lastError, setLastError] = useState(null)
  const [lastSuccess, setLastSuccess] = useState(null)

  // Check if AI is available
  // CN: 检查AI是否可用
  const isAIAvailable = isAIQuestionGenerationAvailable()
  const configStatus = getAIConfigStatus()

  // Handle question generation
  // CN: 处理问题生成
  const handleGenerateQuestions = async () => {
    if (!interview || isGenerating || disabled) return

    try {
      setIsGenerating(true)
      setLastError(null)
      setLastSuccess(null)

      console.log('🚀 Starting AI question generation for interview:', interview.title)

      // Generate and create questions
      // CN: 生成并创建问题
      const createdQuestions = await generateAndCreateQuestions(interview, 8)

      console.log('✅ AI question generation completed successfully')
      setLastSuccess(`Successfully generated ${createdQuestions.length} questions!`)

      // Notify parent component
      // CN: 通知父组件
      if (onQuestionsGenerated) {
        onQuestionsGenerated(createdQuestions)
      }

      // Auto-hide success message after 3 seconds
      // CN: 3秒后自动隐藏成功消息
      setTimeout(() => setLastSuccess(null), 3000)

    } catch (error) {
      console.error('❌ AI question generation failed:', error)
      setLastError(error.message)
      
      // Auto-hide error message after 5 seconds
      // CN: 5秒后自动隐藏错误消息
      setTimeout(() => setLastError(null), 5000)
    } finally {
      setIsGenerating(false)
    }
  }

  // Button size classes
  // CN: 按钮大小类
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  // If AI is not configured, show config button
  // CN: 如果AI未配置，显示配置按钮
  if (!isAIAvailable) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowConfig(!showConfig)}
          className={`inline-flex items-center space-x-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={disabled}
          title="AI question generation is not configured"
        >
          <AlertTriangle className={iconSizes[size]} />
          <span>AI Setup Required</span>
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
                  <li>API Key: {configStatus.hasApiKey ? '✅ Configured' : '❌ Missing'}</li>
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
        className={`inline-flex items-center space-x-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${sizeClasses[size]}`}
        title={`Generate interview questions using AI for "${interview?.job_role || 'this position'}"`}
      >
        {isGenerating ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        ) : (
          <Sparkles className={iconSizes[size]} />
        )}
        <span>
          {isGenerating ? 'Generating...' : 'Generate Questions'}
        </span>
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
          <strong>🔍 AI Debug Info:</strong>
          <ul className="mt-2 space-y-1">
            <li>Available: {isAIAvailable ? '✅' : '❌'}</li>
            <li>API Key: {configStatus.hasApiKey ? '✅' : '❌'}</li>
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
 * CN: 表格操作的紧凑版本
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
 * CN: 专用部分的全宽版本
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
