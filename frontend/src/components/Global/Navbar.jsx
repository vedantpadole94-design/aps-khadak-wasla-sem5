import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiMenu, FiX, FiLock } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    {
      name: 'About Us',
      path: '/about',
      children: [
        ['History & Heritage', '/about#history'],
        ['Vision & Mission', '/about#vision'],
        ['AWES Governance', '/about#awes'],
        ['School Rules & Code', '/about#rules'],
        ['Discipline Policy', '/about#discipline']
      ]
    },
    {
      name: 'Infrastructure',
      path: '/infrastructure',
      children: [
        ['Campus Overview', '/infrastructure#campus-at-a-glance'],
        ['38 Smart Classrooms', '/infrastructure#classrooms'],
        ['Computer & AI Labs', '/infrastructure#computer-lab'],
        ['Central Library', '/infrastructure#library'],
        ['Sports & NDA Grounds', '/infrastructure#sports-and-wellness'],
        ['Composite Science Lab', '/infrastructure#composite-science-lab']
      ]
    },
    {
      name: 'Academics',
      path: '/academics',
      children: [
        ['Curriculum & NEP', '/academics#general'],
        ['Faculty Directory (70+)', '/faculty'],
        ['CBSE Board Results', '/#results'],
        ['Prescribed Textbooks', '/academics#textbooks'],
        ['Rules of Promotion', '/academics#promotion'],
        ['Calendar & Exams', '/calendar']
      ]
    },
    {
      name: 'CCA',
      path: '/cca',
      children: [
        ['Co-Curricular Activities', '/cca'],
        ['House System & Trophies', '/#houses'],
        ['Annual Event Planner', '/calendar'],
        ['Folk Song Champions', '/#houses']
      ]
    },
    {
      name: 'Achievements',
      path: '/achievements',
      children: [
        ['Awards & Honors', '/achievements'],
        ['Board Merit Lists', '/#results'],
        ['Inter-House Trophies', '/#houses']
      ]
    },
    {
      name: 'Admission',
      path: '/admission',
      children: [
        ['Admission Guidelines', '/admission#rules'],
        ['Application Procedure', '/admission#procedure'],
        ['Entrance Syllabus', '/admission#syllabus'],
        ['Document Checklist', '/admission#checklist'],
        ['Fee Structure', '/admission#fees']
      ]
    },
    {
      name: 'HPD',
      path: '/hpd',
      children: [
        ['Value Education Plan', '/hpd#values'],
        ['Life Skills & Wellness', '/hpd#life-skills']
      ]
    },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Recruitment', path: '/recruitment' },
    { name: 'Enquiry', path: '/enquiry' },
    { name: 'CBSE SARAS', path: '/mandatory-disclosure' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed w-full top-0 z-40 transition-all duration-300 ${
          scrolled || !isHome
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-2.5 border-b border-gray-100'
            : 'bg-gradient-to-b from-[#0A1628]/90 via-[#0A1628]/40 to-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          {/* Logo & School Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
              className="w-[50px] h-[50px] flex items-center justify-center shrink-0 drop-shadow-md"
            >
              <img
                src="/assets/aps-logo.svg"
                alt="APS Khadakwasla Crest"
                width={50}
                height={50}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/school-logo-transparent.png';
                }}
              />
            </motion.div>
            <div>
              <div
                className={`font-heading font-bold text-sm sm:text-base md:text-lg leading-tight transition-colors ${
                  scrolled || !isHome ? 'text-primary' : 'text-white'
                }`}
              >
                Army Public School
              </div>
              <div
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  scrolled || !isHome ? 'text-secondary' : 'text-accent'
                }`}
              >
                Khadakwasla, Pune
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-5">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group py-2">
                <Link
                  to={link.path}
                  className={`flex items-center gap-1 font-body text-xs 2xl:text-sm font-semibold transition-colors ${
                    scrolled || !isHome
                      ? 'text-gray-700 hover:text-accent'
                      : 'text-white/90 hover:text-accent'
                  }`}
                >
                  {link.name}
                  {link.children && <FiChevronDown className="text-xs transition-transform group-hover:rotate-180" />}
                </Link>

                {/* Dropdown Menu */}
                {link.children && (
                  <div className="invisible absolute left-0 top-full z-50 w-56 -translate-y-2 rounded-2xl border border-gray-100 bg-white p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {link.children.map(([label, path]) => (
                      <Link
                        key={label}
                        to={path}
                        className="block rounded-xl px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Admin Login Button - Top Right */}
            <Link
              to="/admin/login"
              className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-primary text-xs font-extrabold uppercase tracking-wider hover:bg-white hover:shadow-lg transition-all"
            >
              <FiLock /> Admin Portal
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 xl:hidden">
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-accent text-primary text-xs font-bold"
            >
              Admin
            </Link>
            <button
              className={`p-2 rounded-lg text-2xl transition-colors ${
                scrolled || !isHome ? 'text-primary' : 'text-white'
              }`}
              onClick={() => setIsOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm xl:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-primary text-white flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/aps-logo.svg"
                    alt="APS"
                    className="w-10 h-10 object-contain"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/school-logo-transparent.png'; }}
                  />
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white">APS Khadakwasla</h3>
                    <p className="text-[10px] text-accent uppercase tracking-wider">Navigation</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/70 hover:text-white rounded-lg"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="grow overflow-y-auto p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-gray-200 hover:bg-white/10 hover:text-accent transition-colors"
                  >
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-white/10">
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-primary rounded-xl font-bold text-sm shadow hover:bg-white transition-colors"
                >
                  <FiLock /> Admin Portal Sign In
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
