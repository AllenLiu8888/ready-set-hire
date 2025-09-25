// =============================================================================
// Application Layout Component - Main admin interface structure
// CN: 应用布局组件 - 主管理界面结构
// =============================================================================
// This layout component provides the main admin interface structure with sidebar
// navigation, header, and content area for all management pages.
// CN: 该布局组件为所有管理页面提供主管理界面结构，包含侧边栏导航、头部和内容区域。
// =============================================================================
// Based on Tailwind CSS Plus official sidebar template, adapted for ReadySetHire routing.
// Global layout elements like branding, navigation, and color schemes can be adjusted here.
// CN: 基于 Tailwind CSS Plus 官方侧边栏模板，适配 ReadySetHire 路由。
// 可在此统一调整品牌、导航、配色等全局布局元素。
// =============================================================================

'use client'

import DesktopSidebar from './DesktopSidebar.jsx'
import { Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  MessagesSquare,
  User,
  CircleQuestionMark,
} from 'lucide-react'
  
const navigation = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
  { name: 'Interviews', to: '/interviews', icon: MessagesSquare },
  { name: 'Questions', to: '/questions', icon: CircleQuestionMark },
  { name: 'Applicants', to: '/applicants', icon: User },
]

const logoSrc = 'https://res.cloudinary.com/dd9dbngmy/image/upload/v1758671675/Ready_Set_Hire_wqmsvk.svg'
const profile = {
  name: 'Yikai Liu',
  avatarSrc:
    'https://res.cloudinary.com/dd9dbngmy/image/upload/v1758680049/my-notion-face-portrait_laqgje.png',
}

export default function AppLayout() {
  return (
    <>
      <div>
        {/* Sidebar (desktop only): fixed 18rem width. Keep main content padded left by 18rem (pl-72). */}
        {/* CN: 桌面侧边栏：固定 18rem 宽度。主内容需通过 pl-72 预留空间 */}
        <DesktopSidebar navigation={navigation} logoSrc={logoSrc} profile={profile} />

        {/* Right content area (Header + Main) */}
        {/* CN: 右侧内容区（Header + Main） */}
        <main className="py-10 pl-72">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  )
}
