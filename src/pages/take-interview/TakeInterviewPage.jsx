// =============================================================================
// Take Interview Page - Main interview taking interface with speech recognition
// =============================================================================
// This page handles the complete interview-taking experience for applicants,
// including question navigation, voice recording, text input, and submission.
// =============================================================================

import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Check, Mic, Square, Play, Pause } from 'lucide-react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

// Import API services for getting applicant and questions
import { getApplicant, getQuestions, createApplicantAnswer, updateApplicant } from '../../services'

// Utility function for class names
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function TakeInterviewPage() {
  // =============================================================================
  // URL Parameters and Navigation
  // =============================================================================
  
  const { applicantId } = useParams() // Get applicant ID from URL
  const navigate = useNavigate() // React Router navigation function

  // =============================================================================
  // Speech Recognition Integration
  // =============================================================================
  
  // Speech Recognition hook
  const {
    transcript, // Real-time transcript of spoken words
    listening, // Whether microphone is currently active
    resetTranscript, // Function to clear current transcript
    browserSupportsSpeechRecognition, // Browser compatibility check
    isMicrophoneAvailable // Microphone permission status
  } = useSpeechRecognition()

  // =============================================================================
  // Component State Management
  // =============================================================================

  // State management for the interview process
  const [applicant, setApplicant] = useState(null) // Applicant data
  const [questions, setQuestions] = useState([]) // Interview questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0) // Current question index
  // Rubric 1.6: Text answers removed - voice only
  const [loading, setLoading] = useState(true) // Loading state
  const [error, setError] = useState(null) // Error state

  // Recording states for each question
  const [recordingStates, setRecordingStates] = useState({}) // Track recording state per question
  const [submitting, setSubmitting] = useState(false) // Submission state
  const [currentRecordingQuestion, setCurrentRecordingQuestion] = useState(null) // Currently recording question

  // =============================================================================
  // Data Processing and UI Helper Functions
  // =============================================================================

  // Interview steps for progress indicator
  const getSteps = () => {
    if (!questions.length) return []
    
    return questions.map((question, index) => ({
      name: `Question ${index + 1}`,
      status: index < currentQuestionIndex ? 'complete' : 
              index === currentQuestionIndex ? 'current' : 'upcoming'
    }))
  }

  // Function to fetch applicant and interview data
  const fetchInterviewData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get applicant data
      const applicantData = await getApplicant(applicantId)
      if (!applicantData || applicantData.length === 0) {
        throw new Error('Applicant not found')
      }
      
      const currentApplicant = Array.isArray(applicantData) ? applicantData[0] : applicantData
      setApplicant(currentApplicant)

      // Get questions for this applicant's interview
      const questionsData = await getQuestions()
      // Filter questions by interview_id
      const filteredQuestions = questionsData.filter(q => q.interview_id === currentApplicant.interview_id)
      if (!filteredQuestions || filteredQuestions.length === 0) {
        throw new Error('No questions found for this interview')
      }
      
      setQuestions(filteredQuestions)

      // Initialize recording states for each question (voice only)
      const initialRecordingStates = {}
      filteredQuestions.forEach(question => {
        initialRecordingStates[question.id] = {
          isRecording: false,
          isPlaying: false,
          hasRecording: false,
          audioBlob: null,
          transcriptText: '' // Store voice transcript
        }
      })
      setRecordingStates(initialRecordingStates)

    } catch (err) {
      console.error('Failed to fetch interview data:', err)
      setError(err.message || 'Failed to load interview. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [applicantId])

  // Effect to fetch data when component mounts
  useEffect(() => {
    if (applicantId) {
      fetchInterviewData()
    } else {
      setError('Invalid interview link')
      setLoading(false)
    }
  }, [applicantId, fetchInterviewData])

  // Effect to handle speech recognition transcript
  // Update speech recognition transcript in real-time
  useEffect(() => {
    if (currentRecordingQuestion && transcript) {
      // Update the recording state with the transcript (voice only)
      setRecordingStates(prev => ({
        ...prev,
        [currentRecordingQuestion]: {
          ...prev[currentRecordingQuestion],
          transcriptText: transcript
        }
      }))
    }
  }, [transcript, currentRecordingQuestion])

  // =============================================================================
  // Event Handlers and User Interactions
  // =============================================================================

  // Rubric 1.6: Text input handler removed - voice only

  // Handle recording functions using Speech Recognition API
  const handleStartRecording = async (questionId) => {
    // Check browser support and microphone availability
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
      resetTranscript()
      
      // Set current recording question
      setCurrentRecordingQuestion(questionId)
      
      // Update recording state
      setRecordingStates(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          isRecording: true,
          isPlaying: false
        }
      }))

      // Start listening with continuous mode and English language
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
      await SpeechRecognition.stopListening()
      
      // Update recording state
      setRecordingStates(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          isRecording: false,
          hasRecording: transcript.length > 0,
          transcriptText: transcript // Store the transcript
        }
      }))

      // Clear current recording question
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
    const recordingState = recordingStates[questionId]
    
    if (recordingState?.transcriptText) {
      // Use Speech Synthesis API to read back the transcript
      const utterance = new SpeechSynthesisUtterance(recordingState.transcriptText)
      utterance.rate = 0.8
      utterance.lang = 'en-US'
      
      if (recordingState.isPlaying) {
        // Stop speaking
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
        window.speechSynthesis.speak(utterance)
        setRecordingStates(prev => ({
          ...prev,
          [questionId]: {
            ...prev[questionId],
            isPlaying: true
          }
        }))
        
        // Stop playing when speech ends
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
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  // Navigate to previous question
  // Rubric 1.7: Previous navigation removed - only Next button allowed

  // Submit all answers
  const handleSubmitInterview = async () => {
    try {
      setSubmitting(true)
      console.log('Starting interview submission...')

      // Rubric 1.6: Check if there's voice recording for each question (mandatory)
      const hasAllVoiceAnswers = questions.every(question => {
        const recordingState = recordingStates[question.id]
        return recordingState?.transcriptText?.trim()
      })

      if (!hasAllVoiceAnswers) {
        alert('Please provide voice responses for all questions before submitting. Text input is not allowed.')
        return
      }

      // Submit voice answers for each question (Rubric 1.6: voice only)
      let submittedCount = 0
      for (const question of questions) {
        const recordingState = recordingStates[question.id]
        const voiceAnswer = recordingState?.transcriptText?.trim()
        
        // All questions must have voice answers as per Rubric 1.6
        if (!voiceAnswer) {
          console.error(`Missing voice answer for question ${question.id}`)
          continue
        }

        // Rubric 1.6 & 1.7: Only voice answers are submitted
        const answerData = {
          applicant_id: parseInt(applicantId), // Ensure numeric ID
          interview_id: applicant.interview_id, // Required by API docs
          question_id: question.id,
          answer: voiceAnswer, // Only voice transcript as per Rubric 1.6
          // Note: API docs don't include audio_url field, so we'll omit it for now
        }

        console.log(`Submitting answer for question ${question.id}:`, answerData)
        await createApplicantAnswer(answerData)
        submittedCount++
      }

      console.log(`Successfully submitted ${submittedCount} answers`)

      // Update applicant status to "Completed"
      try {
        await updateApplicant(applicantId, { interview_status: 'Completed' })
        console.log('Successfully updated applicant status to Completed')
      } catch (updateErr) {
        console.error('Failed to update applicant status:', updateErr)
        // Don't block the flow, just log the error
      }

      // Redirect to completion page
      navigate(`/take/${applicantId}/complete`)

    } catch (err) {
      console.error('Failed to submit interview:', err)
      
      // More detailed error message
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

            {/* Rubric 1.6 & 1.7: Speech-only input required */}
            <div className="mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Mic className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-medium text-blue-900">Voice Response Required</h3>
                </div>
                <p className="text-sm text-blue-700">
                  Please use the voice recording feature above to answer this question. 
                  Text input is not available for interview responses.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation - Rubric 1.7: Only Next button allowed */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end items-center">
            {/* Only Next button as per Rubric 1.7 requirement */}
            <div className="flex space-x-3">
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  disabled={!currentRecordingState.transcriptText} // Require speech input to proceed
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!currentRecordingState.transcriptText ? "Please record your voice response before proceeding" : ""}
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleSubmitInterview}
                  disabled={submitting || !currentRecordingState.transcriptText} // Require speech input to submit
                  className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!currentRecordingState.transcriptText ? "Please record your voice response before submitting" : ""}
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
