import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, PlusCircle, Trash2, Loader, CheckCircle, AlertCircle, Trophy } from 'lucide-react';

export default function ManageContestProblems() {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [allProblems, setAllProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [contestRes, problemsRes] = await Promise.all([
        api.get(`/contests/${id}`),
        api.get('/problems')
      ]);

      setContest(contestRes.data);
      
      const problems = Array.isArray(problemsRes.data) 
        ? problemsRes.data 
        : problemsRes.data.problems || [];
      
      // Filter out problems already in the contest
      const contestProblemIds = contestRes.data.problems?.map(cp => cp.problem?.id) || [];
      setAllProblems(problems.filter(p => !contestProblemIds.includes(p.id)));
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const handleAddProblem = async (e) => {
    e.preventDefault();
    
    if (!selectedProblem) {
      setError('Please select a problem');
      return;
    }

    setAdding(true);
    setError('');
    setSuccess('');

    try {
      await api.post(`/contests/${id}/problems`, {
        problemId: selectedProblem
      });

      setSuccess('Problem added successfully!');
      setSelectedProblem('');
      
      setTimeout(() => {
        setSuccess('');
        fetchData();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add problem');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveProblem = async (problemId) => {
    if (!confirm('Remove this problem from the contest?')) return;

    try {
      await api.delete(`/contests/${id}/problems/${problemId}`);
      setSuccess('Problem removed successfully!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove problem');
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
      <div className="flex items-center gap-4 mb-8">
        <Link to={`/contests/${id}`} className="text-blue-400 hover:text-blue-300 transition">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex items-center gap-3">
          <Trophy className="text-yellow-500" size={32} />
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Manage Problems</h1>
            <p className="text-gray-400 text-base mt-1">{contest?.title}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500 text-green-400 p-4 rounded-xl mb-6 flex items-center gap-2">
          <CheckCircle size={20} />
          {success}
        </div>
      )}

      {/* Add Problem Form */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sm:p-8 mb-8">
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
          <PlusCircle size={22} className="text-blue-400" />
          Add Problem to Contest
        </h2>

        <form onSubmit={handleAddProblem} className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedProblem}
            onChange={(e) => setSelectedProblem(e.target.value)}
            className="flex-1 p-3.5 bg-gray-900 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Select a problem...</option>
            {allProblems.map((problem) => (
              <option key={problem.id} value={problem.id}>
                {problem.title} ({problem.difficulty})
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={adding || !selectedProblem}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
          >
            {adding ? <Loader size={18} className="animate-spin" /> : <PlusCircle size={18} />}
            Add
          </button>
        </form>
      </div>

      {/* Current Problems in Contest */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">
            Contest Problems ({contest?.problems?.length || 0})
          </h2>
        </div>

        {!contest?.problems || contest.problems.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-lg">
            No problems added yet. Add problems using the form above.
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {contest.problems.map((cp, index) => (
              <div key={cp.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center font-bold text-xl">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{cp.problem?.title}</h3>
                    <span className="text-gray-500 text-xs font-medium">{cp.problem?.difficulty}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/problems/${cp.problem?.id}/edit`}
                    className="px-4 py-2 bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 text-sm font-medium rounded-lg transition border border-yellow-500/20"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/problems/${cp.problem?.id}`}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium rounded-lg transition"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleRemoveProblem(cp.problem?.id)}
                    className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                    title="Remove problem"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}