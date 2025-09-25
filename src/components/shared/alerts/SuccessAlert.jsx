// =============================================================================
// Success Alert Component - Green success notification with dismiss functionality
// CN: 成功提醒组件 - 带关闭功能的绿色成功通知
// =============================================================================
// Displays success messages to users with a green color scheme and checkmark icon,
// includes dismiss functionality for manual closure.
// CN: 向用户显示成功消息，采用绿色配色和勾选图标，包含手动关闭功能。
// =============================================================================

import { CircleCheck } from 'lucide-react';
import { X } from 'lucide-react'

/**
 * Success alert component for positive user feedback
 * CN: 用于积极用户反馈的成功提醒组件
 */
export default function SuccessAlert({ message, onClose }) {
  return (
    // Success alert container with green styling
    // CN: 带绿色样式的成功提醒容器
    <div className="rounded-md bg-green-50 p-4">
      <div className="flex">
        {/* Success icon */}
        {/* CN: 成功图标 */}
        <div className="shrink-0">
          <CircleCheck aria-hidden="true" className="size-5 text-green-400" />
        </div>
        
        {/* Alert message content */}
        {/* CN: 提醒消息内容 */}
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">{message}</p>
        </div>
        
        {/* Dismiss button */}
        {/* CN: 关闭按钮 */}
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={onClose} // Handle close action
              // CN: 处理关闭操作
              className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-green-50 focus-visible:outline-hidden"
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
