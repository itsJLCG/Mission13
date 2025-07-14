import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
// Import icons from react-icons
import { AiOutlineHome } from 'react-icons/ai'
import { MdOutlineEmojiEvents } from 'react-icons/md'
import { BsChatDots } from 'react-icons/bs'
import { IoGameControllerOutline } from 'react-icons/io5'
// Import your logo
import logo from '../../assets/logo.png' // Adjust the path and filename as needed

const navItems = [
  {
    name: 'Home',
    path: '/dashboard',
    icon: <AiOutlineHome className="w-6 h-6" />,
  },
  {
    name: 'Games',
    path: '/game',
    icon: <IoGameControllerOutline className="w-6 h-6" />,
  },
  {
    name: 'Chatbot',
    path: '/chatbot',
    icon: <BsChatDots className="w-6 h-6" />,
  },
]

export default function Sidebar({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-row">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-4 left-0 z-40 h-[calc(100vh-2rem)] bg-[#020202]
          flex flex-col items-center py-8
          transition-all duration-300
          ${open ? 'w-56 px-6' : 'w-20 px-3'}
          rounded-[40px] shadow-lg
          margin-left-4
          ${open ? 'ml-0' : 'ml-5'}
        `}
        style={{ borderRadius: '40px' }}
      >
        {/* Toggle Button */}
        <button
          className={`
            mb-8 p-2 rounded-full bg-white text-[#111c4e] shadow
            transition-transform duration-300
            ${open ? 'self-end' : 'self-center'}
          `}
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg
            className={`w-6 h-6 transform transition-transform duration-300 ${open ? '' : 'rotate-180'}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Logo/Avatar - Only show when open */}
        {open && (
          <div className="flex justify-center items-center mb-10 w-full transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg overflow-hidden">
              <img 
                src={logo} 
                alt="Logo" 
                className="w-18 h-18 object-contain"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-col gap-6 w-full items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `
                  group flex items-center gap-4 w-full
                  px-3 py-3 my-1 rounded-2xl transition-all duration-200
                  ${isActive
                    ? 'bg-white text-[#b8f772] shadow'
                    : 'text-gray-200 hover:bg-white hover:text-[#b8f772] hover:shadow-lg'}
                  ${open ? 'justify-start' : 'justify-center'}
                  relative
                `
              }
              title={!open ? item.name : undefined}
            >
              <span className="flex items-center justify-center">
                {item.icon}
              </span>
              {open && (
                <span className="font-semibold text-base">{item.name}</span>
              )}
              {/* Tooltip */}
              {!open && (
                <span className="absolute left-16 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content area */}
      <main
        className={`
          flex-1 transition-all duration-300
          ${open ? 'ml-56' : 'ml-20'}
          p-8
        `}
      >
        {children}
      </main>

      {/* Extra styles for icon glow/hover */}
      <style>
        {`
          .group:hover {
            box-shadow: 0 0 0 4px #fff3, 0 2px 8px #0004;
          }
        `}
      </style>
    </div>
  )
}