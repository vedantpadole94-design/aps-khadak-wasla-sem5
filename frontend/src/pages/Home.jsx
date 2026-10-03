import React, { lazy, Suspense } from 'react';
import Announcements from '../components/Home/Announcements';
import QuickStats from '../components/Home/QuickStats';
import PrincipalDesk from '../components/Home/PrincipalDesk';
import ResultsTable from '../components/Home/ResultsTable';
import HouseTable from '../components/Home/HouseTable';
import AcademicPrograms from '../components/Home/AcademicPrograms';
import Facilities from '../components/Home/Facilities';
import GalleryPreview from '../components/Home/GalleryPreview';
import { motion } from 'framer-motion';
import { FiChevronDown, FiShield, FiCompass, FiAward } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Hero3D = lazy(() => import('../components/3D/Hero3D'));
const Hero3DLogo = lazy(() => import('../components/3D/Hero3DLogo'));

const Home = () => {
  return (
    <div className="bg-bg-light">
      {/* Hero Section */}
      <section className="relative min-h-svh md:min-h-dvh flex flex-col justify-center overflow-hidden">
        <Suspense fallback={null}>
          <Hero3D />
        </Suspense>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center lg:text-left mt-16 sm:mt-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-bold tracking-widest uppercase mb-4 shadow">
                <FiShield className="text-accent" /> National Defence Academy (NDA), Pune
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
                Army Public School <br />
                <span className="text-accent">Khadakwasla</span>
              </h1>
              <p className="font-body text-base sm:text-xl text-gray-200 mb-8 sm:mb-10 max-w-2xl drop-shadow-md leading-relaxed">
                Affiliated to CBSE (1180026) | Governed by Army Welfare Education Society (AWES). 
                Excellence in Education. Instilling Discipline. Inspiring Patriotism.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/admission" className="w-full sm:w-auto px-8 py-4 bg-accent text-primary font-bold rounded-xl text-center hover:bg-white transition-all shadow-lg shadow-accent/20 hover:-translate-y-1">
                  Explore Admissions
                </Link>
                <Link to="/enquiry" className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-bold rounded-xl text-center hover:bg-white hover:text-primary transition-all shadow-lg hover:-translate-y-1">
                  Enquire Now
                </Link>
              </div>
            </motion.div>

            {/* Interactive 3D Spinning School Logo Model */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="w-full flex justify-center items-center"
            >
              <Suspense fallback={<div className="w-64 h-64" />}>
                <Hero3DLogo />
              </Suspense>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-white/70"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-xs uppercase tracking-widest mb-2 font-body font-semibold">Scroll</span>
          <FiChevronDown className="text-2xl" />
        </motion.div>
      </section>

      {/* Welcome Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[1.2fr_0.8fr] lg:px-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold tracking-widest uppercase mb-3">
              <FiCompass /> Welcome to APS Khadakwasla
            </div>
            <h2 className="mb-6 font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-primary leading-tight">
              Learning with purpose, courage and care.
            </h2>
            <div className="w-20 h-1 bg-accent mb-6" />
            <p className="mb-4 text-base sm:text-lg leading-relaxed text-gray-600">
              Army Public School Khadakwasla is located in the serene, pristine and picturesque premises of National Defence Academy (NDA) alma mater of the defence forces. It is 16 kms from Pune city and 4 kms from the famous Khadakwasla lake.
            </p>
            <p className="mb-4 text-base sm:text-lg leading-relaxed text-gray-600">
              The school started on 1st April 2012 and is a part of a wide network of schools governed by Army Welfare Education Society (AWES), which aims to provide quality education to wards of defence personnel.
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-600">
              In the portals of Army Public School Khadakwasla, students discover their own talents and get an opportunity to develop them to the fullest. The school provides a stimulating and competitive environment to its students and our highly qualified and dedicated faculty guide them to their goal.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid gap-6">
            <div className="rounded-3xl bg-primary p-8 text-white shadow-xl border-l-4 border-accent">
              <div className="flex items-center gap-3 mb-3">
                <FiAward className="text-accent text-2xl" />
                <h3 className="font-heading text-2xl font-bold text-accent">Our Mission</h3>
              </div>
              <p className="leading-relaxed text-gray-200">
                To provide enabling learning environment with empowered faculty and required Infrastructure for children to realise full potential and face challenges of life.
              </p>
            </div>

            <div className="rounded-3xl border border-primary/10 bg-bg-light p-8 shadow-md border-l-4 border-secondary">
              <div className="flex items-center gap-3 mb-3">
                <FiCompass className="text-secondary text-2xl" />
                <h3 className="font-heading text-2xl font-bold text-primary">Our Vision</h3>
              </div>
              <p className="leading-relaxed text-gray-600">
                Be an organization committed to excellence for holistic development of children, making them global citizens for nation building.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Notices & Announcements Ticker */}
      <Announcements />

      {/* Stats with Animated Numbers */}
      <QuickStats />

      {/* Principal Desk Profile */}
      <PrincipalDesk />

      {/* CBSE Class X and Class XII Board Results */}
      <ResultsTable />

      {/* House System & Trophy Standings */}
      <HouseTable />

      {/* Academic Programs */}
      <AcademicPrograms />

      {/* Campus Infrastructure Highlights */}
      <Facilities />

      {/* Campus Life Gallery Preview */}
      <GalleryPreview />
    </div>
  );
};

export default Home;
