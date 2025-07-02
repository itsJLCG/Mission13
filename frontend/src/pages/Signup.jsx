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
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle signup logic here
    alert('Signup submitted!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f3f0] relative">
      {/* Mission13 Logo Top Left */}
      <div
        className="absolute top-6 left-8 flex items-center gap-2 z-10"
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-1/2 border border-[#b8f772] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#b8f772] bg-white text-[#020202]"
                style={{ fontFamily: 'Nunito Sans, sans-serif' }}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-1/2 border border-[#b8f772] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#b8f772] bg-white text-[#020202]"
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
              className="border border-[#b8f772] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#b8f772] bg-white text-[#020202]"
              style={{ fontFamily: 'Nunito Sans, sans-serif' }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="border border-[#b8f772] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#b8f772] bg-white text-[#020202]"
              style={{ fontFamily: 'Nunito Sans, sans-serif' }}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="border border-[#b8f772] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#b8f772] bg-white text-[#020202]"
              style={{ fontFamily: 'Nunito Sans, sans-serif' }}
            />
            <button
              type="submit"
              className="w-full py-3 bg-[#b8f772] hover:bg-[#020202] hover:text-[#f1f3f0] text-[#020202] font-bold rounded-lg transition shadow mt-2"
              style={{ fontFamily: 'Lexend Deca, sans-serif' }}
            >
              Create Account
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
            <div className="font-semibold mb-2" style={{ fontFamily: 'Lexend Deca, sans-serif' }}>
              Join Mission13’s climate movement
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
          button[type="submit"]:hover {
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