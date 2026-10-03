import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiCheckCircle, FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import { api } from '../utils/api';

const schema = z.object({
  parentName: z.string().min(2, 'Name required'),
  studentName: z.string().min(2, 'Student name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().length(10, '10-digit phone number'),
  classSeeking: z.string().min(1, 'Select a class'),
  message: z.string().optional(),
  contactTime: z.string().optional(),
  source: z.string().optional(),
});

const faqs = [
  { cat: 'Admissions', q: 'When do admissions open?', a: 'Admissions for the next academic year typically open in January-February.' },
  { cat: 'Admissions', q: 'Is there an entrance test?', a: 'Yes, for classes III and above, a basic entrance assessment is conducted.' },
  { cat: 'Academics', q: 'Which board does the school follow?', a: 'The school is affiliated to CBSE (Central Board of Secondary Education).' },
  { cat: 'Fees', q: 'What are the payment modes?', a: 'Fees can be paid online (UPI/Net Banking) or by cheque/DD at the school office.' },
  { cat: 'Transport', q: 'Is school bus facility available?', a: 'Yes, buses cover major routes in Pune. Contact the transport office for details.' },
  { cat: 'Facilities', q: 'Is there a day-boarding option?', a: 'Extended day care is available from 7:30 AM to 5:30 PM for an additional fee.' },
];

const Enquiry = () => {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [faqCat, setFaqCat] = useState('All');

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await api.enquiries(data);
      setSubmitted(true);
    } catch (error) {
      window.alert(error.message || 'Unable to submit enquiry. Please try again.');
    }
  };

  const cats = ['All', ...new Set(faqs.map(f => f.cat))];
  const filteredFaqs = faqCat === 'All' ? faqs : faqs.filter(f => f.cat === faqCat);

  return (
    <div className="pt-24 bg-bg-light">
      {/* Hero */}
      <section className="bg-primary py-20 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-5xl font-bold mb-4">Enquiry</motion.h1>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="w-20 h-1 bg-accent mx-auto"></motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">

          {/* Contact Details */}
          <div className="space-y-8">
            <h2 className="font-heading text-2xl font-bold text-primary">Contact Information</h2>
            {[
              { icon: <FiMapPin />, label: 'Address', value: 'NDA Road, Khadakwasla, Pune - 411024' },
              { icon: <FiPhone />, label: 'Main Office', value: '+91 20 2529 1234' },
              { icon: <FiPhone />, label: 'Admissions', value: '+91 20 2529 5678' },
              { icon: <FiMail />, label: 'Email', value: 'info@apskhadakwasla.in' },
              { icon: <FiClock />, label: 'Office Hours', value: 'Mon–Fri: 9 AM – 4 PM\nSat: 9 AM – 1 PM' },
            ].map((c, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">{c.icon}</div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{c.label}</p>
                  <p className="text-gray-700 font-body whitespace-pre-line">{c.value}</p>
                </div>
              </div>
            ))}
            {/* Map */}
            <div className="rounded-xl overflow-hidden shadow-lg h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.9!2d73.76!3d18.46!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc294c0fb359a33%3A0xc665eab9b5fa0b46!2sArmy%20Public%20School%2C%20Khadakwasla!5e0!3m2!1sen!2sin!4v1698765432101"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Map"
              ></iframe>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {submitted ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-16">
                  <FiCheckCircle className="text-green-500 text-7xl mx-auto mb-6" />
                  <h3 className="font-heading text-3xl font-bold text-primary mb-3">Thank You!</h3>
                  <p className="text-gray-600 font-body">Your enquiry has been received. We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <>
                  <h2 className="font-heading text-2xl font-bold text-primary mb-8">Send an Enquiry</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { id: 'parentName', label: 'Parent Name *' },
                      { id: 'studentName', label: 'Student Name *' },
                      { id: 'email', label: 'Email *' },
                      { id: 'phone', label: 'Phone Number *' },
                    ].map(({ id, label }) => (
                      <div key={id}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                        <input {...register(id)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none font-body" />
                        {errors[id] && <p className="text-red-500 text-xs mt-1">{errors[id].message}</p>}
                      </div>
                    ))}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Class Seeking *</label>
                      <select {...register('classSeeking')} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none">
                        <option value="">Select Class</option>
                        {['Nursery','KG','I–V','VI–VIII','IX–X','XI–XII'].map(c => <option key={c}>{c}</option>)}
                      </select>
                      {errors.classSeeking && <p className="text-red-500 text-xs mt-1">{errors.classSeeking.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">How did you hear about us?</label>
                      <select {...register('source')} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none">
                        <option value="">Select</option>
                        {['Newspaper', 'Social Media', 'Friend/Referral', 'Army Newsletter', 'Website'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Message / Query</label>
                      <textarea rows={4} {...register('message')} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none font-body"></textarea>
                    </div>

                    <div className="md:col-span-2">
                      <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-secondary transition-colors text-lg">
                        Submit Enquiry →
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-primary text-center mb-10">Frequently Asked Questions</h2>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {cats.map(c => (
              <button key={c} onClick={() => setFaqCat(c)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${faqCat === c ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => (
              <motion.div key={i} initial={false} className="bg-white rounded-xl shadow overflow-hidden">
                <button
                  className="w-full text-left px-6 py-5 flex justify-between items-center font-semibold text-gray-800 hover:text-primary transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} className="text-accent text-2xl font-light">+</motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-gray-600 font-body text-sm">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enquiry;
