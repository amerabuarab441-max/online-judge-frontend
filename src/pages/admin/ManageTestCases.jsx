import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, PlusCircle, Trash2, Eye, EyeOff, Save, Loader, AlertCircle, CheckCircle, Database } from 'lucide-react';

export default function ManageTestCases() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newTestCase, setNewTestCase] = useState({
    input: '',
    output: '',
    isHidden: true
  });

  useEffect(() => {
    fetchProblemAndTestCases();
  }, [id]);

  const fetchProblemAndTestCases = async () => {
    try {
      const problemRes = await api.get(`/problems/${id}`);
      setProblem(problemRes.data);

      const testCasesRes = await api.get(`/testcases/problem/${id}`);
      const data = testCasesRes.data;
      setTestCases(Array.isArray(data) ? data : data.testCases || []);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load problem data');
      setLoading(false);
      console.error(err);
    }
  };

  const handleAddTestCase = async (e) => {
    e.preventDefault();
    
    if (!newTestCase.input.trim() || !newTestCase.output.trim()) {
      setError('Input and Output are required');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/testcases', {
        problemId: id,
        input: newTestCase.input,
        output: newTestCase.output,
        isHidden: newTestCase.isHidden
      });

      setSuccess('Test case added successfully!');
      setNewTestCase({ input: '', output: '', isHidden: true });
      
      fetchProblemAndTestCases();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add test case');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTestCase = async (testCaseId) => {
    if (!confirm('Are you sure you want to delete this test case?')) return;

    try {
      await api.delete(`/testcases/${testCaseId}`);
      setTestCases(testCases.filter(tc => tc.id !== testCaseId));
      setSuccess('Test case deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete test case');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTestCase(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
          <Database className="text-blue-400" size={32} />
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Manage Test Cases</h1>
            <p className="text-gray-400 text-base mt-1">Problem: {problem?.title}</p>
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

      {/* Add New Test Case Form */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sm:p-8 mb-8">
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
          <PlusCircle size={22} className="text-blue-400" />
          Add New Test Case
        </h2>

        <form onSubmit={handleAddTestCase} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Input <span className="text-red-500">*</span>
              </label>
              <textarea
                name="input"
                value={newTestCase.input}
                onChange={handleInputChange}
                rows={5}
                placeholder="Enter test input..."
                className="w-full p-3.5 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y font-mono text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Expected Output <span className="text-red-500">*</span>
              </label>
              <textarea
                name="output"
                value={newTestCase.output}
                onChange={handleInputChange}
                rows={5}
                placeholder="Enter expected output..."
                className="w-full p-3.5 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y font-mono text-sm"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isHidden"
                checked={newTestCase.isHidden}
                onChange={handleInputChange}
                className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-900"
              />
              <span className="text-gray-300 text-sm font-medium">
                Hide this test case from contestants
                <span className="block text-xs text-gray-500 mt-0.5">Recommended for final test cases</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
            >
              {saving ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Add Test Case
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Test Cases */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">
            Existing Test Cases ({testCases.length})
          </h2>
        </div>

        {testCases.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-lg">
            No test cases yet. Add your first test case above.
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {testCases.map((tc, index) => (
              <div key={tc.id} className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold">
                      Test #{index + 1}
                    </span>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      tc.isHidden 
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' 
                        : 'bg-green-500/10 text-green-400 border-green-500/20'
                    }`}>
                      {tc.isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                      {tc.isHidden ? 'Hidden' : 'Visible'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteTestCase(tc.id)}
                    className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                    title="Delete test case"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs font-semibold mb-1.5">Input:</p>
                    <pre className="bg-gray-900 p-4 rounded-xl text-gray-300 text-sm whitespace-pre-wrap font-mono max-h-32 overflow-y-auto border border-gray-800">
                      {tc.input}
                    </pre>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-semibold mb-1.5">Expected Output:</p>
                    <pre className="bg-gray-900 p-4 rounded-xl text-green-400 text-sm whitespace-pre-wrap font-mono max-h-32 overflow-y-auto border border-gray-800">
                      {tc.output}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}