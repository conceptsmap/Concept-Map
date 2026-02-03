import React from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import HowItWorks from './components/HowItWorks'
import Content from './components/Content'
import Footer from './components/Footer'

const HomePage = () => {
  return (
    <div>
        <Navbar />
        <HeroSection />
        <HowItWorks />
        <Content />
        <Footer />
    </div>
  )
}

export default HomePage