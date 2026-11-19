import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Content from './component/Content'
import Header from './component/Header'
import { AuthProvider, useAuth } from './component/AuthContext'
import Algo_page from './component/Algo_page'
import Favour from './component/Favour'
import DSATracker from './component/DSATracker'
import AuthPage from './component/AuthPage'
import AboutPage from './component/AboutPage'
import AnalysisPage from './component/AnalysisPage'
import { ThemeProvider } from './component/ThemeProvider'
import { useState, useEffect } from 'react'
import Chatbot from './AiChatbot/Chatbot'
import { allAlgos } from './component/Algo_List'
import { API_URL, getAuthHeaders } from './config/api'


function Protected({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

function AppInner() {
  const { user } = useAuth();
  const [favour, setFavour] = useState(() => {
    try {
      const saved = localStorage.getItem("algoatlas_wishlist");
      if (saved) {
        const ids = JSON.parse(saved);
        return allAlgos.filter(item => ids.includes(item.id));
      }
    } catch { }
    return [];
  });
  const [dbWishlistSynced, setDbWishlistSynced] = useState(false);

  // Sync wishlist with backend database when user changes / logs in
  useEffect(() => {
    if (!user) {
      setDbWishlistSynced(false);
      return;
    }

    const loadWishlistFromDB = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/wishlist`, {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.wishlist)) {
          let dbIds = data.wishlist;

          // Merge any previously saved local wishlist items with cloud database
          try {
            const localSaved = localStorage.getItem("algoatlas_wishlist");
            if (localSaved) {
              const localIds = JSON.parse(localSaved);
              const merged = Array.from(new Set([...dbIds, ...localIds]));
              if (merged.length > dbIds.length) {
                dbIds = merged;
                fetch(`${API_URL}/api/user/wishlist`, {
                  method: "PUT",
                  headers: getAuthHeaders(),
                  credentials: "include",
                  body: JSON.stringify({ wishlist: merged }),
                }).catch(() => {});
              }
            }
          } catch { }

          localStorage.setItem("algoatlas_wishlist", JSON.stringify(dbIds));
          setFavour(allAlgos.filter(algo => dbIds.includes(algo.id)));
          setDbWishlistSynced(true);
        }
      } catch (err) {
        console.warn("Could not load wishlist from database:", err.message);
      }
    };

    loadWishlistFromDB();
  }, [user]);

  const toggleFavour = async (algo) => {
    const exists = favour.some(item => item.id === algo.id);
    const updated = exists ? favour.filter(item => item.id !== algo.id) : [...favour, algo];
    setFavour(updated);

    const ids = updated.map(item => item.id);
    try {
      localStorage.setItem("algoatlas_wishlist", JSON.stringify(ids));
    } catch (err) {
      console.warn("Could not save wishlist to localStorage:", err);
    }

    if (user) {
      try {
        const res = await fetch(`${API_URL}/api/user/wishlist/toggle`, {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({ algoId: algo.id }),
        });
        if (res.ok) {
          setDbWishlistSynced(true);
        }
      } catch (err) {
        console.warn("Failed to sync wishlist change with database:", err.message);
      }
    }
  };

  return (
    <ThemeProvider>
      <Header />
      <Routes>
        <Route path="/login"  element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/" element={<Protected><Content favour={favour} toggleFavour={toggleFavour} /></Protected>} />
        <Route path="/favour" element={<Protected><Favour favour={favour} toggleFavour={toggleFavour} dbSynced={dbWishlistSynced} /></Protected>} />
        <Route path="/algo/:id" element={<Protected><Algo_page /></Protected>} />
        <Route path="/tracker" element={<Protected><DSATracker /></Protected>} />
        <Route path="/analysis" element={<Protected><AnalysisPage /></Protected>} />
        <Route path="/about" element={<Protected><AboutPage /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Chatbot></Chatbot>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;