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
import { ThemeProvider } from './component/ThemeProvider'
import { useState } from 'react'
import Chatbot from './AiChatbot/Chatbot'


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
        <Route path="/" element={<Protected><Content favour={favour} toggleFavour={toggleFavour} /></Protected>} />
        <Route path="/favour" element={<Protected><Favour favour={favour} toggleFavour={toggleFavour} /></Protected>} />
        <Route path="/algo/:id" element={<Protected><Algo_page /></Protected>} />
        <Route path="/tracker" element={<Protected><DSATracker /></Protected>} />
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