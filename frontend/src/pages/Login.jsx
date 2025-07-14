import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import cityImg from '../assets/logo.png'
import loginGif from '../assets/login.png'
import '../styles/Login.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get the page user was trying to access before login
  const from = location.state?.from?.pathname || '/dashboard'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Make API call to backend login endpoint
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Login successful - use auth context login
        const loginSuccess = login(data.user)
        
        if (loginSuccess) {
          console.log('Login successful:', data.user)
          // Redirect to intended page or dashboard
          navigate(from, { replace: true })
        } else {
          setError('Login failed. Please try again.')
        }
      } else {
        // Handle different error responses
        setError(data.message || 'Invalid email or password. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Unable to connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="mesh-overlay"></div>
      
      {/* Header */}
      <header className="login-header">
        <div className="logo-section">
          <img src={cityImg} alt="Logo" className="logo" />
        </div>
        <button
          onClick={() => navigate('/')}
          className="back-button"
          aria-label="Back to home"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      </header>

      {/* Main Content */}
      <div className="login-content">
        <div className="login-card glass-card">
          <div className="login-form-section">
            <div className="form-header">
              <h1 className="form-title">Welcome Back!</h1>
              <p className="form-subtitle">
                Log in to continue your climate action journey with Mission13.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="form-input"
                />
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="#" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? (
                  <div className="loading-content">
                    <div className="spinner"></div>
                    Logging in...
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <div className="signup-link">
              Don't have an account?{' '}
              <Link to="/signup" className="signup-link-text">
                Sign up
              </Link>
            </div>
          </div>

          <div className="login-visual-section">
            <div className="visual-content">
              <img src={loginGif} alt="Climate Action" className="hero-image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login