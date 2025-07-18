import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    try {
      const userData = localStorage.getItem('user')
      const sessionData = localStorage.getItem('user_session')
      
      if (!userData || !sessionData) {
        return false
      }
      
      const user = JSON.parse(userData)
      const session = JSON.parse(sessionData)
      
      // Check if session is still valid
      if (!user.email || !session.isLoggedIn) {
        return false
      }
      
      // Optional: Check session expiration
      if (session.expiresAt && new Date() > new Date(session.expiresAt)) {
        // Session expired, clear data
        localStorage.removeItem('user')
        localStorage.removeItem('user_session')
        return false
      }
      
      return true
    } catch (error) {
      console.error('Authentication check failed:', error)
      return false
    }
  }

  if (!isAuthenticated()) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute