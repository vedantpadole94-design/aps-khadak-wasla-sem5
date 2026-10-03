import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { motion } from 'framer-motion';
import {
  FiGrid, FiUsers, FiImage, FiCalendar, FiBell,
  FiInbox, FiSettings, FiLogOut, FiUser,
  FiTrendingUp, FiAlertCircle, FiLayers, FiExternalLink
} from 'react-icons/fi';

const navItems = [
  { to: '/admin/dashboard',   label: 'Dashboard',     icon: FiGrid },
  { to: '/admin/principal',   label: 'Principal Info',icon: FiUser },
  { to: '/admin/faculty',     label: 'Faculty (CRUD)',icon: FiUsers },
  { to: '/admin/results',     label: 'Board Results', icon: FiTrendingUp },
  { to: '/admin/pages',       label: 'Edit Pages',    icon: FiLayers },
  { to: '/admin/notices',     label: 'Notices/Ticker',icon: FiBell },
  { to: '/admin/popups',      label: 'Popup Alerts',  icon: FiAlertCircle },
  { to: '/admin/calendar',    label: 'Calendar/Events',icon: FiCalendar },
  { to: '/admin/gallery',     label: 'Photo Gallery', icon: FiImage },
  { to: '/admin/enquiries',   label: 'Enquiries',     icon: FiInbox },
  { to: '/admin/settings',    label: 'Site Settings', icon: FiSettings },
];

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-dvh flex-col bg-gray-100 overflow-hidden lg:flex-row">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between gap-3 bg-primary px-4 py-3 text-white lg:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <img
            src="/assets/aps-logo.svg"
            alt="APS"
            className="w-8 h-8 object-contain"
            onError={(e) => { e.target.onerror = null; e.target.src = '/school-logo-transparent.png'; }}
          />
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-bold">APS Admin</p>
            <p className="truncate text-[11px] text-accent font-semibold">{admin?.username || 'Administrator'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" target="_blank" className="text-xs px-2.5 py-1.5 rounded bg-white/10 text-white flex items-center gap-1">
            Site <FiExternalLink />
          </Link>
          <button onClick={handleLogout} className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-300 hover:bg-white/10" aria-label="Logout">
            <FiLogOut className="inline" /> Logout
          </button>
        </div>
      </div>

      {/* Mobile scrollable tabs */}
      <nav className="flex gap-2 overflow-x-auto border-b border-gray-200 bg-white px-4 py-2.5 lg:hidden" aria-label="Admin navigation">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>
            <Icon /> {label}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar for Desktop */}
      <aside className="hidden w-64 bg-primary text-white flex-col shrink-0 overflow-y-auto lg:flex border-r border-white/10">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 shrink-0"
            >
              <img
                src="/assets/aps-logo.svg"
                alt="APS Logo"
                className="w-full h-full object-contain drop-shadow"
                onError={(e) => { e.target.onerror = null; e.target.src = '/school-logo-transparent.png'; }}
              />
            </motion.div>
            <div className="min-w-0">
              <p className="font-heading font-bold text-sm leading-tight text-white">APS Khadakwasla</p>
              <p className="text-xs text-accent font-semibold tracking-wider uppercase mt-0.5">Admin Control</p>
            </div>
          </div>
        </div>

        {/* View Live Site Link */}
        <div className="px-4 pt-4 pb-2">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg bg-accent/20 text-accent hover:bg-accent hover:text-primary transition-all"
          >
            <span>Preview Public Site</span>
            <FiExternalLink />
          </Link>
        </div>

        <nav className="grow p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive ? 'bg-accent text-primary shadow-md' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="text-base shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="mb-2 px-3 py-1.5 rounded-lg bg-white/5 text-[11px] text-gray-400">
            Signed in as: <strong className="text-white">{admin?.username || 'admin'}</strong>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-red-300 hover:text-white hover:bg-red-600/30 rounded-xl transition-all">
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="grow min-w-0 overflow-y-auto bg-gray-50/70">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
