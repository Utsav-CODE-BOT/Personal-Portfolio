import { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'
import { getPersonalInfo } from '../../../config/configLoader'

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const personalInfo = getPersonalInfo()
  const brand = personalInfo?.brand || (personalInfo?.name ? `${personalInfo.name.split(' ')[0]}.dev` : 'Utsav.dev')

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <Terminal className="w-6 h-6 text-purple-500" />
              <span className="text-xl font-mono font-bold hover:text-[#00C8DC] transition-colors">{brand}</span>
            </Link>
          </motion.div>

          <DesktopNav />

          <button 
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <MobileNav 
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      </div>
    </nav>
  )
}
