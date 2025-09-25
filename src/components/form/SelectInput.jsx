import { ChevronDown } from 'lucide-react';

export default function SelectInput({ label, placeholder, id, name, options }) {
    return (
        <>
          {/* Status */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
              <div >
                <label htmlFor="project-name" className="block text-base/6 font-medium text-gray-900 sm:mt-1.5">
                  {label}
                </label>
              </div>
              <div className="mt-2 sm:col-span-2 relative">
                <select
                  id={id}
                  name={name}
                  autoComplete={name}
                  className="block w-full appearance-none rounded-md bg-white py-1.5 pr-10 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                >
                  <option>{placeholder}</option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-gray-500 sm:size-4"
                />
              </div>
            </div>
        </>
    )
}