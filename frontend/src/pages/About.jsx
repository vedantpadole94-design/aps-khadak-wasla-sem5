import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const timelineData = [
  { year: '1980', title: 'Foundation', desc: 'Established under Army Welfare Education Society to serve defence families in Pune.' },
  { year: '1990', title: 'CBSE Affiliation', desc: 'Received full CBSE affiliation, expanding academic programs to Class XII.' },
  { year: '2000', title: 'Infrastructure Growth', desc: 'New science labs, library block, and sports complex inaugurated.' },
  { year: '2010', title: 'Digital Classrooms', desc: 'Introduced smart boards and a dedicated computer lab with 60+ systems.' },
  { year: '2020', title: 'Centre of Excellence', desc: 'Recognised as a Centre of Excellence by Army Welfare Education Society.' },
  { year: '2025', title: 'World-Class Campus', desc: 'Completed modernisation drive — new auditorium, STEM lab, and EV charging for staff.' },
];

const leaders = [
  { name: 'Col. A. K. Sharma (Retd.)', role: 'Principal', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
  { name: 'Mrs. Priya Mehta', role: 'Vice Principal', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
  { name: 'Mr. Deepak Rao', role: 'Head Master', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
];

const facilities = ['Modern Library', 'Science & Biology Labs', 'Computer Lab (100+ systems)', 'Sports Complex', 'Auditorium (500 seats)', 'Smart Classrooms', 'Canteen & Cafeteria', 'Medical Room'];

const About = () => {
  return (
    <div className="pt-24 bg-white">
      {/* Page Hero */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" className="font-heading text-5xl font-bold mb-4">About Us</motion.h1>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="w-20 h-1 bg-accent mx-auto mb-6"></motion.div>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="text-gray-300 max-w-2xl mx-auto font-body text-lg">
            A legacy of excellence, discipline, and patriotism — shaping leaders since 1980.
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-bg-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-primary mb-4">Our History</h2>
            <div className="w-20 h-1 bg-accent mx-auto"></div>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-primary/20"></div>
            {timelineData.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className={`flex items-center gap-8 mb-12 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`w-5/12 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <span className="text-accent font-heading font-bold text-2xl">{item.year}</span>
                    <h3 className="font-heading text-xl font-bold text-primary mt-1 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm font-body">{item.desc}</p>
                  </div>
                </div>
                <div className="w-2/12 flex justify-center">
                  <div className="w-6 h-6 rounded-full bg-accent border-4 border-white shadow-lg z-10"></div>
                </div>
                <div className="w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-primary mb-4">Vision & Mission</h2>
            <div className="w-20 h-1 bg-accent mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {[
              { title: 'Vision', icon: '🔭', content: 'To be a premier institution that nurtures holistic individuals — academically proficient, morally upright, and deeply patriotic.' },
              { title: 'Mission', icon: '🎯', content: 'Deliver excellence in education through innovation, discipline, and values aligned with the spirit of the Indian Armed Forces.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-10 bg-primary text-white rounded-2xl shadow-xl hover:-translate-y-2 transition-transform"
              >
                <div className="text-5xl mb-6">{item.icon}</div>
                <h3 className="font-heading text-2xl font-bold text-accent mb-4">{item.title}</h3>
                <p className="font-body text-gray-200 leading-relaxed">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-bg-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-primary mb-4">School Leadership</h2>
            <div className="w-20 h-1 bg-accent mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {leaders.map((l, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden shadow-xl mb-6 border-4 border-accent group-hover:scale-105 transition-transform">
                  <img src={l.img} alt={l.name} className="object-cover w-full h-full" />
                </div>
                <h3 className="font-heading text-xl font-bold text-primary">{l.name}</h3>
                <p className="text-secondary font-semibold font-body">{l.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold mb-4">Infrastructure</h2>
            <div className="w-20 h-1 bg-accent mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {facilities.map((f, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="p-4 border border-white/20 rounded-xl text-center hover:border-accent hover:bg-white/5 transition-all"
              >
                <p className="font-body font-semibold text-sm">{f}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
