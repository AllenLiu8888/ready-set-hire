import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { CirclePlus } from 'lucide-react';
import { X } from 'lucide-react';
import TextInput from '../../components/form/TextInput';
import TextAreaInput from '../../components/form/TextAreaInput';
import SelectInput from '../../components/form/SelectInput';
import ActionButton from '../../components/form/ActionButton';
import DividerContainer from '../../components/form/DividerContainer';

export default function CreateInterviewDrawer() {
  const [open, setOpen] = useState(false)
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
          <CirclePlus className="w-4 h-4"/>  Add Interview
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
                          <DialogTitle className="text-3xl font-semibold text-gray-900">New Interview</DialogTitle>
                          <p className="text-base text-gray-500">
                            Get started by filling in the information below to create your new interview.
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
                      <TextInput label="Title" placeholder="Interview Title" type="text" id="interview-title" name="interview-title" />
                      <TextInput label="Job Role" placeholder="Interview Description" type="text" id="interview-job-role" name="interview-job-role" />
                      <TextAreaInput label="Description" placeholder="Interview Date" type="text" id="interview-description" name="interview-description" />
                      <SelectInput label="Status" placeholder="Select Interview Status" id="interview-status" name="interview-status" options={InterviewStatus} />
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
