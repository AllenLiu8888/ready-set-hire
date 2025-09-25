// =============================================================================
// Edit Interview Drawer - Modal form for editing existing interview templates
// CN: 编辑面试抽屉 - 编辑现有面试模板的模态表单
// =============================================================================
// This component provides a modal interface for editing existing interview templates,
// including form validation, data pre-filling, and API integration for updates.
// CN: 该组件提供编辑现有面试模板的模态界面，包括表单验证、数据预填充和API集成更新。
// =============================================================================

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { SquarePen } from 'lucide-react';
import { X } from 'lucide-react';
import TextInput from '../../components/form/TextInput';
import TextAreaInput from '../../components/form/TextAreaInput';
import SelectInput from '../../components/form/SelectInput';
import ActionButton from '../../components/form/ActionButton';
import DividerContainer from '../../components/form/DividerContainer';

// Import API service for updating interviews
// CN: 导入更新面试的 API 服务
import { updateInterview } from '../../services';


export default function EditInterviewDrawer({ interview, onInterviewUpdated }) {
  // UI state management
  // CN: UI 状态管理
  const [open, setOpen] = useState(false) // Dialog open/close state / CN: 对话框打开/关闭状态
  const [loading, setLoading] = useState(false) // Form submission loading state / CN: 表单提交加载状态
  
  // Form data state - initialized from props or empty
  // CN: 表单数据状态 - 从 props 初始化或为空
  const [formData, setFormData] = useState({
    title: '',           // Interview title / CN: 面试标题
    job_role: '',        // Job role / CN: 职位角色  
    description: '',     // Interview description / CN: 面试描述
    status: 'Draft'      // Interview status / CN: 面试状态
  })

  // Available interview status options - matches API requirements
  // CN: 可用的面试状态选项 - 匹配 API 要求
  const InterviewStatus = [
    { value: 'Published', label: 'Published' },  // Published interviews are active / CN: 已发布的面试处于活跃状态
    { value: 'Draft', label: 'Draft' },          // Draft interviews are not visible to applicants / CN: 草稿面试对候选人不可见
    { value: 'Archived', label: 'Archived' },    // Archived interviews are closed / CN: 归档面试已关闭
  ]

  // Effect to populate form when interview prop changes
  // CN: 当 interview prop 变化时填充表单的副作用
  useEffect(() => {
    if (interview) {
      setFormData({
        title: interview.title || '',
        job_role: interview.job_role || '',
        description: interview.description || '',
        status: interview.status || 'Draft'
      })
    }
  }, [interview]) // Re-run when interview prop changes / CN: 当 interview prop 变化时重新运行

  // Handle form input changes - updates formData state
  // CN: 处理表单输入变化 - 更新 formData 状态
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,           // Keep existing fields / CN: 保留现有字段
      [field]: value     // Update the specific field / CN: 更新特定字段
    }))
  }

  // Handle form submission - updates existing interview via API
  // CN: 处理表单提交 - 通过 API 更新现有面试
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent default form submission / CN: 阻止默认表单提交

    // Ensure we have an interview to update
    // CN: 确保我们有要更新的面试
    if (!interview || !interview.id) {
      alert('No interview selected for editing')
      return
    }

    // Basic validation - ensure required fields are filled
    // CN: 基础验证 - 确保必填字段已填写
    if (!formData.title.trim() || !formData.job_role.trim() || !formData.status) { // trim() 方法用于去除字符串两端的空白字符（包括空格、制表符、换行符等）
      alert('Please fill in all required fields: Title, Job Role, and Status')
      return
    }

    try {
      setLoading(true) // Start loading / CN: 开始加载

      // Call API service to update interview
      // CN: 调用 API 服务更新面试
      const updatedInterview = await updateInterview(interview.id, formData)
      
      // Success handling
      // CN: 成功处理
      console.log('Interview updated successfully:', updatedInterview)
      
      // Close the dialog
      // CN: 关闭对话框
      setOpen(false)
      
      // Notify parent component to refresh data
      // CN: 通知父组件刷新数据
      if (onInterviewUpdated) {
        onInterviewUpdated()
      }
      
      // Success notification will be handled by parent component
      // CN: 成功通知将由父组件处理
      
    } catch (error) {
      // Error handling
      // CN: 错误处理
      console.error('Failed to update interview:', error)
      
      // TODO: Add beautiful error notification with TailwindCSS  
      // CN: TODO: 使用 TailwindCSS 添加美观的错误通知
      alert('Failed to update interview. Please try again.')
      
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

  // Don't render edit button if no interview provided
  // CN: 如果没有提供面试数据则不渲染编辑按钮
  if (!interview) {
    return null
  }

  return (
    <>
      {/* <button
        type="button"
        className="block rounded-md bg-slate-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <div className="flex items-center gap-2" onClick={() => setOpen(true)}>
          <CirclePlus className="w-4 h-4"/>  Add Interview
        </div>
      </button> */}
      <button
        type="button"
        className="rounded-sm bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-400 shadow-xs hover:bg-blue-100 mr-2">
        <div className='flex items-center gap-2' onClick={() => setOpen(true)}>
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
                          <DialogTitle className="text-3xl font-semibold text-gray-900">Edit Interview</DialogTitle>
                          <p className="text-base text-gray-500">
                            Get started by filling in the information below to edit your interview.
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
                      
                      {/* Status select - can be changed during editing / CN: 状态选择 - 编辑时可更改 */}
                      <SelectInput 
                        label="Status" 
                        placeholder="Select Interview Status" 
                        id="interview-status" 
                        name="interview-status" 
                        options={InterviewStatus}
                        value={formData.status}
                        onChange={(value) => handleInputChange('status', value)}
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
