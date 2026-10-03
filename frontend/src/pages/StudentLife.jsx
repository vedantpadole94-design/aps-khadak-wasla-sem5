import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.55 } }),
};

const clubs = [
  { name: 'Sports Club', icon: '⚽', desc: 'Cricket, Football, Athletics, Basketball, Swimming and more.' },
  { name: 'Science Club', icon: '🔬', desc: 'Experiments, Robotics, STEM projects and Science Fairs.' },
  { name: 'Arts & Craft', icon: '🎨', desc: 'Painting, Sculpture, Pottery and creative expression.' },
  { name: 'Music & Dance', icon: '🎵', desc: 'Classical, Western, Folk music and dance forms.' },
  { name: 'Debate Society', icon: '🎤', desc: 'Public speaking, MUN, elocution and essay writing.' },
  { name: 'NCC / Scouts', icon: '🪖', desc: 'Discipline, adventure activities and leadership training.' },
];

const achievements = [
  { name: 'Arjun Mehta', class: 'XII-A', achievement: 'State Chess Champion 2025' },
  { name: 'Priya Singh', class: 'XI-B', achievement: 'National Science Olympiad Gold' },
  { name: 'Rohit Kumar', class: 'X-C', achievement: '100% in Mathematics, CBSE Board' },
  { name: 'Neha Sharma', class: 'IX-A', achievement: 'State Swimming Champion' },
];

const sports = [
  { name: 'Cricket Ground', img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80' },
  { name: 'Swimming Pool', img: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80' },
  { name: 'Basketball Court', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80' },
];

const StudentLife = () => {
  const [activeTab, setActiveTab] = useState('Clubs');
  const tabs = ['Clubs', 'Sports', 'Achievements', 'Day in Life'];

  return (
    <div className="pt-24 bg-white">
      {/* Hero */}
      <section className="bg-secondary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-5xl font-bold mb-4">Student Life</motion.h1>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="w-20 h-1 bg-accent mx-auto mb-6"></motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-gray-200 text-lg max-w-2xl mx-auto">
            Beyond books — a vibrant campus life that moulds character, creativity, and camaraderie.
          </motion.p>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-20 z-30 bg-white shadow-sm">
        <div className="container mx-auto px-4 flex gap-2 py-3 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-6 py-2 rounded-full whitespace-nowrap font-semibold text-sm transition-all ${activeTab === t ? 'bg-primary text-accent' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Clubs Tab */}
        {activeTab === 'Clubs' && (
          <motion.section key="clubs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 bg-bg-light">
            <div className="container mx-auto px-4">
              <h2 className="font-heading text-3xl font-bold text-primary text-center mb-12">Clubs & Activities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {clubs.map((club, i) => (
                  <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all border border-gray-100 text-center group"
                  >
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform inline-block">{club.icon}</div>
                    <h3 className="font-heading text-xl font-bold text-primary mb-3">{club.name}</h3>
                    <p className="text-gray-500 font-body text-sm">{club.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Sports Tab */}
        {activeTab === 'Sports' && (
          <motion.section key="sports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 bg-bg-light">
            <div className="container mx-auto px-4">
              <h2 className="font-heading text-3xl font-bold text-primary text-center mb-12">Sports Facilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {sports.map((s, i) => (
                  <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="relative rounded-2xl overflow-hidden shadow-xl group aspect-video"
                  >
                    <img src={s.img} alt={s.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                      <h3 className="text-white font-heading text-2xl font-bold p-6">{s.name}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Achievements Tab */}
        {activeTab === 'Achievements' && (
          <motion.section key="achievements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 bg-bg-light">
            <div className="container mx-auto px-4">
              <h2 className="font-heading text-3xl font-bold text-primary text-center mb-12">Student Achievements 🏆</h2>
              <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6">
                {achievements.map((a, i) => (
                  <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-lg border-l-4 border-accent"
                  >
                    <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-2xl font-bold text-accent">{i + 1}</div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-primary">{a.name} <span className="text-sm text-gray-500 font-normal">({a.class})</span></h3>
                      <p className="text-secondary font-semibold text-sm mt-1">{a.achievement}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Day in Life Tab */}
        {activeTab === 'Day in Life' && (
          <motion.section key="daylife" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 bg-bg-light">
            <div className="container mx-auto px-4">
              <h2 className="font-heading text-3xl font-bold text-primary text-center mb-12">A Day at APS Khadakwasla</h2>
              <div className="max-w-3xl mx-auto space-y-6">
                {[
                  { time: '7:00 AM', activity: 'Morning Assembly & PT', emoji: '🌅' },
                  { time: '8:00 AM', activity: 'First Period Begins', emoji: '📚' },
                  { time: '10:15 AM', activity: 'Recess & Breakfast', emoji: '🍱' },
                  { time: '12:30 PM', activity: 'Lunch Break', emoji: '🥗' },
                  { time: '1:30 PM', activity: 'Afternoon Classes', emoji: '✏️' },
                  { time: '3:30 PM', activity: 'Sports & Club Activities', emoji: '⚽' },
                  { time: '5:00 PM', activity: 'Dispersal / Buses', emoji: '🚌' },
                ].map((d, i) => (
                  <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="flex items-center gap-6 bg-white p-5 rounded-xl shadow border-l-4 border-secondary"
                  >
                    <span className="text-3xl">{d.emoji}</span>
                    <div>
                      <span className="text-accent font-bold text-lg font-heading">{d.time}</span>
                      <p className="text-gray-700 font-body">{d.activity}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentLife;
