// =============================================================================
// Action Button Component - Form submit and cancel button pair
// CN: 操作按钮组件 - 表单提交和取消按钮对
// =============================================================================
// Provides a consistent button layout for form actions with cancel and submit
// buttons, commonly used in modal forms and dialogs.
// CN: 为表单操作提供一致的按钮布局，包含取消和提交按钮，常用于模态表单和对话框。
// =============================================================================

/**
 * Action button component for form submission and cancellation
 * CN: 用于表单提交和取消的操作按钮组件
 */
export default function ActionButton({ ActionContent, onClick }) {
    return (
        <>
            {/* Action Buttons Container */}
            {/* CN: 操作按钮容器 */}
            <div className="shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex justify-end space-x-3">
                    {/* Cancel Button */}
                    {/* CN: 取消按钮 */}
                    <button
                        type="button"
                        onClick={onClick} // Handle cancel action
                        // CN: 处理取消操作
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    
                    {/* Submit Button */}
                    {/* CN: 提交按钮 */}
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {ActionContent} {/* Dynamic submit button text */}
                        {/* CN: 动态提交按钮文本 */}
                    </button>
                </div>
            </div>
        </>
    )
}