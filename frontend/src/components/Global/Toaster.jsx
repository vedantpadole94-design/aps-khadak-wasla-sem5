import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import { subscribeToToasts } from '../../utils/toast';

export default function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleNewToast = (item) => {
      setToasts((previous) => [...previous, item]);
      setTimeout(() => {
        setToasts((previous) => previous.filter((toastItem) => toastItem.id !== item.id));
      }, 3500);
    };

    return subscribeToToasts(handleNewToast);
  }, []);

  const removeToast = (id) => {
    setToasts((previous) => previous.filter((toastItem) => toastItem.id !== id));
  };

  return (
    <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`pointer-events-auto p-4 rounded-xl shadow-xl flex items-center justify-between gap-3 text-white text-sm font-semibold border ${
              item.type === 'success'
                ? 'bg-emerald-700 border-emerald-600'
                : item.type === 'error'
                ? 'bg-rose-700 border-rose-600'
                : 'bg-primary border-accent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {item.type === 'success' && <FiCheckCircle className="text-accent text-lg shrink-0" />}
              {item.type === 'error' && <FiAlertCircle className="text-white text-lg shrink-0" />}
              {item.type === 'info' && <FiInfo className="text-accent text-lg shrink-0" />}
              <span>{item.message}</span>
            </div>
            <button
              onClick={() => removeToast(item.id)}
              className="p-1 hover:bg-white/20 rounded-md transition-colors text-white"
            >
              <FiX />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
