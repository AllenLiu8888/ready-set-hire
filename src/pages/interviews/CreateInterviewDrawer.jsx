import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { CirclePlus } from 'lucide-react';
import { X } from 'lucide-react';
import TextInput from '../../components/form/TextInput';
import TextAreaInput from '../../components/form/TextAreaInput';
import SelectInput from '../../components/form/SelectInput';
import ActionButton from '../../components/form/ActionButton';
import DividerContainer from '../../components/form/DividerContainer';
// Import API service for creating interviews
// CN: 导入创建面试的 API 服务
import { createInterview } from '../../services';

export default function CreateInterviewDrawer({ onInterviewCreated }) {
  // UI state management
  // CN: UI 状态管理
  const [open, setOpen] = useState(false) // Dialog open/close state / CN: 对话框打开/关闭状态
  const [loading, setLoading] = useState(false) // Form submission loading state / CN: 表单提交加载状态
  
  // Form data state - stores all interview fields
  // CN: 表单数据状态 - 存储所有面试字段
  const [formData, setFormData] = useState({
    title: '',           // Interview title / CN: 面试标题
    job_role: '',        // Job role / CN: 职位角色  
    description: '',     // Interview description / CN: 面试描述
    status: 'Draft'      // Default status / CN: 默认状态
  })

  // Available interview status options - matches API requirements
  // CN: 可用的面试状态选项 - 匹配 API 要求
  const InterviewStatus = [
    { value: 'Published', label: 'Published' },  // Published interviews are active / CN: 已发布的面试处于活跃状态
    { value: 'Draft', label: 'Draft' },          // Draft interviews are not visible to applicants / CN: 草稿面试对候选人不可见
    { value: 'Archived', label: 'Archived' },    // Archived interviews are closed / CN: 归档面试已关闭
  ]

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

  // Handle form submission - creates new interview via API
  // CN: 处理表单提交 - 通过 API 创建新面试
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent default form submission / CN: 阻止默认表单提交

    // Basic validation - ensure required fields are filled
    // CN: 基础验证 - 确保必填字段已填写
    if (!formData.title.trim() || !formData.job_role.trim() || !formData.status) { // trim() 方法用于去除字符串两端的空白字符（包括空格、制表符、换行符等）
      alert('Please fill in all required fields: Title, Job Role, and Status')
      return
    }

    try {
      setLoading(true) // Start loading / CN: 开始加载

      // Debug: Log form data before sending
      // CN: 调试：发送前记录表单数据
      console.log('📝 Submitting form data:', formData)
      console.log('📝 Form data type check:', {
        title: typeof formData.title,
        job_role: typeof formData.job_role, 
        description: typeof formData.description,
        status: typeof formData.status
      })

      // Call API service to create interview
      // CN: 调用 API 服务创建面试
      const newInterview = await createInterview(formData)
      
      // Success handling
      // CN: 成功处理
      console.log('Interview created successfully:', newInterview)
      
      // Reset form data to initial state
      // CN: 重置表单数据到初始状态
      setFormData({
        title: '',
        job_role: '',
        description: '',
        status: 'Draft'
      })
      
      // Close the dialog
      // CN: 关闭对话框
      setOpen(false)
      
      // Notify parent component to refresh data
      // CN: 通知父组件刷新数据
      if (onInterviewCreated) {
        onInterviewCreated()
      }
      
      // Success notification will be handled by parent component
      // CN: 成功通知将由父组件处理
      
    } catch (error) {
      // Error handling
      // CN: 错误处理
      console.error('Failed to create interview:', error)
      
      // TODO: Add beautiful error notification with TailwindCSS  
      // CN: TODO: 使用 TailwindCSS 添加美观的错误通知
      alert('Failed to create interview. Please try again.')
      
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
          <CirclePlus className="w-4 h-4"/>  Add Interview
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
                          <DialogTitle className="text-3xl font-semibold text-gray-900">New Interview</DialogTitle>
                          <p className="text-base text-gray-500">
                            Get started by filling in the information below to create your new interview.
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
                      {/* Title input - required field / CN: 标题输入 - 必填字段 */}
                      <TextInput 
                        label="Title" 
                        placeholder="Interview Title" 
                        type="text" 
                        id="interview-title" 
                        name="interview-title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                      />
                      
                      {/* Job Role input - required field / CN: 职位角色输入 - 必填字段 */}
                      <TextInput 
                        label="Job Role" 
                        placeholder="Job Role (e.g. Senior Front-end Developer)" 
                        type="text" 
                        id="interview-job-role" 
                        name="interview-job-role"
                        value={formData.job_role}
                        onChange={(e) => handleInputChange('job_role', e.target.value)}
                        required
                      />
                      
                      {/* Description textarea - optional field / CN: 描述文本区域 - 可选字段 */}
                      <TextAreaInput 
                        label="Description" 
                        placeholder="Interview description and requirements" 
                        id="interview-description" 
                        name="interview-description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                      />
                      
                      {/* Status select - defaults to Draft / CN: 状态选择 - 默认为草稿 */}
                      <SelectInput 
                        label="Status" 
                        placeholder="Select Interview Status" 
                        id="interview-status" 
                        name="interview-status" 
                        options={InterviewStatus}
                        value={formData.status}
                        onChange={(value) => handleInputChange('status', value)}
                        required
                      />
                    </DividerContainer>
                  </div>
                  {/* Action buttons */}
                  <ActionButton 
                    ActionContent={loading ? "Creating..." : "Create"} // Dynamic button text / CN: 动态按钮文本
                    type="submit" // Make it a submit button / CN: 设为提交按钮
                    disabled={loading} // Disable during submission / CN: 提交期间禁用
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
