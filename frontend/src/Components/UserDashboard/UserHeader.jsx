import React from 'react'

const UserHeader = ({ onMenuClick }) => {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white shadow relative">
      {/* Left: Hamburger for mobile */}
      <button
        className="md:hidden mr-4 p-2 rounded-full hover:bg-gray-100 transition"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-gray-900">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      {/* Brand */}
      <div className="text-2xl font-bold text-gray-900 font-display">     </div>
      {/* Right: Notification & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Button */}
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Notifications"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-gray-700">
            <path
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {/* User Profile Button */}
        <button
          className="w-10 h-10 rounded-full bg-lime-400 flex items-center justify-center text-gray-900 font-bold text-lg hover:bg-lime-500 transition"
          aria-label="User Profile"
        >
          <span>U</span>
        </button>
      </div>
    </header>
  )
}

export default UserHeader