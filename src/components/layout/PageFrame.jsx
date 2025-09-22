import { Outlet } from 'react-router-dom'
import Header from '../header/header.jsx'

function PageFrame() {

  return (
    <div className="flex min-h-[60vh] flex-col gap-6">
      <header className="space-y-1">
        <Header />
      </header>

      <section className="flex-1">
        <Outlet />
      </section>
    </div>
  )
}

export default PageFrame
