import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiCheckCircle, FiUpload } from 'react-icons/fi';

const schema = z.object({
  studentName: z.string().min(2, 'Full name required'),
  dob: z.string().min(1, 'Date of birth required'),
  classApplying: z.string().min(1, 'Select a class'),
  parentName: z.string().min(2, 'Parent name required'),
  parentPhone: z.string().length(10, 'Enter valid 10-digit number'),
  email: z.string().email('Valid email required'),
  address: z.string().min(10, 'Enter full address'),
  previousSchool: z.string().optional(),
});

const steps = ['Personal Info', 'Parent Details', 'Previous Education', 'Documents'];

const feeData = [
  { class: 'Nursery – KG', annual: '25,000', term1: '8,500', term2: '8,500', term3: '8,000' },
  { class: 'I – V',         annual: '35,000', term1: '12,000', term2: '12,000', term3: '11,000' },
  { class: 'VI – VIII',     annual: '42,000', term1: '14,500', term2: '14,500', term3: '13,000' },
  { class: 'IX – X',        annual: '50,000', term1: '17,000', term2: '17,000', term3: '16,000' },
  { class: 'XI – XII',      annual: '60,000', term1: '21,000', term2: '21,000', term3: '18,000' },
];

const docs = ['Birth Certificate', 'Transfer Certificate', 'Previous Mark Sheets (last 2 years)', 'Passport-size Photos (4)', 'Aadhaar Card', 'Parent ID & Rank Card (Defence)'];

const Admissions = () => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors }, trigger } = useForm({ resolver: zodResolver(schema) });

  const next = async () => {
    let fields = [];
    if (step === 0) fields = ['studentName', 'dob', 'classApplying'];
    if (step === 1) fields = ['parentName', 'parentPhone', 'email', 'address'];
    const valid = await trigger(fields);
    if (valid) setStep(s => s + 1);
  };

  const onSubmit = () => setSubmitted(true);

  return (
    <div className="pt-24 bg-bg-light">
      {/* Hero */}
      <section className="bg-secondary py-20 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-5xl font-bold mb-4">Admissions 2026-27</motion.h1>
          <div className="w-20 h-1 bg-accent mx-auto"></div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Admission Process Steps */}
        <h2 className="font-heading text-3xl font-bold text-primary text-center mb-12">Admission Process</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {['Online Application', 'Document Verification', 'Entrance Test', 'Interview', 'Fee Payment', 'Confirmation'].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center w-32"
            >
              <div className="w-14 h-14 rounded-full bg-primary text-white font-bold text-xl flex items-center justify-center shadow-lg mb-3">
                {i + 1}
              </div>
              <div className="text-gray-600 text-xs font-semibold font-body">{s}</div>
            </motion.div>
          ))}
        </div>

        {/* Eligibility & Docs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white rounded-2xl shadow p-8 border-t-4 border-accent">
            <h3 className="font-heading text-2xl font-bold text-primary mb-6">Required Documents</h3>
            <ul className="space-y-3">
              {docs.map((d, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700 font-body">
                  <span className="text-green-500 mt-0.5">✓</span>{d}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow p-8 border-t-4 border-secondary">
            <h3 className="font-heading text-2xl font-bold text-primary mb-6">Age Criteria (as of 1 Apr 2026)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead><tr className="bg-primary text-white"><th className="p-3">Class</th><th className="p-3">Min. Age</th><th className="p-3">Max. Age</th></tr></thead>
                <tbody>
                  {[['Nursery','3 yrs','4 yrs'],['KG','4 yrs','5 yrs'],['I','5 yrs','7 yrs'],['VI','10 yrs','12 yrs'],['IX','13 yrs','15 yrs']].map((r,i) => (
                    <tr key={i} className={i%2===0?'bg-gray-50':'bg-white'}><td className="p-3">{r[0]}</td><td className="p-3">{r[1]}</td><td className="p-3">{r[2]}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Fee Structure */}
        <h2 className="font-heading text-3xl font-bold text-primary text-center mb-8">Fee Structure (INR)</h2>
        <div className="overflow-x-auto mb-20 rounded-2xl shadow">
          <table className="w-full text-left border-collapse bg-white">
            <thead><tr className="bg-primary text-white text-sm">
              <th className="p-4">Class</th><th className="p-4">Annual Total</th><th className="p-4">Term I</th><th className="p-4">Term II</th><th className="p-4">Term III</th>
            </tr></thead>
            <tbody>
              {feeData.map((r, i) => (
                <tr key={i} className={`${i%2===0?'bg-gray-50':'bg-white'} hover:bg-accent/10 transition-colors`}>
                  <td className="p-4 font-semibold text-secondary">{r.class}</td>
                  <td className="p-4 font-bold text-primary">₹{r.annual}</td>
                  <td className="p-4">₹{r.term1}</td>
                  <td className="p-4">₹{r.term2}</td>
                  <td className="p-4">₹{r.term3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Multi-Step Form */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-primary text-center mb-10">Online Application Form</h2>

          {submitted ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center bg-white rounded-2xl shadow-xl p-16">
              <FiCheckCircle className="text-green-500 text-7xl mx-auto mb-6" />
              <h3 className="font-heading text-3xl font-bold text-primary mb-3">Application Submitted!</h3>
              <p className="text-gray-600 font-body">We will contact you within 2 business days.</p>
            </motion.div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Step Indicator */}
              <div className="flex mb-10">
                {steps.map((s, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= step ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>{i+1}</div>
                    <span className={`text-xs mt-1 text-center ${i <= step ? 'text-primary font-semibold' : 'text-gray-400'}`}>{s}</span>
                    {i < steps.length - 1 && <div className={`h-0.5 w-full mt-4 ${i < step ? 'bg-primary' : 'bg-gray-200'}`}></div>}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Student Full Name *</label>
                        <input {...register('studentName')} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none" />
                        {errors.studentName && <p className="text-red-500 text-xs mt-1">{errors.studentName.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth *</label>
                        <input type="date" {...register('dob')} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none" />
                        {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Class Applying For *</label>
                        <select {...register('classApplying')} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none">
                          <option value="">Select Class</option>
                          {['Nursery','KG','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'].map(c => <option key={c}>{c}</option>)}
                        </select>
                        {errors.classApplying && <p className="text-red-500 text-xs mt-1">{errors.classApplying.message}</p>}
                      </div>
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Parent / Guardian Name *</label>
                        <input {...register('parentName')} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none" />
                        {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                        <input {...register('parentPhone')} placeholder="10-digit number" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none" />
                        {errors.parentPhone && <p className="text-red-500 text-xs mt-1">{errors.parentPhone.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                        <input {...register('email')} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none" />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Address *</label>
                        <textarea rows={3} {...register('address')} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none" />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Previous School Name</label>
                        <input {...register('previousSchool')} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Last Class Passed</label>
                        <input className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Percentage / Grade</label>
                        <input className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none" />
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <p className="text-gray-500 text-sm font-body">Please attach the following documents (PDF or JPG, max 2MB each):</p>
                      {docs.slice(0, 4).map((d, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 border border-dashed border-gray-300 rounded-lg hover:border-accent transition-colors">
                          <FiUpload className="text-gray-400 text-lg" />
                          <span className="text-sm text-gray-600 flex-grow">{d}</span>
                          <input type="file" className="text-xs" />
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between mt-10">
                  {step > 0 && (
                    <button type="button" onClick={() => setStep(s => s - 1)}
                      className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-semibold">
                      ← Back
                    </button>
                  )}
                  <div className="ml-auto">
                    {step < steps.length - 1 ? (
                      <button type="button" onClick={next}
                        className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-semibold">
                        Continue →
                      </button>
                    ) : (
                      <button type="submit"
                        className="px-8 py-3 bg-accent text-primary rounded-lg hover:bg-yellow-500 transition-colors font-bold">
                        Submit Application ✓
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admissions;
