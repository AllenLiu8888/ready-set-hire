import { tv } from 'tailwind-variants';
import { RefreshCcw, Trash2, Link, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import CreateApplicantDrawer from './CreateApplicantDrawer.jsx';
import EditApplicantDrawer from './EditApplicantDrawer.jsx';
import ConfirmAlert from '../../components/shared/alerts/ConfirmAlert.jsx';
import SuccessAlert from '../../components/shared/alerts/SuccessAlert.jsx';

// Import API services and utilities
// CN: 导入 API 服务和工具函数
import { getApplicants, deleteApplicant } from '../../services';
import { getInterviewTitleById } from '../../utils/interviewUtils';

const ApplicantsStatus = tv({
  base: 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
  variants: {
    status: {
      'Not Started': 'bg-yellow-50 text-yellow-600',
      'Completed': 'bg-blue-50 text-blue-600',
    },
  },
})
export default function ApplicantsPage() {
  // State management for applicants data and UI states
  // CN: 候选人数据和 UI 状态的状态管理
  const [applicants, setApplicants] = useState([]) // Store applicants list / CN: 存储候选人列表
  const [loading, setLoading] = useState(true) // Loading state / CN: 加载状态
  const [error, setError] = useState(null) // Error state / CN: 错误状态
  
  // State for delete confirmation dialog
  // CN: 删除确认对话框的状态
  const [showConfirm, setShowConfirm] = useState(false) // Control confirm dialog / CN: 控制确认对话框
  const [applicantToDelete, setApplicantToDelete] = useState(null) // Applicant to be deleted / CN: 要删除的候选人
  
  // State for success notification
  // CN: 成功通知的状态
  const [successMessage, setSuccessMessage] = useState('') // Success message content / CN: 成功消息内容
  const [showSuccess, setShowSuccess] = useState(false) // Control success alert visibility / CN: 控制成功提醒的可见性

  // Function to fetch applicants from API
  // CN: 从 API 获取候选人数据的函数
  const fetchApplicants = async () => {
    try {
      setLoading(true) // Start loading / CN: 开始加载
      setError(null) // Clear previous errors / CN: 清除之前的错误
      
      // Call API service to get applicants
      // CN: 调用 API 服务获取候选人数据
      const data = await getApplicants()
      
      // Update state with fetched data
      // CN: 用获取的数据更新状态
      setApplicants(data)
    } catch (err) {
      // Handle errors
      // CN: 处理错误
      console.error('Failed to fetch applicants:', err)
      setError('Failed to load applicants. Please try again.')
    } finally {
      // Always stop loading regardless of success/failure
      // CN: 无论成功或失败都停止加载
      setLoading(false)
    }
  }

  // Function to show success notification
  // CN: 显示成功通知的函数
  const showSuccessNotification = (message) => {
    setSuccessMessage(message)
    setShowSuccess(true)
    
    // Auto-hide after 3 seconds / CN: 3秒后自动隐藏
    setTimeout(() => {
      setShowSuccess(false)
      setSuccessMessage('')
    }, 3000)
  }

  // Function to handle success alert close
  // CN: 处理成功提醒关闭的函数
  const handleCloseSuccess = () => {
    setShowSuccess(false)
    setSuccessMessage('')
  }

  // Function to handle applicant creation success
  // CN: 处理候选人创建成功的函数
  const handleApplicantCreated = () => {
    fetchApplicants() // Refresh the list / CN: 刷新列表
    showSuccessNotification('Applicant created successfully!') // Show success message / CN: 显示成功消息
  }

  // Function to handle applicant update success
  // CN: 处理候选人更新成功的函数
  const handleApplicantUpdated = () => {
    fetchApplicants() // Refresh the list / CN: 刷新列表
    showSuccessNotification('Applicant updated successfully!') // Show success message / CN: 显示成功消息
  }

  // Function to handle delete button click - shows confirmation dialog
  // CN: 处理删除按钮点击 - 显示确认对话框
  const handleDeleteClick = (applicant) => {
    setApplicantToDelete(applicant) // Store applicant to delete / CN: 存储要删除的候选人
    setShowConfirm(true) // Show confirmation dialog / CN: 显示确认对话框
  }

  // Function to handle confirmed deletion
  // CN: 处理确认删除的函数
  const handleConfirmDelete = async () => {
    if (!applicantToDelete) return

    try {
      console.log('Deleting applicant:', applicantToDelete.id, `${applicantToDelete.firstname} ${applicantToDelete.surname}`)
      
      // Call API service to delete applicant
      // CN: 调用 API 服务删除候选人
      await deleteApplicant(applicantToDelete.id)
      
      console.log('Delete API call successful')
      
      // Remove from local state (optimistic update)
      // CN: 从本地状态中移除（乐观更新）
      setApplicants(prev => prev.filter(applicant => applicant.id !== applicantToDelete.id))
      
      // Clean up state
      // CN: 清理状态
      setApplicantToDelete(null)
      setShowConfirm(false)
      
      // Show success message
      // CN: 显示成功消息
      console.log('Applicant deleted successfully:', `${applicantToDelete.firstname} ${applicantToDelete.surname}`)
      showSuccessNotification(`Applicant "${applicantToDelete.firstname} ${applicantToDelete.surname}" deleted successfully!`)
      
    } catch (err) {
      // Handle deletion errors with detailed logging
      // CN: 处理删除错误并详细记录
      console.error('Failed to delete applicant:', err)
      console.error('Applicant details:', {
        id: applicantToDelete.id,
        name: `${applicantToDelete.firstname} ${applicantToDelete.surname}`,
        error: err.message
      })
      
      // Show detailed error message
      // CN: 显示详细错误消息
      alert(`Failed to delete applicant "${applicantToDelete.firstname} ${applicantToDelete.surname}": ${err.message}`)
      
      // Keep dialog open so user can try again
      // CN: 保持对话框打开，用户可以重试
      // setShowConfirm(false) // Don't close on error
    }
  }

  // Function to handle dialog close
  // CN: 处理对话框关闭的函数
  const handleCloseConfirm = () => {
    setShowConfirm(false)
    setApplicantToDelete(null)
  }

  // Function to generate interview invitation link
  // CN: 生成面试邀请链接的函数
  const generateInvitationLink = (applicantId) => {
    // Generate the take interview URL for the applicant
    // CN: 为候选人生成答题链接URL
    const baseUrl = window.location.origin
    const inviteLink = `${baseUrl}/take/${applicantId}`
    
    // Copy to clipboard
    // CN: 复制到剪贴板
    navigator.clipboard.writeText(inviteLink).then(() => {
      showSuccessNotification('Interview link copied to clipboard!')
    }).catch((err) => {
      console.error('Failed to copy link:', err)
      alert('Failed to copy link to clipboard')
    })
  }

  // Effect hook to fetch data when component mounts
  // CN: 当组件挂载时获取数据的副作用钩子
  useEffect(() => {
    fetchApplicants()
  }, []) // Empty dependency array means this runs once on mount / CN: 空依赖数组意味着只在挂载时运行一次

  // Early return for loading state
  // CN: 加载状态的早期返回
  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCcw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-2 text-gray-600">Loading applicants...</p>
          </div>
        </div>
      </div>
    )
  }

  // Early return for error state
  // CN: 错误状态的早期返回
  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchApplicants}
              className="rounded-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  } 

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Success notification - floating at top / CN: 成功通知 - 浮动在顶部 */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <SuccessAlert message={successMessage} onClose={handleCloseSuccess} />
        </div>
      )}
      
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-semibold text-gray-900">Applicants</h1>
          <p className="mt-2 text-base text-gray-700">
            A list of all the applicants in your account including their title, role, description and status.
          </p>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={fetchApplicants} // Add click handler to refresh data / CN: 添加点击处理器来刷新数据
            disabled={loading} // Disable while loading / CN: 加载时禁用
            className="rounded-md bg-white px-3 py-2 text-center font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-200 hover:text-gray-500 disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}/> Refresh
            </div>
          </button>

          <CreateApplicantDrawer onApplicantCreated={handleApplicantCreated} /> {/* Pass callback to refresh and show success / CN: 传递回调以刷新并显示成功消息 */}
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg">
              <table className="relative min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Contact
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Interview
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {/* Show empty state if no applicants / CN: 如果没有候选人则显示空状态 */}
                  {applicants.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-8 h-8 text-gray-300" />
                          <p>No applicants found</p>
                          <p className="text-sm">Create your first applicant to get started</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // Map through real applicants data from API / CN: 遍历来自 API 的真实候选人数据
                    applicants.map((applicant) => (
                      <tr key={applicant.id}>
                        <td className="py-4 px-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                          {applicant.title} {applicant.firstname} {applicant.surname}
                        </td> 
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{applicant.phone_number}</span>
                            <span className="text-sm text-gray-500">{applicant.email_address}</span>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {/* Display interview title from localStorage with error handling / CN: 从localStorage显示面试标题并处理错误 */}
                          {getInterviewTitleById(applicant.interview_id)}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          <span className={ApplicantsStatus({ status: applicant.interview_status })}>
                            {applicant.interview_status}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-center text-sm font-medium whitespace-nowrap">  
                          {/* Copy interview link button / CN: 复制面试链接按钮 */}
                          <button
                            type="button"
                            onClick={() => generateInvitationLink(applicant.id)} // Generate and copy invitation link / CN: 生成并复制邀请链接
                            className="rounded-sm bg-zinc-50 px-2 py-1 text-sm font-semibold text-zinc-600 shadow-xs hover:bg-zinc-100 mr-2"
                          >
                            <div className='flex items-center gap-2'>
                              <Link className="w-4 h-4"/>
                              Copy Link
                            </div>
                          </button>
                          
                          {/* Pass applicant data to edit drawer / CN: 传递候选人数据给编辑抽屉 */}
                          <EditApplicantDrawer 
                            applicant={applicant} 
                            onApplicantUpdated={handleApplicantUpdated}
                          />
                          
                          {/* Delete button / CN: 删除按钮 */}
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(applicant)} // Use new click handler / CN: 使用新的点击处理器
                            className="rounded-sm bg-red-50 px-2 py-1 text-sm font-semibold text-red-600 shadow-xs hover:bg-red-100 ml-2"
                          >
                            <div className='flex items-center gap-2'>
                              <Trash2 className="w-4 h-4"/>
                            </div>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation dialog for delete action / CN: 删除操作的确认对话框 */}
      {showConfirm && (
        <ConfirmAlert
          open={showConfirm}
          onClose={handleCloseConfirm}
          onConfirm={handleConfirmDelete}
          title="Delete Applicant"
          message={`Are you sure you want to delete "${applicantToDelete?.firstname} ${applicantToDelete?.surname}"? This action cannot be undone.`}
        />
      )}
    </div>
  )
}
