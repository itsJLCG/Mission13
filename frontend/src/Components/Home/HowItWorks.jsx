import React, { useRef, useEffect } from 'react'
import illustration from '../../assets/city.png' // Update with your actual image path

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
  // Refs for each number
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
    // Trigger once on mount
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="max-w-5xl mx-auto my-40 px-4">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&family=Nunito+Sans:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <h2
        className="text-3xl font-extrabold text-center mb-2"
        style={{ fontFamily: 'Poppins, sans-serif', color: '#020202' }}
      >
        How it works?
      </h2>
      <p
        className="mb-10 text-center"
        style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#204d36' }}
      >
        Getting started with Mission13 is simple. Follow these steps to begin your climate journey.
      </p>
      <div className="flex flex-col md:flex-row items-center gap-25">
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
          <img
            src={illustration}
            alt="How it works illustration"
            className="howitworks-illustration"
            style={{
              width: '520px',
              height: '320px',
              objectFit: 'fill'
            }}
          />
        </div>
        {/* Right Side: Steps */}
        <div className="w-full md:w-1/2 animate-howitworks-fadein">
          <ol className="relative border-l-4 border-lime-400 pl-8">
            {steps.map((step, idx) => (
              <li
                key={step.title}
                className="mb-10 last:mb-0 relative group"
                style={{ transition: 'transform 0.3s' }}
              >
                <span
                  ref={el => (numberRefs.current[idx] = el)}
                  className="howitworks-step-number absolute -left-10 flex items-center justify-center w-10 h-10 rounded-full bg-lime-400 text-gray-900 font-bold text-lg shadow-lg step-bounce"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
                  }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3
                  className="text-xl font-bold mb-1"
                  style={{ fontFamily: 'Poppins, sans-serif', color: '#020202' }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-gray-700"
                  style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#020202' }}
                >
                  {step.description}
                </p>
                {/* Hover effect */}
                <style>
                  {`
                    .group:hover {
                      transform: translateX(8px) scale(1.03);
                      background: #f1f3f0;
                      border-radius: 1rem;
                      box-shadow: 0 8px 32px 0 rgba(34, 197, 94, 0.10);
                    }
                  `}
                </style>
              </li>
            ))}
          </ol>
        </div>
      </div>
      {/* Animations */}
      <style>
        {`
          .animate-howitworks-fadein {
            animation: howitworks-fadein 1s cubic-bezier(.4,2,.6,.9) both;
          }
          @keyframes howitworks-fadein {
            0% {
              opacity: 0;
              transform: translateX(60px) scale(0.98);
            }
            80% {
              opacity: 1;
              transform: translateX(-6px) scale(1.03);
            }
            100% {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
          .howitworks-step-number {
            /* for animation targeting */
          }
          @keyframes step-pop {
            0% {
              opacity: 0;
              transform: scale(0.5) translateY(-30px);
            }
            60% {
              opacity: 1;
              transform: scale(1.15) translateY(8px);
            }
            80% {
              transform: scale(0.95) translateY(-2px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-18px);}
          }
          @keyframes bounce-in {
            0% { transform: scale(0.5) translateY(-30px); opacity: 0; }
            80% { transform: scale(1.1) translateY(5px); opacity: 1; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
        `}
      </style>
    </section>
  )
}

export default HowItWorks