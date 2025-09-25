import { CircleQuestionMark } from 'lucide-react';
import { RefreshCcw } from 'lucide-react';
import { Users } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { tv } from 'tailwind-variants';
import EditInterviewDrawer from './EditInterviewDrawer.jsx';  
import CreateInterviewDrawer from './CreateInterviewDrawer.jsx';


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

const Interviews = [
  { id: 1, title: 'Front-end Developer Interview', job_role: 'Senior Front-end Developer', description: 'Interview for candidates with React experience', status: 'Published', questions: 3, applicants: 3, applicants_completed_count: 2, applicants_not_started_count: 1, },
  { id: 2, title: 'Designer Interview', job_role: 'Junior Designer', description: 'Interview for candidates with design experience', status: 'Published', questions: 4, applicants: 7, applicants_completed_count: 4, applicants_not_started_count: 3, },
  { id: 2, title: 'Designer Interview', job_role: 'Junior Designer', description: 'Interview for candidates with design experience', status: 'Published', questions: 4, applicants: 9, applicants_completed_count: 6, applicants_not_started_count: 3, },
  { id: 3, title: 'Director of Product', job_role: 'Director of Product', description: 'Interview for candidates with product experience', status: 'Draft', questions: 5, applicants: 10, applicants_completed_count: 8, applicants_not_started_count: 2, },
  { id: 4, title: 'Copywriter Interview', job_role: 'Copywriter', description: 'Interview for candidates with copywriting experience', status: 'Archived', questions: 6, applicants: 100, applicants_completed_count: 98, applicants_not_started_count: 2, },
  { id: 5, title: 'Senior Designer Interview', job_role: 'Senior Designer', description: 'Interview for candidates with design experience', status: 'Published', questions: 7, applicants: 100, applicants_completed_count: 99, applicants_not_started_count: 1, },
  { id: 6, title: 'Principal Designer Interview', job_role: 'Principal Designer', description: 'Interview for candidates with design experience', status: 'Published', questions: 8, applicants: 100, applicants_completed_count: 99, applicants_not_started_count: 1, },
]

export default function InterviewsPage() {
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
            className="rounded-md bg-white px-3 py-2 text-center font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-200 hover:text-gray-500"
          >
            <div className="flex items-center gap-2">
              <RefreshCcw className="w-4 h-4"/> Refresh
            </div>
          </button>
          <CreateInterviewDrawer />
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
                  {Interviews.map((Interview) => (
                    <tr key={Interview.id}>    
                      <td className="py-4 px-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                        {Interview.title}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{Interview.job_role}</td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        <span className={InterviewStatus({ status: Interview.status })}>{Interview.status}</span>
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 ">
                        <div className="flex items-center gap-2">
                          <CircleQuestionMark className="w-4 h-4"/> {Interview.questions} Questions  
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500"> 
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4"/> 
                          {Interview.applicants}
                          <span className={ApplicantsStatus({ status: 'Completed' })}>{Interview.applicants_completed_count} Completed</span>
                          <span className={ApplicantsStatus({ status: 'Not Started' })}>{Interview.applicants_not_started_count} Pending</span>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-center text-sm font-medium whitespace-nowrap">
                        <EditInterviewDrawer />
                        {/* <button
                          type="button"
                          className="rounded-sm bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-400 shadow-xs hover:bg-blue-100 mr-2">
                            <div className='flex items-center gap-2'>
                              <SquarePen className="w-4 h-4"/>
                            </div>
                          
                        </button> */}
                        <button
                          type="button"
                          className="rounded-sm bg-red-50 px-2 py-1 text-sm font-semibold text-red-600 shadow-xs hover:bg-red-100">
                          <div className='flex items-center gap-2'>
                            <Trash2 className="w-4 h-4"/>
                          </div>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
