import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../services/api';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle, Loader, Code2 } from 'lucide-react';

export default function SubmissionDetails() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const response = await api.get(`/submissions/${id}`);
      setSubmission(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load submission details');
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch(status) {
      case 'ACCEPTED': return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'Accepted' };
      case 'WRONG_ANSWER': return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'Wrong Answer' };
      case 'TIME_LIMIT_EXCEEDED': return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'Time Limit Exceeded' };
      case 'MEMORY_LIMIT_EXCEEDED': return { icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'Memory Limit Exceeded' };
      case 'RUNTIME_ERROR': return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', text: 'Runtime Error' };
      case 'COMPILATION_ERROR': return { icon: XCircle, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'Compilation Error' };
      case 'PENDING': return { icon: Loader, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'Pending' };
      default: return { icon: AlertCircle, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', text: status };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="w-full lg:w-3/4 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl">
          {error || 'Submission not found'}
        </div>
      </div>
    );
  }

  const mainStatus = getStatusInfo(submission.status);
  const MainStatusIcon = mainStatus.icon;

  return (
    <div className="w-full lg:w-3/4 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link to="/submissions" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 font-medium transition">
        <ArrowLeft size={20} />
        Back to My Submissions
      </Link>

      {/* Summary Card */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Submission for: <Link to={`/problems/${submission.problem?.id}`} className="text-blue-400 hover:underline">{submission.problem?.title}</Link>
            </h1>
            <p className="text-sm text-gray-400">
              Submitted on {new Date(submission.createdAt).toLocaleString()}
            </p>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${mainStatus.bg} ${mainStatus.color} ${mainStatus.border}`}>
            <MainStatusIcon size={18} />
            {mainStatus.text}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-900 p-4 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Language</p>
            <p className="text-white font-semibold uppercase">{submission.language}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Execution Time</p>
            <p className="text-white font-semibold">{submission.executionTime ? `${submission.executionTime} ms` : '-'}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Memory Used</p>
            <p className="text-white font-semibold">{submission.memoryUsed ? `${submission.memoryUsed} MB` : '-'}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Judged At</p>
            <p className="text-white font-semibold text-xs">{submission.judgedAt ? new Date(submission.judgedAt).toLocaleTimeString() : '-'}</p>
          </div>
        </div>
      </div>

      {/* Source Code */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden mb-8">
        <div className="bg-gray-900 px-5 py-4 border-b border-gray-700 flex items-center gap-3">
          <Code2 size={20} className="text-blue-400" />
          <span className="text-base font-semibold text-white">Submitted Code</span>
        </div>
        <div className="h-[400px]">
          <Editor
            height="100%"
            defaultLanguage={submission.language === 'cpp' ? 'cpp' : 'python'}
            value={submission.sourceCode}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 15,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16 },
            }}
          />
        </div>
      </div>

      {/* Test Cases Results */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="bg-gray-900 px-5 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Test Cases Results</h2>
        </div>
        <div className="divide-y divide-gray-700">
          {submission.results && submission.results.length > 0 ? (
            submission.results.map((result, index) => {
              const tcStatus = getStatusInfo(result.status);
              const TcStatusIcon = tcStatus.icon;
              const isHidden = result.testCase?.isHidden;

              return (
                <div key={result.id} className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-semibold">Test Case #{index + 1}</span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${tcStatus.bg} ${tcStatus.color} ${tcStatus.border}`}>
                        <TcStatusIcon size={12} />
                        {tcStatus.text}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex gap-4">
                      <span>Time: {result.executionTime ? `${result.executionTime}ms` : '-'}</span>
                      <span className="hidden sm:inline">Memory: {result.memoryUsed ? `${result.memoryUsed}MB` : '-'}</span>
                    </div>
                  </div>

                  {isHidden ? (
                    <div className="bg-gray-900/50 p-4 rounded-xl text-sm text-gray-400 italic">
                      This test case is hidden. Input and expected output are not available.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 mb-1 font-medium">Input:</p>
                        <pre className="bg-gray-900 p-3 rounded-xl text-gray-300 whitespace-pre-wrap max-h-32 overflow-y-auto">
                          {result.testCase?.input || '-'}
                        </pre>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1 font-medium">Expected Output:</p>
                        <pre className="bg-gray-900 p-3 rounded-xl text-green-400 whitespace-pre-wrap max-h-32 overflow-y-auto">
                          {result.testCase?.output || '-'}
                        </pre>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1 font-medium">Actual Output:</p>
                        <pre className="bg-gray-900 p-3 rounded-xl text-blue-400 whitespace-pre-wrap max-h-32 overflow-y-auto">
                          {result.actualOutput || '-'}
                        </pre>
                      </div>
                    </div>
                  )}

                  {result.errorMessage && result.status !== 'ACCEPTED' && (
                    <div className="mt-3 p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-xs text-red-400">
                      <strong>Error:</strong> {result.errorMessage}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-400 text-lg">
              {submission.status === 'COMPILATION_ERROR' ? 'No test cases were run due to compilation error.' : 'No test case results available.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}