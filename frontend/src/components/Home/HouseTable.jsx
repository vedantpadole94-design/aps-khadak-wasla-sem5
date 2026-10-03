import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiShield, FiMusic } from 'react-icons/fi';

const houseData = {
  primary: [
    { name: 'Shivaji House', position: 1, color: '#FF9933', badge: '1st Place 🏆', motto: 'Valor & Leadership', icon: '🦁' },
    { name: 'RanaPratap House', position: 2, color: '#F8FAFC', textColor: '#0F172A', badge: '2nd Place 🥈', motto: 'Courage & Honour', icon: '⚔️' },
    { name: 'Ashoka House', position: 3, color: '#138808', badge: '3rd Place 🥉', motto: 'Peace & Wisdom', icon: '🕊️' },
    { name: 'Ranjit House', position: 4, color: '#D4AF37', badge: '4th Place 🌟', motto: 'Strength & Determination', icon: '🦅' }
  ],
  secondary: [
    { name: 'Shivaji House', position: 1, color: '#FF9933', badge: '1st Place 🏆', motto: 'Valor & Leadership', icon: '🦁' },
    { name: 'RanaPratap House', position: 2, color: '#F8FAFC', textColor: '#0F172A', badge: '2nd Place 🥈', motto: 'Courage & Honour', icon: '⚔️' },
    { name: 'Ashoka House', position: 3, color: '#138808', badge: '3rd Place 🥉', motto: 'Peace & Wisdom', icon: '🕊️' },
    { name: 'Ranjit House', position: 4, color: '#D4AF37', badge: '4th Place 🌟', motto: 'Strength & Determination', icon: '🦅' }
  ]
};

const folkSongWinners = [
  'Pragati Sonar', 'Vaibhavi Sonawane', 'Devansh Ghadage',
  'Avanti Salunke', 'Prachi Singh', 'Shravani Devare',
  'Lara Gawade', 'Kumari Saloni', 'Abhijeet Dhokrat', 'Jyoti Sarode'
];

export default function HouseTable() {
  const [wing, setWing] = useState('primary');

  return (
    <section className="py-20 bg-white border-t border-gray-100" id="houses">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-primary text-xs font-bold tracking-widest uppercase mb-3">
            <FiShield className="text-accent" /> Inter-House Spirit
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
            House System & Trophies
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6" />
          <p className="text-gray-600 text-base md:text-lg">
            Fostering healthy competition, esprit de corps, discipline and leadership through four noble houses named after India's greatest historical legends.
          </p>

          {/* Toggle Primary / Secondary */}
          <div className="inline-flex p-1.5 bg-gray-100 rounded-xl mt-6">
            <button
              onClick={() => setWing('primary')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                wing === 'primary' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:text-primary'
              }`}
            >
              Primary Wing (Classes I - V)
            </button>
            <button
              onClick={() => setWing('secondary')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                wing === 'secondary' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:text-primary'
              }`}
            >
              Secondary Wing (Classes VI - XII)
            </button>
          </div>
        </div>

        {/* House Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {houseData[wing].map((house, idx) => {
            const isWhite = house.name.includes('RanaPratap');
            return (
              <motion.div
                key={house.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative rounded-2xl p-6 shadow-xl border border-gray-100 overflow-hidden flex flex-col justify-between"
                style={{
                  backgroundColor: house.color,
                  color: isWhite ? '#0F172A' : '#FFFFFF',
                  borderColor: isWhite ? '#E2E8F0' : 'transparent'
                }}
              >
                {/* Background watermark icon */}
                <div className="absolute right-2 bottom-2 text-7xl opacity-15 select-none pointer-events-none">
                  {house.icon}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full ${
                        isWhite ? 'bg-primary text-white' : 'bg-black/25 text-white backdrop-blur-sm'
                      }`}
                    >
                      Rank #{house.position}
                    </span>
                    <span className="text-2xl">{house.icon}</span>
                  </div>

                  <h3 className="font-heading text-2xl font-bold mb-1">
                    {house.name}
                  </h3>
                  <p className={`text-xs font-serif italic mb-4 ${isWhite ? 'text-gray-600' : 'text-white/80'}`}>
                    "{house.motto}"
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-black/10 flex items-center justify-between">
                  <span className="font-bold text-sm">{house.badge}</span>
                  <FiAward className="text-xl opacity-80" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Folk Song Competition Spotlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-secondary text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-accent text-primary flex items-center justify-center text-3xl shrink-0 shadow-lg">
              <FiMusic />
            </div>
            <div className="grow text-center md:text-left">
              <span className="text-accent text-xs font-bold uppercase tracking-widest">
                Prestigious CCA Honor
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold mt-1 mb-2">
                Inter-House Folk Song Competition Champions
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Honoring the extraordinary musical talents and cultural pride of our winning students:
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {folkSongWinners.map((winner, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-xs font-medium text-white border border-white/15"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {winner}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
