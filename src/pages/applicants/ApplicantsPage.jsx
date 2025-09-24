const Applicants = [
  { id:"1",title:'Mr',firstname:'John',surname:'Smith',phone_number:'+61 412 345 678',email_address:'john.smith@example.com',interview_status:'Not Started',}, 
  { id:"2",title:'Ms',firstname:'Jane',surname:'Doe',phone_number:'+61 412 345 679',email_address:'jane.doe@example.com',interview_status:'Not Started',}, 
  { id:"3",title:'Mr',firstname:'Jim',surname:'Beam',phone_number:'+61 412 345 680',email_address:'jim.beam@example.com',interview_status:'Completed',}, 
  { id:"4",title:'Ms',firstname:'Jill',surname:'Johnson',phone_number:'+61 412 345 681',email_address:'jill.johnson@example.com',interview_status:'Not Started',}, 
  { id:"5",title:'Mr',firstname:'Jack',surname:'Brown',phone_number:'+61 412 345 682',email_address:'jack.brown@example.com',interview_status:'Completed',}, 
  { id:"6",title:'Dr',firstname:'Jill',surname:'Johnson',phone_number:'+61 412 345 683',email_address:'jill.johnson@example.com',interview_status:'Not Started',}, 
]

export default function ApplicantsPage() {  
  return (
    <div className="px-4 sm:px-6 lg:px-8">
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
            className="rounded-md bg-white px-3 py-2 text-center font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-200 hover:text-gray-500"
          >
            Refresh
          </button>
          <button
            type="button"
            className="block rounded-md bg-slate-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Applicant
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
                      Applicant
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Contact
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Interview Status
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
                  {Applicants.map((Applicant) => (
                    <tr key={Applicant.id}>
                      <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                        {Applicant.title} {Applicant.firstname} {Applicant.surname}
                      </td> 
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{Applicant.phone_number}</span>
                          <span className="text-sm text-gray-500">{Applicant.email_address}</span>
                        </div>
                        </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{Applicant.interview_status}</td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{Applicant.status}</td>
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
