import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Brain, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        user
          ? `${
              isScrolled
                ? 'bg-indigo-900/80 backdrop-blur-lg shadow-lg'
                : 'bg-transparent'
            }`
          : 'bg-indigo-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <Brain className="h-8 w-8 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
              <div className="absolute -inset-2 bg-indigo-400 opacity-0 group-hover:opacity-20 rounded-full blur-xl transition-opacity"></div>
            </div>
            <span className="ml-2 text-xl font-bold text-white">Career AI</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/quiz')}
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  Career Quiz
                </button>
                <button
                  onClick={() => navigate('/chat')}
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  AI Chat
                </button>
                <button
                  onClick={handleSignOut}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-indigo-900/95 backdrop-blur-lg rounded-lg mt-2">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      navigate('/quiz');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-indigo-200 hover:text-white hover:bg-indigo-800/50 rounded-lg transition-colors"
                  >
                    Career Quiz
                  </button>
                  <button
                    onClick={() => {
                      navigate('/chat');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-indigo-200 hover:text-white hover:bg-indigo-800/50 rounded-lg transition-colors"
                  >
                    AI Chat
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}