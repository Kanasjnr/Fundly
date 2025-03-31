import React from 'react'
import Header from "../components/Home/Header"
import Hero from "../components/Home/Hero"
import Features from "../components/Home/Features"
import HowItWorks from "../components/Home/HowItWorks"
import Testimonials from "../components/Home/Testimonials"

import CTA from "../components/Home/CTA"
import Footer from "../components/Home/Footer"
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 relative">
      <Header position={"sticky"} zIndex={9999} top={0}/>
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage