import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Clock, HardDrive, Search, Filter, AlertCircle, Code2 } from 'lucide-react';

export default function Problems() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('ALL');

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const response = await api.get('/problems');
            const data = response.data;
            setProblems(Array.isArray(data) ? data : data.problems || []);
            setLoading(false);
        } catch (err) {
            setError('Failed to load problems');
            setLoading(false);
        }
    };

    const filteredProblems = problems.filter(problem => {
        const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = difficultyFilter === 'ALL' || problem.difficulty === difficultyFilter;
        return matchesSearch && matchesDifficulty;
    });

    const getDifficultyStyle = (difficulty) => {
        switch (difficulty) {
            case 'EASY':
                return { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', dot: 'bg-green-400' };
            case 'MEDIUM':
                return { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', dot: 'bg-yellow-400' };
            case 'HARD':
                return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400' };
            default:
                return { text: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', dot: 'bg-gray-400' };
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
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 flex items-center gap-3">
                    <Code2 className="text-blue-400" size={32} />
                    Problems
                </h1>
                <p className="text-gray-400">
                    Sharpen your skills by solving {problems.length} coding challenges
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-10">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search problems..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                </div>

                {/* Difficulty Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-500" size={18} />
                    <select
                        value={difficultyFilter}
                        onChange={(e) => setDifficultyFilter(e.target.value)}
                        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                        <option value="ALL">All Difficulties</option>
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {filteredProblems.length === 0 ? (
                <div className="text-center py-16 bg-gray-800/50 rounded-2xl border border-gray-700">
                    <Search className="mx-auto text-gray-600 mb-4" size={48} />
                    <p className="text-gray-400 text-lg">No problems found matching your criteria</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredProblems.map((problem, index) => {
                        const style = getDifficultyStyle(problem.difficulty);
                        return (
                            <Link
                                key={problem.id}
                                to={`/problems/${problem.id}`}
                                className="block bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 rounded-xl p-5 transition group hover:bg-gray-800"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-gray-500 text-sm font-mono">#{index + 1}</span>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition">
                                                {problem.title}
                                            </h3>
                                        </div>
                                        <p className="text-gray-400 text-sm line-clamp-2 mb-3 max-w-3xl">
                                            {problem.description?.substring(0, 150)}...
                                        </p>
                                        <div className="flex gap-4 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {problem.timeLimit}ms
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <HardDrive size={12} />
                                                {problem.memoryLimit}MB
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
                                            {problem.difficulty}
                                        </span>
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