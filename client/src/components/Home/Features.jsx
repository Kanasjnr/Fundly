import { motion } from "framer-motion"
import { Shield, Zap, Coins, Users, Gift, BarChart } from "lucide-react"

const features = [
  {
    icon: <Shield className="h-12 w-12 text-fundly-600" />,
    title: "Blockchain-Based Campaigns",
    description:
      "Create and manage fundraising campaigns securely on the blockchain, ensuring transparency and trust for all participants.",
  },
  {
    icon: <Zap className="h-12 w-12 text-fundly-600" />,
    title: "Smart Contract Integration",
    description:
      "Leverage automated and transparent fund distribution using smart contracts, reducing intermediaries and increasing efficiency.",
  },
  {
    icon: <Coins className="h-12 w-12 text-fundly-600" />,
    title: "Cryptocurrency Payments",
    description:
      "Accept contributions in various cryptocurrencies, opening up your campaign to a global audience and reducing transaction fees.",
  },
  {
    icon: <Users className="h-12 w-12 text-fundly-600" />,
    title: "Decentralized Identity (DID)",
    description:
      "Implement robust KYC measures to verify campaign creators, ensuring accountability and building trust among backers.",
  },
  {
    icon: <Gift className="h-12 w-12 text-fundly-600" />,
    title: "Token-Gated Perks",
    description:
      "Offer exclusive rewards to backers through NFTs or tokens, creating unique incentives and fostering community engagement.",
  },
  {
    icon: <BarChart className="h-12 w-12 text-fundly-600" />,
    title: "Transparent Tracking",
    description:
      "Provide real-time, on-chain tracking of campaign progress and fund allocation, giving backers full visibility into their investments.",
  },
]

const Features = () => {
  return (
    <section id="features" className="py-20 px-6 md:px-12 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-fundly-800">Why Choose Fundly?</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg border border-fundly-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              viewport={{ once: true }}
            >
              {feature.icon}
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 text-fundly-800">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features

