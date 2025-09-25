// =============================================================================
// Text Input Component - Reusable form input field
// CN: 文本输入组件 - 可复用的表单输入字段
// =============================================================================
// Provides a consistent text input field with label, validation, and styling
// for use across all forms in the application.
// CN: 为应用程序中的所有表单提供一致的文本输入字段，包含标签、验证和样式。
// =============================================================================

/**
 * Reusable text input component with consistent styling
 * CN: 具有一致样式的可复用文本输入组件
 */
export default function TextInput({ label, placeholder, type, id, name, required, value, onChange }) {
    return (
        <>
            <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                {/* Input Label */}
                {/* CN: 输入标签 */}
                <div>
                    <label htmlFor={id} className="block text-base/6 font-medium text-gray-900 sm:mt-1.5">
                        {label}{required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                </div>
                
                {/* Input Field */}
                {/* CN: 输入字段 */}
                <div className="sm:col-span-2">
                <input
                    id={id}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value || ''} // Controlled input with fallback to empty string
                    // CN: 受控输入，回退到空字符串
                    onChange={onChange} // Event handler for value changes
                    // CN: 值变化的事件处理器
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
                    required={required}
                />
                </div>
            </div>
        </>
    )
}