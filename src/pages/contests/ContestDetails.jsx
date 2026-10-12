import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  ArrowLeft, Trophy, Clock, Calendar, Users, 
  AlertCircle, LogIn, Loader, CheckCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ContestDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [contest, setContest] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);
  const [activeTab, setActiveTab] = useState('problems');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    fetchContest();
    fetchLeaderboard();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!contest) return;

    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(contest.startTime);
      const end = new Date(contest.endTime);

      if (now < start) {
        const diff = start - now;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`Starts in ${hours}h ${minutes}m ${seconds}s`);
      } else if (now <= end) {
        const diff = end - now;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s remaining`);
      } else {
        setTimeLeft('Contest ended');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [contest]);

  const fetchContest = async () => {
    try {
      const response = await api.get(`/contests/${id}`);
      setContest(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load contest');
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get(`/contests/${id}/leaderboard`);
      setLeaderboard(response.data.leaderboard || []);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      await api.post(`/contests/${id}/join`);
      fetchContest();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to join contest');
    } finally {
      setJoining(false);
    }
  };

  const handleStartVirtual = async () => {
    if (!confirm('Start a virtual contest? The timer will begin immediately.')) return;
    
    setJoining(true);
    try {
      await api.post(`/contests/${id}/virtual`);
      fetchContest();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start virtual contest');
    } finally {
      setJoining(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'UPCOMING': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'RUNNING': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'FINISHED': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl">
          {error || 'Contest not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        to="/contests" 
        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 font-medium transition"
      >
        <ArrowLeft size={20} />
        Back to Contests
      </Link>

      {/* Contest Header */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">{contest.title}</h1>
            <p className="text-gray-400 text-base sm:text-lg">{contest.description}</p>
          </div>
          <span className={`inline-flex px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(contest.status)}`}>
            {contest.status}
          </span>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span className="font-medium">{new Date(contest.startTime).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={18} />
            <span className="font-medium">{contest.participantCount || 0} participants</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span className={`font-bold ${contest.status === 'RUNNING' ? 'text-green-400' : ''}`}>
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Join / Virtual Button */}
        {user && (
          <div className="mt-4">
            {contest.isJoined ? (
              <div className="flex items-center gap-2 text-green-400 font-semibold">
                <CheckCircle size={22} />
                <span>You have joined this contest</span>
              </div>
            ) : contest.status !== 'FINISHED' ? (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-xl font-semibold transition shadow-md shadow-blue-500/20"
              >
                {joining ? <Loader size={20} className="animate-spin" /> : <LogIn size={20} />}
                {joining ? 'Joining...' : 'Join Contest'}
              </button>
            ) : (
              <button
                onClick={handleStartVirtual}
                disabled={joining}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-xl font-semibold transition shadow-md shadow-purple-500/20"
              >
                {joining ? <Loader size={20} className="animate-spin" /> : <Clock size={20} />}
                {joining ? 'Starting...' : 'Start Virtual Contest'}
              </button>
            )}
          </div>
        )}

        {!user && (
          <div className="mt-4">
            <Link to="/login" className="text-blue-400 hover:underline font-medium">
              Login to join this contest →
            </Link>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('problems')}
          className={`px-6 py-3 border-b-2 font-semibold transition ${
            activeTab === 'problems'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Problems ({contest.problems?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-6 py-3 border-b-2 font-semibold transition ${
            activeTab === 'leaderboard'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Leaderboard
        </button>
      </div>

      {/* Problems Tab */}
      {activeTab === 'problems' && (
        <div>
          {contest.status === 'UPCOMING' ? (
            <div className="text-center py-16 bg-gray-800/50 rounded-2xl border border-gray-700">
              <Clock className="mx-auto text-gray-600 mb-4" size={56} />
              <p className="text-gray-400 text-lg font-medium">
                Problems will be revealed when the contest starts
              </p>
            </div>
          ) : contest.problems?.length === 0 ? (
            <div className="text-center py-16 bg-gray-800/50 rounded-2xl border border-gray-700">
              <p className="text-gray-400 text-lg">No problems in this contest yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {contest.problems.map((cp, index) => (
                <Link
                  key={cp.id}
                  to={`/problems/${cp.problem.id}?contestId=${contest.id}`}
                  className="bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 rounded-xl p-5 transition flex items-center gap-5 group hover:bg-gray-800"
                >
                  <span className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center font-bold text-xl">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition">
                      {cp.problem.title}
                    </h3>
                  </div>
                  <span className="text-gray-500 text-sm font-medium">{cp.problem.difficulty}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
          {leaderboard.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-lg">
              No participants yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="text-left p-5 text-gray-400 text-sm font-semibold">Rank</th>
                    <th className="text-left p-5 text-gray-400 text-sm font-semibold">User</th>
                    <th className="text-left p-5 text-gray-400 text-sm font-semibold">Score</th>
                    <th className="text-left p-5 text-gray-400 text-sm font-semibold">Penalty</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr key={entry.userId} className="border-t border-gray-700 hover:bg-gray-800/50 transition">
                      <td className="p-5">
                        <span className={`font-bold text-lg ${
                          entry.rank === 1 ? 'text-yellow-400' :
                          entry.rank === 2 ? 'text-gray-300' :
                          entry.rank === 3 ? 'text-orange-400' :
                          'text-gray-500'
                        }`}>
                          #{entry.rank}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className="text-white font-semibold">{entry.username}</span>
                        {entry.isVirtual && (
                          <span className="ml-2 px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded-full">
                            Virtual
                          </span>
                        )}
                      </td>
                      <td className="p-5 text-green-400 font-bold text-lg">{entry.score}</td>
                      <td className="p-5 text-gray-400 font-medium">{entry.penalty} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}