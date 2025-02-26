import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useSignerOrProvider from "../../hooks/useSignerOrProvider"; 


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { signer } = useSignerOrProvider(); 
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (signer) {
      navigate("/dashboard"); 
    }
  }, [signer, navigate]);

  const navItems = [
    { href: "#features", text: "Features" },
    { href: "#how-it-works", text: "How It Works" },
    { href: "#testimonials", text: "Testimonials" },
  ];

  

  return (
    <motion.header
      className={`py-4 px-6 md:px-12 flex justify-between items-center fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-transparent"
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
          <a
            key={item.href}
            href={item.href}
            className="text-fundly-800 hover:text-fundly-600 transition-colors font-semibold"
          >
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
              <a
                key={item.href}
                href={item.href}
                className="text-fundly-800 hover:text-fundly-600 transition-colors"
              >
                {item.text}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      <div className="flex items-center">
        <appkit-button  />

        <button
          className="md:hidden ml-4"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-fundly-500" />
          ) : (
            <Menu className="h-6 w-6 text-fundly-500" />
          )}
        </button>
      </div>
    </motion.header>
  );
};

export default Header;