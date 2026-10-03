import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBookOpen, FiCheckCircle, FiMail, FiPhone } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';

const content = {
  about: {
    eyebrow: 'Our story and values',
    title: 'About Us',
    intro: 'A legacy of academic excellence, holistic development and disciplined service to defence families.',
    sections: [
      { id: 'history', title: 'History', text: 'NDA English School was established on 1st February 1955. In 1975, it was taken over by the National Defence Academy (NDA) from the Pune Jesuits Society. The following year, in 1976, the school was registered under the Society Registration Act and later under the Zilla Parishad in 1980. A major milestone came in 2012 when the school was upgraded to Army Public School (APS) Khadakwasla, with Class VI as the highest class at the time.\n\nThe school continued to grow steadily, receiving affiliation from the Central Board of Secondary Education (CBSE) on 10th February 2014. In 2016, it was further upgraded to include Class X, effective from 1st April. Another significant achievement came on 11th August 2021, when APS Khadakwasla was upgraded to a Senior Secondary School, offering education up to Class XII.\n\nAt present, the school comprises 38 well-equipped classrooms and provides quality education from Classes I to XII. With a student strength of over 1,700, APS Khadakwasla continues to uphold its legacy of academic excellence and holistic development in a disciplined and nurturing environment.' },
      { id: 'vision', title: 'Vision and mission', text: 'Be an organization committed to excellence for holistic development of children, making them global citizens for nation building. To provide enabling learning environment with empowered faculty and required infrastructure for children to realise full potential and face challenges of life.' },
      { id: 'awes', title: 'Army Welfare Education Society', text: 'Army Public School Khadakwasla is part of the wide network of schools governed by Army Welfare Education Society, which aims to provide quality education to wards of defence personnel.' },
      { id: 'rules', title: 'School rules', type: 'list', items: ['Identity card must be worn to school on all days and the school diary must be brought every day.', 'Minimum 75% attendance is required; leave should be applied for in advance and supported by a medical certificate when needed.', 'Students are expected to greet teachers and elders, show behavioural excellence and never bully, use foul language or damage school property.', 'Students must be present 10 minutes before the scheduled time. The gate closes at 7:40 AM; three late arrivals may result in disciplinary action.', 'Uniforms must be neat, washed and ironed, with well-groomed hair and correct waist-level trousers or skirts.', 'Mobile phones and half days are not permitted. Students absent for 10 or more days may have their names struck off.', 'Library books may be borrowed one at a time for seven days; late returns attract a fine of Rs.4 per day.'] },
      { id: 'discipline', title: 'Discipline', text: 'The school emphasizes a high standard of discipline and also demands from students serious application to their studies as well as other pursuits. This calls for co-operation from the parents. The Principal may order withdrawal of a student should conduct be detrimental to discipline. Three warning cards result in suspension or expulsion.' },
    ],
  },
  infrastructure: {
    eyebrow: 'Our campus',
    title: 'Infrastructure',
    intro: 'A safe, modern and stimulating campus designed to help every learner explore, create and grow.',
    sections: [
      { title: 'Campus at a glance', type: 'stats', items: [['34', 'Classrooms'], ['2', 'Computer labs'], ['1', 'Science lab'], ['9,000+', 'Library books'], ['136', 'Computers'], ['146', 'CCTV cameras'], ['34', 'Smart boards'], ['2', 'Gardens']] },
      { title: 'Classrooms', text: 'Each classroom is well equipped with quality study furniture, racks, cupboards, bulletin boards and display boards. Tables and benches are carefully carpentered with round, smooth edges for a safe learning environment.' },
      { title: 'Computer lab', text: 'Our lab has 60 systems including Dell PCs, HP PCs, thin clients and a dedicated server. Students from Classes I to XII learn through a flexible curriculum using Python IDLE, Anaconda, NetBeans, GIMP, Synfig, MySQL, MS Office and Tux Paint.' },
      { title: 'Library', text: 'The library has over 9,000 books, 20 magazines, five daily newspapers and 12 Kindles. Its collection spans classics, modern science fiction and subject resources selected by teachers and the librarian.' },
      { title: 'Sports and wellness', text: 'Physical activity develops teamwork, leadership, dedication, discipline and self-confidence. Students can participate in athletics, fencing, softball, Kho-Kho, Kabbadi, basketball, football, cricket and yoga.' },
      { title: 'Composite science lab', text: 'A modern lab accommodates more than 40 students and provides an open environment for experiments and research, with equipment for Physics and apparatus and chemicals for Chemistry.' },
    ],
  },
  cca: {
    eyebrow: 'Beyond the classroom',
    title: 'Co-Curricular Activities',
    intro: 'Students discover their interests, practise collaboration and build confidence through a rich programme of activities.',
    sections: [
      { title: 'Activity pillars', type: 'cards', items: ['Co-Curricular Activities', 'House System', 'Activity Planner', 'Student Creative Corner'] },
      { title: 'A culture of participation', text: 'From assemblies and music to art, dance, clubs and inter-house competitions, every student receives opportunities to participate, perform and learn from peers.' },
      { title: 'Awards and recognition', type: 'list', items: ['Best all-rounder in each class', 'Overall academic performance', 'Hundred Percent Attendance prize', 'Best Improvement in each section', 'Best House Trophy', 'Best House in Sports Trophy', 'Best House in Discipline Trophy', 'Best House Assembly', 'Best Class Assembly'] },
    ],
  },
  achievements: {
    eyebrow: 'Pride of APS Khadakwasla',
    title: 'Achievements',
    intro: 'Celebrating the academic, sporting, creative and leadership accomplishments of our school community.',
    sections: [
      { title: 'House positions', type: 'stats', items: [['01', 'Shivaji House'], ['02', 'RanaPratap House'], ['03', 'Ashoka House'], ['04', 'Ranjit House']] },
      { title: 'Inter House Folk Song Competition', type: 'list', items: ['Pragati Sonar, Vaibhavi Sonawane, Devansh Ghadage', 'Avanti Salunke, Prachi Singh, Shravani Devare', 'Lara Gawade, Kumari Saloni, Abhijeet Dhokrat, Jyoti Sarode'] },
      { title: 'Academic and student achievements', text: 'The school recognises consistent academic performance, improvement, attendance, sportsmanship, creativity and responsible leadership throughout the year.' },
    ],
  },
  hpd: {
    eyebrow: 'Holistic personality development',
    title: 'HPD',
    intro: 'Value education and life skills help students become confident, compassionate and responsible citizens.',
    sections: [
      { title: 'Annual plans', type: 'cards', items: ['Value Education Annual Plan', 'Life Skill Annual Plan', 'Wellness and mindfulness', 'Leadership and citizenship'] },
      { title: 'Our approach', text: 'Learning at APS extends beyond textbooks. Students reflect on values, practise communication and teamwork, and develop the resilience needed to face the challenges of life.' },
    ],
  },
  recruitment: {
    eyebrow: 'Join our team',
    title: 'Recruitment',
    intro: 'Army Public School Khadakwasla welcomes committed educators and staff who share our vision of excellence and service.',
    sections: [
      { title: 'Opportunities', type: 'cards', items: ['Teaching positions', 'Primary teacher positions', 'Administrative staff', 'Laboratory and technical support'] },
      { title: 'Application information', text: 'Recruitment notices and application forms are published as vacancies become available. Please check the school notice board or contact the school office for the latest schedule and eligibility requirements.' },
      { title: 'School office', type: 'contact' },
    ],
  },
};

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: (index = 0) => ({ opacity: 1, y: 0, transition: { delay: index * 0.08, duration: 0.55 } }) };

function SectionBlock({ section, index }) {
  return (
    <motion.section id={section.id || section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')} variants={fadeUp} custom={index} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="mb-16 scroll-mt-28">
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">{section.title}</h2>
      <div className="h-1 w-16 bg-accent mb-8" />
      {section.text && <div className="max-w-4xl whitespace-pre-line text-lg leading-8 text-gray-600">{section.text}</div>}
      {section.type === 'stats' && <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{section.items.map(([value, label]) => <div key={label} className="rounded-2xl bg-primary p-5 text-white shadow-lg"><strong className="block font-heading text-3xl text-accent">{value}</strong><span className="text-sm text-gray-200">{label}</span></div>)}</div>}
      {section.type === 'cards' && <div className="grid sm:grid-cols-2 gap-4">{section.items.map((item) => <div key={item} className="group rounded-2xl border border-primary/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><FiBookOpen className="mb-4 text-2xl text-accent transition group-hover:rotate-6" /><h3 className="font-heading text-xl font-bold text-primary">{item}</h3><FiArrowRight className="mt-5 text-secondary" /></div>)}</div>}
      {section.type === 'list' && <div className="grid md:grid-cols-2 gap-4">{section.items.map((item) => <div key={item} className="flex gap-3 rounded-xl bg-white p-4 shadow-sm"><FiCheckCircle className="mt-1 shrink-0 text-secondary" /><span className="text-gray-700">{item}</span></div>)}</div>}
      {section.type === 'contact' && <div className="grid sm:grid-cols-2 gap-4 max-w-2xl"><a href="tel:02025290084" className="flex items-center gap-3 rounded-xl bg-white p-5 shadow-sm text-primary"><FiPhone className="text-accent" />020-25290084</a><a href="mailto:apskhadakwasla1@gmail.com" className="flex items-center gap-3 rounded-xl bg-white p-5 shadow-sm text-primary"><FiMail className="text-accent" />apskhadakwasla1@gmail.com</a></div>}
    </motion.section>
  );
}

export default function InformationPage({ pageKey }) {
  const defaultPage = content[pageKey] || content.infrastructure;
  const [loadedPage, setLoadedPage] = useState(null);
  const page = loadedPage?.key === pageKey ? loadedPage.value : defaultPage;

  useEffect(() => {
    api.list(`pages/${pageKey}`)
      .then((res) => {
        if (res.data && res.data.content && res.data.content.sections) {
          setLoadedPage({ key: pageKey, value: res.data.content });
        }
      })
      .catch(() => {});
  }, [pageKey]);

  return (
    <div className="pt-24 bg-bg-light min-h-screen">
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-3 uppercase tracking-[0.25em] text-accent text-sm font-semibold">{page.eyebrow}</p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-5xl md:text-6xl font-bold mb-5">
            {page.title}
          </motion.h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-300 leading-relaxed">{page.intro}</p>
        </div>
      </section>
      <main className="container mx-auto px-4 py-16 md:py-24">
        {page.sections && page.sections.map((section, index) => (
          <SectionBlock key={section.id || section.title || index} section={section} index={index} />
        ))}
        <div className="rounded-2xl bg-secondary p-8 text-white md:flex items-center justify-between gap-8 mt-12 shadow-lg">
          <div>
            <h2 className="font-heading text-2xl font-bold mb-2">Need more information?</h2>
            <p className="text-white/80">Our school office at NDA Khadakwasla will be happy to help you.</p>
          </div>
          <Link to="/contact" className="mt-5 md:mt-0 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-bold text-primary hover:bg-white transition-colors shadow">
            Contact School Office <FiArrowRight />
          </Link>
        </div>
      </main>
    </div>
  );
}
