import React from 'react';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const sectionCopy = {
  principal: {
    title: "Principal's Message",
    description: 'Manage the principal profile, welcome message, and signature shown on the public website.',
    tasks: ['Upload principal photo', 'Edit welcome message', 'Preview and publish'],
  },
  notices: {
    title: 'Notice Board',
    description: 'Publish announcements with priority and expiry dates so families always see current information.',
    tasks: ['Create announcements', 'Pin high-priority notices', 'Archive expired notices'],
  },
  admissions: {
    title: 'Admission Applications',
    description: 'Review applications, verify documents, and keep the admissions team aligned on every enquiry.',
    tasks: ['Review applications', 'Track document verification', 'Schedule interviews'],
  },
  settings: {
    title: 'Website Settings',
    description: 'Centralize school contact details, office hours, branding, and social media links.',
    tasks: ['Update contact details', 'Manage school identity', 'Configure communication links'],
  },
};

const AdminSection = ({ section }) => {
  const content = sectionCopy[section] || sectionCopy.settings;
  return (
    <div className="max-w-4xl">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">Content management</p>
      <h1 className="mt-2 font-heading text-4xl font-bold text-primary">{content.title}</h1>
      <p className="mt-3 max-w-2xl text-gray-500">{content.description}</p>
      <div className="mt-10 rounded-2xl border border-dashed border-primary/20 bg-white p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <FiCheckCircle className="mt-1 text-2xl text-accent" />
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary">Your workspace is ready</h2>
            <p className="mt-2 text-sm text-gray-500">This section is part of the CMS architecture and is ready to connect to its dedicated collection and editor.</p>
          </div>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {content.tasks.map((task) => (
            <div key={task} className="rounded-xl bg-bg-light p-4 text-sm font-semibold text-primary">{task}</div>
          ))}
        </div>
        <button type="button" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-secondary">
          Configure section <FiArrowRight />
        </button>
      </div>
    </div>
  );
};

export default AdminSection;
