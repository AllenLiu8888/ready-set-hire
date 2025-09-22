import { TextAlignJustify } from 'lucide-react';

function MobileTopBar({ onOpen, title, profile }) {
  return (
    <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
      <button type="button" onClick={onOpen} className="-m-2.5 p-2.5 text-gray-400 hover:text-white lg:hidden">
        <span className="sr-only">Open sidebar</span>
        <TextAlignJustify aria-hidden="true" className="size-6" />
      </button>
      <div className="flex-1 text-sm/6 font-semibold text-white">{title}</div>
      <a href={profile?.href ?? '#'}>
        <span className="sr-only">Your profile</span>
        <img
          alt=""
          src={profile?.avatarSrc}
          className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
        />
      </a>
    </div>
  )
}

export default MobileTopBar
