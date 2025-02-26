
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { ArrowRight, Lightbulb } from "lucide-react"

const Hero = () => {
  // Floating animation for the central icon
  const floatingAnimation = {
    y: [-10, 10],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  }

  // Particle animation
  const particleAnimation = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      x: [0, Math.random() * 400 - 200],
      y: [0, Math.random() * 400 - 200],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        delay: Math.random() * 2,
        ease: "easeInOut",
      },
    },
  }

  // Radial wave animation
  const radialWaveAnimation = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: [0.5, 0],
      scale: [0, 2],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeOut",
      },
    },
  }

  return (
    <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-fundly-700 to-fundly-900 text-white overflow-hidden relative min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center relative">
        {/* Central Content */}
        <motion.div
          className="relative z-10"
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
            className="text-xl md:text-2xl mb-12 max-w-xl mx-auto"
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

        {/* Central Icon with Floating Animation */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"
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

        {/* Dynamic Particle Effects */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-fundly-300 rounded-full"
            initial="hidden"
            animate="visible"
            variants={particleAnimation}
            style={{
              left: "50%",
              top: "50%",
            }}
          />
        ))}

        {/* Radial Waves */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-fundly-300 rounded-full"
            initial="hidden"
            animate="visible"
            variants={radialWaveAnimation}
            style={{
              width: `${(i + 1) * 200}px`,
              height: `${(i + 1) * 200}px`,
            }}
          />
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
      </div>
    </section>
  )
}

export default Hero