import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import { api, assetUrl } from '../utils/api';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isCurrent = true;
    api.list('gallery')
      .then((response) => {
        if (isCurrent) {
          setPhotos((response.data || []).map((photo) => ({
            ...photo,
            cat: photo.category,
            img: assetUrl(photo.url),
            date: photo.date || ''
          })));
        }
      })
      .catch(() => {
        if (isCurrent) setLoadError('Unable to load the photo gallery. Please try again later.');
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });
    return () => { isCurrent = false; };
  }, []);

  const categories = ['All', ...new Set(photos.map((photo) => photo.cat).filter(Boolean))];
  const filtered = photos.filter(p =>
    (activeFilter === 'All' || p.cat === activeFilter) &&
    (p.caption.toLowerCase().includes(search.toLowerCase()) || p.date.includes(search))
  );

  return (
    <div className="pt-24 bg-bg-light min-h-screen">
      {/* Hero */}
      <section className="bg-primary py-20 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-5xl font-bold mb-4">
            How We Celebrate 🎉
          </motion.h1>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="w-20 h-1 bg-accent mx-auto mb-6"></motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-gray-300 max-w-xl mx-auto">
            A visual journey through our vibrant campus events and celebrations.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {loadError && <p role="alert" className="mb-6 text-center text-red-700">{loadError}</p>}
        {/* Search */}
        <div className="relative max-w-sm mb-8">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search photos..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full bg-white shadow-sm focus:ring-2 focus:ring-accent outline-none font-body"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeFilter === cat ? 'bg-primary text-accent shadow' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {filtered.map(photo => (
              <motion.div
                key={photo._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="break-inside-avoid cursor-pointer group relative rounded-2xl overflow-hidden shadow-lg"
                onClick={() => setLightbox(photo)}
              >
                <img src={photo.img} alt={photo.caption} className="w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                  <p className="text-white font-bold font-heading text-lg">{photo.caption}</p>
                  <p className="text-gray-300 text-sm">{photo.date} · {photo.cat}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {loading && <p className="py-12 text-center text-gray-500">Loading photos...</p>}
        {!loading && !loadError && filtered.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">🖼️</p>
            <p className="font-heading text-2xl">No photos found</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-white text-3xl hover:text-accent" onClick={() => setLightbox(null)}>
              <FiX />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <img src={lightbox.img} alt={lightbox.caption} className="w-full max-h-[70vh] object-cover" />
              <div className="p-6">
                <h3 className="font-heading text-2xl font-bold text-primary">{lightbox.caption}</h3>
                <p className="text-gray-500 text-sm mt-1">{lightbox.date} · {lightbox.cat}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
