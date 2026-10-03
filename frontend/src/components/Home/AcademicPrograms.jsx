import React from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiCpu, FiGlobe } from 'react-icons/fi';

const ProgramCard = ({ title, description, icon: Icon, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="group perspective w-full h-[350px]"
    >
      <div className="relative preserve-3d group-hover:rotate-y-180 w-full h-full duration-1000">
        {/* Front */}
        <div className="absolute backface-hidden w-full h-full bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center text-primary text-4xl mb-6 group-hover:scale-110 transition-transform">
            <Icon />
          </div>
          <h3 className="font-heading text-2xl font-bold text-primary mb-4">{title}</h3>
          <p className="font-body text-gray-500 line-clamp-3">{description}</p>
          <div className="mt-6 text-accent font-semibold tracking-wider text-sm uppercase">Hover to Explore</div>
        </div>
        
        {/* Back */}
        <div className="absolute backface-hidden rotate-y-180 w-full h-full bg-primary text-white rounded-xl shadow-xl p-8 flex flex-col items-center justify-center text-center">
          <h3 className="font-heading text-2xl font-bold text-accent mb-4">{title} Curriculum</h3>
          <ul className="text-sm space-y-2 mb-6 text-gray-300">
            <li>✓ Advanced Laboratory Access</li>
            <li>✓ Expert Mentorship</li>
            <li>✓ Comprehensive Study Material</li>
            <li>✓ Regular Assessments</li>
          </ul>
          <button className="px-6 py-2 border border-accent text-accent hover:bg-accent hover:text-primary transition-colors rounded">
            View Syllabus
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const AcademicPrograms = () => {
  return (
    <section className="py-24 bg-bg-light relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4"
          >
            Academic Excellence
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-accent mx-auto"
          ></motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProgramCard 
            title="Science Stream" 
            icon={FiCpu} 
            delay={0.1}
            description="Physics, Chemistry, Mathematics, and Biology with state-of-the-art laboratories."
          />
          <ProgramCard 
            title="Commerce Stream" 
            icon={FiBook} 
            delay={0.3}
            description="Accountancy, Business Studies, and Economics focusing on modern financial practices."
          />
          <ProgramCard 
            title="Humanities" 
            icon={FiGlobe} 
            delay={0.5}
            description="History, Geography, Political Science, fostering critical thinking and global awareness."
          />
        </div>
      </div>
    </section>
  );
};

export default AcademicPrograms;
