import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Save, Loader, FileText } from 'lucide-react';

export default function CreateProblem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'EASY',
    timeLimit: 1000,
    memoryLimit: 256
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'timeLimit' || name === 'memoryLimit') ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/problems', formData);
      setSuccess('Problem created successfully! Redirecting to test cases...');
      
      const problemId = response.data.id || response.data.problem?.id;
      if (problemId) {
        setTimeout(() => {
          navigate(`/admin/problems/${problemId}/testcases`);
        }, 1500);
      } else {
        setTimeout(() => navigate('/admin/problems'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create problem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-3/4 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/problems" className="text-blue-400 hover:text-blue-300 transition">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex items-center gap-3">
          <FileText className="text-blue-400" size={32} />
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Create New Problem</h1>
            <p className="text-gray-400 text-base mt-1">Add a new coding challenge to the platform</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500 text-green-400 p-4 rounded-xl mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sm:p-8 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Problem Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Two Sum Problem"
            className="w-full p-3.5 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Problem Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={10}
            placeholder="Describe the problem statement, input format, output format, and constraints..."
            className="w-full p-3.5 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y"
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Difficulty <span className="text-red-500">*</span>
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full p-3.5 bg-gray-900 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        {/* Limits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Time Limit (ms) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="timeLimit"
              value={formData.timeLimit}
              onChange={handleChange}
              min={100}
              max={10000}
              required
              className="w-full p-3.5 bg-gray-900 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Memory Limit (MB) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="memoryLimit"
              value={formData.memoryLimit}
              onChange={handleChange}
              min={64}
              max={1024}
              required
              className="w-full p-3.5 bg-gray-900 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-3 text-lg shadow-lg shadow-blue-500/20"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save size={20} />
              Create Problem
            </>
          )}
        </button>
      </form>
    </div>
  );
}