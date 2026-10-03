import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiImage } from 'react-icons/fi';
import { api, assetUrl } from '../../utils/api';

const defaultPhotos = [
  {
    caption: 'NDA Khadakwasla Alma Mater Grounds & School Campus',
    category: 'Campus',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80'
  },
  {
    caption: 'Modern Physics & Composite Chemistry Laboratories',
    category: 'Academics',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80'
  },
  {
    caption: 'Inter-House Sports Meet & Parade Drill',
    category: 'Sports',
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80'
  },
  {
    caption: 'High-Speed Computer & Robotics Laboratory',
    category: 'Facilities',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'
  },
  {
    caption: 'Rich Central Library with 9,000+ Books & Kindles',
    category: 'Library',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80'
  },
  {
    caption: 'Annual Day Celebrations & Cultural Symphony',
    category: 'Cultural',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80'
  }
];

export default function GalleryPreview() {
  const [photos, setPhotos] = useState(defaultPhotos);

  useEffect(() => {
    api.list('gallery')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const apiList = res.data.map(p => ({
            ...p,
            url: assetUrl(p.url)
          }));
          setPhotos(apiList.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-primary text-xs font-bold tracking-widest uppercase mb-3">
              <FiImage className="text-accent" /> Campus Life & Moments
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
              Life at APS Khadakwasla
            </h2>
            <div className="w-20 h-1 bg-accent mt-3 mb-2" />
            <p className="text-gray-600 max-w-xl text-sm sm:text-base">
              A vibrant snapshot of academic rigor, athletic vigor, creative expression, and military esprit de corps.
            </p>
          </div>
          <Link
            to="/gallery"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition-all shadow-md group"
          >
            Explore Full Gallery <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="group relative h-72 rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-100"
            >
              <img
                src={item.url}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-accent text-primary text-xs font-extrabold uppercase rounded-full shadow">
                  {item.category || 'Campus'}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-heading font-bold text-lg leading-snug line-clamp-2 drop-shadow">
                  {item.caption}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
