import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiBookOpen } from 'react-icons/fi';

// Dummy data for holidays
const holidays = [
  { date: '15 Aug 2026', day: 'Saturday', name: 'Independence Day', type: 'National' },
  { date: '19 Aug 2026', day: 'Wednesday', name: 'Raksha Bandhan', type: 'Festival' },
  { date: '26 Aug 2026', day: 'Wednesday', name: 'Janmashtami', type: 'Festival' },
  { date: '02 Oct 2026', day: 'Friday', name: 'Gandhi Jayanti', type: 'National' },
  { date: '22 Oct 2026', day: 'Thursday', name: 'Dussehra', type: 'Festival' },
  { date: '11 Nov 2026', day: 'Wednesday', name: 'Diwali', type: 'Festival' },
  { date: '25 Dec 2026', day: 'Friday', name: 'Christmas', type: 'Festival' },
];

const Academics = () => {
  const [activeTab, setActiveTab] = useState('Curriculum');

  return (
    <div className="pt-24 pb-20 bg-bg-light min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-5xl font-bold text-primary mb-4">Academics</h1>
          <div className="w-24 h-1 bg-accent mx-auto"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto font-body">
            Our rigorous academic framework is designed to challenge students, foster critical thinking, and prepare them for future endeavors.
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['Curriculum', 'Holiday Calendar'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-full font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-primary text-accent shadow-lg scale-105' 
                  : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
            >
              {tab === 'Curriculum' && <FiBookOpen className="inline mr-2" />}
              {tab === 'Holiday Calendar' && <FiCalendar className="inline mr-2" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 min-h-125">
          <AnimatePresence mode="wait">
            
            {/* Curriculum Tab */}
            {activeTab === 'Curriculum' && (
              <motion.div
                key="curriculum"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-heading font-bold text-primary mb-8 border-b-2 border-accent pb-2 inline-block">Syllabus Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {['Primary (I-V)', 'Middle (VI-VIII)', 'Secondary (IX-X)', 'Senior Sec (XI-XII)'].map((level, i) => (
                    <motion.div 
                      key={level}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 border border-gray-100 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow"
                    >
                      <h3 className="text-xl font-bold text-secondary mb-4">{level}</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Focuses on foundational concepts, practical learning, and continuous comprehensive evaluation (CCE).
                      </p>
                      <button className="text-accent font-semibold text-sm hover:underline">Download PDF &rarr;</button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Holiday Calendar Tab */}
            {activeTab === 'Holiday Calendar' && (
              <motion.div
                key="holiday"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-end mb-8">
                  <h2 className="text-3xl font-heading font-bold text-primary border-b-2 border-accent pb-2 inline-block">Academic Year 2026-27 Holidays</h2>
                  <button className="text-sm bg-secondary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors">
                    Download PDF
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {holidays.map((holiday, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center p-4 bg-gray-50 rounded-xl border-l-4 hover:shadow-md transition-shadow"
                      style={{ borderLeftColor: holiday.type === 'National' ? '#d4af37' : '#4a5d3a' }}
                    >
                      <div className="shrink-0 w-20 text-center border-r border-gray-200 pr-4 mr-4">
                        <div className="text-2xl font-bold text-primary leading-none">{holiday.date.split(' ')[0]}</div>
                        <div className="text-xs uppercase text-gray-500 font-semibold">{holiday.date.split(' ')[1]}</div>
                      </div>
                      <div className="grow">
                        <h4 className="font-bold text-lg text-gray-800">{holiday.name}</h4>
                        <p className="text-sm text-gray-500">{holiday.day}</p>
                      </div>
                      <div className="shrink-0">
                        <span className={`text-xs px-2 py-1 rounded-full ${holiday.type === 'National' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                          {holiday.type}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Academics;
