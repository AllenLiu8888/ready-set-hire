const people = [
  { id: 1, title: 'Front-end Developer Interview', role: 'Senior Front-end Developer', description: 'Interview for candidates with React experience', status: 'Published',},
  { id: 2, title: 'Designer Interview', role: 'Junior Designer', description: 'Interview for candidates with design experience', status: 'Published',  },
  { id: 3, title: 'Director of Product', role: 'Director of Product', description: 'Interview for candidates with product experience', status: 'Draft',  },
  { id: 4, title: 'Copywriter Interview', role: 'Copywriter', description: 'Interview for candidates with copywriting experience', status: 'Archived',  },
  { id: 5, title: 'Senior Designer Interview', role: 'Senior Designer', description: 'Interview for candidates with design experience', status: 'Published',  },
  { id: 6, title: 'Principal Designer Interview', role: 'Principal Designer', description: 'Interview for candidates with design experience', status: 'Published',  },
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
            Refresh
          </button>
          <button
            type="button"
            className="block rounded-md bg-slate-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Question
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
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="py-3.5 pr-4 pl-3 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {people.map((person) => (
                    <tr key={person.id}>
                      <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                        {person.title}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{person.role}</td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{person.description}</td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{person.status}</td>
                      <td className="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                      <button
                        type="button"
                        className="rounded-sm bg-zinc-50 px-2 py-1 text-sm font-semibold text-zinc-600 shadow-xs hover:bg-zinc-100 mr-3">
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-sm bg-red-50 px-2 py-1 text-sm font-semibold text-red-600 shadow-xs hover:bg-red-100">
                        Delete
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
