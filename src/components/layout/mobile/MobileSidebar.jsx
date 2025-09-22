import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react'
import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react';


function MobileSidebar({ open, onClose, navigation, teams, logoSrc, brandName }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50 lg:hidden">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
      />

      <div className="fixed inset-0 flex">
        <DialogPanel
          transition
          className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
        >
          <TransitionChild>
            <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
              <button type="button" onClick={onClose} className="-m-2.5 p-2.5">
                <span className="sr-only">Close sidebar</span>
                <X aria-hidden="true" className="size-6 text-white" />
              </button>
            </div>
          </TransitionChild>

          <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
            <div className="relative flex h-16 shrink-0 items-center">
              <img alt={brandName} src={logoSrc} className="h-8 w-auto" />
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
                          onClick={onClose}
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
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:border-white/20 group-hover:text-white">
                              {team.initial}
                            </span>
                            <span className="truncate">{team.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : null}
              </ul>
            </nav>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default MobileSidebar
