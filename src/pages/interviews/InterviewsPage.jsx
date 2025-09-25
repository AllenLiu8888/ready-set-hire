import { CircleQuestionMark, Users, Trash2, RefreshCcw } from 'lucide-react';
import { tv } from 'tailwind-variants';
import { useState, useEffect } from 'react';
import EditInterviewDrawer from './EditInterviewDrawer.jsx';  
import CreateInterviewDrawer from './CreateInterviewDrawer.jsx';
import ConfirmAlert from '../../components/shared/alerts/ConfirmAlert.jsx';
import SuccessAlert from '../../components/shared/alerts/SuccessAlert.jsx';
import { AIQuestionGeneratorCompact } from '../../components/ai/AIQuestionGenerator.jsx';

// Import API services
// CN: 导入 API 服务
import { getInterviews, deleteInterview, getQuestions, getApplicants } from '../../services';
import { storeInterviews } from '../../utils/interviewUtils';



const InterviewStatus = tv({
  base: 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
  variants: {
    status: {
      'Published': 'bg-green-50 text-green-600',
      'Draft': 'bg-yellow-50 text-yellow-600',
      'Archived': 'bg-red-50 text-red-600',
    },
  },
})

const ApplicantsStatus = tv({
  base: 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
  variants: {
    status: {
      'Not Started': 'bg-yellow-50 text-yellow-600 insering-ring inset-ring-yellow-700/10',
      'Completed': 'bg-blue-50 text-blue-400 insering-ring inset-ring-blue-700/10',
    },
  },
})

export default function InterviewsPage() {
  // State management for interviews data and UI states
  // CN: 面试数据和 UI 状态的状态管理
  const [interviews, setInterviews] = useState([]) // Store interviews list / CN: 存储面试列表
  const [questions, setQuestions] = useState([]) // Store questions list / CN: 存储题目列表
  const [applicants, setApplicants] = useState([]) // Store applicants list / CN: 存储候选人列表
  const [loading, setLoading] = useState(true) // Loading state / CN: 加载状态
  const [error, setError] = useState(null) // Error state / CN: 错误状态
  
  // State for delete confirmation dialog
  // CN: 删除确认对话框的状态
  const [showConfirm, setShowConfirm] = useState(false) // Control confirm dialog / CN: 控制确认对话框
  const [interviewToDelete, setInterviewToDelete] = useState(null) // Interview to be deleted / CN: 要删除的面试
  
  // State for success notification
  // CN: 成功通知的状态
  const [successMessage, setSuccessMessage] = useState('') // Success message content / CN: 成功消息内容
  const [showSuccess, setShowSuccess] = useState(false) // Control success alert visibility / CN: 控制成功提醒的可见性

  // Function to fetch all data from API
  // CN: 从 API 获取所有数据的函数
  const fetchInterviews = async () => {
    try {
      setLoading(true) // Start loading / CN: 开始加载
      setError(null) // Clear previous errors / CN: 清除之前的错误
      
      console.log('📊 Fetching interviews, questions, and applicants data...')
      
      // Fetch all data in parallel for better performance
      // CN: 并行获取所有数据以提高性能
      const [interviewsData, questionsData, applicantsData] = await Promise.all([
        getInterviews(),
        getQuestions(),
        getApplicants()
      ])
      
      // Update state with fetched data
      // CN: 用获取的数据更新状态
      setInterviews(interviewsData)
      setQuestions(questionsData)
      setApplicants(applicantsData)
      
      // Store interviews in localStorage for other components to use
      // CN: 将面试数据存储到localStorage供其他组件使用
      storeInterviews(interviewsData)
      
      console.log('✅ All data loaded successfully')
      
    } catch (err) {
      // Handle errors
      // CN: 处理错误
      console.error('Failed to fetch data:', err)
      setError('Failed to load data. Please try again.')
    } finally {
      // Always stop loading regardless of success/failure
      // CN: 无论成功或失败都停止加载
      setLoading(false)
    }
  }

  // Function to handle interview creation success
  // CN: 处理面试创建成功的函数
  const handleInterviewCreated = () => {
    fetchInterviews() // Refresh the list / CN: 刷新列表
    showSuccessNotification('Interview created successfully!') // Show success message / CN: 显示成功消息
  }

  // Function to handle interview update success
  // CN: 处理面试更新成功的函数
  const handleInterviewUpdated = () => {
    fetchInterviews() // Refresh the list / CN: 刷新列表
    showSuccessNotification('Interview updated successfully!') // Show success message / CN: 显示成功消息
  }

  // Function to handle delete button click - shows confirmation dialog
  // CN: 处理删除按钮点击 - 显示确认对话框
  const handleDeleteClick = (interview) => {
    setInterviewToDelete(interview) // Store interview to delete / CN: 存储要删除的面试
    setShowConfirm(true) // Show confirmation dialog / CN: 显示确认对话框
  }

  // Function to handle confirmed deletion
  // CN: 处理确认删除的函数
  const handleConfirmDelete = async () => {
    if (!interviewToDelete) return

    try {
      console.log('Deleting interview:', interviewToDelete.id, interviewToDelete.title)
      
      // Call API service to delete interview
      // CN: 调用 API 服务删除面试
      await deleteInterview(interviewToDelete.id)
      
      console.log('Delete API call successful')
      
      // Remove from local state (optimistic update)
      // CN: 从本地状态中移除（乐观更新）
      setInterviews(prev => prev.filter(interview => interview.id !== interviewToDelete.id))
      
      // Clean up state
      // CN: 清理状态
      setInterviewToDelete(null)
      setShowConfirm(false)
      
      // Show success message
      // CN: 显示成功消息
      console.log('Interview deleted successfully:', interviewToDelete.title)
      showSuccessNotification(`Interview "${interviewToDelete.title}" deleted successfully!`)
      
    } catch (err) {
      // Handle deletion errors with detailed logging
      // CN: 处理删除错误并详细记录
      console.error('Failed to delete interview:', err)
      console.error('Interview details:', {
        id: interviewToDelete.id,
        title: interviewToDelete.title,
        error: err.message
      })
      
      // Show detailed error message
      // CN: 显示详细错误消息
      alert(`Failed to delete interview "${interviewToDelete.title}": ${err.message}`)
      
      // Keep dialog open so user can try again
      // CN: 保持对话框打开，用户可以重试
      // setShowConfirm(false) // Don't close on error
    }
  }

  // Function to handle dialog close
  // CN: 处理对话框关闭的函数
  const handleCloseConfirm = () => {
    setShowConfirm(false)
    setInterviewToDelete(null)
  }

  // Function to calculate questions count for an interview
  // CN: 计算面试题目数量的函数
  const getQuestionsCount = (interviewId) => {
    return questions.filter(q => q.interview_id === interviewId).length
  }

  // Function to calculate applicants count and status for an interview
  // CN: 计算面试候选人数量和状态的函数
  const getApplicantsStats = (interviewId) => {
    const interviewApplicants = applicants.filter(a => a.interview_id === interviewId)
    const total = interviewApplicants.length
    const completed = interviewApplicants.filter(a => a.interview_status === 'Completed').length
    const pending = interviewApplicants.filter(a => a.interview_status === 'Not Started').length
    
    return { total, completed, pending }
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

  // Effect hook to fetch data when component mounts
  // CN: 当组件挂载时获取数据的副作用钩子
  useEffect(() => {
    fetchInterviews()
  }, []) // Empty dependency array means this runs once on mount / CN: 空依赖数组意味着只在挂载时运行一次

  // Early return for loading state
  // CN: 加载状态的早期返回
  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCcw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-2 text-gray-600">Loading interviews...</p>
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
              onClick={fetchInterviews}
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
          <h1 className="text-3xl font-semibold text-gray-900">Interviews Management</h1>
          <p className="mt-2 text-base text-gray-700">
            A list of all the interviews in your account including their title, role, description and status.
          </p>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={fetchInterviews} // Add click handler to refresh data / CN: 添加点击处理器来刷新数据
            disabled={loading} // Disable while loading / CN: 加载时禁用
            className="rounded-md bg-white px-3 py-2 text-center font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-200 hover:text-gray-500 disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}/> Refresh
            </div>
          </button>
          <CreateInterviewDrawer onInterviewCreated={handleInterviewCreated} /> {/* Pass callback to refresh and show success / CN: 传递回调以刷新并显示成功消息 */}
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
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role Job
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Questions
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Applicants
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {/* Show empty state if no interviews / CN: 如果没有面试则显示空状态 */}
                  {interviews.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <CircleQuestionMark className="w-8 h-8 text-gray-300" />
                          <p>No interviews found</p>
                          <p className="text-sm">Create your first interview to get started</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // Map through real interviews data from API / CN: 遍历来自 API 的真实面试数据
                    interviews.map((interview) => (
                      <tr key={interview.id}>    
                        <td className="py-4 px-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                          {interview.title}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{interview.job_role}</td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          <span className={InterviewStatus({ status: interview.status })}>{interview.status}</span>
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 ">
                          <div className="flex items-center gap-2">
                            <CircleQuestionMark className="w-4 h-4"/> 
                            {getQuestionsCount(interview.id)} Questions  
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500"> 
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4"/> 
                            {(() => {
                              const stats = getApplicantsStats(interview.id)
                              return (
                                <>
                                  {stats.total} Applicants
                                  {stats.total > 0 && (
                                    <>
                                      <span className={ApplicantsStatus({ status: 'Completed' })}>{stats.completed} Completed</span>
                                      <span className={ApplicantsStatus({ status: 'Not Started' })}>{stats.pending} Pending</span>
                                    </>
                                  )}
                                </>
                              )
                            })()}
                          </div>
                        </td>
                        <td className="py-4 px-3 text-center text-sm font-medium whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-2">
                            {/* AI Question Generator / CN: AI问题生成器 */}
                            <AIQuestionGeneratorCompact
                              interview={interview}
                              onQuestionsGenerated={() => {
                                // Refresh data to show new questions count
                                // CN: 刷新数据以显示新的问题数量
                                fetchInterviews()
                                showSuccessNotification(`AI questions generated for "${interview.title}"!`)
                              }}
                            />
                            
                            {/* Edit button / CN: 编辑按钮 */}
                            <EditInterviewDrawer 
                              interview={interview} 
                              onInterviewUpdated={handleInterviewUpdated}
                            />
                            
                            {/* Delete button / CN: 删除按钮 */}
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(interview)}
                              className="rounded-sm bg-red-50 px-2 py-1 text-sm font-semibold text-red-600 shadow-xs hover:bg-red-100"
                            >
                              <div className='flex items-center gap-2'>
                                <Trash2 className="w-4 h-4"/>
                              </div>
                            </button>
                          </div>
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
          title="Delete Interview"
          message={`Are you sure you want to delete "${interviewToDelete?.title}"? This action cannot be undone.`}
        />
      )}
    </div>
  )
}
