import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Check, Mic, Square, Play, Pause } from 'lucide-react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
// Import API services for getting applicant and questions
// CN: 导入获取候选人和题目的 API 服务
import { getApplicant, getQuestions, createApplicantAnswer, updateApplicant } from '../../services'

// Utility function for class names
// CN: 类名工具函数
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function TakeInterviewPage() {
  const { applicantId } = useParams() // Get applicant ID from URL / CN: 从URL获取候选人ID
  const navigate = useNavigate()

  // Speech Recognition hook
  // CN: 语音识别钩子
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition()

  // State management for the interview process
  // CN: 面试流程的状态管理
  const [applicant, setApplicant] = useState(null) // Applicant data / CN: 候选人数据
  const [questions, setQuestions] = useState([]) // Interview questions / CN: 面试题目
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0) // Current question index / CN: 当前题目索引
  const [answers, setAnswers] = useState({}) // Store answers for each question / CN: 存储每个题目的答案
  const [loading, setLoading] = useState(true) // Loading state / CN: 加载状态
  const [error, setError] = useState(null) // Error state / CN: 错误状态
 // Interview completion state / CN: 面试完成状态

  // Recording states for each question
  // CN: 每个题目的录音状态
  const [recordingStates, setRecordingStates] = useState({}) // Track recording state per question / CN: 跟踪每个题目的录音状态
  const [submitting, setSubmitting] = useState(false) // Submission state / CN: 提交状态
  const [currentRecordingQuestion, setCurrentRecordingQuestion] = useState(null) // Currently recording question / CN: 当前录音的题目

  // Interview steps for progress indicator
  // CN: 面试进度指示器的步骤
  const getSteps = () => {
    if (!questions.length) return []
    
    return questions.map((question, index) => ({
      name: `Question ${index + 1}`,
      status: index < currentQuestionIndex ? 'complete' : 
              index === currentQuestionIndex ? 'current' : 'upcoming'
    }))
  }

  // Function to fetch applicant and interview data
  // CN: 获取候选人和面试数据的函数
  const fetchInterviewData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get applicant data
      // CN: 获取候选人数据
      const applicantData = await getApplicant(applicantId)
      if (!applicantData || applicantData.length === 0) {
        throw new Error('Applicant not found')
      }
      
      const currentApplicant = Array.isArray(applicantData) ? applicantData[0] : applicantData
      setApplicant(currentApplicant)

      // Get questions for this applicant's interview
      // CN: 获取该候选人面试的题目
      const questionsData = await getQuestions()
      // Filter questions by interview_id
      // CN: 按interview_id过滤题目
      const filteredQuestions = questionsData.filter(q => q.interview_id === currentApplicant.interview_id)
      if (!filteredQuestions || filteredQuestions.length === 0) {
        throw new Error('No questions found for this interview')
      }
      
      setQuestions(filteredQuestions)

      // Initialize recording states and answers
      // CN: 初始化录音状态和答案
      const initialRecordingStates = {}
      const initialAnswers = {}
      filteredQuestions.forEach(question => {
        initialRecordingStates[question.id] = {
          isRecording: false,
          isPlaying: false,
          hasRecording: false,
          audioBlob: null
        }
        initialAnswers[question.id] = ''
      })
      setRecordingStates(initialRecordingStates)
      setAnswers(initialAnswers)

    } catch (err) {
      console.error('Failed to fetch interview data:', err)
      setError(err.message || 'Failed to load interview. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [applicantId])

  // Effect to fetch data when component mounts
  // CN: 组件挂载时获取数据的副作用
  useEffect(() => {
    if (applicantId) {
      fetchInterviewData()
    } else {
      setError('Invalid interview link')
      setLoading(false)
    }
  }, [applicantId, fetchInterviewData])

  // Effect to handle speech recognition transcript
  // CN: 处理语音识别转录文本的副作用
  useEffect(() => {
    if (currentRecordingQuestion && transcript) {
      // Update the answer with the transcript
      // CN: 用转录文本更新答案
      setAnswers(prev => ({
        ...prev,
        [currentRecordingQuestion]: transcript
      }))
    }
  }, [transcript, currentRecordingQuestion])

  // Handle answer text change
  // CN: 处理答案文本变化
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  // Handle recording functions using Speech Recognition API
  // CN: 使用语音识别 API 处理录音功能
  const handleStartRecording = async (questionId) => {
    // Check browser support and microphone availability
    // CN: 检查浏览器支持和麦克风可用性
    if (!browserSupportsSpeechRecognition) {
      alert('Browser does not support speech recognition. Please use Chrome, Edge, or Safari.')
      return
    }

    if (!isMicrophoneAvailable) {
      alert('Microphone access is required for voice recording. Please allow microphone access and try again.')
      return
    }

    try {
      // Reset transcript for new recording
      // CN: 为新录音重置转录文本
      resetTranscript()
      
      // Set current recording question
      // CN: 设置当前录音题目
      setCurrentRecordingQuestion(questionId)
      
      // Update recording state
      // CN: 更新录音状态
      setRecordingStates(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          isRecording: true,
          isPlaying: false
        }
      }))

      // Start listening with continuous mode and English language
      // CN: 开启连续模式和英语语言的监听
      await SpeechRecognition.startListening({ 
        continuous: true,
        language: 'en-US'
      })
      
      console.log('Started voice recording for question:', questionId)
    } catch (error) {
      console.error('Failed to start recording:', error)
      alert('Failed to start voice recording. Please try again.')
    }
  }

  const handleStopRecording = async (questionId) => {
    try {
      // Stop listening
      // CN: 停止监听
      await SpeechRecognition.stopListening()
      
      // Update recording state
      // CN: 更新录音状态
      setRecordingStates(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          isRecording: false,
          hasRecording: transcript.length > 0,
          transcriptText: transcript // Store the transcript / CN: 存储转录文本
        }
      }))

      // Clear current recording question
      // CN: 清除当前录音题目
      setCurrentRecordingQuestion(null)
      
      console.log('Stopped voice recording for question:', questionId)
      console.log('Transcript:', transcript)
    } catch (error) {
      console.error('Failed to stop recording:', error)
    }
  }

  const handlePlayRecording = (questionId) => {
    // For speech recognition, we don't have actual audio playback
    // Instead, we can show the transcript or use speech synthesis to read it back
    // CN: 对于语音识别，我们没有实际的音频播放
    // 相反，我们可以显示转录文本或使用语音合成来读回
    const recordingState = recordingStates[questionId]
    
    if (recordingState?.transcriptText) {
      // Use Speech Synthesis API to read back the transcript
      // CN: 使用语音合成 API 读回转录文本
      const utterance = new SpeechSynthesisUtterance(recordingState.transcriptText)
      utterance.rate = 0.8
      utterance.lang = 'en-US'
      
      if (recordingState.isPlaying) {
        // Stop speaking
        // CN: 停止朗读
        window.speechSynthesis.cancel()
        setRecordingStates(prev => ({
          ...prev,
          [questionId]: {
            ...prev[questionId],
            isPlaying: false
          }
        }))
      } else {
        // Start speaking
        // CN: 开始朗读
        window.speechSynthesis.speak(utterance)
        setRecordingStates(prev => ({
          ...prev,
          [questionId]: {
            ...prev[questionId],
            isPlaying: true
          }
        }))
        
        // Stop playing when speech ends
        // CN: 语音结束时停止播放
        utterance.onend = () => {
          setRecordingStates(prev => ({
            ...prev,
            [questionId]: {
              ...prev[questionId],
              isPlaying: false
            }
          }))
        }
      }
    }
    
    console.log('Toggle transcript playback for question:', questionId)
  }

  // Navigate to next question
  // CN: 导航到下一个题目
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  // Navigate to previous question
  // CN: 导航到上一个题目
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  // Submit all answers
  // CN: 提交所有答案
  const handleSubmitInterview = async () => {
    try {
      setSubmitting(true)
      console.log('Starting interview submission...')

      // Check if there's at least one answer or recording
      // CN: 检查是否至少有一个答案或录音
      const hasAnyAnswer = questions.some(question => {
        const recordingState = recordingStates[question.id]
        const textAnswer = answers[question.id]
        return textAnswer?.trim() || recordingState?.transcriptText?.trim()
      })

      if (!hasAnyAnswer) {
        alert('Please provide at least one answer before submitting.')
        return
      }

      // Submit answers for each question that has content
      // CN: 为每个有内容的题目提交答案
      let submittedCount = 0
      for (const question of questions) {
        const recordingState = recordingStates[question.id]
        const textAnswer = answers[question.id]?.trim()
        const voiceAnswer = recordingState?.transcriptText?.trim()
        
        // Skip questions with no answers
        // CN: 跳过没有答案的题目
        if (!textAnswer && !voiceAnswer) {
          console.log(`Skipping question ${question.id} - no answer provided`)
          continue
        }

        // Combine written answer with speech transcript
        // CN: 结合书面答案和语音转录
        let combinedAnswer = ''
        if (textAnswer && voiceAnswer) {
          combinedAnswer = `${textAnswer}\n\n[Voice Recording Transcript]: ${voiceAnswer}`
        } else if (textAnswer) {
          combinedAnswer = textAnswer
        } else if (voiceAnswer) {
          combinedAnswer = `[Voice Recording Transcript]: ${voiceAnswer}`
        }

        const answerData = {
          applicant_id: parseInt(applicantId), // Ensure numeric ID
          interview_id: applicant.interview_id, // Required by API docs
          question_id: question.id,
          answer: combinedAnswer, // Correct field name according to API docs
          // Note: API docs don't include audio_url field, so we'll omit it for now
          // CN: API文档中没有audio_url字段，所以暂时省略
        }

        console.log(`Submitting answer for question ${question.id}:`, answerData)
        await createApplicantAnswer(answerData)
        submittedCount++
      }

      console.log(`Successfully submitted ${submittedCount} answers`)

      // Update applicant status to "Completed"
      // CN: 更新候选人状态为"已完成"
      try {
        await updateApplicant(applicantId, { interview_status: 'Completed' })
        console.log('Successfully updated applicant status to Completed')
      } catch (updateErr) {
        console.error('Failed to update applicant status:', updateErr)
        // Don't block the flow, just log the error
        // CN: 不要阻塞流程，只记录错误
      }

      // Redirect to completion page
      // CN: 重定向到完成页面
      navigate(`/take/${applicantId}/complete`)

    } catch (err) {
      console.error('Failed to submit interview:', err)
      
      // More detailed error message
      // CN: 更详细的错误消息
      let errorMessage = 'Failed to submit your answers. '
      if (err.message.includes('401')) {
        errorMessage += 'Authentication error. Please refresh the page and try again.'
      } else if (err.message.includes('400')) {
        errorMessage += 'Invalid data format. Please check your answers and try again.'
      } else if (err.message.includes('500')) {
        errorMessage += 'Server error. Please try again in a few moments.'
      } else {
        errorMessage += 'Please check your internet connection and try again.'
      }
      
      alert(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  // Early return for loading state
  // CN: 加载状态的早期返回
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your interview...</p>
        </div>
      </div>
    )
  }

  // Early return for error state
  // CN: 错误状态的早期返回
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }


  // Get current question
  // CN: 获取当前题目
  const currentQuestion = questions[currentQuestionIndex]
  const currentRecordingState = recordingStates[currentQuestion?.id] || {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {applicant?.firstname} {applicant?.surname} - Interview
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Progress</p>
              <p className="text-lg font-semibold text-indigo-600">
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
              {getSteps().map((step, stepIdx) => (
                <li key={step.name} className={classNames(stepIdx !== getSteps().length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>
                  {step.status === 'complete' ? (
                    <>
                      <div aria-hidden="true" className="absolute inset-0 flex items-center">
                        <div className="h-0.5 w-full bg-indigo-600" />
                      </div>
                      <div className="relative flex size-8 items-center justify-center rounded-full bg-indigo-600">
                        <Check aria-hidden="true" className="size-5 text-white" />
                        <span className="sr-only">{step.name}</span>
                      </div>
                    </>
                  ) : step.status === 'current' ? (
                    <>
                      <div aria-hidden="true" className="absolute inset-0 flex items-center">
                        <div className="h-0.5 w-full bg-gray-200" />
                      </div>
                      <div className="relative flex size-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
                        <span aria-hidden="true" className="size-2.5 rounded-full bg-indigo-600" />
                        <span className="sr-only">{step.name}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div aria-hidden="true" className="absolute inset-0 flex items-center">
                        <div className="h-0.5 w-full bg-gray-200" />
                      </div>
                      <div className="relative flex size-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                        <span aria-hidden="true" className="size-2.5 rounded-full bg-transparent" />
                        <span className="sr-only">{step.name}</span>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Question Card */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Question {currentQuestionIndex + 1}
              </h2>
              <div className="mb-4 space-x-4">
                <span className="text-lg text-gray-700 leading-relaxed">
                  {currentQuestion?.question}
                </span>
                {currentQuestion?.difficulty && (
                  <span className={classNames(
                    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium mt-3',
                    currentQuestion.difficulty === 'Easy' ? 'bg-green-50 text-green-600' :
                    currentQuestion.difficulty === 'Intermediate' ? 'bg-yellow-50 text-yellow-600' :
                    'bg-red-50 text-red-600'
                  )}>
                    {currentQuestion.difficulty}
                  </span>
                )}
              </div>

            </div>

            {/* Recording Section */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Audio Response</h3>
              <div className="flex items-center space-x-4">
                {!currentRecordingState.isRecording && !currentRecordingState.hasRecording && (
                  <button
                    onClick={() => handleStartRecording(currentQuestion.id)}
                    className="flex items-center space-x-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Start Recording</span>
                  </button>
                )}

                {currentRecordingState.isRecording && (
                  <button
                    onClick={() => handleStopRecording(currentQuestion.id)}
                    className="flex items-center space-x-2 rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                  >
                    <Square className="w-4 h-4" />
                    <span>Stop Recording</span>
                  </button>
                )}

                {currentRecordingState.hasRecording && (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handlePlayRecording(currentQuestion.id)}
                      className="flex items-center space-x-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {currentRecordingState.isPlaying ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Play</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleStartRecording(currentQuestion.id)}
                      className="flex items-center space-x-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Re-record</span>
                    </button>
                  </div>
                )}

                {currentRecordingState.isRecording && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">
                      {listening ? 'Listening...' : 'Starting microphone...'}
                    </span>
                  </div>
                )}
                
                {/* Show browser support warnings */}
                {!browserSupportsSpeechRecognition && (
                  <div className="text-yellow-600 text-sm">
                    Warning: Speech recognition not supported. Please use Chrome, Edge, or Safari.
                  </div>
                )}
                
                {!isMicrophoneAvailable && browserSupportsSpeechRecognition && (
                  <div className="text-yellow-600 text-sm">
                    Microphone access required. Please allow microphone permissions.
                  </div>
                )}
              </div>
            </div>

            {/* Voice Transcript Display */}
            {currentRecordingQuestion === currentQuestion?.id && transcript && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Live Voice Transcript
                </label>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-blue-900 italic">"{transcript}"</p>
                  <p className="text-xs text-blue-600 mt-2">
                    Keep speaking... This will be automatically saved when you stop recording.
                  </p>
                </div>
              </div>
            )}
            
            {/* Show saved transcript for current question */}
            {currentRecordingState.transcriptText && currentRecordingQuestion !== currentQuestion?.id && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Saved Voice Response
                </label>
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-green-900">"{currentRecordingState.transcriptText}"</p>
                  <p className="text-xs text-green-600 mt-2">
                    Voice response saved. You can record again to replace it.
                  </p>
                </div>
              </div>
            )}

            {/* Text Answer */}
            <div className="mb-8">
              <label htmlFor={`answer-${currentQuestion?.id}`} className="block text-sm font-medium text-gray-900 mb-3">
                Written Response (Optional)
              </label>
              <textarea
                id={`answer-${currentQuestion?.id}`}
                rows={6}
                className="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="You can provide additional written notes here..."
                value={answers[currentQuestion?.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              />
              <p className="mt-2 text-xs text-gray-500">
                You can provide written notes in addition to or instead of voice responses.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-3">
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleSubmitInterview}
                  disabled={submitting}
                  className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Interview'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
