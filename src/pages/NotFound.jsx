const NotFoundPage = () => (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-semibold">404</h1>
      <p className="text-base-content/70">We couldn&apos;t find the page you were looking for.</p>
      <a className="btn btn-primary" href="/">
        Back to Dashboard
      </a>
    </div>
  )

export default NotFoundPage