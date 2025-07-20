import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Dashboard as DashboardIcon,
  Nature as NatureIcon,
  Chat as ChatIcon,
  SportsEsports as SportsEsportsIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material'
import Logo from '../../assets/logo.png'
import '../../../src/styles/admin/AdminSidebar.css'

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Eco-Challenges', icon: <NatureIcon />, path: '/admin/challenges' },
  { text: 'Chatbot Management', icon: <ChatIcon />, path: '/admin/chatbot' },
  { text: 'Game Management', icon: <SportsEsportsIcon />, path: '/admin/game' },
  { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  { text: 'Reports', icon: <BarChartIcon />, path: '/admin/reports' },
]

const Sidebar = () => {
  const location = useLocation()

  return (
    <div className="admin-sidebar">
      {/* Header Section */}
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-logo">
          <div className="admin-logo-icon">
            <img src={Logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="admin-logo-text">Mission 13</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar-nav">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.text}
              to={item.path}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="admin-nav-content">
                <div className="admin-nav-icon">{item.icon}</div>
                <span className="admin-nav-text">{item.text}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer/Logout */}
      <div className="admin-sidebar-footer">
        <button className="admin-logout-btn">
          <div className="admin-nav-icon">
            <ExitToAppIcon />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
