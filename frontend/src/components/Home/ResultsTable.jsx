import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiCheckCircle, FiAward } from 'react-icons/fi';
import { api } from '../../utils/api';
import AnimatedNumber from '../Global/AnimatedNumber';

const fallbackX = [
  { classLevel: 'X', year: '2021-22', registered: 119, passed: 119, percentage: '100%', remarks: 'Centum Pass' },
  { classLevel: 'X', year: '2022-23', registered: 121, passed: 120, percentage: '99.11%', remarks: '-' },
  { classLevel: 'X', year: '2023-24', registered: 111, passed: 111, percentage: '100%', remarks: 'Centum Pass' },
  { classLevel: 'X', year: '2024-25', registered: 124, passed: 124, percentage: '100%', remarks: 'Centum Pass' },
];

const fallbackXII = [
  { classLevel: 'XII', year: '2022-23', registered: 53, passed: 52, percentage: '98.11%', remarks: 'Compartment cleared' },
  { classLevel: 'XII', year: '2023-24', registered: 46, passed: 46, percentage: '100%', remarks: '100% First Division' },
  { classLevel: 'XII', year: '2024-25', registered: 64, passed: 64, percentage: '100%', remarks: 'Outstanding' },
];

export default function ResultsTable() {
  const [activeTab, setActiveTab] = useState('X');
  const [results, setResults] = useState([...fallbackX, ...fallbackXII]);

  useEffect(() => {
    api.list('results')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setResults(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const currentList = results.filter((r) => r.classLevel === activeTab);

  return (
    <section className="py-20 bg-bg-light" id="results">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-primary text-xs font-bold tracking-widest uppercase mb-3">
            <FiTrendingUp className="text-accent" /> CBSE Academic Excellence
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
            Board Examination Results
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6" />
          <p className="text-gray-600 text-base md:text-lg">
            Consistent 100% pass percentages and outstanding academic distinctions at the All India Secondary and Senior School Certificate Examinations (CBSE).
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-3xl font-heading font-extrabold text-accent block">
                <AnimatedNumber value="100%" />
              </span>
              <span className="text-xs text-gray-500 uppercase font-semibold">Pass Rate (Avg)</span>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-3xl font-heading font-extrabold text-primary block">
                <AnimatedNumber value="1180026" />
              </span>
              <span className="text-xs text-gray-500 uppercase font-semibold">CBSE Affiliation</span>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-3xl font-heading font-extrabold text-secondary block">
                <AnimatedNumber value="34114" />
              </span>
              <span className="text-xs text-gray-500 uppercase font-semibold">School Code</span>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-3xl font-heading font-extrabold text-accent block">
                <AnimatedNumber value="1700+" />
              </span>
              <span className="text-xs text-gray-500 uppercase font-semibold">Total Scholars</span>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="inline-flex p-1.5 bg-gray-200/80 rounded-xl mt-8">
            <button
              onClick={() => setActiveTab('X')}
              className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'X' ? 'bg-primary text-white shadow-md' : 'text-gray-700 hover:text-primary'
              }`}
            >
              Class X (AISSE)
            </button>
            <button
              onClick={() => setActiveTab('XII')}
              className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'XII' ? 'bg-primary text-white shadow-md' : 'text-gray-700 hover:text-primary'
              }`}
            >
              Class XII (AISSCE)
            </button>
          </div>
        </div>

        {/* Results Table Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary text-white text-xs sm:text-sm uppercase tracking-wider">
                  <th className="py-4 px-6 font-bold">Academic Year</th>
                  <th className="py-4 px-6 font-bold text-center">Registered</th>
                  <th className="py-4 px-6 font-bold text-center">Passed</th>
                  <th className="py-4 px-6 font-bold text-center">Pass %</th>
                  <th className="py-4 px-6 font-bold">Performance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm md:text-base">
                {currentList.map((row, idx) => {
                  const isCentum = row.percentage === '100%';
                  return (
                    <motion.tr
                      key={row.year + idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-amber-50/40 transition-colors"
                    >
                      <td className="py-4 px-6 font-bold text-primary flex items-center gap-2">
                        <FiAward className={isCentum ? 'text-accent' : 'text-gray-400'} />
                        {row.year}
                      </td>
                      <td className="py-4 px-6 text-center text-gray-700 font-medium">
                        {row.registered}
                      </td>
                      <td className="py-4 px-6 text-center text-gray-700 font-medium">
                        {row.passed}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold ${
                            isCentum
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          <FiCheckCircle className="text-xs" />
                          {row.percentage}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm">
                        {row.remarks || (isCentum ? '100% First Class Success' : 'Distinction Results')}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
