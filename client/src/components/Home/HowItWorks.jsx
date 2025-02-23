import React from "react"
import { motion } from "framer-motion"
import { FileText, Users, Rocket, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: <FileText className="h-16 w-16 mb-4 text-fundly-500" />,
    title: "Create Your Campaign",
    description: "Set up your fundraising campaign with details and goals.",
  },
  {
    icon: <Users className="h-16 w-16 mb-4 text-fundly-500" />,
    title: "Share & Gather Support",
    description: "Spread the word and collect contributions from backers.",
  },
  {
    icon: <Rocket className="h-16 w-16 mb-4 text-fundly-500" />,
    title: "Launch Your Project",
    description: "Use the funds to bring your idea to life.",
  },
  {
    icon: <CheckCircle className="h-16 w-16 mb-4 text-fundly-500" />,
    title: "Deliver & Reward",
    description: "Complete your project and reward your backers.",
  },
]

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-6 md:px-12 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-fundly-500">How It Works</h2>
      <div className="max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex flex-col md:flex-row items-center mb-12 last:mb-0"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="md:w-1/3 flex justify-center">
              <div className="bg-green-100 rounded-full p-8 transform transition-transform duration-300 hover:scale-110">
                {step.icon}
              </div>
            </div>
            <div className="md:w-2/3 mt-6 md:mt-0 md:ml-8 text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-2 text-fundly-500">{step.title}</h3>
              <p className="text-gray-600 text-lg">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks

