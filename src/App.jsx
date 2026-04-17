import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Content from './frontend/component/Content'
import Header from './frontend/component/Header'
import { ThemeProvider } from './frontend/component/ThemeProvider'
import { AuthProvider, useAuth } from './frontend/component/AuthContext'
import Algo_page from './frontend/component/Algo_page'
import Favour from './frontend/component/Favour'
import DSATracker from './frontend/component/DSATracker'
import AuthPage from './frontend/component/AuthPage'
import AboutPage from './frontend/component/AboutPage'
import { useState } from 'react'

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppInner() {
  const [favour, setFavour] = useState([]);
  const toggleFavour = (algo) => {
    const exists = favour.find(item => item.id === algo.id);
    setFavour(exists ? favour.filter(item => item.id !== algo.id) : [...favour, algo]);
  };

  return (
    <ThemeProvider>
      <Header />
      <Routes>
        <Route path="/login"  element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/" element={<Protected><Content favour={favour} toggleFavour={toggleFavour} /></Protected>} />
        <Route path="/favour" element={<Protected><Favour favour={favour} toggleFavour={toggleFavour} /></Protected>} />
        <Route path="/algo/:id" element={<Protected><Algo_page /></Protected>} />
        <Route path="/tracker" element={<Protected><DSATracker /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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