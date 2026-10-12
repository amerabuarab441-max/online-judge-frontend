import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Clock, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

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
    switch (status) {
      case 'ACCEPTED':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' };
      case 'WRONG_ANSWER':
        return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' };
      case 'TIME_LIMIT_EXCEEDED':
        return { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
      case 'MEMORY_LIMIT_EXCEEDED':
        return { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-500/10' };
      case 'RUNTIME_ERROR':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' };
      case 'COMPILATION_ERROR':
        return { icon: XCircle, color: 'text-purple-500', bg: 'bg-purple-500/10' };
      case 'PENDING':
        return { icon: Loader, color: 'text-blue-500', bg: 'bg-blue-500/10' };
      default:
        return { icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-500/10' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-8">My Submissions</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-lg mb-4">You haven't submitted any solutions yet.</p>
          <Link to="/problems" className="text-blue-400 hover:underline">
            Start solving problems →
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Problem</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Language</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Time</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Memory</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Submitted</th>
                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => {
                  const statusInfo = getStatusInfo(sub.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={sub.id} className="border-t border-gray-700 hover:bg-gray-750 transition">
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                          <StatusIcon size={14} className={sub.status === 'PENDING' ? 'animate-spin' : ''} />
                          {sub.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-white font-medium">
                        {sub.problem?.title || 'Unknown'}
                      </td>
                      <td className="p-4 text-gray-400 text-sm uppercase">
                        {sub.language}
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {sub.executionTime ? `${sub.executionTime}ms` : '-'}
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {sub.memoryUsed ? `${sub.memoryUsed}MB` : '-'}
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {new Date(sub.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <Link
                          to={`/submissions/${sub.id}`}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
              >
                Previous
              </button>
              <span className="text-gray-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}