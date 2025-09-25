// =============================================================================
// 404 Not Found Page - Error page for invalid routes
// CN: 404未找到页面 - 无效路由的错误页面
// =============================================================================
// This page is displayed when users navigate to non-existent routes,
// providing a friendly error message and navigation back to the main application.
// CN: 当用户导航到不存在的路由时显示此页面，提供友好的错误消息和返回主应用的导航。
// =============================================================================

/**
 * 404 Not Found page component
 * CN: 404未找到页面组件
 */
const NotFoundPage = () => (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
      {/* Error Code Display */}
      {/* CN: 错误代码显示 */}
      <h1 className="text-3xl font-semibold">404</h1>
      
      {/* Error Message */}
      {/* CN: 错误消息 */}
      <p className="text-base-content/70">We couldn&apos;t find the page you were looking for.</p>
      
      {/* Navigation Link Back to Dashboard */}
      {/* CN: 返回仪表板的导航链接 */}
      <a className="btn btn-primary" href="/">
        Back to Dashboard
      </a>
    </div>
  )

export default NotFoundPage