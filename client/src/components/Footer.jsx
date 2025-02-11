import React from "react"

"use client"
import { motion } from "framer-motion"
import { Twitter, Facebook, Instagram, GitlabIcon as GitHub } from "lucide-react"

const Footer = () => {
  const socialIcons = [
    { Icon: Twitter, href: "#" },
    { Icon: Facebook, href: "#" },
    { Icon: Instagram, href: "#" },
    { Icon: GitHub, href: "#" },
  ]

  return (
    <footer className="py-12 px-6 md:px-12 bg-fundly-900 text-white relative overflow-hidden">
      {/* Animated gradient background instead of image */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, var(--fundly-700) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, var(--fundly-700) 0%, transparent 50%)",
            "radial-gradient(circle at 0% 0%, var(--fundly-700) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="mb-4">
            <img src="/Logo (1).png" alt="Fundly Logo" className="h-8 w-auto" />
          </div>
          <p className="text-fundly-100">Empowering ideas through Web3 crowdfunding.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h4 className="text-lg font-semibold mb-4 text-fundly-300">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-fundly-100 hover:text-white transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#features" className="text-fundly-100 hover:text-white transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="text-fundly-100 hover:text-white transition-colors">
                How It Works
              </a>
            </li>
            <li>
              <a href="#testimonials" className="text-fundly-100 hover:text-white transition-colors">
                Testimonials
              </a>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h4 className="text-lg font-semibold mb-4 text-fundly-300">Legal</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-fundly-100 hover:text-white transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="text-fundly-100 hover:text-white transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-fundly-100 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h4 className="text-lg font-semibold mb-4 text-fundly-300">Connect With Us</h4>
          <div className="flex space-x-4">
            {socialIcons.map(({ Icon, href }, index) => (
              <motion.a
                key={index}
                href={href}
                className="text-fundly-100 hover:text-white transition-colors p-2 hover:bg-fundly-800/50 rounded-full"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="h-6 w-6" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-12 text-center text-fundly-100 relative z-10">
        <p>&copy; {new Date().getFullYear()} Fundly. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer

