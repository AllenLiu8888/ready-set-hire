import { useState, useEffect } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { UserPlus } from 'lucide-react';
import { X } from 'lucide-react';
import TextInput from '../../components/form/TextInput'; 
import ActionButton from '../../components/form/ActionButton';
import DividerContainer from '../../components/form/DividerContainer';
import SelectInput from '../../components/form/SelectInput';

// Import API services for creating applicants and getting interviews
// CN: 导入创建候选人和获取面试的 API 服务
import { createApplicant, getInterviews } from '../../services';

export default function CreateApplicantDrawer({ onApplicantCreated }) {
  // UI state management
  // CN: UI 状态管理
  const [open, setOpen] = useState(false) // Dialog open/close state / CN: 对话框打开/关闭状态
  const [loading, setLoading] = useState(false) // Form submission loading state / CN: 表单提交加载状态
  
  // Form data state - stores all applicant fields
  // CN: 表单数据状态 - 存储所有候选人字段
  const [formData, setFormData] = useState({
    title: '',              // Applicant title (Mr, Ms, Dr, etc.) / CN: 候选人称谓
    firstname: '',          // First name / CN: 名字
    surname: '',            // Last name / CN: 姓氏
    phone_number: '',       // Phone number / CN: 电话号码
    email_address: '',      // Email address / CN: 邮箱地址
    interview_id: '',       // Interview ID / CN: 面试ID
    interview_status: 'Not Started'  // Default status / CN: 默认状态
  })

  // Available interviews and status options from API
  // CN: 来自 API 的可用面试和状态选项
  const [interviews, setInterviews] = useState([]) // Store interviews from API / CN: 存储来自API的面试数据
  const [interviewsLoading, setInterviewsLoading] = useState(true) // Loading state for interviews / CN: 面试数据加载状态

  // Available interview status options - matches API requirements
  // CN: 可用的面试状态选项 - 匹配 API 要求
  const InterviewStatus = [
    { value: 'Not Started', label: 'Not Started' },  // New applicant / CN: 新候选人
    { value: 'Completed', label: 'Completed' },      // Completed interview / CN: 已完成面试
  ]

  // Function to fetch interviews for the dropdown
  // CN: 获取面试数据用于下拉选择的函数
  const fetchInterviews = async () => {
    try {
      setInterviewsLoading(true)
      const data = await getInterviews()
      
      // Transform interview data to format needed for SelectInput
      // CN: 将面试数据转换为 SelectInput 需要的格式
      const interviewOptions = data.map(interview => ({
        value: interview.id,
        label: `${interview.title} (${interview.job_role})`
      }))
      
      setInterviews(interviewOptions)
    } catch (error) {
      console.error('Failed to fetch interviews:', error)
      // TODO: Add beautiful error notification
      // CN: TODO: 添加美观的错误通知
    } finally {
      setInterviewsLoading(false)
    }
  }

  // Effect to fetch interviews when component mounts
  // CN: 组件挂载时获取面试数据的副作用
  useEffect(() => {
    fetchInterviews()
  }, [])

  // Handle form input changes - updates formData state
  // CN: 处理表单输入变化 - 更新 formData 状态
  const handleInputChange = (field, value) => {
    // Debug: Log input changes
    // CN: 调试：记录输入变化
    console.log('🔄 Input change:', { field, value, valueType: typeof value })
    
    setFormData(prev => ({
      ...prev,           // Keep existing fields / CN: 保留现有字段
      [field]: value     // Update the specific field / CN: 更新特定字段
    }))
  }

  // Handle form submission - creates new applicant via API
  // CN: 处理表单提交 - 通过 API 创建新候选人
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent default form submission / CN: 阻止默认表单提交

    // Basic validation - ensure required fields are filled
    // CN: 基础验证 - 确保必填字段已填写
    if (!formData.title.trim() || !formData.firstname.trim() || !formData.surname.trim() || 
        !formData.phone_number.trim() || !formData.email_address.trim() || !formData.interview_id) {
      alert('Please fill in all required fields: Title, First Name, Last Name, Phone Number, Email Address, and Interview')
      return
    }

    // Basic email validation
    // CN: 基础邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email_address.trim())) {
      alert('Please enter a valid email address')
      return
    }

    try {
      setLoading(true) // Start loading / CN: 开始加载

      // Debug: Log form data before sending
      // CN: 调试：发送前记录表单数据
      console.log('📝 Submitting applicant form data:', formData)
      console.log('📝 Form data type check:', {
        title: typeof formData.title,
        firstname: typeof formData.firstname,
        surname: typeof formData.surname,
        phone_number: typeof formData.phone_number,
        email_address: typeof formData.email_address,
        interview_id: typeof formData.interview_id,
        interview_status: typeof formData.interview_status
      })

      // Call API service to create applicant
      // CN: 调用 API 服务创建候选人
      const newApplicant = await createApplicant(formData)
      
      // Success handling
      // CN: 成功处理
      console.log('Applicant created successfully:', newApplicant)
      
      // Reset form data to initial state
      // CN: 重置表单数据到初始状态
      setFormData({
        title: '',
        firstname: '',
        surname: '',
        phone_number: '',
        email_address: '',
        interview_id: '',
        interview_status: 'Not Started'
      })
      
      // Close the dialog
      // CN: 关闭对话框
      setOpen(false)
      
      // Notify parent component to refresh data
      // CN: 通知父组件刷新数据
      if (onApplicantCreated) {
        onApplicantCreated()
      }
      
      // Success notification will be handled by parent component
      // CN: 成功通知将由父组件处理
      
    } catch (error) {
      // Error handling
      // CN: 错误处理
      console.error('Failed to create applicant:', error)
      
      // TODO: Add beautiful error notification with TailwindCSS  
      // CN: TODO: 使用 TailwindCSS 添加美观的错误通知
      alert('Failed to create applicant. Please try again.')
      
    } finally {
      setLoading(false) // Always stop loading / CN: 始终停止加载
    }
  }

  // Handle dialog close - also reset form if needed
  // CN: 处理对话框关闭 - 如果需要也重置表单
  const handleClose = () => {
    if (!loading) { // Only allow close if not submitting / CN: 只有在非提交状态时才允许关闭
      setOpen(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        className="block rounded-md bg-slate-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <div className="flex items-center gap-2" onClick={() => setOpen(true)}>
          <UserPlus className="w-4 h-4"/>  Add Applicant
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
                          <DialogTitle className="text-3xl font-semibold text-gray-900">New Applicant</DialogTitle>
                          <p className="text-base text-gray-500">
                            Get started by filling in the information below to create your new applicant.
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
                      {/* Title input - required field / CN: 称谓输入 - 必填字段 */}
                      <TextInput 
                        label="Title" 
                        placeholder="Mr, Ms, Dr" 
                        type="text" 
                        id="applicant-title" 
                        name="applicant-title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                      />
                      
                      {/* First name input - required field / CN: 名字输入 - 必填字段 */}
                      <TextInput 
                        label="First Name" 
                        placeholder="First Name" 
                        type="text" 
                        id="applicant-firstname" 
                        name="applicant-firstname"
                        value={formData.firstname}
                        onChange={(e) => handleInputChange('firstname', e.target.value)}
                        required
                      />
                      
                      {/* Last name input - required field / CN: 姓氏输入 - 必填字段 */}
                      <TextInput 
                        label="Last Name" 
                        placeholder="Last Name" 
                        type="text" 
                        id="applicant-lastname" 
                        name="applicant-lastname"
                        value={formData.surname}
                        onChange={(e) => handleInputChange('surname', e.target.value)}
                        required
                      />
                      
                      {/* Phone number input - required field / CN: 电话号码输入 - 必填字段 */}
                      <TextInput 
                        label="Phone Number" 
                        placeholder="+61 xxx xxx xxx" 
                        type="tel" 
                        id="applicant-phone-number" 
                        name="applicant-phone-number"
                        value={formData.phone_number}
                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      />
                      
                      {/* Email address input - required field / CN: 邮箱地址输入 - 必填字段 */}
                      <TextInput 
                        label="Email Address" 
                        placeholder="example@email.com" 
                        type="email" 
                        id="applicant-email-address" 
                        name="applicant-email-address"
                        value={formData.email_address}
                        onChange={(e) => handleInputChange('email_address', e.target.value)}
                        required
                      />
                      
                      {/* Interview select - required field with loading state / CN: 面试选择 - 必填字段带加载状态 */}
                      <SelectInput 
                        label="Interview" 
                        placeholder={interviewsLoading ? "Loading interviews..." : "Select Interview"} 
                        id="applicant-interview" 
                        name="applicant-interview" 
                        options={interviews}
                        value={formData.interview_id}
                        onChange={(value) => handleInputChange('interview_id', value)}
                        required
                        disabled={interviewsLoading}
                      />
                      
                      {/* Interview status select - defaults to "Not Started" / CN: 面试状态选择 - 默认为"未开始" */}
                      <SelectInput 
                        label="Interview Status" 
                        placeholder="Select Interview Status" 
                        id="applicant-interview-status" 
                        name="applicant-interview-status" 
                        options={InterviewStatus}
                        value={formData.interview_status}
                        onChange={(value) => handleInputChange('interview_status', value)}
                        required
                      />
                    </DividerContainer>
                  </div>
                  {/* Action buttons */}
                  <ActionButton 
                    ActionContent={loading ? "Creating..." : "Create"} // Dynamic button text / CN: 动态按钮文本
                    type="submit" // Make it a submit button / CN: 设为提交按钮
                    disabled={loading || interviewsLoading} // Disable during submission or while loading interviews / CN: 提交期间或加载面试时禁用
                  />
                </form>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
