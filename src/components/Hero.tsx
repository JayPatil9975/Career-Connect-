import { useEffect, useState } from 'react';
import { ArrowRight, Brain, Target, MessageSquare, Search, BarChart3, GraduationCap, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getCareerInfo } from '../lib/ai';
import ReactMarkdown from 'react-markdown';
import { Footer } from './Footer';

interface UserProgress {
  quizzesTaken: number;
  skillsIdentified: number;
  recommendedPaths: string[];
}

export function Hero() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [careerInfo, setCareerInfo] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState<UserProgress>({
    quizzesTaken: 0,
    skillsIdentified: 0,
    recommendedPaths: [],
  });

  useEffect(() => {
    if (user) {
      setProgress({
        quizzesTaken: 2,
        skillsIdentified: 8,
        recommendedPaths: ['Software Development', 'Data Science', 'UX Design'],
      });
    }
  }, [user]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const info = await getCareerInfo(searchQuery);
      setCareerInfo(info);
    } catch (error) {
      console.error('Error fetching career info:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex-1">
      <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:20px_20px] opacity-20 animate-[pulse_4s_ease-in-out_infinite]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Brain className="h-16 w-16 text-indigo-400 animate-[pulse_3s_ease-in-out_infinite]" />
                <div className="absolute -inset-2 bg-indigo-400 opacity-20 rounded-full blur-xl animate-[pulse_3s_ease-in-out_infinite]"></div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Discover Your Perfect Career Path
            </h1>
            <p className="text-xl md:text-2xl text-indigo-200 max-w-3xl mx-auto mb-12">
              Let AI guide you to your ideal career. Take our comprehensive assessment, chat with our career advisor, and explore endless possibilities.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              {user ? (
                <>
                  <button
                    onClick={() => navigate('/quiz')}
                    className="group inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 hover:scale-105"
                  >
                    Take Career Quiz
                    <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate('/chat')}
                    className="group inline-flex items-center px-8 py-3 border-2 border-indigo-400 text-base font-medium rounded-md text-indigo-300 hover:bg-indigo-800/30 transition-all duration-300 hover:scale-105"
                  >
                    Chat with AI Advisor
                    <MessageSquare className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="group inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 hover:scale-105"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 text-center border border-white/10 hover:border-indigo-400/50 transition-all duration-300 hover:scale-105">
              <div className="flex justify-center mb-4">
                <Target className="h-8 w-8 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Career Assessment</h3>
              <p className="text-indigo-200">Take our AI-powered quiz to discover careers that match your skills and interests.</p>
            </div>

            <div className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 text-center border border-white/10 hover:border-indigo-400/50 transition-all duration-300 hover:scale-105">
              <div className="flex justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Career Advisor</h3>
              <p className="text-indigo-200">Get personalized career guidance through our AI-powered chat system.</p>
            </div>

            <div className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 text-center border border-white/10 hover:border-indigo-400/50 transition-all duration-300 hover:scale-105">
              <div className="flex justify-center mb-4">
                <Search className="h-8 w-8 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Career Explorer</h3>
              <p className="text-indigo-200">Research different career paths and get detailed insights about each role.</p>
            </div>
          </div>
        </div>
      </div>

      {user && (
        <div className="bg-gradient-to-b from-indigo-900 to-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Your Career Journey</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-indigo-400/50 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Quizzes Taken</h3>
                    <Target className="h-6 w-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                  </div>
                  <p className="text-3xl font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    {progress.quizzesTaken}
                  </p>
                </div>

                <div className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-indigo-400/50 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Skills Identified</h3>
                    <BarChart3 className="h-6 w-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                  </div>
                  <p className="text-3xl font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    {progress.skillsIdentified}
                  </p>
                </div>

                <div className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-indigo-400/50 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Career Paths</h3>
                    <GraduationCap className="h-6 w-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                  </div>
                  <p className="text-3xl font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    {progress.recommendedPaths.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Career Search Section */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">
                Explore Career Paths
              </h2>
              <form onSubmit={handleSearch} className="flex gap-4 mb-8">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a career (e.g., Software Engineer, Data Scientist)"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <Search className="absolute right-3 top-3 h-5 w-5 text-indigo-300" />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className={`px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all duration-300 hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100`}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </form>

              {careerInfo && (
                <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/20">
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown
                      className="text-indigo-200 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:mt-6 [&>h2]:text-white 
                        [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul>li]:mb-2
                        [&>p]:mb-4"
                    >
                      {careerInfo}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-16">
              <h2 className="text-2xl font-bold text-white mb-6">
                Recommended Career Paths
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {progress.recommendedPaths.map((path) => (
                  <div
                    key={path}
                    className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-indigo-400/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-white">{path}</h4>
                      <Sparkles className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                    </div>
                    <p className="text-sm text-indigo-200">
                      Click to explore detailed information about this career path
                    </p>
                    <div className="mt-4 flex items-center text-indigo-400 text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>High growth potential</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer/>
    </div>
    
  );
}