import React from "react"
"use client"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { ArrowRight, Users, Wallet, Coins, Lightbulb, Rocket, Heart, Shield, CheckCircle2 } from "lucide-react"

const Hero = () => {
  // Animation variants for floating effect
  const floatingAnimation = {
    y: [-10, 10],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  }

  // Animation variants for connection lines
  const lineAnimation = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
      },
    },
  }

  return (
    <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-fundly-700 to-fundly-900 text-white overflow-hidden relative min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
        {/* Left Content */}
        <motion.div
          className="md:w-1/2 mb-12 md:mb-0"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            Revolutionize Your <span className="text-fundly-300">Crowdfunding</span> with Web3
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-12 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            Empower your ideas with blockchain technology. Launch campaigns, gather support, and receive funds securely
            through Fundly.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          >
            <Button size="lg" className="bg-white text-fundly-800 hover:bg-fundly-100 transition-all duration-300">
              Start Your Campaign <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Content - Interactive Illustration */}
        <motion.div
          className="md:w-1/2 relative h-[500px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Central Idea Icon */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={floatingAnimation}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-fundly-400/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <div className="relative bg-white/10 backdrop-blur-md rounded-full p-6 border border-white/20">
                <Lightbulb className="w-16 h-16 text-fundly-300" />
              </div>
            </div>
          </motion.div>

          {/* Orbiting Elements */}
          {[
            { Icon: Users, position: "top-10 left-1/4", delay: 0 },
            { Icon: Wallet, position: "top-1/4 right-10", delay: 0.2 },
            { Icon: Heart, position: "bottom-20 right-1/4", delay: 0.4 },
            { Icon: Shield, position: "bottom-1/4 left-10", delay: 0.6 },
            { Icon: Rocket, position: "top-1/3 left-10", delay: 0.8 },
            { Icon: Coins, position: "bottom-10 left-1/3", delay: 1 },
          ].map(({ Icon, position, delay }, index) => (
            <motion.div
              key={index}
              className={`absolute ${position}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay, duration: 0.5 }}
            >
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                animate={{
                  y: [-10, 10],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: Math.random(),
                }}
              >
                <Icon className="w-8 h-8 text-fundly-300" />
              </motion.div>
            </motion.div>
          ))}

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ transform: "scale(0.95)" }}>
            <motion.path
              d="M200,250 L100,100 M200,250 L300,100 M200,250 L300,400 M200,250 L100,400"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
              fill="none"
              initial="hidden"
              animate="visible"
              variants={lineAnimation}
            />
          </svg>

          {/* Floating Success Indicators */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.8, 1, 0.8],
                x: [0, 30, 60],
                y: [0, -30, -60],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.8,
                ease: "easeOut",
              }}
              style={{
                left: "50%",
                top: "50%",
              }}
            >
              <CheckCircle2 className="w-4 h-4 text-fundly-300" />
            </motion.div>
          ))}

          {/* Background Glow */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-fundly-500/10 rounded-full w-96 h-96 -z-10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}

export default Hero

