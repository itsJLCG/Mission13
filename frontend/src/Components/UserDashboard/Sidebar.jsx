
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
// Import icons from react-icons
import { MdDashboard, MdLogout } from 'react-icons/md'
import { BsChatDots } from 'react-icons/bs'
import { IoGameControllerOutline } from 'react-icons/io5'
// Import Sidebar CSS
import '../../styles/Sidebar.css'
// Import your logo
import logo from '../../assets/logo.png'

const navItems = [
  {
    name: 'Dashboard',
   path: '/dashboard',
    icon: <MdDashboard />,
  },
  {
    name: 'Games',
    path: '/game',
    icon: <IoGameControllerOutline />,
  },
  {
    name: 'Chatbot',
    path: '/chatbot',
    icon: <BsChatDots />,
  },
]

export default function Sidebar({ open, setOpen }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <>
      {/* Sidebar */}
      <aside className={`grass-sidebar ${open ? 'open' : ''}`}>
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="sidebar-logo" onClick={handleLogoClick}>
            <div className="logo-icon">
              <img src={logo} alt="Logo" />
            </div>
            <span className="logo-text">Mission13</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <div className="nav-content">
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon"><MdLogout /></span>
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}