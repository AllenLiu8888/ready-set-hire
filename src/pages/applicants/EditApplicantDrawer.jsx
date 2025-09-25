import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { UserPlus } from 'lucide-react';
import { X } from 'lucide-react';
import TextInput from '../../components/form/TextInput'; 
import ActionButton from '../../components/form/ActionButton';
import DividerContainer from '../../components/form/DividerContainer';
import SelectInput from '../../components/form/SelectInput';

export default function EditApplicantDrawer() {
  const [open, setOpen] = useState(false)
  const Interviews = [
    { value: '1', label: 'Interview 1', status:'Not Started'},
    { value: '2', label: 'Interview 2', status:'Not Started'},
    { value: '3', label: 'Interview 3', status:'Completed'},
  ]
  const InterviewStatus = [
    { value: 'Not Started', label: 'Not Started' },
    { value: 'Completed', label: 'Completed' },
  ]
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
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="shadow-xl/30 pointer-events-auto w-screen max-w-4xl transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <form className="relative flex h-full flex-col overflow-y-auto bg-white shadow-xl">
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
                            onClick={() => setOpen(false)}
                            className="relative rounded-md text-gray-400 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <X aria-hidden="true" className="size-6 text-gray-900" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <DividerContainer>
                      <TextInput label="Title" placeholder="Mr, Ms, Dr" type="text" id="applicant-title" name="applicant-title" />
                      <TextInput label="First Name" placeholder="First Name" type="text" id="applicant-firstname" name="applicant-firstname" />
                      <TextInput label="Last Name" placeholder="Last Name" type="text" id="applicant-lastname" name="applicant-lastname" />
                      <TextInput label="Phone Number" placeholder="Phone Number" type="text" id="applicant-phone-number" name="applicant-phone-number" />
                      <TextInput label="Email Address" placeholder="Email Address" type="text" id="applicant-email-address" name="applicant-email-address" />
                      <SelectInput label="Interview" placeholder="Select Interview" id="applicant-interview" name="applicant-interview" options={Interviews} />
                      <SelectInput label="Interview Status" placeholder="Select Interview Status" id="applicant-interview-status" name="applicant-interview-status" options={InterviewStatus} />
                    </DividerContainer>
                  </div>
                  {/* Action buttons */}
                  <ActionButton ActionContent="Create" onClick={() => setOpen(false)} />
                </form>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
