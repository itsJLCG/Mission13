import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication status on app load
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      const userData = localStorage.getItem('user')
      const sessionData = localStorage.getItem('user_session')
      
      if (userData && sessionData) {
        const user = JSON.parse(userData)
        const session = JSON.parse(sessionData)
        
        // Check if session is valid
        if (session.isLoggedIn && (!session.expiresAt || new Date() < new Date(session.expiresAt))) {
          setUser(user)
        } else {
          // Session expired
          logout()
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = (userData) => {
    try {
      // Create session with expiration (24 hours)
      const session = {
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      }
      
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('user_session', JSON.stringify(session))
      setUser(userData)
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('user_session')
    localStorage.removeItem('user_streak')
    localStorage.removeItem('challenge-history')
    localStorage.removeItem('user_settings')
    setUser(null)
  }

  const isAuthenticated = () => {
    return !!user
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}