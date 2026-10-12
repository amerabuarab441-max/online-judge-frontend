import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { PlusCircle, FileText, Database, Code2, AlertCircle, Trophy, Users, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    problems: 0,
    contests: 0,
    submissions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [problemsRes, contestsRes] = await Promise.all([
        api.get('/problems'),
        api.get('/contests')
      ]);

      const problems = Array.isArray(problemsRes.data) 
        ? problemsRes.data 
        : problemsRes.data.problems || [];
      
      const contests = Array.isArray(contestsRes.data)
        ? contestsRes.data
        : contestsRes.data.contests || [];

      setStats({
        problems: problems.length,
        contests: contests.length,
        submissions: 0
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Problems',
      value: stats.problems,
      icon: FileText,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      link: '/admin/problems'
    },
    {
      label: 'Total Contests',
      value: stats.contests,
      icon: Trophy,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      link: '/contests'
    },
    {
      label: 'Active Users',
      value: '100+',
      icon: Users,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      link: null
    }
  ];

  return (
    <div className="w-full lg:w-3/4 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
            <Database className="text-blue-400" size={36} />
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-base">
            Manage problems, contests, and platform content
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

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-blue-500/30 transition">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/admin/problems" 
          className="block bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition">
              <FileText className="text-blue-400" size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">Manage Problems</h3>
              <p className="text-gray-400 text-sm">Create, edit, and delete problems</p>
            </div>
          </div>
          <div className="flex items-center text-blue-400 text-sm font-medium">
            Go to Problems
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link 
          to="/contests/new" 
          className="block bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition">
              <Trophy className="text-purple-400" size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition">Create Contest</h3>
              <p className="text-gray-400 text-sm">Set up a new programming contest</p>
            </div>
          </div>
          <div className="flex items-center text-purple-400 text-sm font-medium">
            Create New Contest
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition" />
          </div>
        </Link>
      </div>
    </div>
  );
}