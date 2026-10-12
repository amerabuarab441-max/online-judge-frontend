import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Save, Loader, FileText, Languages } from 'lucide-react';

export default function EditProblem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeLang, setActiveLang] = useState('en');

  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    difficulty: 'EASY',
    timeLimit: 1000,
    memoryLimit: 256
  });

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    try {
      const response = await api.get(`/problems/${id}`);
      const problem = response.data;
      
      setFormData({
        title: problem.title || '',
        titleAr: problem.titleAr || '',
        description: problem.description || '',
        descriptionAr: problem.descriptionAr || '',
        difficulty: problem.difficulty || 'EASY',
        timeLimit: problem.timeLimit || 1000,
        memoryLimit: problem.memoryLimit || 256
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load problem');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'timeLimit' || name === 'memoryLimit') ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.put(`/problems/${id}`, {
        ...formData,
        titleAr: formData.titleAr || null,
        descriptionAr: formData.descriptionAr || null
      });

      setSuccess('Problem updated successfully!');
      setTimeout(() => {
        navigate('/admin/problems');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update problem');
    } finally {
      setSaving(false);
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
        <Link to="/admin/problems" className="text-blue-400 hover:text-blue-300 transition">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex items-center gap-3">
          <FileText className="text-blue-400" size={32} />
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Edit Problem</h1>
            <p className="text-gray-400 text-base mt-1">Update problem details and translations</p>
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
        {/* Language Tabs */}
        <div className="flex gap-2 border-b border-gray-700">
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold transition ${
              activeLang === 'en'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('ar')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold transition ${
              activeLang === 'ar'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Languages size={18} />
            العربية
          </button>
        </div>

        {/* English Fields */}
        {activeLang === 'en' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Title (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3.5 bg-gray-900 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Description (English) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={10}
                className="w-full p-3.5 bg-gray-900 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y"
              />
            </div>
          </>
        )}

        {/* Arabic Fields */}
        {activeLang === 'ar' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                العنوان (بالعربية)
              </label>
              <input
                type="text"
                name="titleAr"
                value={formData.titleAr}
                onChange={handleChange}
                dir="rtl"
                placeholder="اكتب عنوان المشكلة بالعربية..."
                className="w-full p-3.5 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-right"
              />
              <p className="text-xs text-gray-500 mt-1">اترك الحقل فارغاً إذا لم تتوفر ترجمة عربية</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                الوصف (بالعربية)
              </label>
              <textarea
                name="descriptionAr"
                value={formData.descriptionAr}
                onChange={handleChange}
                rows={10}
                dir="rtl"
                placeholder="اكتب وصف المشكلة بالعربية..."
                className="w-full p-3.5 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y text-right"
              />
              <p className="text-xs text-gray-500 mt-1">اترك الحقل فارغاً إذا لم تتوفر ترجمة عربية</p>
            </div>
          </>
        )}

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
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-3 text-lg shadow-lg shadow-blue-500/20"
          >
            {saving ? (
              <>
                <Loader size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
          <Link
            to="/admin/problems"
            className="px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition flex items-center justify-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}