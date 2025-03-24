import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Target, BarChart3, GraduationCap, Search } from 'lucide-react';
import { getCareerInfo } from '../lib/ai';

interface UserProgress {
  quizzesTaken: number;
  skillsIdentified: number;
  recommendedPaths: string[];
}

export function Dashboard() {
  const { user } = useAuthStore();
  const [progress, setProgress] = useState<UserProgress>({
    quizzesTaken: 0,
    skillsIdentified: 0,
    recommendedPaths: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [careerInfo, setCareerInfo] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // In a real app, fetch user progress from Supabase
    setProgress({
      quizzesTaken: 2,
      skillsIdentified: 8,
      recommendedPaths: ['Software Development', 'Data Science', 'UX Design'],
    });
  }, []);

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.email}
          </h1>
          <p className="mt-2 text-gray-600">
            Track your progress and explore career opportunities
          </p>
        </div>

        {/* Career Search Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Explore Career Paths
          </h2>
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a career (e.g., Software Engineer, Data Scientist)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
                isSearching ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {careerInfo && (
            <div className="bg-gray-50 rounded-lg p-6 whitespace-pre-line">
              {careerInfo}
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Quizzes Taken</h3>
              <Target className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {progress.quizzesTaken}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Skills Identified</h3>
              <BarChart3 className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {progress.skillsIdentified}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Career Paths</h3>
              <GraduationCap className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {progress.recommendedPaths.length}
            </p>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Recommended Career Paths
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {progress.recommendedPaths.map((path) => (
              <div
                key={path}
                className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 transition-colors cursor-pointer"
              >
                <h4 className="font-medium text-gray-900">{path}</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Click to explore detailed information about this career path
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}