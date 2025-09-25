import { CircleQuestionMark, Users, Trash2, RefreshCcw } from 'lucide-react';
import { tv } from 'tailwind-variants';
import { useState, useEffect } from 'react';
import EditInterviewDrawer from './EditInterviewDrawer.jsx';  
import CreateInterviewDrawer from './CreateInterviewDrawer.jsx';
// Import API services
// CN: 导入 API 服务
import { getInterviews, deleteInterview } from '../../services';



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
  const [loading, setLoading] = useState(true) // Loading state / CN: 加载状态
  const [error, setError] = useState(null) // Error state / CN: 错误状态

  // Function to fetch interviews from API
  // CN: 从 API 获取面试数据的函数
  const fetchInterviews = async () => {
    try {
      setLoading(true) // Start loading / CN: 开始加载
      setError(null) // Clear previous errors / CN: 清除之前的错误
      
      // Call API service to get interviews
      // CN: 调用 API 服务获取面试数据
      const data = await getInterviews()
      
      // Update state with fetched data
      // CN: 用获取的数据更新状态
      setInterviews(data)
    } catch (err) {
      // Handle errors
      // CN: 处理错误
      console.error('Failed to fetch interviews:', err)
      setError('Failed to load interviews. Please try again.')
    } finally {
      // Always stop loading regardless of success/failure
      // CN: 无论成功或失败都停止加载
      setLoading(false)
    }
  }

  // Function to handle interview deletion
  // CN: 处理面试删除的函数
  const handleDeleteInterview = async (interviewId) => {
    // Show confirmation dialog
    // CN: 显示确认对话框
    // TODO:加入好看的确认框，TailwindCSSPLUS的
    if (!window.confirm('Are you sure you want to delete this interview?')) {
      return
    }

    try {
      // Call API service to delete interview
      // CN: 调用 API 服务删除面试
      await deleteInterview(interviewId)
      
      // Remove from local state (optimistic update)
      // CN: 从本地状态中移除（乐观更新）
      setInterviews(prev => prev.filter(interview => interview.id !== interviewId))
      
      // Optional: Show success message
      // CN: 可选：显示成功消息
      // TODO:加入好看的成功信息，TailwindCSSPLUS的
      console.log('Interview deleted successfully')
    } catch (err) {
      // Handle deletion errors
      // CN: 处理删除错误
      console.error('Failed to delete interview:', err)
      alert('Failed to delete interview. Please try again.')
    }
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
          <CreateInterviewDrawer onInterviewCreated={fetchInterviews} /> {/* Pass callback to refresh after creation / CN: 传递回调以在创建后刷新 */}
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
                            {/* TODO: Add questions count from API / CN: TODO: 从 API 添加题目数量 */}
                            0 Questions  
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500"> 
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4"/> 
                            {/* TODO: Add applicants count from API / CN: TODO: 从 API 添加候选人数量 */}
                            0 Applicants
                            <span className={ApplicantsStatus({ status: 'Completed' })}>0 Completed</span>
                            <span className={ApplicantsStatus({ status: 'Not Started' })}>0 Pending</span>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-center text-sm font-medium whitespace-nowrap">
                          {/* Pass interview data to edit drawer / CN: 传递面试数据给编辑抽屉 */}
                          <EditInterviewDrawer 
                            interview={interview} 
                            onInterviewUpdated={fetchInterviews} 
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteInterview(interview.id)} // Add delete handler / CN: 添加删除处理器
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
    </div>
  )
}
