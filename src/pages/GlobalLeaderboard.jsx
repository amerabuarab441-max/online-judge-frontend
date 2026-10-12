import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Award, AlertCircle, Loader } from 'lucide-react';

export default function GlobalLeaderboard() {
    const { user: currentUser } = useAuth();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await api.get('/users/leaderboard?limit=50');
            setLeaderboard(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load leaderboard');
            setLoading(false);
        }
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return <Trophy className="text-yellow-400" size={24} />;
        if (rank === 2) return <Medal className="text-gray-300" size={24} />;
        if (rank === 3) return <Medal className="text-orange-400" size={24} />;
        return <span className="text-gray-500 font-bold text-lg">#{rank}</span>;
    };

    const getRankBg = (rank) => {
        if (rank === 1) return 'bg-yellow-500/5 border-yellow-500/20';
        if (rank === 2) return 'bg-gray-500/5 border-gray-400/20';
        if (rank === 3) return 'bg-orange-500/5 border-orange-500/20';
        return 'bg-gray-800/50 border-gray-700';
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
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-2xl mb-4">
                    <Trophy className="text-yellow-400" size={32} />
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Global Leaderboard</h1>
                <p className="text-gray-400 text-base">Top problem solvers on the platform</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {leaderboard.length === 0 ? (
                <div className="text-center py-16 bg-gray-800/50 rounded-2xl border border-gray-700">
                    <Award className="mx-auto text-gray-600 mb-4" size={48} />
                    <p className="text-gray-400 text-lg">No submissions yet</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {leaderboard.map((entry) => {
                        const isCurrentUser = currentUser && currentUser.id === entry.id;
                        return (
                            <Link
                                key={entry.id}
                                to={`/profile/${entry.id}`}
                                className={`block border rounded-2xl p-5 transition hover:border-blue-500/50 ${getRankBg(entry.rank)} ${isCurrentUser ? 'ring-2 ring-blue-500/50' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Rank */}
                                    <div className="w-12 flex items-center justify-center">
                                        {getRankIcon(entry.rank)}
                                    </div>

                                    {/* Avatar */}
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <span className="text-white text-lg font-bold">
                                            {entry.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-white font-bold text-lg">{entry.username}</span>
                                            {isCurrentUser && (
                                                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full font-medium">
                                                    You
                                                </span>
                                            )}
                                            {entry.role === 'ADMIN' && (
                                                <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded-full font-medium">
                                                    Admin
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-gray-500 text-sm">
                                            Joined {new Date(entry.joinedAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-blue-400">{entry.rating || 1500}</div>
                                            <div className="text-xs text-gray-500">Rating</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-green-400">{entry.problemsSolved}</div>
                                            <div className="text-xs text-gray-500">Solved</div>
                                        </div>
                                        <div className="text-center hidden sm:block">
                                            <div className="text-xl font-bold text-gray-400">{entry.totalAccepted}</div>
                                            <div className="text-xs text-gray-500">Accepted</div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}