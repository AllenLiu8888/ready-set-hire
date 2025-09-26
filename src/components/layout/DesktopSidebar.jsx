// =============================================================================
// Desktop Sidebar Component - Fixed navigation sidebar for desktop layout
// =============================================================================
// Provides the main navigation sidebar for desktop screens, including brand logo,
// navigation items, and profile section with responsive styling.
// =============================================================================

import { NavLink } from 'react-router-dom'

/**
 * Desktop-only sidebar component for main navigation
 * Shows brand, primary navigation, and a fixed profile link.
 */
function DesktopSidebar({ navigation, logoSrc, profile }) {
  return (
    <div className="fixed inset-y-0 z-50 flex w-72 flex-col bg-neutral-700">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6">
        <div className="flex h-16 shrink-0 items-center">
          <img alt={profile?.companyAlt ?? 'Your Company'} src={logoSrc} className="pt-2 h-8 w-auto" />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        [
                          'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                          isActive ? 'bg-white/5 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                        ].join(' ')
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon
                            aria-hidden="true"
                            className={[
                              'size-6 shrink-0',
                              isActive ? 'text-white' : 'text-gray-400 group-hover:text-white',
                            ].join(' ')}
                          />
                          {item.name}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
            {/* Removed teams section for desktop-only simplified layout */}
            <li className="-mx-6 mt-auto">
              <a
                href={profile?.href ?? '#'}
                className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-white/5"
              >
                <img
                  alt=""
                  src={profile?.avatarSrc}
                  className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                />
                <span className="sr-only">Your profile</span>
                <span aria-hidden="true">{profile?.name ?? 'Tom Cook'}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default DesktopSidebar
