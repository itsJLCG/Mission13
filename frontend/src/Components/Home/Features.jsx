import React from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import '../../styles/Features.css'

// Example icon imports
import icon1 from '../../assets/f1.png'
import icon2 from '../../assets/f2.png'
import icon3 from '../../assets/f3.png'
import icon4 from '../../assets/f4.png'
import icon5 from '../../assets/f5.png'
import icon6 from '../../assets/f6.png'

const features = [
  {
    title: 'SDG Education Module',
    description:
      'Integrated learning tools to teach users more about SDG 13 and other related goals, empowering them with knowledge alongside action.',
    icon: icon1,
    color: '#d8e84e',
  },
  {
    title: 'AI-Powered Chatbot Interaction',
    description:
      'An intelligent chatbot provides users with daily eco-friendly challenges tailored to their habits, preferences, and progress—enabling a personalized and engaging experience.',
    icon: icon2,
    color: '#d8e84e',
  },
  {
    title: 'Gamified Reward System',
    description:
      'Users earn points, badges, and milestones for completing challenges, creating a fun and motivating environment that encourages continuous participation.',
    icon: icon3,
    color: '#d8e84e',
  },
  {
    title: 'Educational Insights and Climate Tips',
    description:
      'Beyond challenges, the chatbot also provides quick facts, sustainable living tips, and climate news updates to raise awareness.',
    icon: icon4,
    color: '#d8e84e',
  },
  {
    title: 'SDG 13-Aligned Daily Challenges',
    description:
      'Every challenge is aligned with the UN Sustainable Development Goal 13 (Climate Action) to ensure meaningful, goal-oriented environmental engagement.',
    icon: icon5,
    color: '#d8e84e',
  },
  {
    title: 'Feedback and Reflection System',
    description:
      'At the end of each challenge, users can reflect on their experience and provide feedback, enabling continuous system improvement and personal insight.',
    icon: icon6,
    color: '#d8e84e',
  },
]

const Features = () => {
  React.useEffect(() => {
    AOS.init({ duration: 900 })
  }, [])

  return (
    <section className="features-section">
      <h1 className="features-title" data-aos="fade-down">
        Key Features
      </h1>
      <p className="features-description" data-aos="fade-up">
        Mission13 combines AI technology, gamification, and impact tracking to
        make climate action accessible and engaging for everyone.
      </p>
      <div className="features-grid">
        {features.map((feature, idx) => (
          <div
            key={feature.title}
            className="feature-card glass-card"
            data-aos="zoom-in"
            data-aos-delay={idx * 50}
          >
            <img
              src={feature.icon}
              alt={feature.title + ' icon'}
              className="feature-icon"
            />
            <h3 className="feature-title" style={{ color: feature.color }}>
              {feature.title}
            </h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features