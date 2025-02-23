import React from "react"
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { ArrowRight } from "lucide-react"

const CTA = () => {
  return (
    <section className="relative py-20 px-6 md:px-12 bg-gradient-to-r from-fundly-700 to-fundly-900 text-white overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 bg-[url('/cta-background-pattern.svg')] bg-cover opacity-10"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      {/* CTA Content */}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Ready to Launch Your Campaign?
        </motion.h2>
        <motion.p
          className="text-xl mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Join the future of crowdfunding with Fundly. Start your Web3-powered campaign today and turn your ideas into
          reality.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-fundly-800 hover:bg-fundly-100 transition-all duration-300 transform hover:scale-105"
          >
            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA

