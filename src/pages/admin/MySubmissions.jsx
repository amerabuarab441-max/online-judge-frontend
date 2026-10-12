import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Clock, CheckCircle, XCircle, AlertCircle, Loader, FileCode, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, [page]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/submissions/my?page=${page}&limit=10`);
      const data = response.data;
      
      setSubmissions(data.submissions || data);
      setPagination(data.pagination || null);
      setLoading(false);
    } catch (err) {
      setError('Failed to load submissions');
      setLoading(false);
      console.error(err);
    }
  };

  const getStatusInfo = (status) => {
    switch(status) {
      case 'ACCEPTED':
        return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' };
      case 'WRONG_ANSWER':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
      case 'TIME_LIMIT_EXCEEDED':
        return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
      case 'MEMORY_LIMIT_EXCEEDED':
        return { icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
      case 'RUNTIME_ERROR':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' };
      case 'COMPILATION_ERROR':
        return { icon: XCircle, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' };
      case 'PENDING':
        return { icon: Loader, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
      default:
        return { icon: AlertCircle, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-3/4 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
          <FileCode className="text-blue-400" size={36} />
          My Submissions
        </h1>
        <p className="text-gray-400 text-base">
          Track all your code submissions and results
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="text-center py-20 bg-gray-800/50 rounded-2xl border border-gray-700">
          <FileCode className="mx-auto text-gray-600 mb-4" size={56} />
          <p className="text-gray-400 text-lg font-medium mb-2">You haven't submitted any solutions yet</p>
          <Link to="/problems" className="text-blue-400 hover:underline font-medium">
            Start solving problems →
          </Link>
        </div>
      ) : (
        <>
          {/* Submissions Table */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="text-left p-4 sm:p-5 text-gray-400 text-sm font-semibold">Status</th>
                    <th className="text-left p-4 sm:p-5 text-gray-400 text-sm font-semibold">Problem</th>
                    <th className="text-left p-4 sm:p-5 text-gray-400 text-sm font-semibold hidden sm:table-cell">Language</th>
                    <th className="text-left p-4 sm:p-5 text-gray-400 text-sm font-semibold hidden md:table-cell">Time</th>
                    <th className="text-left p-4 sm:p-5 text-gray-400 text-sm font-semibold hidden md:table-cell">Memory</th>
                    <th className="text-left p-4 sm:p-5 text-gray-400 text-sm font-semibold hidden lg:table-cell">Submitted</th>
                    <th className="text-left p-4 sm:p-5 text-gray-400 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => {
                    const statusInfo = getStatusInfo(sub.status);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <tr key={sub.id} className="border-t border-gray-700 hover:bg-gray-800/70 transition">
                        <td className="p-4 sm:p-5">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                            <StatusIcon size={14} className={sub.status === 'PENDING' ? 'animate-spin' : ''} />
                            <span className="hidden sm:inline">{sub.status.replace(/_/g, ' ')}</span>
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-white font-semibold">
                          {sub.problem?.title || 'Unknown'}
                        </td>
                        <td className="p-4 sm:p-5 text-gray-400 text-sm uppercase font-medium hidden sm:table-cell">
                          {sub.language}
                        </td>
                        <td className="p-4 sm:p-5 text-gray-400 text-sm hidden md:table-cell">
                          {sub.executionTime ? `${sub.executionTime}ms` : '-'}
                        </td>
                        <td className="p-4 sm:p-5 text-gray-400 text-sm hidden md:table-cell">
                          {sub.memoryUsed ? `${sub.memoryUsed}MB` : '-'}
                        </td>
                        <td className="p-4 sm:p-5 text-gray-400 text-sm hidden lg:table-cell">
                          {new Date(sub.createdAt).toLocaleString()}
                        </td>
                        <td className="p-4 sm:p-5">
                          <Link 
                            to={`/submissions/${sub.id}`}
                            className="px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs font-medium rounded-lg transition border border-blue-500/20"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition font-medium"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <span className="text-gray-400 font-medium">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition font-medium"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}