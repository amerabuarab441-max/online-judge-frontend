import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Trophy, Clock, Users, Calendar, AlertCircle, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ContestsList() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'PROBLEM_SETTER');

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const response = await api.get('/contests');
      setContests(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load contests');
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'UPCOMING':
        return <span className="px-4 py-1.5 rounded-xl text-sm font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">Upcoming</span>;
      case 'RUNNING':
        return <span className="px-4 py-1.5 rounded-xl text-sm font-semibold bg-green-500/10 text-green-400 border border-green-500/20 animate-pulse">Running</span>;
      case 'FINISHED':
        return <span className="px-4 py-1.5 rounded-xl text-sm font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/20">Finished</span>;
      default:
        return null;
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
            <Trophy className="text-yellow-500" size={36} />
            Contests
          </h1>
          <p className="text-gray-400 text-base">
            Compete with others and improve your skills
          </p>
        </div>
        {isAdmin && (
          <Link 
            to="/contests/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition shadow-md shadow-blue-500/20"
          >
            <PlusCircle size={20} />
            Create Contest
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {contests.length === 0 ? (
        <div className="text-center py-20 bg-gray-800/50 rounded-2xl border border-gray-700">
          <Trophy className="mx-auto text-gray-600 mb-4" size={56} />
          <p className="text-gray-400 text-lg font-medium mb-2">No contests yet</p>
          <p className="text-gray-500 text-base">Check back later for upcoming competitions</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {contests.map((contest) => (
            <div key={contest.id} className="relative">
              <Link 
                to={`/contests/${contest.id}`}
                className="block bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 rounded-2xl p-6 transition group hover:bg-gray-800"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-400 transition mb-2">
                      {contest.title}
                    </h3>
                    <p className="text-gray-400 text-base">
                      {contest.description?.substring(0, 120)}
                      {contest.description?.length > 120 && '...'}
                    </p>
                  </div>
                  {getStatusBadge(contest.status)}
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span className="font-medium">{new Date(contest.startTime).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span className="font-medium">
                      {Math.round((new Date(contest.endTime) - new Date(contest.startTime)) / 60000)} min
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={18} />
                    <span className="font-medium">{contest.participantCount || 0} participants</span>
                  </div>
                </div>
              </Link>
              
              {isAdmin && (
                <Link
                  to={`/contests/${contest.id}/manage`}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 px-4 py-2 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 text-sm font-medium rounded-xl transition z-10 border border-purple-500/20"
                >
                  Manage Problems
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}