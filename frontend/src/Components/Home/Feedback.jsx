import React, { useState } from 'react'
import '../../styles/Feedback.css'

// SVG icons remain the same...
const FacebookIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#d8e84e"/>
    <path d="M15.5 8.5h-2V7.5c0-.4.3-.5.5-.5h1.5V5h-2c-1.1 0-2 .9-2 2v1.5H9v2h2V17h2.5v-6.5h1.7l.3-2z" fill="#092c25"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#d8e84e"/>
    <g>
      <rect x="7" y="7" width="10" height="10" rx="3" stroke="#092c25" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="2.5" stroke="#092c25" strokeWidth="1.5"/>
      <circle cx="15.5" cy="8.5" r="0.7" fill="#092c25"/>
    </g>
  </svg>
)

const EmailIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#d8e84e"/>
    <path d="M6 8l6 5 6-5M6 8v8h12V8M6 8l6 5 6-5" stroke="#092c25" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
)

const PhoneIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#d8e84e"/>
    <path d="M8 9c.7 2.2 2.3 3.8 4.5 4.5l1.5-1.5c.2-.2.5-.2.7 0l2 2c.2.2.2.5 0 .7l-1 1c-.3.3-.7.4-1.1.3-2.8-.7-5-2.9-5.7-5.7-.1-.4 0-.8.3-1.1l1-1c.2-.2.5-.2.7 0l2 2c.2.2.2.5 0 .7L8 9z" stroke="#092c25" strokeWidth="1.5" strokeLinejoin="round"/>
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
  }

  return (
    <section className="feedback-section">
      <div className="feedback-header">
        <h2 className="feedback-title">
          Get in Touch
        </h2>
        <p className="feedback-description">
          Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="feedback-content">
        <div className="feedback-contact">
          <div className="glass-contact-card">
            <h3 className="contact-title">
              Contact Information
            </h3>
            <p className="contact-description">
              Ready to start your climate action journey? Connect with us through any of these channels.
            </p>
            
            <div className="contact-list">
              <div className="contact-item">
                <FacebookIcon />
                <span className="contact-text">Mission13</span>
              </div>
              <div className="contact-item">
                <InstagramIcon />
                <span className="contact-text">@Mission13</span>
              </div>
              <div className="contact-item">
                <EmailIcon />
                <span className="contact-text">hello@mission13.com</span>
              </div>
              <div className="contact-item">
                <PhoneIcon />
                <span className="contact-text">+63 910 827 3261</span>
              </div>
            </div>
          </div>
        </div>

        <div className="feedback-form-container">
          <div className="glass-form-card">
            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="form-row">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
                className="form-input"
              />
              <textarea
                name="message"
                placeholder="Your message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
                className="form-input form-textarea"
              />
              <button type="submit" className="submit-button">
                Send Message
              </button>
              {submitted && (
                <div className="success-message">
                  <p>Thank you for your message! We'll get back to you soon.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Feedback