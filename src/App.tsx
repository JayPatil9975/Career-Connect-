import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/authStore';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AuthGuard } from './components/AuthGuard';
import { Login } from './pages/Login';
import { Quiz } from './pages/Quiz';
import { Chat } from './pages/Chat';

function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Set up auth state listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/quiz"
            element={
              <AuthGuard>
                <Quiz />
              </AuthGuard>
            }
          />
          <Route
            path="/chat"
            element={
              <AuthGuard>
                <Chat />
              </AuthGuard>
            }
          />
        </Routes>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App