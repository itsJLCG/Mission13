import React from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Example icon imports (replace with your actual image files)
import icon1 from '../../assets/city.png'
import icon2 from '../../assets/city.png'
import icon3 from '../../assets/city.png'
import icon4 from '../../assets/city.png'
import icon5 from '../../assets/city.png'
import icon6 from '../../assets/city.png'

const features = [
  {
    title: 'SDG Education Module',
    description:
      'Integrated learning tools to teach users more about SDG 13 and other related goals, empowering them with knowledge alongside action.',
    icon: icon1,
    bg: '#b8f772',
    color: '#020202',
  },
  {
    title: 'AI-Powered Chatbot Interaction',
    description:
      'An intelligent chatbot provides users with daily eco-friendly challenges tailored to their habits, preferences, and progress—enabling a personalized and engaging experience.',
    icon: icon2,
    bg: '#f1f3f0',
    color: '#020202',
  },
  {
    title: 'Gamified Reward System',
    description:
      'Users earn points, badges, and milestones for completing challenges, creating a fun and motivating environment that encourages continuous participation.',
    icon: icon3,
    bg: '#020202',
    color: '#fff',
  },
  {
    title: 'Educational Insights and Climate Tips',
    description:
      'Beyond challenges, the chatbot also provides quick facts, sustainable living tips, and climate news updates to raise awareness.',
    icon: icon4,
    bg: '#b8f772',
    color: '#020202',
  },
  {
    title: 'SDG 13-Aligned Daily Challenges',
    description:
      'Every challenge is aligned with the UN Sustainable Development Goal 13 (Climate Action) to ensure meaningful, goal-oriented environmental engagement.',
    icon: icon5,
    bg: '#f1f3f0',
    color: '#020202',
  },
  {
    title: 'Feedback and Reflection System',
    description:
      'At the end of each challenge, users can reflect on their experience and provide feedback, enabling continuous system improvement and personal insight.',
    icon: icon6,
    bg: '#020202',
    color: '#fff',
  },
]

const Features = () => {
  React.useEffect(() => {
    AOS.init({ duration: 900 })
  }, [])

  return (
    <section className="max-w-6xl mx-auto my-10 px-10">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&family=Nunito+Sans:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <h1
        className="text-4xl font-extrabold mb-2"
        style={{ fontFamily: 'Poppins, sans-serif', color: '#020202' }}
        data-aos="fade-down"
      >
        Key Features
      </h1>
      <p
        className="mb-8"
        style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#020202' }}
        data-aos="fade-up"
      >
        Mission13 combines AI technology, gamification, and impact tracking to
        make climate action accessible and engaging for everyone.
      </p>
      <div className="grid md:grid-cols-2 gap-10">
        {features.map((feature, idx) => (
          <div
            key={feature.title}
            className="feature-card flex flex-col items-start rounded-2xl p-5 shadow transition-transform duration-300"
            style={{
              background: feature.bg,
              color: feature.color,
              minHeight: 210,
              minWidth: 320,
              maxWidth: 500,
              cursor: 'pointer',
            }}
            data-aos="zoom-in"
            data-aos-delay={idx * 100}
          >
            <img
              src={feature.icon}
              alt={feature.title + ' icon'}
              className="w-14 h-12 mb-2 feature-icon"
              style={{ objectFit: 'contain' }}
            />
            <h3
              className="text-1xl font-bold mb-2"
              style={{ fontFamily: 'Poppins, sans-serif', color: feature.color }}
            >
              {feature.title}
            </h3>
            <p
              className="text-base"
              style={{ fontFamily: 'Nunito Sans, sans-serif', color: feature.color }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
      {/* Custom hover animation styles */}
      <style>
        {`
          .feature-card {
            transition:
              transform 0.35s cubic-bezier(.4,2,.6,.9),
              box-shadow 0.35s cubic-bezier(.4,2,.6,.9);
          }
          .feature-card:hover {
            animation: pulse-lift 0.6s;
            z-index: 2;
          }
          @keyframes pulse-lift {
            0% {
              transform: scale(1) translateY(0);
              box-shadow: 0 4px 16px 0 #b8f77233, 0 1px 4px 0 #02020211;
            }
            40% {
              transform: scale(1.08) translateY(-18px);
              box-shadow: 0 24px 48px 0 #b8f77255, 0 4px 16px 0 #02020222;
            }
            60% {
              transform: scale(1.04) translateY(-12px);
              box-shadow: 0 18px 36px 0 #b8f77244, 0 3px 12px 0 #02020218;
            }
            100% {
              transform: scale(1.07) translateY(-18px);
              box-shadow: 0 24px 48px 0 #b8f77255, 0 4px 16px 0 #02020222;
            }
          }
        `}
      </style>
    </section>
  )
}

export default Features