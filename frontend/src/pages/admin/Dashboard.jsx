import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers, FiInbox, FiCalendar, FiImage, FiBell,
  FiTrendingUp, FiLayers, FiAlertCircle, FiSettings
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import AnimatedNumber from '../../components/Global/AnimatedNumber';

export default function Dashboard() {
  const [counts, setCounts] = useState({
    faculty: 70,
    enquiries: 0,
    notices: 4,
    events: 4,
    photos: 5,
    results: 9,
    popups: 1
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  useEffect(() => {
    Promise.allSettled([
      api.list('faculty'),
      api.list('enquiries'),
      api.list('notices'),
      api.list('events'),
      api.list('gallery'),
      api.list('results'),
      api.list('popups')
    ]).then(([facRes, enqRes, notRes, evRes, galRes, resRes, popRes]) => {
      setCounts({
        faculty: facRes.value?.data?.length || 0,
        enquiries: enqRes.value?.data?.length || 0,
        notices: notRes.value?.data?.length || 0,
        events: evRes.value?.data?.length || 0,
        photos: galRes.value?.data?.length || 0,
        results: resRes.value?.data?.length || 0,
        popups: popRes.value?.data?.length || 0
      });
      if (enqRes.value?.data) {
        setRecentEnquiries(enqRes.value.data.slice(0, 5));
      }
    });
  }, []);

  const statCards = [
    { label: 'Faculty Members', value: counts.faculty, suffix: '', icon: FiUsers, color: 'bg-emerald-600', link: '/admin/faculty' },
    { label: 'Parent Enquiries', value: counts.enquiries, suffix: '', icon: FiInbox, color: 'bg-amber-500', link: '/admin/enquiries' },
    { label: 'Active Notices', value: counts.notices, suffix: '', icon: FiBell, color: 'bg-rose-600', link: '/admin/notices' },
    { label: 'Upcoming Events', value: counts.events, suffix: '', icon: FiCalendar, color: 'bg-purple-600', link: '/admin/calendar' },
    { label: 'Board Results Recorded', value: counts.results, suffix: '', icon: FiTrendingUp, color: 'bg-indigo-600', link: '/admin/results' },
  ];

  const quickActions = [
    { label: 'Edit Principal Profile', to: '/admin/principal', icon: FiUsers, color: 'text-amber-500' },
    { label: 'Edit Website Pages (About, Infra, etc.)', to: '/admin/pages', icon: FiLayers, color: 'text-blue-500' },
    { label: 'Manage Board Results', to: '/admin/results', icon: FiTrendingUp, color: 'text-emerald-500' },
    { label: 'Create Popup Alert / Notification', to: '/admin/popups', icon: FiAlertCircle, color: 'text-rose-500' },
    { label: 'Manage Faculty Directory', to: '/admin/faculty', icon: FiUsers, color: 'text-purple-500' },
    { label: 'Post New Notice / Ticker', to: '/admin/notices', icon: FiBell, color: 'text-orange-500' },
    { label: 'Upload Photo to Gallery', to: '/admin/gallery', icon: FiImage, color: 'text-cyan-500' },
    { label: 'Site-wide Settings & Contacts', to: '/admin/settings', icon: FiSettings, color: 'text-gray-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary via-navy to-secondary text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Control Center</span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mt-1">
            Army Public School Khadakwasla
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            Affiliation No: 1180026 | School Code: 34114 | NDA Khadakwasla, Pune
          </p>
        </div>
        <Link
          to="/"
          target="_blank"
          className="px-5 py-2.5 rounded-xl bg-accent text-primary font-bold text-sm hover:bg-white transition-colors shadow-lg"
        >
          View Public Site →
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <Link key={idx} to={stat.link}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:border-accent/40 transition-all flex items-center gap-5"
            >
              <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-md shrink-0`}>
                <stat.icon />
              </div>
              <div>
                <p className="text-3xl font-extrabold font-heading text-gray-800">
                  <AnimatedNumber value={stat.value} />{stat.suffix}
                </p>
                <p className="text-xs uppercase font-bold text-gray-500 tracking-wider mt-0.5">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100">
          <h2 className="font-heading text-xl font-bold text-primary mb-6 flex items-center gap-2">
            <FiTrendingUp className="text-accent" /> Management Tools
          </h2>
          <div className="grid grid-cols-1 gap-2.5">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                to={action.to}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
              >
                <action.icon className={`${action.color} text-lg shrink-0`} />
                <span className="font-semibold text-xs sm:text-sm text-gray-700 group-hover:text-primary">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-heading text-xl font-bold text-primary flex items-center gap-2">
              <FiInbox className="text-accent" /> Recent Admissions & Contact Enquiries
            </h2>
            <Link to="/admin/enquiries" className="text-xs font-bold text-accent hover:underline">
              View All ({counts.enquiries}) →
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <FiInbox className="text-4xl mx-auto mb-3 opacity-40" />
              <p className="text-sm">No new inquiries submitted yet.</p>
              <p className="text-xs text-gray-400 mt-1">Submitted website enquiry forms appear here in real time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEnquiries.map((enq, idx) => (
                <div
                  key={enq._id || idx}
                  className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <div>
                    <p className="font-bold text-sm text-primary">
                      {enq.studentName || 'Student'} <span className="font-normal text-xs text-gray-500">(Class: {enq.classSeeking})</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Parent: {enq.parentName} • {enq.phone} • {enq.email}
                    </p>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold self-start sm:self-auto">
                    {enq.status || 'New'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
