// =============================================================================
// TextArea Input Component - Multi-line text input field
// =============================================================================
// Provides a consistent multi-line text input field with label and validation
// for longer text content like descriptions and comments.
// =============================================================================

/**
 * Reusable textarea component with consistent styling
 */
export default function TextAreaInput({ label, placeholder, id, name, required, value, onChange }) {
    return (
        <>
            <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                {/* TextArea Label */}
                {}
                <div>
                    <label htmlFor={id} className="block text-base/6 font-medium text-gray-900 sm:mt-1.5">
                    {label}{required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                </div>
                
                {/* TextArea Field */}
                {}
                <div className="sm:col-span-2">
                    <textarea
                    id={id}
                    name={name}
                    rows={3} // Default 3 rows for adequate space
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
                    value={value || ''} // Controlled input with fallback
                    onChange={onChange} // Value change handler
                    placeholder={placeholder}
                    required={required}
                    />
                </div>
            </div>
        </>
    )
}