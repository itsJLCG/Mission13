import React from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z"/>
      </svg>
    )
  },
  { name: 'Games', path: '/games', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 17a4 4 0 100-8 4 4 0 000 8zM7 7a4 4 0 100-8 4 4 0 000 8zm0 10a4 4 0 100-8 4 4 0 000 8zm10 0a4 4 0 100-8 4 4 0 000 8z"/>
      </svg>
    )
  },
  { name: 'Chatbot', path: '/chatbot', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 22c4.418 0 8-3.134 8-7V7a8 8 0 10-16 0v8c0 3.866 3.582 7 8 7z"/>
        <circle cx="8" cy="11" r="1.5" fill="currentColor"/>
        <circle cx="16" cy="11" r="1.5" fill="currentColor"/>
      </svg>
    )
  },
]

const Sidebar = ({ open, setOpen }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/30 z-30 transition-opacity md:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <aside
        className={`
          bg-[#204d36] text-white w-64 min-h-screen flex flex-col py-8 px-4
          fixed z-40 top-0 left-0 transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 md:z-20
        `}
      >
        <div className="mb-10 text-2xl font-bold font-display text-lime-400 px-2">
          Mission13
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map(item => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition 
                ${isActive ? 'bg-lime-400 text-[#204d36]' : 'hover:bg-lime-600/30'}`
              }
              onClick={() => setOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar