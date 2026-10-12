import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    User, Mail, Calendar, Trophy, Code2, CheckCircle,
    Target, Award, Clock, AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const isOwnProfile = currentUser && currentUser.id === id;

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            const response = await api.get(`/users/${id}`);
            setProfile(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load profile');
            setLoading(false);
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'EASY': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'HARD': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    const getStatusColor = (status) => {
        if (status === 'ACCEPTED') return 'text-green-400';
        if (status === 'PENDING') return 'text-blue-400';
        return 'text-red-400';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="w-full lg:w-3/4 mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error || 'Profile not found'}
                </div>
            </div>
        );
    }

    const stats = profile.stats;

    return (
        <div className="w-full lg:w-3/4 mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Profile Header */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sm:p-8 mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="text-white text-4xl font-bold">
                            {profile.username.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{profile.username}</h1>
                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${profile.role === 'ADMIN'
                                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                    : profile.role === 'PROBLEM_SETTER'
                                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                {profile.role}
                            </span>
                            {isOwnProfile && (
                                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                                    You
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <Mail size={16} />
                                {profile.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                Member since {new Date(profile.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {/* Rating Card */}
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <Award className="text-blue-400" size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-blue-400 mb-1">{profile.rating || 1500}</div>
                    <div className="text-gray-400 text-sm">Rating</div>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5 hover:border-blue-500/30 transition">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                            <CheckCircle className="text-green-400" size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.problemsSolved}</div>
                    <div className="text-gray-400 text-sm">Problems Solved</div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5 hover:border-blue-500/30 transition">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <Code2 className="text-blue-400" size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.totalSubmissions}</div>
                    <div className="text-gray-400 text-sm">Total Submissions</div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5 hover:border-blue-500/30 transition">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                            <Target className="text-yellow-400" size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.acceptanceRate}%</div>
                    <div className="text-gray-400 text-sm">Acceptance Rate</div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5 hover:border-blue-500/30 transition">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                            <Trophy className="text-purple-400" size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.contestsParticipated}</div>
                    <div className="text-gray-400 text-sm">Contests Joined</div>
                </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Award size={20} className="text-yellow-400" />
                    Solved by Difficulty
                </h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                        <div className="text-2xl font-bold text-green-400 mb-1">{stats.solvedByDifficulty.EASY}</div>
                        <div className="text-xs text-gray-400 font-medium">EASY</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/10">
                        <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.solvedByDifficulty.MEDIUM}</div>
                        <div className="text-xs text-gray-400 font-medium">MEDIUM</div>
                    </div>
                    <div className="text-center p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                        <div className="text-2xl font-bold text-red-400 mb-1">{stats.solvedByDifficulty.HARD}</div>
                        <div className="text-xs text-gray-400 font-medium">HARD</div>
                    </div>
                </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
                <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Clock size={20} className="text-blue-400" />
                        Recent Submissions
                    </h2>
                </div>

                {profile.recentSubmissions.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        No submissions yet. <Link to="/problems" className="text-blue-400 hover:underline">Start solving!</Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-700">
                        {profile.recentSubmissions.map((sub) => (
                            <Link
                                key={sub.id}
                                to={`/submissions/${sub.id}`}
                                className="block p-4 hover:bg-gray-800/70 transition"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className={`font-semibold ${getStatusColor(sub.status)}`}>
                                            {sub.status.replace(/_/g, ' ')}
                                        </span>
                                        <span className="text-white font-medium">{sub.problem?.title || 'Unknown'}</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(sub.problem?.difficulty)}`}>
                                        {sub.problem?.difficulty}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {new Date(sub.createdAt).toLocaleString()} • {sub.language}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}