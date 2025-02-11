import React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../components/ui/button"
import { Wallet, Menu, X } from "lucide-react"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "#features", text: "Features" },
    { href: "#how-it-works", text: "How It Works" },
    { href: "#testimonials", text: "Testimonials" },
  ]

  return (
    <motion.header
      className={`py-4 px-6 md:px-12 flex justify-between items-center fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    "bg-white shadow-lg"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center">
        <img src="/Logo (1).png" alt="Fundly Logo" className="h-10 w-auto" />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        {navItems.map((item) => (
          <a key={item.href} href={item.href} className="text-fundly-800 hover:text-fundly-600 transition-colors">
            {item.text}
          </a>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden flex flex-col absolute top-full left-0 w-full bg-white p-6 shadow-md space-y-4"
          >
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-fundly-800 hover:text-fundly-600 transition-colors">
                {item.text}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      <div className="flex items-center">
        <Button
          variant="outline"
          className="hidden md:flex items-center border-fundly-500 text-fundly-500 hover:bg-fundly-500 hover:text-white transition-all duration-300"
        >
          <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
        </Button>
        <button className="md:hidden ml-4" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6 text-fundly-500" /> : <Menu className="h-6 w-6 text-fundly-500" />}
        </button>
      </div>
    </motion.header>
  )
}

export default Header

