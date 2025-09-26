// =============================================================================
// Action Button Component - Form submit and cancel button pair
// =============================================================================
// Provides a consistent button layout for form actions with cancel and submit
// buttons, commonly used in modal forms and dialogs.
// =============================================================================

/**
 * Action button component for form submission and cancellation
 */
export default function ActionButton({ ActionContent, onClick }) {
    return (
        <>
            {/* Action Buttons Container */}
            <div className="shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex justify-end space-x-3">
                    {/* Cancel Button */}
                    <button
                        type="button"
                        onClick={onClick} // Handle cancel action
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {ActionContent} {/* Dynamic submit button text */}
                    </button>
                </div>
            </div>
        </>
    )
}