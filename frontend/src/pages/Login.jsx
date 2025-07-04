import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import cityImg from '../assets/city.png'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle login logic here
    alert('Login submitted!')
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
        {/* Left Side */}
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
        {/* Right Side */}
        <div className="md:w-1/2 flex flex-col justify-center px-8 py-12 relative bg-[#f1f3f0]">
          <h2
            className="text-3xl font-extrabold mb-2 text-[#020202]"
            style={{ fontFamily: 'Lexend Deca, sans-serif' }}
          >
            Welcome Back!
          </h2>
          <p
            className="mb-8 text-[#020202]"
            style={{ fontFamily: 'Nunito Sans, sans-serif' }}
          >
            Log in to continue your climate action journey with Mission13.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                className="block mb-1 text-[#020202] font-semibold text-sm"
                htmlFor="email"
                style={{ fontFamily: 'Nunito Sans, sans-serif' }}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#b8f772] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8f772] transition bg-white text-[#020202]"
                style={{ fontFamily: 'Nunito Sans, sans-serif' }}
              />
            </div>
            <div>
              <label
                className="block mb-1 text-[#020202] font-semibold text-sm"
                htmlFor="password"
                style={{ fontFamily: 'Nunito Sans, sans-serif' }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#b8f772] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8f772] transition bg-white text-[#020202]"
                style={{ fontFamily: 'Nunito Sans, sans-serif' }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2" style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#020202' }}>
                <input type="checkbox" className="accent-[#b8f772]" />
                <span>Remember me</span>
              </label>
              <Link to="#" className="text-[#b8f772] hover:underline font-semibold" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#b8f772] hover:bg-[#020202] hover:text-[#f1f3f0] text-[#020202] font-bold rounded-lg transition shadow mt-2"
              style={{ fontFamily: 'Lexend Deca, sans-serif' }}
            >
              Login
            </button>
          </form>
          <div className="mt-6 text-center text-[#020202] text-sm" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-[#b8f772] font-semibold hover:underline">
              Sign up
            </Link>
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

export default Login