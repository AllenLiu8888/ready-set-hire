import { MessageCirclePlus } from 'lucide-react';
import { RefreshCcw } from 'lucide-react';
import { SquarePen } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { tv } from 'tailwind-variants'

const QuestionsDifficulty = tv({
  base: 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
  variants: {
    status: {
      'Easy': 'bg-green-50 text-green-600',
      'Intermediate': 'bg-yellow-50 text-yellow-600',
      'Advanced': 'bg-red-50 text-red-600',
    },
  },
})

const Questions = [
  { id: 1, interview_id: 1, interview: 'Front-end Developer Interview', question: 'Explain the difference between let and const in JavaScript', difficulty: 'Easy',},
  { id: 2, interview_id: 2, interview: 'Designer Interview', question: 'What is the difference between a div and a span?', difficulty: 'Intermediate',},
  { id: 3, interview_id: 3, interview: 'Director of Product', question: 'What is the difference between a div and a span?', difficulty: 'Advanced',},
  { id: 4, interview_id: 4, interview: 'Copywriter Interview', question: 'What is the difference between a div and a span?', difficulty: 'Advanced',},
  { id: 5, interview_id: 5, interview: 'Senior Designer Interview', question: 'What is the difference between a div and a span?', difficulty: 'Easy',},
  { id: 6, interview_id: 6, interview: 'Principal Designer Interview', question: 'What is the difference between a div and a span?', difficulty: 'Intermediate',},
]

export default function QuestionsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-semibold text-gray-900">Questions</h1>
          <p className="mt-2 text-base text-gray-700">
            A list of all the questions in your account including their title, role, description and status.
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
          <button
            type="button"
            className="block rounded-md bg-slate-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <div className="flex items-center gap-2">
              <MessageCirclePlus className="w-4 h-4"/> Add Question
            </div>
          </button>
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
                      Question
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Interview
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Difficulty
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {Questions.map((Question) => (
                    <tr key={Question.id}>
                      <td className="py-4 px-auto text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                        {Question.question}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{Question.interview}</td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                      <span className={QuestionsDifficulty({ status: Question.difficulty })}>{Question.difficulty}</span>
                      </td>
                      <td className="py-4 px-4 text-center text-sm font-medium whitespace-nowrap">
                      <button
                        type="button"
                        className="rounded-sm bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-400 shadow-xs hover:bg-blue-100 mr-2">
                          <div className='flex items-center gap-2'>
                            <SquarePen className="w-4 h-4"/>
                          </div>
                      </button>
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
