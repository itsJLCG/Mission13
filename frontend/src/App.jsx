import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import UserDashboard from './pages/UserDashboard'
import Game from './pages/Game'
import Chatbot from './pages/Chatbot'
import UserProfile from './pages/UserProfile'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard' // <-- Add this import


// Layout for conditional header/footer if needed in the future
function Layout({ children }) {
  const location = useLocation()
  const hideHeader = location.pathname === '/login' || location.pathname === '/signup'
  // You can add a shared header/footer here if needed
  return <>{children}</>
}

const App = () => (
  <AuthProvider>
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          
          <Route path="/game" element={
            <ProtectedRoute>
              <Game />
            </ProtectedRoute>
          } />
          
          <Route path="/chatbot" element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          {/* Catch all route - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Layout>
    </Router>
  </AuthProvider>
)

export default App