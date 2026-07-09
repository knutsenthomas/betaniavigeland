import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onSearchOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainLinks = [
    { to: '/', label: 'Hjem' },
    { to: '/hva-skjer', label: 'Hva skjer' },
    { to: '/virkegrener', label: 'Våre virkegrener' },
    { to: '/podcast', label: 'Podcast' },
  ];

  const dropdownLinks = [
    { to: '/about', label: 'Om oss' },
    { to: '/misjon', label: 'Misjon' },
    { to: '/gave', label: 'Gave & Givertjeneste' },
    { to: '/rental', label: 'Utleie' },
    { to: '/medlem', label: 'Medlem' },
  ];

  const allMobileLinks = [
    { to: '/', label: 'Hjem', icon: 'home' },
    { to: '/hva-skjer', label: 'Hva skjer', icon: 'calendar_today' },
    { to: '/virkegrener', label: 'Våre virkegrener', icon: 'church' },
    { to: '/podcast', label: 'Podcast', icon: 'podcasts' },
    { to: '/about', label: 'Om oss', icon: 'info' },
    { to: '/misjon', label: 'Misjon', icon: 'public' },
    { to: '/gave', label: 'Gave & Giver', icon: 'volunteer_activism' },
    { to: '/rental', label: 'Utleie', icon: 'key' },
    { to: '/medlem', label: 'Medlem', icon: 'group_add' },
  ];

  const isOmOssActive = dropdownLinks.some(link => location.pathname === link.to);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'shadow-md h-16 bg-surface-cream/90 backdrop-blur-md'
          : 'h-20 bg-surface-cream/80 backdrop-blur-md'
      }`}
    >
      <div className="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-full">
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3 transition-colors duration-300 hover:opacity-90 group min-w-0 flex-1 sm:flex-initial mr-4"
        >
          <img 
            src="/logo-icon.png?v=2" 
            alt="Betania Vigeland Logo" 
            className={`object-contain group-hover:scale-105 transition-all duration-300 shrink-0 ${
              isScrolled ? 'w-8 h-8' : 'w-10 h-10'
            }`}
          />
          <span className="font-headline-md text-base sm:text-lg lg:text-headline-md font-bold text-primary truncate">
            Betania Vigeland
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-8 h-full">
          {mainLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `font-label-md text-label-md pb-1 transition-colors duration-300 border-b-2 ${
                  isActive
                    ? 'text-secondary border-secondary font-bold'
                    : 'text-on-surface-variant border-transparent hover:text-secondary'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Hover Dropdown for Om oss / Mer */}
          <div 
            className="relative h-full flex items-center"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              className={`font-label-md text-label-md pb-1 transition-colors duration-300 border-b-2 flex items-center gap-1 focus:outline-none ${
                isOmOssActive
                  ? 'text-secondary border-secondary font-bold'
                  : 'text-on-surface-variant border-transparent hover:text-secondary'
              }`}
            >
              <span>Om oss</span>
              <span className={`material-symbols-outlined text-[16px] transition-transform duration-200 select-none ${isDropdownOpen ? 'rotate-180' : ''}`}>
                keyboard_arrow_down
              </span>
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-[80%] left-0 w-44 bg-white border border-surface-container rounded-2xl shadow-lg p-1.5 flex flex-col gap-0.5 z-50"
                >
                  {dropdownLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsDropdownOpen(false)}
                      className={`px-3 py-2 rounded-xl text-[13px] font-label-md text-left transition-colors ${
                        location.pathname === link.to
                          ? 'bg-surface-cream text-secondary font-bold'
                          : 'text-on-surface-variant hover:bg-surface-cream hover:text-secondary'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSearchOpen}
            className="text-primary hover:text-secondary p-2 rounded-full hover:bg-surface-container/50 transition-colors flex items-center justify-center"
            aria-label="Søk på nettsiden"
          >
            <span className="material-symbols-outlined text-[24px]">search</span>
          </button>

          {/* Hamburger Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-primary focus:outline-none"
            aria-label="Toggle navigation"
          >
            <span className="material-symbols-outlined text-[28px]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg shadow-2xl border-t border-surface-container z-45 overflow-y-auto max-h-[85vh]"
          >
            <div className="p-6 space-y-6">
              {/* Links Grid */}
              <div className="grid grid-cols-2 gap-3">
                {allMobileLinks.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all active:scale-[0.98] ${
                        isActive
                          ? 'bg-primary/5 text-primary border-primary/20 font-bold'
                          : 'bg-surface-cream/50 text-on-surface-variant border-surface-container/50 hover:bg-surface-cream'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[20px] shrink-0 ${
                        isActive ? 'text-primary' : 'text-secondary/70'
                      }`}>
                        {link.icon}
                      </span>
                      <span className="text-[13px] tracking-wide leading-tight truncate">
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Drawer Footer Utilities */}
              <div className="pt-4 border-t border-surface-container/60 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                  Kontakt oss
                </span>
                <div className="flex gap-3">
                  <a
                    href="mailto:post@betania-vigeland.no"
                    className="w-9 h-9 rounded-full bg-surface-cream hover:bg-primary/10 text-primary flex items-center justify-center border border-surface-container transition-colors"
                    aria-label="Send epost"
                  >
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </a>
                  <a
                    href="https://www.facebook.com/betaniavigeland"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-surface-cream hover:bg-primary/10 text-primary flex items-center justify-center border border-surface-container transition-colors"
                    aria-label="Følg på Facebook"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 8H7v3h2v9h3v-9h3.6l.4-3H12V6c0-.9.2-1.2 1-1.2h2.5V2H13c-3 0-4 1.5-4 3.5V8z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
