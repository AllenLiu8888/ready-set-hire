// =============================================================================
// Divider Container Component - Form section wrapper with visual separation
// CN: 分割容器组件 - 带视觉分离的表单区域包装器
// =============================================================================
// Provides consistent spacing and visual dividers between form sections,
// creating a structured layout for complex forms.
// CN: 为表单区域之间提供一致的间距和视觉分割，为复杂表单创建结构化布局。
// =============================================================================

/**
 * Container component that adds dividers and spacing between form sections
 * CN: 在表单区域之间添加分割线和间距的容器组件
 */
export default function DividerContainer({children}) {
    return (
        <>
            {/* Form sections container with responsive spacing and dividers */}
            {/* CN: 带响应式间距和分割线的表单区域容器 */}
            <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                {children} {/* Nested form sections */}
                {/* CN: 嵌套表单区域 */}
            </div>
        </>
    )
}