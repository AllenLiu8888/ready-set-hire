'use client'

// 布局组件基于 Tailwind CSS Plus 官方侧边栏模板，改造以匹配 ReadySetHire 路由。
// 在此文件即可统一调整品牌、导航、配色等全局布局元素。
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import DesktopSidebar from './desktop/DesktopSidebar.jsx'
import MobileSidebar from './mobile/MobileSidebar.jsx'
import MobileTopBar from './mobile/MobileTopBar.jsx'
import PageFrame from './PageFrame.jsx'

// 导航菜单：修改 name/to/icon 可更新左栏与移动端菜单；end 为 true 表示严格匹配首页。


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
// 团队列表：示例数据仅用于展示，可替换为真实团队分组或移除该模块。
const teams = []

const logoSrc = 'https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600'
const profile = {
  name: 'Tom Cook',
  avatarSrc:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

export default function Layout() {
  // sidebarOpen 控制移动端抽屉开关；activeNav/meta 控制移动端顶栏与页面头部信息。
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const activeNav = navigation.find((item) =>
    item.end ? item.to === location.pathname : location.pathname.startsWith(item.to),
  )


  return (
    <div>
      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={navigation}
        teams={teams}
        logoSrc={logoSrc}
        brandName="ReadySetHire"
      />

      {/* Desktop sidebar：宽度固定 18rem (lg:w-72)，若调整需同步修改主内容的 lg:pl-72。 */}
      <DesktopSidebar navigation={navigation} teams={teams} logoSrc={logoSrc} profile={profile} />

      {/* 移动端顶栏：显示当前页面标题，并提供按钮唤起抽屉。 */}
      <MobileTopBar
        onOpen={() => setSidebarOpen(true)}
        title={activeNav?.name ?? 'ReadySetHire'}
        profile={{ ...profile, href: '#' }}
      />

      <main className="py-10 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">
          <PageFrame />
        </div>
      </main>
    </div>
  )
}
