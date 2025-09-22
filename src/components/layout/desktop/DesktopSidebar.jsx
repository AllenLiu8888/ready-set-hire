import { NavLink } from 'react-router-dom'

function DesktopSidebar({ navigation, teams, logoSrc, profile }) {
  return (
    <div className="hidden bg-gray-900 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6">
        <div className="flex h-16 shrink-0 items-center">
          <img alt={profile?.companyAlt ?? 'Your Company'} src={logoSrc} className="h-8 w-auto" />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
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
            {teams?.length ? (
              <li>
                <div className="text-xs/6 font-semibold text-gray-400">Your teams</div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {teams.map((team) => (
                    <li key={team.name}>
                      <a
                        href={team.href}
                        className="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-white/5 hover:text-white"
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                          {team.initial}
                        </span>
                        <span className="truncate">{team.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : null}
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
