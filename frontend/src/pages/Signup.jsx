import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import cityImg from '../assets/city.png'

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
    <div className="min-h-screen flex items-center justify-center bg-[#f1f3f0] relative">
      {/* Mission13 Logo Top Left */}
      <div
        className="absolute z-10 flex items-center gap-2 top-6 left-8"
        style={{ fontFamily: 'Lexend Deca, sans-serif' }}
      >
        <span className="inline-block w-3 h-3 bg-[#b8f772] rounded-full"></span>
        <span className="text-[#020202] text-xl font-bold">Mission13</span>
      </div>
      {/* Back Button Top Right */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 right-8 text-[#020202] hover:text-[#b8f772] transition z-10"
        aria-label="Back"
        style={{ fontFamily: 'Lexend Deca, sans-serif' }}
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden border border-[#b8f772]">
        {/* Left Side: Signup Form */}
        <div className="md:w-1/2 flex flex-col justify-center px-8 py-12 bg-[#f1f3f0]">
          <h2
            className="text-3xl font-extrabold mb-2 text-[#020202]"
            style={{ fontFamily: 'Lexend Deca, sans-serif' }}
          >
            Join Mission13
          </h2>
          <p
            className="mb-8 text-[#020202]"
            style={{ fontFamily: 'Nunito Sans, sans-serif' }}
          >
            Create your account and start making a difference today.
          </p>

          {/* Error Message */}
          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 border border-green-400 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-1/2 border border-[#b8f772] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#b8f772] bg-white text-[#020202] disabled:opacity-50"
                style={{ fontFamily: 'Nunito Sans, sans-serif' }}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-1/2 border border-[#b8f772] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#b8f772] bg-white text-[#020202] disabled:opacity-50"
                style={{ fontFamily: 'Nunito Sans, sans-serif' }}
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="border border-[#b8f772] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#b8f772] bg-white text-[#020202] disabled:opacity-50"
              style={{ fontFamily: 'Nunito Sans, sans-serif' }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="border border-[#b8f772] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#b8f772] bg-white text-[#020202] disabled:opacity-50"
              style={{ fontFamily: 'Nunito Sans, sans-serif' }}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              className="border border-[#b8f772] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#b8f772] bg-white text-[#020202] disabled:opacity-50"
              style={{ fontFamily: 'Nunito Sans, sans-serif' }}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#b8f772] hover:bg-[#020202] hover:text-[#f1f3f0] text-[#020202] font-bold rounded-lg transition shadow mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Lexend Deca, sans-serif' }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-current rounded-full border-t-transparent animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          <div className="mt-6 text-center text-[#020202] text-sm" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-[#b8f772] font-semibold hover:underline">
              Login
            </Link>
          </div>
        </div>
        {/* Right Side: Image and Description */}
        <div className="md:w-1/2 bg-[#b8f772] flex flex-col justify-between items-center py-10 px-6 relative">
          <img src={cityImg} alt="City" className="w-64 mx-auto mb-8 drop-shadow-xl rounded-xl border-4 border-[#f1f3f0]" />
          <div className="text-center text-[#020202] mt-8">
            <div className="mb-2 font-semibold" style={{ fontFamily: 'Lexend Deca, sans-serif' }}>
              Join Mission13's climate movement
            </div>
            <div className="text-xs opacity-80" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
              Every daily challenge builds a cleaner, more sustainable tomorrow
            </div>
          </div>
        </div>
      </div>
      {/* Extra hover and design styles */}
      <style>
        {`
          .border-[#b8f772]:hover, .bg-[#b8f772]:hover {
            box-shadow: 0 0 0 4px #b8f77244;
          }
          input:focus {
            outline: none;
            border-color: #b8f772;
            box-shadow: 0 0 0 2px #b8f77255;
          }
          button[type="submit"]:hover:not(:disabled) {
            background: #020202 !important;
            color: #f1f3f0 !important;
            border: 1.5px solid #b8f772;
          }
        `}
      </style>
    </div>
  )
}

export default Signup