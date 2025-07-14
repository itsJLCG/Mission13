import React from 'react'
import heroVideo from '../../assets/hero-video.mp4'
import '../../styles/Hero.css'

const Hero = () => {
  return (
    <section className="hero-section">
      <video className="hero-video" autoPlay loop muted playsInline>
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="hero-overlay" />
      
      <div className="hero-content">
        <h1 className="hero-title">
          Take Climate Action
        </h1>
        <h2 className="hero-subtitle">
          with <em className="hero-emphasis">AI-Powered Challenges</em>
        </h2>
        <p className="hero-description">
          Join Mission13 and make a real impact through personalized daily eco-challenges.
        </p>
        <button className="hero-button">
          Get Started
        </button>
      </div>
    </section>
  )
}

export default Hero