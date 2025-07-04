import React, { useState } from 'react'

// Example SVG icons (replace with your own SVGs or images if desired)
const FacebookIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#b8f772"/>
    <path d="M15.5 8.5h-2V7.5c0-.4.3-.5.5-.5h1.5V5h-2c-1.1 0-2 .9-2 2v1.5H9v2h2V17h2.5v-6.5h1.7l.3-2z" fill="#020202"/>
  </svg>
)
const InstagramIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#b8f772"/>
    <g>
      <rect x="7" y="7" width="10" height="10" rx="3" stroke="#020202" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="2.5" stroke="#020202" strokeWidth="1.5"/>
      <circle cx="15.5" cy="8.5" r="0.7" fill="#020202"/>
    </g>
  </svg>
)
const EmailIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#b8f772"/>
    <path d="M6 8l6 5 6-5M6 8v8h12V8M6 8l6 5 6-5" stroke="#020202" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
)
const PhoneIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#b8f772"/>
    <path d="M8 9c.7 2.2 2.3 3.8 4.5 4.5l1.5-1.5c.2-.2.5-.2.7 0l2 2c.2.2.2.5 0 .7l-1 1c-.3.3-.7.4-1.1.3-2.8-.7-5-2.9-5.7-5.7-.1-.4 0-.8.3-1.1l1-1c.2-.2.5-.2.7 0l2 2c.2.2.2.5 0 .7L8 9z" stroke="#020202" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
)

const Feedback = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    // Handle form submission here
  }

  return (
    <section className="max-w-6xl mx-auto my-16 px-4">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@700&family=Nunito+Sans:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Left Side: Info */}
        <div className="w-full md:w-1/2 mb-10 md:mb-0">
          <h2
            className="text-4xl font-extrabold mb-4"
            style={{ fontFamily: 'Lexend Deca, sans-serif', color: '#020202' }}
          >
            Get in touch
          </h2>
          <p
            className="mb-6 text-base"
            style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#020202' }}
          >
            Use our contact form for all information requests or contact us directly using the contact information below. All information is treated with complete confidentiality and in accordance with our{' '}
            <a href="#" className="text-[#5f5fff] underline hover:no-underline">data protection statement</a>.
          </p>
          <div className="mb-2" style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#020202', fontSize: '15px' }}>
            Feel free to get in touch with us via email or phone:
          </div>
          {/* Vertical Contact List */}
          <div className="flex flex-col gap-3 mb-4 mt-2">
            <div className="flex items-center gap-2">
              <FacebookIcon />
              <span style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#020202', fontSize: '16px' }}>Mission13</span>
            </div>
            <div className="flex items-center gap-2">
              <InstagramIcon />
              <span style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#020202', fontSize: '16px' }}>@Mission13</span>
            </div>
            <div className="flex items-center gap-2">
              <EmailIcon />
              <span style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#020202', fontSize: '16px' }}>mission13.com</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon />
              <span style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#020202', fontSize: '16px' }}>09108273261</span>
            </div>
          </div>
        </div>
        {/* Right Side: Form */}
        <div className="w-full md:w-1/2">
          <form
            onSubmit={handleSubmit}
            className="bg-[#f1f3f0] rounded-xl shadow-lg p-8 flex flex-col gap-4"
            style={{ minWidth: 340 }}
          >
            <div className="flex gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                required
                className="flex-1 border border-gray-200 rounded-md px-4 py-3 text-base focus:outline-none focus:border-[#b8f772] transition"
                style={{ fontFamily: 'Nunito Sans, sans-serif', background: '#fff', color: '#020202' }}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                required
                className="flex-1 border border-gray-200 rounded-md px-4 py-3 text-base focus:outline-none focus:border-[#b8f772] transition"
                style={{ fontFamily: 'Nunito Sans, sans-serif', background: '#fff', color: '#020202' }}
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded-md px-4 py-3 text-base focus:outline-none focus:border-[#b8f772] transition"
              style={{ fontFamily: 'Nunito Sans, sans-serif', background: '#fff', color: '#020202' }}
            />
            <textarea
              name="message"
              placeholder="Message"
              rows={3}
              value={form.message}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded-md px-4 py-3 text-base focus:outline-none focus:border-[#b8f772] transition resize-none"
              style={{ fontFamily: 'Nunito Sans, sans-serif', background: '#fff', color: '#020202' }}
            />
            <button
              type="submit"
              className="bg-[#b8f772] hover:bg-[#020202] hover:text-white text-[#020202] font-semibold px-8 py-3 rounded transition text-base mt-2"
              style={{ fontFamily: 'Lexend Deca, sans-serif', minWidth: 120 }}
            >
              Submit
            </button>
            {submitted && (
              <div className="mt-4 bg-[#b8f772] text-[#020202] p-4 rounded-xl shadow text-center font-semibold">
                Thank you for your feedback!
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
              By clicking Submit, you agree that Mission13 processes your personal data as required for this information request. You have read the <a href="#" className="text-[#5f5fff] underline hover:no-underline">data protection statement</a>.
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Feedback