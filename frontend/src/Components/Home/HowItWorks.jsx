import React, { useRef, useEffect } from 'react'
import illustration from '../../assets/city.gif'
import '../../styles/HowItWorks.css'

const steps = [
  {
    title: 'Sign Up and Create Your Profile',
    description: 'Join the Mission13 community and personalize your climate journey.',
  },
  {
    title: 'Meet Your AI Climate Companion',
    description: 'Chat with your friendly AI assistant who delivers daily eco-challenges and tips.',
  },
  {
    title: 'Complete Daily Challenges',
    description: 'Take simple actions each day that make a real difference for the planet.',
  },
  {
    title: 'Track Progress and Earn Rewards',
    description: 'See your impact grow with every challenge, earn points, badges, and feel great doing good!',
  },
]

const HowItWorks = () => {
  const numberRefs = useRef([])

  useEffect(() => {
    const handleScroll = () => {
      numberRefs.current.forEach((ref, idx) => {
        if (!ref) return
        const rect = ref.getBoundingClientRect()
        const inView = rect.top < window.innerHeight && rect.bottom > 0
        if (inView) {
          ref.style.animation = `step-pop 0.7s cubic-bezier(.4,2,.6,.9) both`
          ref.style.animationDelay = `${0.15 * idx + 0.2}s`
        } else {
          ref.style.animation = 'none'
        }
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="howitworks-section">
      <h2 className="howitworks-title">
        How it works?
      </h2>
      <p className="howitworks-description">
        Getting started with Mission13 is simple. Follow these steps to begin your climate journey.
      </p>
      <div className="howitworks-content">
        <div className="howitworks-image-container">
          <img
            src={illustration}
            alt="How it works animated illustration"
            className="howitworks-illustration"
          />
        </div>
        <div className="howitworks-steps animate-howitworks-fadein">
          <ol className="howitworks-timeline">
            {steps.map((step, idx) => (
              <li key={step.title} className="howitworks-step group">
                <span
                  ref={el => (numberRefs.current[idx] = el)}
                  className="howitworks-step-number"
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="howitworks-step-title">
                  {step.title}
                </h3>
                <p className="howitworks-step-description">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks