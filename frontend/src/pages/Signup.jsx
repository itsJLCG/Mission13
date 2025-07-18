import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import cityImg from '../assets/logo.png'
import signupImg from '../assets/signup.png' // Using city.png for signup
import '../styles/Signup.css' // Using the new Signup.css file

const Signup = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Clear error when user starts typing
    if (error) setError('')
  }

  const validateForm = () => {
    if (!form.firstName.trim()) {
      setError('First name is required')
      return false
    }
    if (!form.lastName.trim()) {
      setError('Last name is required')
      return false
    }
    if (!form.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!form.password) {
      setError('Password is required')
      return false
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess('Account created successfully! Redirecting to login...')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setError(data.error || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('Network error. Please check your connection and try again.')
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
              <h1 className="form-title">Join Mission13</h1>
              <p className="form-subtitle">
                Create your account and start making a difference today.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="error-message" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)', color: '#4ade80' }}>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group" style={{ flexDirection: 'row', gap: '0.5rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="Enter your first name"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="form-input"
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Enter your last name"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  value={form.email}
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
                  placeholder="Password (min 6 characters)"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? (
                  <div className="loading-content">
                    <div className="spinner"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="signup-link">
              Already have an account?{' '}
              <Link to="/login" className="signup-link-text">
                Login
              </Link>
            </div>
          </div>

          <div className="login-visual-section">
            <div className="visual-content">
              <img src={signupImg} alt="Climate Action" className="hero-image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup