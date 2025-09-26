// =============================================================================
// AI Question Generation Service
// =============================================================================
// This service provides AI-powered interview question generation capabilities
// using various LLM providers like OpenAI, Azure OpenAI, or local models.
// =============================================================================

import { createQuestion } from './questionService.js'

/**
 * Generate interview questions using AI
 *
 * @param {Object} interviewData - Interview information
 * @param {string} interviewData.title - Interview title
 * @param {string} interviewData.job_role - Job role
 * @param {string} interviewData.description - Interview description
 * @param {number} questionCount - Number of questions to generate (default: 8)
 * @returns {Promise<Array>} Generated questions
 */
export async function generateInterviewQuestions(interviewData, questionCount = 8) {
  try {
    console.log('Generating interview questions for:', interviewData)
    
    // Create prompt for AI
    const prompt = createPrompt(interviewData, questionCount)
    
    // Call AI API (using OpenAI-compatible endpoint)
    const aiResponse = await callAIAPI(prompt)
    
    // Parse and validate questions
    const questions = parseAIResponse(aiResponse)
    
    console.log('Generated', questions.length, 'questions successfully')
    return questions
    
  } catch (error) {
    console.error('Failed to generate questions:', error)
    throw new Error(`Failed to generate interview questions: ${error.message}`)
  }
}

// =============================================================================
// Main Question Generation Functions
// =============================================================================

/**
 * Generate questions and automatically add them to the interview
 *
 * @param {Object} interview - Interview object
 * @param {number} questionCount - Number of questions to generate
 * @returns {Promise<Array>} Created question objects
 */
export async function generateAndCreateQuestions(interview, questionCount = 8) {
  try {
    console.log('Starting AI question generation and creation process...')
    
    // Generate questions using AI
    const generatedQuestions = await generateInterviewQuestions(interview, questionCount)
    
    // Create questions in database
    const createdQuestions = []
    
    for (const questionData of generatedQuestions) {
      try {
        const questionToCreate = {
          interview_id: interview.id,
          question: questionData.question,
          difficulty: questionData.difficulty || 'Intermediate'
        }
        
        console.log('Creating question:', questionToCreate.question.substring(0, 50) + '...')
        const createdQuestion = await createQuestion(questionToCreate)
        createdQuestions.push(createdQuestion)
        
      } catch (createError) {
        console.error('Failed to create question:', questionData.question, createError)
        // Continue with other questions even if one fails
      }
    }
    
    console.log(`Successfully created ${createdQuestions.length} out of ${generatedQuestions.length} questions`)
    return createdQuestions
    
  } catch (error) {
    console.error('Failed to generate and create questions:', error)
    throw error
  }
}

// =============================================================================
// AI Integration Helper Functions
// =============================================================================

/**
 * Create prompt for AI question generation
 */
function createPrompt(interviewData, questionCount) {
  const { title, job_role, description } = interviewData
  
  return `You are an expert HR interviewer. Generate ${questionCount} high-quality interview questions for the following position:

Position: ${title}
Job Role: ${job_role}
Description: ${description || 'No additional description provided'}

Requirements:
1. Generate exactly ${questionCount} questions
2. Mix of difficulty levels: Easy (2-3), Intermediate (4-5), Advanced (1-2)
3. Include different question types: technical skills, behavioral, problem-solving, situational
4. Questions should be specific to the job role and realistic
5. Each question should be clear, professional, and relevant

Please respond with a JSON array in this exact format:
[
  {
    "question": "Tell me about your experience with...",
    "difficulty": "Easy"
  },
  {
    "question": "How would you handle a situation where...",
    "difficulty": "Intermediate"
  }
]

Only return the JSON array, no additional text or explanation.`
}

/**
 * Call AI API for question generation
 */
async function callAIAPI(prompt) {
  // Get API configuration
  const apiConfig = getAIAPIConfig()
  
  if (!apiConfig.isConfigured) {
    throw new Error('AI API is not configured. Please set up your API credentials.')
  }
  
  try {
    console.log('Calling AI API...')
    
    const response = await fetch(apiConfig.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.apiKey}`,
        ...(apiConfig.customHeaders || {})
      },
      body: JSON.stringify({
        model: apiConfig.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 0.9
      })
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`AI API error (${response.status}): ${errorData}`)
    }
    
    const data = await response.json()
    console.log('AI API response received')
    
    return data.choices?.[0]?.message?.content || data.response || data.text
    
  } catch (error) {
    console.error('AI API call failed:', error)
    throw new Error(`AI API call failed: ${error.message}`)
  }
}

/**
 * Parse AI response and validate questions
 */
function parseAIResponse(response) {
  try {
    // Clean up response (remove code blocks, extra whitespace)
    let cleanResponse = response.trim()
    
    // Remove markdown code blocks if present
    if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    }
    
    // Parse JSON
    const questions = JSON.parse(cleanResponse)
    
    // Validate structure
    if (!Array.isArray(questions)) {
      throw new Error('Response is not an array')
    }
    
    // Validate each question
    const validQuestions = questions.filter(q => {
      if (!q || typeof q !== 'object') return false
      if (!q.question || typeof q.question !== 'string') return false
      if (q.question.trim().length < 10) return false
      
      // Normalize difficulty
      if (!q.difficulty || !['Easy', 'Intermediate', 'Advanced'].includes(q.difficulty)) {
        q.difficulty = 'Intermediate'
      }
      
      return true
    })
    
    if (validQuestions.length === 0) {
      throw new Error('No valid questions found in AI response')
    }
    
    console.log(`Parsed ${validQuestions.length} valid questions from AI response`)
    return validQuestions
    
  } catch (error) {
    console.error('Failed to parse AI response:', error)
    console.error('Raw response:', response)
    
    // Fallback: return some default questions
    return getFallbackQuestions()
  }
}

// =============================================================================
// Configuration and Utility Functions
// =============================================================================

/**
 * Get AI API configuration
 */
function getAIAPIConfig() {
  // Check for environment variables
  const apiKey = import.meta.env.VITE_AI_API_KEY
  const apiEndpoint = import.meta.env.VITE_AI_API_ENDPOINT
  const apiModel = import.meta.env.VITE_AI_API_MODEL
  
  // Default to OpenAI if no custom endpoint provided
  const defaultEndpoint = 'https://api.openai.com/v1/chat/completions'
  const defaultModel = 'gpt-3.5-turbo'
  
  return {
    isConfigured: Boolean(apiKey),
    apiKey: apiKey,
    endpoint: apiEndpoint || defaultEndpoint,
    model: apiModel || defaultModel,
    customHeaders: {}
  }
}

/**
 * Fallback questions when AI generation fails
 */
function getFallbackQuestions() {
  return [
    {
      question: "Tell me about yourself and your professional background.",
      difficulty: "Easy"
    },
    {
      question: "What interests you most about this position and our company?",
      difficulty: "Easy"
    },
    {
      question: "Describe a challenging project you worked on and how you overcame obstacles.",
      difficulty: "Intermediate"
    },
    {
      question: "How do you handle working under pressure and tight deadlines?",
      difficulty: "Intermediate"
    },
    {
      question: "What are your greatest professional strengths and how do they apply to this role?",
      difficulty: "Intermediate"
    },
    {
      question: "Describe a time when you had to work with a difficult team member.",
      difficulty: "Intermediate"
    },
    {
      question: "Where do you see yourself professionally in the next 3-5 years?",
      difficulty: "Easy"
    },
    {
      question: "What would you do if you discovered a significant error in a project just before the deadline?",
      difficulty: "Advanced"
    }
  ]
}

/**
 * Check if AI question generation is available
 */
export function isAIQuestionGenerationAvailable() {
  const config = getAIAPIConfig()
  return config.isConfigured
}

/**
 * Get AI configuration status for debugging
 */
export function getAIConfigStatus() {
  const config = getAIAPIConfig()
  
  return {
    isConfigured: config.isConfigured,
    hasApiKey: Boolean(config.apiKey),
    endpoint: config.endpoint,
    model: config.model
  }
}
