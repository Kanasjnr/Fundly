import "./config/connection";

import React from "react"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Features from "./components/Features"
import HowItWorks from "./components/HowItWorks"
import Testimonials from "./components/Testimonials"
import Stats from "./components/Stats"
import CTA from "./components/CTA"
import Footer from "./components/Footer"

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-800 relative">
      <Header position={"sticky"} zIndex={9999} top={0}/>
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default App

