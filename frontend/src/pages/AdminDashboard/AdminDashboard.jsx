import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from '../../Components/Admin/sidebar'
import Header from '../../Components/Admin/header'
import Footer from '../../Components/Admin/Footer'
import Overview from './Overview'
import EcoChallenges from './EcoChallenges'
import ChatbotManagement from './ChatbotManagement'
import GameManagement from './GameManagement'
import UserManagement from './UserManagement'
import ReportsInsights from './ReportsInsights'

const SIDEBAR_WIDTH = 250 // Match your Sidebar.jsx width
const HEADER_HEIGHT = 70

const AdminDashboard = () => (
  <div
    style={{
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden', // Prevent horizontal scroll
      background: '#f5f8f3dc', // Light greenish background
      position: 'relative',
      fontFamily: 'Poppins, sans-serif',
    }}
  >
    <Sidebar />
    <Header />
    <main
      style={{
        marginLeft: SIDEBAR_WIDTH,
        marginTop: HEADER_HEIGHT,
        padding: '2.5rem 2.5rem 1.5rem 2.5rem',
        minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
        background: '#f5f8f3',
        overflowX: 'hidden', // Prevent horizontal scroll
        boxSizing: 'border-box',
        transition: 'margin 0.3s',
      }}
    >
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="challenges/*" element={<EcoChallenges />} />
        <Route path="chatbot/*" element={<ChatbotManagement />} />
        <Route path="game/*" element={<GameManagement />} />
        <Route path="users/*" element={<UserManagement />} />
        <Route path="reports/*" element={<ReportsInsights />} />
      </Routes>
    </main>
    <div style={{
      marginLeft: SIDEBAR_WIDTH,
      width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
      background: '#f5f8f3',
    }}>
      <Footer />
    </div>
  </div>
)

export default AdminDashboard