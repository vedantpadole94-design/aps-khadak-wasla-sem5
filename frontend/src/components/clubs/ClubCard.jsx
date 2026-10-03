import React from 'react';
import { motion } from 'framer-motion';

const CATEGORY_COLORS = {
  Academic: '#1E40AF',
  Sports:   '#15803D',
  Arts:     '#7C3AED',
  Service:  '#C8102E',
  Other:    '#6B7280'
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const ClubCard = ({ club, index = 0 }) => {
  const color = CATEGORY_COLORS[club.category] || CATEGORY_COLORS.Other;

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(10,22,40,0.12)' }}
      className="relative flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden"
      aria-label={`${club.name} — ${club.category}`}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: color }} />

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Icon + Category badge */}
        <div className="flex items-start justify-between gap-2">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: `${color}15` }}
            aria-hidden="true"
          >
            {club.icon || '🎯'}
          </span>
          <span
            className="mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
            style={{ color, backgroundColor: `${color}15` }}
          >
            {club.category}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-heading text-base font-bold leading-snug text-primary">
          {club.name}
        </h3>

        {/* Description */}
        {club.description && (
          <p className="text-xs leading-5 text-gray-500 line-clamp-2">
            {club.description}
          </p>
        )}

        {/* Meta row */}
        <div className="mt-auto flex flex-col gap-1 border-t border-gray-100 pt-3">
          {club.teacher && (
            <p className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="text-[13px]">👤</span>
              <span className="font-medium">{club.teacher}</span>
            </p>
          )}
          {club.timing && (
            <p className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="text-[13px]">🕐</span>
              <span>{club.timing}</span>
            </p>
          )}
          {club.venue && (
            <p className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="text-[13px]">📍</span>
              <span>{club.venue}</span>
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default ClubCard;
