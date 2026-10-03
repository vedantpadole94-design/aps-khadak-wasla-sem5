import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiBell, FiExternalLink } from 'react-icons/fi';
import { api, assetUrl } from '../../utils/api';
import { Link, useLocation } from 'react-router-dom';

export default function NotificationPopup() {
  const [popup, setPopup] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('aps_popup_dismissed');
    if (isDismissed) return;

    api.list('popups/active')
      .then((res) => {
        const popups = res.data || [];
        const active = popups.find((p) => p.isActive);
        if (active) {
          const currentPage = location.pathname === '/' ? 'home' : location.pathname.replace('/', '');
          const allowedPages = active.showOnPages || ['home'];
          
          if (allowedPages.includes('all') || allowedPages.includes(currentPage)) {
            setPopup(active);
            const delayTimer = setTimeout(() => {
              setIsOpen(true);
            }, (active.delay || 2) * 1000);

            let autoDismissTimer;
            if (active.autoDismiss && active.autoDismiss > 0) {
              autoDismissTimer = setTimeout(() => {
                setIsOpen(false);
              }, ((active.delay || 2) + active.autoDismiss) * 1000);
            }

            return () => {
              clearTimeout(delayTimer);
              if (autoDismissTimer) clearTimeout(autoDismissTimer);
            };
          }
        }
      })
      .catch(() => {});
  }, [location.pathname]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('aps_popup_dismissed', 'true');
  };

  if (!popup) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gold/30"
          >
            {/* Header Ribbon */}
            <div className="bg-[#0A1628] text-white p-5 flex items-center justify-between border-b-2 border-accent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <FiBell className="text-xl animate-bounce" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Notice & Announcement</h3>
                  <p className="text-xs text-gold">Army Public School Khadakwasla</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Close Announcement"
              >
                <FiX />
              </button>
            </div>

            {/* Optional Image */}
            {popup.image && (
              <div className="w-full h-48 bg-gray-100 overflow-hidden">
                <img
                  src={assetUrl(popup.image)}
                  alt={popup.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content Body */}
            <div className="p-6">
              <h4 className="font-heading font-bold text-xl text-primary mb-3">
                {popup.title}
              </h4>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {popup.message}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 font-medium"
                >
                  Dismiss
                </button>
                <Link
                  to="/admission"
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-secondary transition-colors shadow"
                >
                  View Admissions <FiExternalLink />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
