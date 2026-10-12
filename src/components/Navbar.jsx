import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Trophy, Code2, LogOut, User, Menu, X, Medal } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'PROBLEM_SETTER');

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { path: '/problems', label: 'Problems', icon: Code2 },
    { path: '/contests', label: 'Contests', icon: Trophy },
    { path: '/leaderboard', label: 'Leaderboard', icon: Medal },
    ...(user ? [{ path: '/submissions', label: 'My Submissions', icon: User }] : []),
    ...(isAdmin ? [{ path: '/admin', label: 'Admin Panel', icon: Shield }] : [])
  ];

  return (
    <nav className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition shadow-lg shadow-blue-500/20">
              <Code2 className="text-white" size={22} />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white">
              Online<span className="text-blue-400">Judge</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive(link.path)
                    ? 'bg-blue-500/15 text-blue-400'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Section - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link 
                  to={`/profile/${user.id}`}
                  className="flex items-center gap-2.5 group"
                  title="View my profile"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition">
                    <span className="text-white text-sm font-bold">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden lg:block">
                    <span className="text-gray-200 font-medium text-sm group-hover:text-blue-400 transition">{user.username}</span>
                    {isAdmin && (
                      <span className="ml-2 px-2 py-0.5 bg-purple-500/15 text-purple-400 text-xs rounded-full font-medium">
                        {user.role}
                      </span>
                    )}
                  </div>
                </Link>
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition text-sm font-medium"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-gray-300 hover:text-white text-sm font-semibold transition"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-blue-500/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition ${
                  isActive(link.path)
                    ? 'bg-blue-500/15 text-blue-400'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            ))}
            
            <div className="pt-3 border-t border-gray-800">
              {user ? (
                <div className="flex items-center justify-between px-4 py-2">
                  <Link 
                    to={`/profile/${user.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-gray-200 font-medium">{user.username}</span>
                  </Link>
                  <button 
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition text-sm"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 px-4">
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 text-gray-300 hover:text-white border border-gray-700 rounded-xl text-sm font-semibold transition"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}