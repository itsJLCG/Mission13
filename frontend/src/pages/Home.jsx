import React from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Header from '../Components/Home/Header'
import Hero from '../Components/Home/Hero'
import Features from '../Components/Home/Features'
import HowItWorks from '../Components/Home/HowItWorks'
import Feedback from '../Components/Home/Feedback'
import Team from '../Components/Home/Team'
import Footer from '../Components/Home/Footer'

const Home = () => {
  React.useEffect(() => {
    AOS.init({ duration: 900 })
  }, [])

  return (
    <>
      <div data-aos="fade-down">
        <Header />
      </div>
      <div data-aos="fade-up">
        <Hero />
      </div>
      <div data-aos="fade-right">
        <Features />
      </div>
      <div data-aos="fade-left">
        <HowItWorks />
      </div>
      <div>
        <Feedback />
      </div>
      <div data-aos="fade-up">
        <Team />
      </div>
      <div>
        <Footer />
      </div>
    </>
  )
}

export default Home