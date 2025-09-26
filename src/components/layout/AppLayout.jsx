// =============================================================================
// Application Layout Component - Main admin interface structure
// =============================================================================
// This layout component provides the main admin interface structure with sidebar
// navigation, header, and content area for all management pages.
// =============================================================================
// Based on Tailwind CSS Plus official sidebar template, adapted for ReadySetHire routing.
// Global layout elements like branding, navigation, and color schemes can be adjusted here.
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
        <DesktopSidebar navigation={navigation} logoSrc={logoSrc} profile={profile} />

        {/* Right content area (Header + Main) */}
        <main className="py-10 pl-72">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  )
}
