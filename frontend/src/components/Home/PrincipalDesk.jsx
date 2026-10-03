import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiAward, FiBookOpen } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { api, assetUrl } from '../../utils/api';

const defaultPrincipal = {
  name: 'Dr. Yasmin Kaur',
  qualification: 'BSc(Chemistry), MSc(Organic Chemistry), B.Ed, PGDEA',
  message: 'Greetings, dear students, parents, and educators,\n\nAt APS Khadakwasla, we believe in the power of education to transform lives and shape a brighter future. As we embark on this academic journey together, I am thrilled to share our commitment to providing an inspiring and holistic learning environment for all. With the recent implementation of the National Education Policy (NEP), we are embracing innovative pedagogical approaches that cater to individual learning styles, foster critical thinking, and nurture a lifelong love for learning.\n\nOur dedicated team of educators is steadfast in their pursuit of excellence, adapting teaching methodologies to align with the evolving needs of our students and the dynamic world around us. As the principal, my vision is to empower our students to become confident, compassionate, and responsible global citizens.',
  photo: ''
};

const PrincipalDesk = () => {
  const [data, setData] = useState(defaultPrincipal);

  useEffect(() => {
    api.list('principal')
      .then((res) => {
        if (res.data && res.data.name) {
          setData(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const photoSrc = data.photo
    ? (data.photo.startsWith('/assets') ? data.photo : assetUrl(data.photo))
    : '/assets/aps-logo.svg';

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/5 skew-x-12 origin-top-right pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Image Side with Military Crest & Frame */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-5/12 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4] bg-gradient-to-br from-primary via-navy to-secondary p-2 flex flex-col justify-end">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <img 
                  src={photoSrc} 
                  alt={data.name} 
                  className="max-h-72 w-auto object-contain drop-shadow-2xl transition-transform hover:scale-105 duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/school-logo-transparent.png';
                  }}
                />
              </div>

              <div className="relative z-10 p-6 rounded-2xl bg-[#0A1628]/85 backdrop-blur-md border border-gold/30 text-white">
                <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider mb-1">
                  <FiAward /> Head of Institution
                </div>
                <h3 className="font-heading text-2xl font-bold text-white">{data.name}</h3>
                <p className="font-body text-xs text-gold/90 font-medium mt-0.5">{data.qualification}</p>
                <p className="font-body text-xs text-gray-300 mt-1">Principal, Army Public School Khadakwasla</p>
              </div>
            </div>

            {/* Design accents */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-accent rounded-tl-xl -z-10" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-accent rounded-br-xl -z-10" />
          </motion.div>

          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-7/12"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-1 bg-accent" />
              <h4 className="font-body text-secondary font-bold tracking-widest uppercase text-sm">
                From the Principal's Desk
              </h4>
            </div>
            
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-primary font-bold mb-6 leading-tight">
              Empowering Minds, <br />
              <span className="text-accent">Building a Greater Nation</span>
            </h2>
            
            <div className="prose prose-lg text-gray-600 font-body mb-8">
              <p className="mb-5 text-lg italic border-l-4 border-accent pl-4 text-gray-700 font-serif">
                "Our vision is to empower our students to become confident, compassionate, and responsible global citizens."
              </p>
              <div className="text-base sm:text-lg leading-relaxed text-gray-600 whitespace-pre-line">
                {data.message}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <Link 
                to="/about#principal" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-secondary transition-colors group shadow-lg"
              >
                Read Institutional Profile
                <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                to="/faculty" 
                className="inline-flex items-center gap-2 px-6 py-4 border-2 border-primary/20 text-primary font-semibold rounded-xl hover:bg-primary/5 transition-colors"
              >
                <FiBookOpen /> Meet Our 70+ Faculty
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PrincipalDesk;
