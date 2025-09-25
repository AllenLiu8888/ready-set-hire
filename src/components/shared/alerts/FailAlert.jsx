// =============================================================================
// Fail Alert Component - Red error notification with dismiss functionality
// CN: 失败提醒组件 - 带关闭功能的红色错误通知
// =============================================================================
// Displays error messages to users with a red color scheme and X icon,
// includes dismiss functionality for manual closure.
// CN: 向用户显示错误消息，采用红色配色和X图标，包含手动关闭功能。
// =============================================================================

import { CircleX } from 'lucide-react';
import { X } from 'lucide-react'

/**
 * Fail alert component for error user feedback
 * CN: 用于错误用户反馈的失败提醒组件
 */
export default function FailAlert({ message, onClose }) {
  return (
    // Error alert container with red styling
    // CN: 带红色样式的错误提醒容器
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        {/* Error icon */}
        {/* CN: 错误图标 */}
        <div className="shrink-0">
          <CircleX aria-hidden="true" className="size-5 text-red-400" />
        </div>
        
        {/* Alert message content */}
        {/* CN: 提醒消息内容 */}
        <div className="ml-3">
          <p className="text-sm font-medium text-red-800">{message}</p>
        </div>
        
        {/* Dismiss button */}
        {/* CN: 关闭按钮 */}
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={onClose} // Handle close action
              // CN: 处理关闭操作
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
