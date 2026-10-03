import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiShield, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-[#0A1628] text-white pt-16 pb-8 border-t-4 border-accent">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* About Column with 80px Logo */}
          <div>
            <div className="flex items-center gap-4 mb-5">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="w-[80px] h-[80px] shrink-0"
              >
                <img
                  src="/assets/aps-logo.svg"
                  alt="Army Public School Khadakwasla Crest"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(212,175,55,0.4)]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/school-logo-transparent.png';
                  }}
                />
              </motion.div>
              <div>
                <h3 className="font-heading font-bold text-lg text-white leading-tight">
                  Army Public School
                </h3>
                <p className="text-xs font-semibold text-accent uppercase tracking-wider">
                  Khadakwasla, Pune
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  CBSE Affiliation: 1180026<br />School Code: 34114
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm mb-4 leading-relaxed font-body">
              Nestled in the prestigious National Defence Academy (NDA) alma mater premises. Governed by Army Welfare Education Society (AWES).
            </p>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl mb-6">
              <p className="text-xs text-gold font-serif italic text-center">
                "Truth is God | Service Before Self"
              </p>
            </div>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors text-sm">
                <FiFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors text-sm">
                <FiTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors text-sm">
                <FiInstagram />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors text-sm">
                <FiYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-5 relative inline-block text-white">
              Institutional Links
              <span className="absolute -bottom-1.5 left-0 w-12 h-1 bg-accent rounded"></span>
            </h4>
            <ul className="space-y-2.5 text-gray-300 text-xs sm:text-sm">
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us & History</Link></li>
              <li><Link to="/infrastructure" className="hover:text-accent transition-colors">Campus & Laboratories</Link></li>
              <li><Link to="/academics" className="hover:text-accent transition-colors">Academics & NEP Pedagogy</Link></li>
              <li><Link to="/faculty" className="hover:text-accent transition-colors">Faculty Directory (70+ Staff)</Link></li>
              <li><Link to="/cca" className="hover:text-accent transition-colors">Co-Curricular Activities & Houses</Link></li>
              <li><Link to="/admission" className="hover:text-accent transition-colors">Admissions & Rules</Link></li>
              <li><Link to="/mandatory-disclosure" className="hover:text-accent transition-colors flex items-center gap-1.5"><FiFileText className="text-accent" /> CBSE Mandatory Disclosure (SARAS)</Link></li>
              <li><Link to="/gallery" className="hover:text-accent transition-colors">Photo & Video Gallery</Link></li>
              <li><Link to="/recruitment" className="hover:text-accent transition-colors">Staff Recruitment</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-5 relative inline-block text-white">
              Contact School Office
              <span className="absolute -bottom-1.5 left-0 w-12 h-1 bg-accent rounded"></span>
            </h4>
            <ul className="space-y-4 text-gray-300 text-xs sm:text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-accent text-lg shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Army Public School Khadakwasla<br />
                  Barrack No. 03, Opp Gole Market<br />
                  NDA Khadakwasla, Pune 411023
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-accent text-lg shrink-0" />
                <a href="tel:02025290084" className="hover:text-accent transition-colors">
                  020-25290084
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-accent text-lg shrink-0" />
                <a href="mailto:apskhadakwasla1@gmail.com" className="hover:text-accent transition-colors break-all">
                  apskhadakwasla1@gmail.com
                </a>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-accent hover:text-primary rounded-lg text-xs font-bold transition-all border border-white/15"
                >
                  <FiShield /> Faculty & Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* NDA Khadakwasla Google Map */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-5 relative inline-block text-white">
              Campus Location
              <span className="absolute -bottom-1.5 left-0 w-12 h-1 bg-accent rounded"></span>
            </h4>
            <div className="w-full h-44 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.823671234567!2d73.7667!3d18.4417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc294c0fb359a33%3A0xc665eab9b5fa0b46!2sArmy%20Public%20School%2C%20Khadakwasla!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="APS Khadakwasla NDA Location"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-2 text-center">
              16 kms from Pune Station • 4 kms from Khadakwasla Lake
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Army Public School Khadakwasla. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link to="/about#rules" className="hover:text-accent">School Code</Link>
            <span>•</span>
            <Link to="/mandatory-disclosure" className="hover:text-accent">CBSE Compliance</Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-accent">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
