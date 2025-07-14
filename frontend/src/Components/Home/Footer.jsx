import React from 'react'
import '../../styles/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-name">
              Mission13
            </div>
            <p className="brand-description">
              Empowering individuals to take meaningful climate action through AI-powered challenges and community engagement.
            </p>
          </div>

          <div className="footer-links">
            <h3 className="footer-section-title">
              Quick Links
            </h3>
            <div className="links-list">
              <a href="#" className="footer-link">Home</a>
              <a href="#" className="footer-link">Features</a>
              <a href="#" className="footer-link">How It Works</a>
              <a href="#" className="footer-link">Our Team</a>
            </div>
          </div>

          <div className="footer-contact">
            <h3 className="footer-section-title">
              Connect With Us
            </h3>
            <div className="contact-info">
              <a href="mailto:hello@mission13.com" className="footer-link">
                hello@mission13.com
              </a>
              <a href="tel:+639108273261" className="footer-link">
                +63 910 827 3261
              </a>
              <div className="social-links">
                <a href="#" className="social-link">Facebook</a>
                <a href="#" className="social-link">Instagram</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              &copy; {new Date().getFullYear()} Mission13. All rights reserved.
            </div>
            <div className="legal-links">
              <a href="#" className="footer-link legal-link">Privacy Policy</a>
              <a href="#" className="footer-link legal-link">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer