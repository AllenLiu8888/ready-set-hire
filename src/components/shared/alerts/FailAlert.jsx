// =============================================================================
// Fail Alert Component - Red error notification with dismiss functionality
// =============================================================================
// Displays error messages to users with a red color scheme and X icon,
// includes dismiss functionality for manual closure.
// =============================================================================

import { CircleX } from 'lucide-react';
import { X } from 'lucide-react'

/**
 * Fail alert component for error user feedback
 */
export default function FailAlert({ message, onClose }) {
  return (
    // Error alert container with red styling
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        {/* Error icon */}
        <div className="shrink-0">
          <CircleX aria-hidden="true" className="size-5 text-red-400" />
        </div>
        
        {/* Alert message content */}
        <div className="ml-3">
          <p className="text-sm font-medium text-red-800">{message}</p>
        </div>
        
        {/* Dismiss button */}
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={onClose} // Handle close action
              className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-red-50 focus-visible:outline-hidden"
            >
              <span className="sr-only">Dismiss</span>
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
