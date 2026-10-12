import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2, Trophy, Users, Zap, ArrowRight, Shield, Globe } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: Code2,
      title: 'Code Editor',
      description: 'Write and submit code in C++ and Python with our powerful Monaco editor',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      icon: Zap,
      title: 'Instant Judging',
      description: 'Get immediate feedback with detailed test case results',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10'
    },
    {
      icon: Trophy,
      title: 'Contests',
      description: 'Compete in official contests or start virtual challenges anytime',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      icon: Shield,
      title: 'Secure Execution',
      description: 'Code runs in isolated Docker containers for maximum security',
      color: 'text-green-400',
      bg: 'bg-green-500/10'
    }
  ];

  const stats = [
    { label: 'Problems', value: '50+' },
    { label: 'Languages', value: '2' },
    { label: 'Contests', value: '10+' },
    { label: 'Active Users', value: '100+' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyNTYzZWIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2aC0ydjJoMnYtMnptMCAwaDJ2Mmgydi0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-8">
            <Zap size={16} />
            Competitive Programming Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            Master Coding.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Win Contests.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Practice competitive programming, compete with others, and improve your algorithmic skills with our automated judging system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to="/problems"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-500/25"
              >
                Start Solving
                <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-500/25"
                >
                  Get Started Free
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/problems"
                  className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition border border-gray-700 text-lg"
                >
                  Browse Problems
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform provides all the tools and features you need to become a competitive programming expert.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition group"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <feature.icon className={feature.color} size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-y border-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Globe className="mx-auto text-blue-400 mb-6" size={48} />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join thousands of programmers who are improving their skills every day.
          </p>
          {!user && (
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition text-lg shadow-lg shadow-blue-500/25"
            >
              Create Your Account
              <ArrowRight size={20} />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2026 Online Judge. Built with ❤️ for competitive programmers.</p>
        </div>
      </footer>
    </div>
  );
}