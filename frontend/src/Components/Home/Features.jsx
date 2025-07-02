import React from 'react'

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
      >
        Key Features
      </h1>
      <p
        className="mb-8"
        style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#020202' }}
      >
        Mission13 combines AI technology, gamification, and impact tracking to
        make climate action accessible and engaging for everyone.
      </p>
      <div className="grid md:grid-cols-2 gap-10">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col items-start rounded-2xl p-5 shadow transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              background: feature.bg,
              color: feature.color,
              minHeight: 210,
              minWidth: 320,
              maxWidth: 500,
              cursor: 'pointer',
            }}
          >
            <img
              src={feature.icon}
              alt={feature.title + ' icon'}
              className="w-14 h-12 mb-2"
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
    </section>
  )
}

export default Features