import React from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import HowItWorks from './components/HowItWorks'
import CMCertification from './components/CMCertification'
import Testimonials from './components/Testimonials'
import Content from './components/Content'
import Footer from './components/Footer'

const HomePage = () => {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <HowItWorks />

      <CMCertification />
      <Testimonials />

      <Content />
      <Footer />
    </div>
  )
}

export default HomePage