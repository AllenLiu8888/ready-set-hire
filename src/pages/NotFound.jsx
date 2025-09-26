// =============================================================================
// 404 Not Found Page - Error page for invalid routes
// =============================================================================
// This page is displayed when users navigate to non-existent routes,
// providing a friendly error message and navigation back to the main application.
// =============================================================================

/**
 * 404 Not Found page component
 */
const NotFoundPage = () => (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
      {/* Error Code Display */}
      {}
      <h1 className="text-3xl font-semibold">404</h1>
      
      {/* Error Message */}
      {}
      <p className="text-base-content/70">We couldn&apos;t find the page you were looking for.</p>
      
      {/* Navigation Link Back to Dashboard */}
      {}
      <a className="btn btn-primary" href="/">
        Back to Dashboard
      </a>
    </div>
  )

export default NotFoundPage