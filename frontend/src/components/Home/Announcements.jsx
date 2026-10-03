import React from 'react';
import { motion } from 'framer-motion';
import { FiBell } from 'react-icons/fi';

const Announcements = () => {
  const notices = [
    "Admission for Academic Year 2026-27 is now open.",
    "Annual Sports Meet scheduled for next month.",
    "Parent-Teacher Meeting for Classes X and XII this Saturday.",
    "New Science Lab inauguration by the Principal.",
  ];

  return (
    <div className="bg-secondary text-white py-3 relative z-20 overflow-hidden shadow-lg border-y-4 border-accent">
      <div className="container mx-auto px-4 flex items-center">
        <div className="flex items-center gap-2 font-heading font-bold text-accent whitespace-nowrap bg-secondary z-10 pr-4">
          <FiBell className="animate-bounce" />
          <span>LATEST UPDATES:</span>
        </div>
        <div className="flex-1 overflow-hidden relative h-6">
          <motion.div
            className="flex whitespace-nowrap absolute"
            animate={{ x: [0, -1000] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {notices.map((notice, index) => (
              <span key={index} className="mx-8 font-body text-sm tracking-wide">
                {notice}
              </span>
            ))}
            {/* Duplicate for seamless looping */}
            {notices.map((notice, index) => (
              <span key={`dup-${index}`} className="mx-8 font-body text-sm tracking-wide">
                {notice}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
