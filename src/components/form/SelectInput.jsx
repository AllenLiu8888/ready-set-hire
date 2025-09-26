// =============================================================================
// Select Input Component - Dropdown selection field
// =============================================================================
// Provides a consistent dropdown select field with label, options, and validation
// for use in forms requiring selection from predefined options.
// =============================================================================

import { ChevronDown } from 'lucide-react';

/**
 * Reusable select dropdown component with consistent styling
 */
export default function SelectInput({ label, placeholder, id, name, options, required, value, onChange }) {
    return (
        <>
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
              {/* Select Label */}
              {}
              <div >
                <label htmlFor={id} className="block text-base/6 font-medium text-gray-900 sm:mt-1.5">
                  {label}{required && <span className="text-red-400 ml-1">*</span>}
                </label>
              </div>
              
              {/* Select Field Container */}
              {}
              <div className="mt-2 sm:col-span-2 relative">
                <select
                  id={id}
                  name={name}
                  autoComplete={name}
                  value={value || ''} // Controlled select with fallback
                  onChange={(e) => onChange(e.target.value)} // Value change handler
                  className="block w-full appearance-none rounded-md bg-white py-1.5 pr-10 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  required={required}
                >
                  {/* Placeholder option */}
                  {}
                  {placeholder && <option value="" disabled>{placeholder}</option>}
                  
                  {/* Dynamic options from props */}
                  {}
                  {options && options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                
                {/* Dropdown indicator icon */}
                {}
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-gray-500 sm:size-4"
                />
              </div>
            </div>
        </>
    )
}