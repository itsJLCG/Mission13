import React from 'react'
import bgImg from '../../assets/hero-bg.png'
import cityImg from '../../assets/city.png'

const Hero = () => {
  return (
    <section
      className="relative flex items-center justify-between rounded-xl mx-auto my-3 p-20 max-w-[1300px] min-h-[500px] bg-lime-600 overflow-hidden"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Left Side: Text */}
      <div className="max-w-2xl z-10">
        <h1
          className="text-5xl md:text-13xl font-extrabold leading-tight text-gray-900 mb-4"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Mission13: Take Climate Action with AI-Powered Challenges
        </h1>
        <p
          className="text-gray-800 mb-8 text-lg"
          style={{ fontFamily: 'Nunito Sans, sans-serif' }}
        >
          Join Mission13 and make a real impact through personalized daily eco-challenges.
        </p>
        <button
          className="px-10 py-4 bg-black hover:bg-[#b8f772] text-white hover:text-gray-900 font-semibold rounded shadow transition text-lg"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Get Started
        </button>
      </div>
      {/* Right Side: Animated City Image */}
      <div className="hidden md:block z-10">
        <img
          src={cityImg}
          alt="City"
          className="w-[650px] max-w-none animate-bounce-slow drop-shadow-xl"
          style={{ animation: 'bounce-slow 2s infinite' }}
        />
      </div>
      {/* Custom bounce animation */}
      <style>
        {`
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-32px);}
          }
          .animate-bounce-slow {
            animation: bounce-slow 2s infinite;
          }
        `}
      </style>
      {/* Overlay for better text contrast if needed */}
      <div className="absolute inset-0 bg-lime-300 opacity-70 pointer-events-none rounded-xl" />
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&family=Nunito+Sans:wght@400;700&display=swap"
        rel="stylesheet"
      />
    </section>
  )
}

export default Hero