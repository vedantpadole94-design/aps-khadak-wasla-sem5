import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiUsers, FiBookOpen, FiMonitor, FiShield, FiTrendingUp } from 'react-icons/fi';

const StatCounter = ({ target, suffix = '+', label, icon: Icon, delay }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 1800;
      const increment = Math.max(1, target / (duration / 16));
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-xl border border-gray-100 hover:border-accent/40 transition-all duration-300"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl mb-4 group-hover:bg-accent group-hover:text-primary transition-colors">
        <Icon />
      </div>
      <div className="text-3xl sm:text-4xl font-heading font-extrabold text-primary mb-1">
        {count}
        <span className="text-accent">{suffix}</span>
      </div>
      <div className="text-gray-500 font-body text-xs sm:text-sm font-bold tracking-wider uppercase text-center">
        {label}
      </div>
    </motion.div>
  );
};

const QuickStats = () => {
  const stats = [
    { target: 1700, suffix: '+', label: 'Students Enrolled', icon: FiUsers },
    { target: 70, suffix: '+', label: 'Expert Faculty', icon: FiBookOpen },
    { target: 38, suffix: '', label: 'Digital Classrooms', icon: FiMonitor },
    { target: 100, suffix: '%', label: 'Board Pass Rate', icon: FiTrendingUp },
    { target: 136, suffix: '', label: 'Computer Terminals', icon: FiMonitor },
    { target: 146, suffix: '', label: 'CCTV Cameras', icon: FiShield },
  ];

  return (
    <section className="py-20 bg-bg-light relative z-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Key Highlights</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary">APS Khadakwasla at a Glance</h2>
          <div className="w-16 h-1 bg-accent mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <StatCounter key={index} {...stat} delay={index * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickStats;
