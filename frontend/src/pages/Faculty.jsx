import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiPhone, FiMail } from 'react-icons/fi';
import { api, assetUrl } from '../utils/api';

const FacultyPage = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [flipped, setFlipped] = useState(null);

  useEffect(() => {
    let isCurrent = true;
    api.list('faculty')
      .then((response) => {
        if (isCurrent) setFaculty(response.data || []);
      })
      .catch(() => {
        if (isCurrent) setLoadError('Unable to load the faculty directory. Please try again later.');
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const departments = [...new Set(faculty.map((member) => member.department).filter(Boolean))].sort();
  const filtered = faculty.filter(f =>
    (dept === 'All' || f.department === dept) &&
    [f.name, f.department, f.designation, f.qualification, f.subject]
      .some((value) => value?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pt-24 bg-bg-light min-h-screen">
      {/* Hero */}
      <section className="bg-secondary py-20 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-5xl font-bold mb-4">Our Faculty</motion.h1>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="w-20 h-1 bg-accent mx-auto mb-4"></motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-gray-200 max-w-xl mx-auto">
            Our educators shaping the next generation.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow max-w-sm">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or department..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full bg-white shadow-sm focus:ring-2 focus:ring-accent outline-none font-body" />
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', ...departments].map(d => (
              <button key={d} onClick={() => setDept(d)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${dept === d ? 'bg-primary text-accent' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Faculty Grid — Flip Cards */}
        {loading && <div className="py-16 text-center text-gray-500">Loading faculty directory...</div>}
        {loadError && <div role="alert" className="py-16 text-center text-red-700">{loadError}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {!loading && !loadError && filtered.map((f, i) => (
            <motion.div
              key={f._id}
              custom={i % 4}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 4) * 0.08 }}
              className="perspective cursor-pointer h-[340px]"
              onClick={() => setFlipped(flipped === f._id ? null : f._id)}
            >
              <div className={`relative preserve-3d w-full h-full transition-all duration-700 ${flipped === f._id ? 'rotate-y-180' : ''}`}>
                {/* Front */}
                <div className="absolute backface-hidden w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
                  <div className="h-48 overflow-hidden bg-primary/10">
                    {f.photo ? (
                      <img src={assetUrl(f.photo)} alt={f.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-primary text-5xl font-bold" aria-hidden="true">
                        {f.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('')}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className="font-heading font-bold text-primary text-base leading-tight">{f.name}</h3>
                    <p className="text-secondary text-sm font-semibold mt-1">{f.designation}</p>
                    <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{f.department}</span>
                  </div>
                  <p className="text-xs text-gray-400 text-center pb-3">Click to view details</p>
                </div>
                {/* Back */}
                <div className="absolute backface-hidden rotate-y-180 w-full h-full bg-primary text-white rounded-2xl shadow-xl p-6 flex flex-col justify-center">
                  <h3 className="font-heading text-xl font-bold text-accent mb-4">{f.name}</h3>
                  <div className="space-y-2 text-sm text-gray-200">
                    {f.qualification && <p>🎓 {f.qualification}</p>}
                    {f.subject && <p>📖 Teaches: {f.subject}</p>}
                    {f.experience > 0 && <p>⏳ {f.experience} years experience</p>}
                    <div className="pt-3 space-y-2">
                      {f.phone && <a href={`tel:${f.phone}`} onClick={(event) => event.stopPropagation()} className="flex items-center gap-2 hover:text-accent transition-colors">
                        <FiPhone className="text-accent" /> {f.phone}
                      </a>}
                      {f.email && <a href={`mailto:${f.email}`} onClick={(event) => event.stopPropagation()} className="flex items-center gap-2 hover:text-accent transition-colors text-xs">
                        <FiMail className="text-accent" /> {f.email}
                      </a>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!loading && !loadError && filtered.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">👨‍🏫</p>
            <p className="font-heading text-2xl">No faculty members found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyPage;
