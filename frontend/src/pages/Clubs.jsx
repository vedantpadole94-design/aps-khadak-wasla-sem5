import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getClubs } from '../utils/clubsApi';
import ClubCard from '../components/clubs/ClubCard';

const CATEGORIES = ['All', 'Academic', 'Sports', 'Arts', 'Service', 'Other'];

const CATEGORY_COLORS = {
  Academic: '#1E40AF',
  Sports:   '#15803D',
  Arts:     '#7C3AED',
  Service:  '#C8102E',
  Other:    '#6B7280'
};

const sectionVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const WingSection = ({ title, accentColor, clubs, loading }) => (
  <motion.section
    variants={sectionVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-60px' }}
    className="mb-16"
    aria-labelledby={`wing-${accentColor}`}
  >
    <div className="mb-8 flex items-end gap-4">
      <div>
        <h2
          id={`wing-${accentColor}`}
          className="font-heading text-2xl font-bold uppercase tracking-wide text-primary sm:text-3xl"
        >
          {title}
        </h2>
        <div className="mt-2 h-1 w-16 rounded-full" style={{ backgroundColor: accentColor }} />
      </div>
    </div>

    {loading ? (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    ) : clubs.length === 0 ? (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-14 text-center">
        <p className="text-sm text-gray-400">No clubs added yet for this wing.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map((club, index) => (
          <ClubCard key={club._id} club={club} index={index} />
        ))}
      </div>
    )}
  </motion.section>
);

const Clubs = () => {
  const [allClubs, setAllClubs] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    let current = true;
    getClubs()
      .then((res) => {
        if (current) setAllClubs(res.data || []);
      })
      .catch(() => {
        if (current) setLoadError('Unable to load clubs. Please try again later.');
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => { current = false; };
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return allClubs;
    return allClubs.filter((c) => c.category === activeCategory);
  }, [allClubs, activeCategory]);

  const primaryClubs   = useMemo(() => filtered.filter((c) => c.wing === 'primary'),   [filtered]);
  const secondaryClubs = useMemo(() => filtered.filter((c) => c.wing === 'secondary'), [filtered]);

  return (
    <main className="min-h-screen bg-[#FAF7F0] pt-24">
      {/* ── Hero Banner ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A1628] px-4 py-16 text-center text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_40%)]" />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-4xl"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            Army Public School Khadakwasla
          </p>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">
            SCHOOL CLUBS
          </h1>
          <div className="mx-auto mt-5 h-1 w-16 bg-[#D4AF37]" />
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
            Explore, learn, and grow beyond the classroom through our vibrant co-curricular clubs.
          </p>
          <p className="mt-4 text-xs text-white/60">
            <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <span aria-hidden="true"> › </span>
            Clubs
          </p>
        </motion.div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loadError && (
          <p role="alert" className="mb-8 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {loadError}
          </p>
        )}

        {/* ── Category Filter Pills ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-12 flex flex-wrap justify-center gap-2"
          role="group"
          aria-label="Filter clubs by category"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const color = CATEGORY_COLORS[cat];
            return (
              <motion.button
                key={cat}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={isActive}
                className="rounded-full border px-4 py-1.5 text-sm font-semibold transition-all"
                style={
                  isActive
                    ? {
                        backgroundColor: color || '#0A1628',
                        borderColor:     color || '#0A1628',
                        color:           '#fff'
                      }
                    : {
                        backgroundColor: '#fff',
                        borderColor:     color || '#E5E5E5',
                        color:           color || '#0A1628'
                      }
                }
              >
                {cat}
              </motion.button>
            );
          })}
        </motion.div>

        {/* ── Wing 1: Primary ──────────────────────────────── */}
        <WingSection
          title="PRIMARY WING (Classes 1–5)"
          accentColor="#D4AF37"
          clubs={primaryClubs}
          loading={loading}
        />

        {/* ── Wing 2: Secondary ────────────────────────────── */}
        <WingSection
          title="SECONDARY WING (Classes 6–10)"
          accentColor="#3B5323"
          clubs={secondaryClubs}
          loading={loading}
        />
      </div>
    </main>
  );
};

export default Clubs;
