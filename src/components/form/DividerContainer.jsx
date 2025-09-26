// =============================================================================
// Divider Container Component - Form section wrapper with visual separation
// =============================================================================
// Provides consistent spacing and visual dividers between form sections,
// creating a structured layout for complex forms.
// =============================================================================

/**
 * Container component that adds dividers and spacing between form sections
 */
export default function DividerContainer({children}) {
    return (
        <>
            {/* Form sections container with responsive spacing and dividers */}
            {}
            <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                {children} {/* Nested form sections */}
                {}
            </div>
        </>
    )
}