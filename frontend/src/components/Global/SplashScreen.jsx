import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Only show splash screen once per tab session if desired, or short intro
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#0A1628] text-white overflow-hidden pointer-events-auto"
        >
          {/* Subtle Tri-Color Ambient Glow */}
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#FF9933]/15 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#138808]/15 to-transparent blur-3xl pointer-events-none" />

          {/* Central Rotating Glow Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute w-80 h-80 rounded-full border border-gold/20 border-dashed pointer-events-none"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute w-96 h-96 rounded-full border border-white/10 pointer-events-none"
          />

          {/* Main Rotating / Scaled Logo */}
          <div className="relative mb-6">
            <motion.div
              animate={{ rotateY: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-36 h-36 sm:w-44 sm:h-44 relative flex items-center justify-center"
            >
              <img
                src="/assets/aps-logo.svg"
                alt="APS Khadakwasla Crest"
                className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(212,175,55,0.7)]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/school-logo-transparent.png';
                }}
              />
            </motion.div>
          </div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center px-4"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide text-white font-heading">
              ARMY PUBLIC SCHOOL
            </h1>
            <p className="text-sm sm:text-base tracking-[0.3em] font-semibold text-[#D4AF37] uppercase mt-1">
              KHADAKWASLA, PUNE
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-3" />
            <p className="text-xs sm:text-sm text-gray-300 tracking-widest italic font-serif">
              "Truth is God | Service Before Self"
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 sm:w-64 h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-[#FF9933] via-[#D4AF37] to-[#138808]"
            />
          </div>

          <button
            onClick={() => setVisible(false)}
            className="mt-6 text-xs text-gray-400 hover:text-white underline tracking-wider uppercase"
          >
            Skip Intro →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
