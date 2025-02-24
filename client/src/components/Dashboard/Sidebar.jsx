'use client';

import React from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { LayoutDashboard, Rocket, UserCheck, Vote, Image, Menu } from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Rocket, label: "Campaigns", path: "/dashboard/campaigns" },
  { icon: Vote, label: "Governance", path: "/dashboard/governance" },
  { icon: UserCheck, label: "KYC Verification", path: "/dashboard/kyc" },
  { icon: Image, label: "My NFTs", path: "/dashboard/nfts" },
]

export function Sidebar() {
  const location = useLocation()
  const [expanded, setExpanded] = React.useState(true)
  const [isMobile, setIsMobile] = React.useState(false)

  // Handle responsive behavior
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setExpanded(window.innerWidth >= 768)
    }

    // Initial check
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && expanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setExpanded(false)}
        />
      )}

      <aside
        className={cn(
          "bg-fundly-800 text-white shadow-lg transition-all duration-300 ease-in-out fixed md:static h-screen z-30",
          expanded ? "w-80 md:w-72" : "w-20",
          isMobile && !expanded && "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-fundly-700">
          <img
            src="/Logo (1).png"
            alt="Fundly Logo"
            className={cn(
              "h-10 transition-all duration-300", 
              expanded ? "opacity-100" : "opacity-0"
            )}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(!expanded)}
            className="text-fundly-300 hover:text-white"
          >
            <Menu className="h-7 w-7" />
          </Button>
        </div>

        <nav className="mt-8 px-3">
          <ul className="space-y-3">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3.5 rounded-lg transition-all duration-200",
                    location.pathname === item.path
                      ? "bg-fundly-700 text-fundly-300"
                      : "text-fundly-100 hover:bg-fundly-700 hover:text-white",
                    expanded ? "justify-start" : "justify-center"
                  )}
                >
                  <item.icon className="h-6 w-6 flex-shrink-0" />
                  <span 
                    className={cn(
                      "ml-3 font-semibold text-[15px] transition-all duration-300",
                      expanded ? "opacity-100" : "opacity-0 w-0"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile toggle button */}
      {isMobile && !expanded && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(true)}
          className="fixed bottom-6 right-6 z-30 bg-fundly-800 text-white rounded-full p-3 shadow-lg hover:bg-fundly-700"
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}
    </>
  )
}
