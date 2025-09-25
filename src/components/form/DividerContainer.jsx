export default function DividerContainer({children}) {
    return (
        <>
            <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                {children}
            </div>
        </>

    )
}