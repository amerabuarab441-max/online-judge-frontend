import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { PlusCircle, Trash2, Clock, HardDrive, AlertCircle, Search, FileText, Edit } from 'lucide-react';

export default function AdminProblemsList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await api.get('/problems');
      const data = response.data;
      setProblems(Array.isArray(data) ? data : data.problems || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load problems');
      setLoading(false);
    }
  };

  const handleDelete = async (problemId) => {
    if (!confirm('Are you sure you want to delete this problem? This will also delete all its test cases and submissions.')) return;

    try {
      await api.delete(`/problems/${problemId}`);
      setProblems(problems.filter(p => p.id !== problemId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete problem');
    }
  };

  const filteredProblems = problems.filter(problem =>
    problem.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case 'EASY':
        return { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', dot: 'bg-green-400' };
      case 'MEDIUM':
        return { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', dot: 'bg-yellow-400' };
      case 'HARD':
        return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400' };
      default:
        return { text: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', dot: 'bg-gray-400' };
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
            <FileText className="text-blue-400" size={36} />
            Manage Problems
          </h1>
          <p className="text-gray-400 text-base">
            {problems.length} problems in the database
          </p>
        </div>
        <Link
          to="/admin/problems/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition shadow-md shadow-blue-500/20"
        >
          <PlusCircle size={20} />
          New Problem
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search problems..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {filteredProblems.length === 0 ? (
        <div className="text-center py-16 bg-gray-800/50 rounded-2xl border border-gray-700">
          <Search className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-400 text-lg">No problems found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProblems.map((problem) => {
            const style = getDifficultyStyle(problem.difficulty);
            return (
              <div
                key={problem.id}
                className="bg-gray-800/50 border border-gray-700 hover:border-blue-500/30 rounded-2xl p-5 transition"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{problem.title}</h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}>
                        {problem.difficulty}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm line-clamp-2 max-w-3xl mb-3">
                      {problem.description?.substring(0, 150)}...
                    </p>

                    <div className="flex gap-6 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {problem.timeLimit}ms
                      </div>
                      <div className="flex items-center gap-1">
                        <HardDrive size={12} />
                        {problem.memoryLimit}MB
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Link
                      to={`/admin/problems/${problem.id}/edit`}
                      className="px-4 py-2 bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 text-sm font-medium rounded-lg transition border border-yellow-500/20"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/admin/problems/${problem.id}/testcases`}
                      className="px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-sm font-medium rounded-lg transition border border-blue-500/20"
                    >
                      Test Cases
                    </Link>
                    <Link
                      to={`/problems/${problem.id}`}
                      className="px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 text-sm font-medium rounded-lg transition"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(problem.id)}
                      className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition border border-transparent hover:border-red-500/20"
                      title="Delete problem"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}