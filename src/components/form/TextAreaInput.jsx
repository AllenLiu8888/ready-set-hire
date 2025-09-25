// =============================================================================
// TextArea Input Component - Multi-line text input field
// CN: 文本区域输入组件 - 多行文本输入字段
// =============================================================================
// Provides a consistent multi-line text input field with label and validation
// for longer text content like descriptions and comments.
// CN: 为描述和评论等较长文本内容提供一致的多行文本输入字段，包含标签和验证。
// =============================================================================

/**
 * Reusable textarea component with consistent styling
 * CN: 具有一致样式的可复用文本区域组件
 */
export default function TextAreaInput({ label, placeholder, id, name, required, value, onChange }) {
    return (
        <>
            <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                {/* TextArea Label */}
                {/* CN: 文本区域标签 */}
                <div>
                    <label htmlFor={id} className="block text-base/6 font-medium text-gray-900 sm:mt-1.5">
                    {label}{required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                </div>
                
                {/* TextArea Field */}
                {/* CN: 文本区域字段 */}
                <div className="sm:col-span-2">
                    <textarea
                    id={id}
                    name={name}
                    rows={3} // Default 3 rows for adequate space
                    // CN: 默认3行以提供足够空间
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
                    value={value || ''} // Controlled input with fallback
                    // CN: 带回退的受控输入
                    onChange={onChange} // Value change handler
                    // CN: 值变化处理器
                    placeholder={placeholder}
                    required={required}
                    />
                </div>
            </div>
        </>
    )
}