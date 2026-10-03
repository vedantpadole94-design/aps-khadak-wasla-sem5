import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiTrash2, FiInbox } from 'react-icons/fi';
import { api } from '../../utils/api';
import { toast } from '../../utils/toast';

const ManageEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    api.list('enquiries', `?page=${page}`)
      .then((response) => {
        if (isCurrent) {
          setEnquiries(response.data || []);
          setTotalPages(response.totalPages || 0);
          setTotalCount(response.count || 0);
          setLoadError('');
        }
      })
      .catch(() => {
        if (isCurrent) setLoadError('Unable to load enquiries.');
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });
    return () => { isCurrent = false; };
  }, [page]);

  const changePage = (nextPage) => {
    setLoading(true);
    setPage(nextPage);
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await api.update('enquiries', id, { status });
      setEnquiries((previous) => previous.map((enquiry) => enquiry._id === id ? response.data : enquiry));
      toast.success('Enquiry status updated');
    } catch (error) {
      toast.error(error.message || 'Unable to update enquiry');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await api.remove('enquiries', id);
      setEnquiries((previous) => previous.filter((enquiry) => enquiry._id !== id));
      const nextCount = Math.max(0, totalCount - 1);
      const nextTotalPages = Math.ceil(nextCount / 20);
      setTotalCount(nextCount);
      setTotalPages(nextTotalPages);
      if (page > nextTotalPages && nextTotalPages > 0) changePage(nextTotalPages);
      toast.success('Enquiry deleted');
    } catch (error) {
      toast.error(error.message || 'Unable to delete enquiry');
    }
  };

  const filtered = filter === 'All' ? enquiries : enquiries.filter((enquiry) => enquiry.status === filter.toLowerCase());

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">Enquiries</h1>
          <p className="text-gray-400 text-sm mt-1">{enquiries.filter((enquiry) => enquiry.status === 'new').length} new · {totalCount} total</p>
        </div>
        <div className="flex gap-2">
          {['All', 'New', 'Contacted', 'Resolved'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === s ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loadError && <p role="alert" className="mb-4 text-red-700">{loadError}</p>}
      <div className="space-y-4">
        {filtered.map((enq, i) => (
          <motion.div key={enq._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl shadow p-6 border-l-4 border-accent"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-heading font-bold text-primary">{enq.parentName}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${enq.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{enq.status}</span>
                </div>
                <p className="text-sm text-gray-500">Student: <strong>{enq.studentName}</strong> · Class: <strong>{enq.classSeeking}</strong> · {new Date(enq.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-400 mt-0.5">{enq.email} · {enq.phone}</p>
                <p className="text-gray-700 text-sm mt-3 bg-gray-50 p-3 rounded-lg">{enq.message}</p>
              </div>
              <div className="flex gap-2 ml-4 shrink-0">
                {enq.status === 'new' && (
                  <button onClick={() => updateStatus(enq._id, 'contacted')} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Mark Contacted" aria-label="Mark contacted">
                    <FiCheckCircle />
                  </button>
                )}
                {enq.status !== 'resolved' && (
                  <button onClick={() => updateStatus(enq._id, 'resolved')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Mark Resolved" aria-label="Mark resolved">
                    <FiCheckCircle />
                  </button>
                )}
                <button onClick={() => handleDelete(enq._id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {loading && <p className="text-center py-16 text-gray-500">Loading enquiries...</p>}
        {!loading && !loadError && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <FiInbox className="text-5xl mx-auto mb-4" />
            <p>No {filter === 'All' ? '' : filter.toLowerCase()} enquiries found.</p>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => changePage(Math.max(1, page - 1))}
            disabled={page === 1 || loading}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => changePage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || loading}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageEnquiries;
