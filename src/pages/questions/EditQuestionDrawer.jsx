import { useState, useEffect } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { X } from 'lucide-react';
import { SquarePen } from 'lucide-react';
import TextAreaInput from '../../components/form/TextAreaInput';
import SelectInput from '../../components/form/SelectInput';
import ActionButton from '../../components/form/ActionButton';
import DividerContainer from '../../components/form/DividerContainer';

// Import API services
// CN: 导入 API 服务
import { updateQuestion, getInterviews } from '../../services';

export default function EditQuestionDrawer({ question, onQuestionUpdated }) {
  // UI state management
  // CN: UI 状态管理
  const [open, setOpen] = useState(false) // Dialog open/close state / CN: 对话框打开/关闭状态
  const [loading, setLoading] = useState(false) // Form submission loading state / CN: 表单提交加载状态
  
  // Form data state - initialized from props or empty
  // CN: 表单数据状态 - 从 props 初始化或为空
  const [formData, setFormData] = useState({
    question: '',       // Question content / CN: 题目内容
    interview_id: '',   // Interview ID / CN: 面试 ID
    difficulty: 'Easy'  // Question difficulty / CN: 题目难度
  })

  // Interviews data from API
  // CN: 来自 API 的面试数据
  const [interviews, setInterviews] = useState([])
  const [interviewsLoading, setInterviewsLoading] = useState(false)

  // Available question difficulty options - matches API requirements
  // CN: 可用的题目难度选项 - 匹配 API 要求
  const QuestionDifficulty = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ]

  // Effect to populate form when question prop changes
  // CN: 当 question prop 变化时填充表单的副作用
  useEffect(() => {
    if (question) {
      setFormData({
        question: question.question || '',
        interview_id: question.interview_id?.toString() || '',
        difficulty: question.difficulty || 'Easy'
      })
    }
  }, [question]) // Re-run when question prop changes / CN: 当 question prop 变化时重新运行

  // Fetch interviews when component mounts or dialog opens
  // CN: 组件挂载或对话框打开时获取面试数据
  const fetchInterviews = async () => {
    try {
      setInterviewsLoading(true)
      const data = await getInterviews()
      
      // Transform interviews data for SelectInput
      // CN: 为 SelectInput 转换面试数据
      const interviewOptions = data.map(interview => ({
        value: interview.id.toString(),
        label: `${interview.title} (${interview.job_role})`
      }))
      
      setInterviews(interviewOptions)
    } catch (err) {
      console.error('Failed to fetch interviews:', err)
      // Fallback to empty array if API fails
      // CN: API 失败时回退到空数组
      setInterviews([])
    } finally {
      setInterviewsLoading(false)
    }
  }

  // Effect to fetch interviews when dialog opens
  // CN: 对话框打开时获取面试数据的副作用
  useEffect(() => {
    if (open && interviews.length === 0) {
      fetchInterviews()
    }
  }, [open, interviews.length])

  // Handle form input changes - updates formData state
  // CN: 处理表单输入变化 - 更新 formData 状态
  const handleInputChange = (field, value) => {
    // Debug: Log input changes
    // CN: 调试：记录输入变化
    console.log('Input change:', { field, value, valueType: typeof value })
    
    setFormData(prev => ({
      ...prev,           // Keep existing fields / CN: 保留现有字段
      [field]: value     // Update the specific field / CN: 更新特定字段
    }))
  }

  // Handle form submission - updates existing question via API
  // CN: 处理表单提交 - 通过 API 更新现有题目
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent default form submission / CN: 阻止默认表单提交

    // Ensure we have a question to update
    // CN: 确保我们有要更新的题目
    if (!question || !question.id) {
      alert('No question selected for editing')
      return
    }

    // Basic validation - ensure required fields are filled
    // CN: 基础验证 - 确保必填字段已填写
    if (!formData.question.trim() || !formData.interview_id || !formData.difficulty) {
      alert('Please fill in all required fields: Question, Interview, and Difficulty')
      return
    }

    try {
      setLoading(true) // Start loading / CN: 开始加载

      // Debug: Log form data before sending
      // CN: 调试：发送前记录表单数据
      console.log('Updating question data:', formData)

      // Prepare data for API - convert interview_id to number
      // CN: 为 API 准备数据 - 将 interview_id 转换为数字
      const questionData = {
        ...formData,
        interview_id: parseInt(formData.interview_id, 10)
      }

      // Call API service to update question
      // CN: 调用 API 服务更新题目
      const updatedQuestion = await updateQuestion(question.id, questionData)
      
      // Success handling
      // CN: 成功处理
      console.log('Question updated successfully:', updatedQuestion)
      
      // Close the dialog
      // CN: 关闭对话框
      setOpen(false)
      
      // Notify parent component to refresh data
      // CN: 通知父组件刷新数据
      if (onQuestionUpdated) {
        onQuestionUpdated()
      }
      
      // Success notification will be handled by parent component
      // CN: 成功通知将由父组件处理
      
    } catch (error) {
      // Error handling
      // CN: 错误处理
      console.error('Failed to update question:', error)
      
      // TODO: Add beautiful error notification with TailwindCSS  
      // CN: TODO: 使用 TailwindCSS 添加美观的错误通知
      alert('Failed to update question. Please try again.')
      
    } finally {
      setLoading(false) // Always stop loading / CN: 始终停止加载
    }
  }

  // Handle dialog close - prevent close during submission
  // CN: 处理对话框关闭 - 提交期间阻止关闭
  const handleClose = () => {
    if (!loading) { // Only allow close if not submitting / CN: 只有在非提交状态时才允许关闭
      setOpen(false)
    }
  }

  // Don't render edit button if no question provided
  // CN: 如果没有提供题目数据则不渲染编辑按钮
  if (!question) {
    return null
  }
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)} // Move onClick to button level / CN: 将 onClick 移动到按钮级别
        className="rounded-sm bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-400 shadow-xs hover:bg-blue-100 mr-2"
      >
        <div className='flex items-center gap-2'>
          <SquarePen className="w-4 h-4"/>
        </div>
      </button>
      <Dialog open={open} onClose={handleClose} className="relative z-10">
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
                transition
                className="shadow-xl/30 pointer-events-auto w-screen max-w-4xl transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <form onSubmit={handleSubmit} className="relative flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  {/* Form Container */}
                  <div className="flex-1">
                    {/* Header */}
                    <div className="bg-slate-100 px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between space-x-3">
                        <div className="space-y-1 pt-8 pb-4 ">
                          <DialogTitle className="text-3xl font-semibold text-gray-900">Edit Question</DialogTitle>
                          <p className="text-base text-gray-500">
                            Get started by filling in the information below to edit your question.
                          </p>
                        </div>
                        <div className="flex h-7 items-center">
                          <button
                            type="button"
                            onClick={handleClose} // Use handleClose instead of setOpen directly / CN: 使用 handleClose 而不是直接 setOpen
                            disabled={loading} // Disable close button during submission / CN: 提交期间禁用关闭按钮
                            className="relative rounded-md text-gray-400 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <X aria-hidden="true" className="size-6 text-gray-900" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <DividerContainer>
                      {/* Interview selection - required field / CN: 面试选择 - 必填字段 */}
                      <SelectInput 
                        label="Interview" 
                        placeholder={interviewsLoading ? "Loading interviews..." : "Select Interview"} 
                        id="question-interview" 
                        name="question-interview" 
                        options={interviews}
                        value={formData.interview_id}
                        onChange={(value) => handleInputChange('interview_id', value)}
                        required
                      />
                      
                      {/* Question content - required field / CN: 题目内容 - 必填字段 */}
                      <TextAreaInput 
                        label="Question" 
                        placeholder="Enter your question here..." 
                        id="question-content" 
                        name="question-content"
                        value={formData.question}
                        onChange={(e) => handleInputChange('question', e.target.value)}
                        required
                      />
                      
                      {/* Difficulty selection - required field / CN: 难度选择 - 必填字段 */}
                      <SelectInput 
                        label="Difficulty" 
                        placeholder="Select Question Difficulty" 
                        id="question-difficulty" 
                        name="question-difficulty" 
                        options={QuestionDifficulty}
                        value={formData.difficulty}
                        onChange={(value) => handleInputChange('difficulty', value)}
                        required
                      />
                    </DividerContainer>
                  </div>
                  {/* Action buttons */}
                  <ActionButton 
                    ActionContent={loading ? "Updating..." : "Update"} // Dynamic button text / CN: 动态按钮文本
                    type="submit" // Make it a submit button / CN: 设为提交按钮
                    disabled={loading} // Disable during submission / CN: 提交期间禁用
                  />
                </form>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}
