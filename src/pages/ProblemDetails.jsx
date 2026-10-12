import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../services/api';
import { Clock, HardDrive, Code2, Send, ArrowLeft, Trophy, Plus, Minus, RotateCcw, Languages, Loader } from 'lucide-react';

const DEFAULT_CPP_CODE = '';
const DEFAULT_PYTHON_CODE = '';

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 32;
const DEFAULT_FONT_SIZE = 19;

export default function ProblemDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const contestId = searchParams.get('contestId');

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [sourceCode, setSourceCode] = useState(DEFAULT_CPP_CODE);
  const [language, setLanguage] = useState('cpp');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // حجم الخط
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('editorFontSize');
    const parsed = saved ? parseInt(saved) : DEFAULT_FONT_SIZE;
    return (parsed >= MIN_FONT_SIZE && parsed <= MAX_FONT_SIZE) ? parsed : DEFAULT_FONT_SIZE;
  });

  // لغة العرض (عربي/إنجليزي)
  const [viewLanguage, setViewLanguage] = useState('en');
  const [arabicTranslation, setArabicTranslation] = useState(null);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    try {
      const response = await api.get(`/problems/${id}`);
      setProblem(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load problem');
      setLoading(false);
      console.error(err);
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    
    if (newLang === 'cpp') {
      setSourceCode(DEFAULT_CPP_CODE);
    } else if (newLang === 'python') {
      setSourceCode(DEFAULT_PYTHON_CODE);
    }
  };

  const handleZoomIn = () => {
    setFontSize(prev => {
      const newSize = Math.min(prev + 2, MAX_FONT_SIZE);
      localStorage.setItem('editorFontSize', newSize.toString());
      return newSize;
    });
  };

  const handleZoomOut = () => {
    setFontSize(prev => {
      const newSize = Math.max(prev - 2, MIN_FONT_SIZE);
      localStorage.setItem('editorFontSize', newSize.toString());
      return newSize;
    });
  };

  const handleResetFontSize = () => {
    setFontSize(DEFAULT_FONT_SIZE);
    localStorage.setItem('editorFontSize', DEFAULT_FONT_SIZE.toString());
  };

  // التبديل إلى العربية (مع ترجمة آلية إذا لزم الأمر)
  const handleSwitchToArabic = async () => {
    // إذا كانت الترجمة محملة بالفعل
    if (arabicTranslation) {
      setViewLanguage('ar');
      return;
    }

    // إذا كانت الترجمة محفوظة في المشكلة
    if (problem.titleAr && problem.descriptionAr) {
      setArabicTranslation({
        titleAr: problem.titleAr,
        descriptionAr: problem.descriptionAr
      });
      setViewLanguage('ar');
      return;
    }

    // ترجمة آلية
    setTranslating(true);
    try {
      const response = await api.post(`/problems/${id}/translate`);
      setArabicTranslation({
        titleAr: response.data.titleAr,
        descriptionAr: response.data.descriptionAr
      });
      setViewLanguage('ar');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to translate problem. Please try again.');
    } finally {
      setTranslating(false);
    }
  };

  const handleSwitchToEnglish = () => {
    setViewLanguage('en');
  };

  const handleSubmit = async () => {
    if (!sourceCode.trim()) {
      alert('Please write some code first');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setSubmissionResult({
        type: 'error',
        message: 'You must be logged in to submit. Please login first.',
      });
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }

    setSubmitting(true);
    setSubmissionResult(null);
    
    try {
      const response = await api.post('/submissions', {
        problemId: id,
        sourceCode,
        language,
        contestId: contestId || null
      });
      
      setSubmissionResult({
        type: 'info',
        message: 'Submission created successfully! Judging...'
      });
      
      pollSubmissionResult(response.data.submission.id);
    } catch (err) {
      console.error('[Submit] Error:', err.response?.data || err.message);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to submit code';
      
      setSubmissionResult({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setSubmitting(false);
    }
  };

  const pollSubmissionResult = async (submissionId) => {
    const maxAttempts = 30;
    let attempts = 0;
    
    const interval = setInterval(async () => {
      attempts++;
      try {
        const response = await api.get(`/submissions/${submissionId}`);
        const submission = response.data;
        
        if (submission.status !== 'PENDING') {
          clearInterval(interval);
          setSubmissionResult({
            type: submission.status === 'ACCEPTED' ? 'success' : 'warning',
            message: `Verdict: ${submission.status.replace(/_/g, ' ')}`,
            details: submission
          });
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setSubmissionResult({
            type: 'error',
            message: 'Judging took too long. Please check My Submissions.'
          });
        }
      } catch (err) {
        clearInterval(interval);
      }
    }, 2000);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'EASY': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'HARD': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="w-full lg:w-3/4 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl">
          {error || 'Problem not found'}
        </div>
      </div>
    );
  }

  // تحديد النص المعروض حسب اللغة
  const displayTitle = viewLanguage === 'ar' && arabicTranslation 
    ? arabicTranslation.titleAr 
    : problem.title;
  
  const displayDescription = viewLanguage === 'ar' && arabicTranslation 
    ? arabicTranslation.descriptionAr 
    : problem.description;

  return (
    <div className="w-full lg:w-3/4 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button + Contest Badge */}
      <div className="flex items-center justify-between mb-6">
        <Link 
          to="/problems" 
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition"
        >
          <ArrowLeft size={20} />
          Back to Problems
        </Link>
        
        {contestId && (
          <Link
            to={`/contests/${contestId}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl text-sm font-medium hover:bg-purple-500/20 transition"
          >
            <Trophy size={16} />
            Back to Contest
          </Link>
        )}
      </div>

      {/* Problem Header */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <h1 
            className="text-3xl sm:text-4xl font-extrabold text-white"
            dir={viewLanguage === 'ar' ? 'rtl' : 'ltr'}
          >
            {displayTitle}
          </h1>
          <span className={`inline-flex px-4 py-2 rounded-xl text-sm font-semibold border ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>

        {/* Language Toggle */}
        <div className="flex gap-2 mb-6 bg-gray-900 p-1.5 rounded-xl inline-flex border border-gray-700">
          <button
            onClick={handleSwitchToEnglish}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              viewLanguage === 'en'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={handleSwitchToArabic}
            disabled={translating}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
              viewLanguage === 'ar'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {translating ? (
              <>
                <Loader size={14} className="animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Languages size={14} />
                العربية
              </>
            )}
          </button>
        </div>
        
        <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span className="font-medium">Time Limit: {problem.timeLimit}ms</span>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive size={18} />
            <span className="font-medium">Memory Limit: {problem.memoryLimit}MB</span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <div 
            className={`text-gray-300 whitespace-pre-wrap text-base sm:text-lg leading-relaxed ${
              viewLanguage === 'ar' ? 'text-right' : ''
            }`}
            dir={viewLanguage === 'ar' ? 'rtl' : 'ltr'}
          >
            {displayDescription}
          </div>
        </div>
      </div>

      {/* Code Editor Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="bg-gray-900 px-5 py-4 border-b border-gray-700 flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <Code2 size={20} className="text-blue-400" />
              <span className="text-base font-semibold text-white">Code Editor</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Font Size Controls */}
              <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1 border border-gray-700">
                <button
                  onClick={handleZoomOut}
                  disabled={fontSize <= MIN_FONT_SIZE}
                  title="Decrease font size"
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-md transition"
                >
                  <Minus size={16} />
                </button>
                <span className="text-xs text-gray-400 font-medium w-12 text-center select-none">
                  {fontSize}px
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={fontSize >= MAX_FONT_SIZE}
                  title="Increase font size"
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-md transition"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={handleResetFontSize}
                  title="Reset font size"
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition border-l border-gray-700 ml-1"
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              {/* Language Selector */}
              <select 
                value={language}
                onChange={handleLanguageChange}
                className="bg-gray-700 text-white text-sm font-medium rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="cpp">C++</option>
                <option value="python">Python</option>
              </select>
            </div>
          </div>
          
          <div className="h-[550px]">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : 'python'}
              value={sourceCode}
              onChange={(value) => setSourceCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: fontSize,
                lineHeight: Math.round(fontSize * 1.5),
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                padding: { top: 20, bottom: 20 },
                letterSpacing: 0.5,
                fontWeight: '500',
                tabSize: 4,
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
              }}
            />
          </div>
        </div>

        {/* Submit Section */}
        <div className="space-y-5">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-3 text-lg shadow-lg shadow-blue-500/20"
          >
            <Send size={22} />
            {submitting ? 'Submitting...' : 'Submit Code'}
          </button>

          {submissionResult && (
            <div className={`p-5 rounded-xl border ${
              submissionResult.type === 'success' 
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : submissionResult.type === 'warning'
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                : submissionResult.type === 'info'
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <p className="font-bold text-base">{submissionResult.message}</p>
              {submissionResult.details && (
                <div className="mt-4 text-sm space-y-1">
                  <p>Execution Time: <span className="font-semibold">{submissionResult.details.executionTime || 0}ms</span></p>
                  <p>Memory Used: <span className="font-semibold">{submissionResult.details.memoryUsed || 'N/A'}</span></p>
                  <Link 
                    to={`/submissions/${submissionResult.details.id}`}
                    className="text-blue-400 hover:underline mt-3 inline-block font-medium"
                  >
                    View Full Details →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
            <h3 className="text-base font-semibold text-white mb-3">Submission Info</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                Your code will be compiled and tested automatically
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                Results will appear here after judging
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                You can view your submission history in "My Submissions"
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}