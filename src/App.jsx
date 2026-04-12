import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Content from './frontend/component/content'
import Header from './frontend/component/Header'
import { ThemeProvider } from './frontend/component/ThemeProvider'
import Algo_page from './frontend/component/Algo_page'
import Favour from './frontend/component/Favour'
import Login from './frontend/component/Login'
import Signup from './frontend/component/Signup'

function App() {
  const [favour, setfavour] = useState([]);
  // Check if user is already stored (persists across refresh)
  const [user, setUser] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('algoatlas_user') || 'null');
    return stored || null;
  });

  const toggleFavour = (algo) => {
    const exists = favour.find(item => item.id === algo.id);
    if (exists) {
      setfavour(favour.filter(item => item.id !== algo.id));
    } else {
      setfavour([...favour, algo]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('algoatlas_user');
    setUser(null);
  };

  return (
    <ThemeProvider>
      {user && <Header onLogout={handleLogout} user={user} />}

      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login setUser={setUser} />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" replace /> : <Signup setUser={setUser} />}
        />
        <Route
          path="/"
          element={user
            ? <Content favour={favour} toggleFavour={toggleFavour} />
            : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/favour"
          element={user
            ? <Favour favour={favour} toggleFavour={toggleFavour} />
            : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/algo/:id"
          element={user ? <Algo_page /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App