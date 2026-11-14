import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current logged-in user from backend database or local fallback on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.user) {
          setUser(data.user);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.warn("Backend auth check unavailable (server might be offline):", error.message);
      }

      // Fallback: check localStorage for saved guest or offline session
      try {
        const saved = localStorage.getItem("algoatlas_user");
        if (saved) {
          setUser(JSON.parse(saved));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const guestLogin = () => {
    const guestUser = {
      _id: "guest_" + Date.now(),
      name: "Guest Explorer",
      email: "guest@algoatlas.dev",
      isGuest: true,
    };
    try {
      localStorage.setItem("algoatlas_user", JSON.stringify(guestUser));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
    setUser(guestUser);
    return { ok: true, user: guestUser };
  };

  const signup = async (name, email, password) => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { ok: false, error: data.message || "Signup failed" };
      }

      const userData = data.user || data;
      setUser(userData);
      return { ok: true, user: userData };
    } catch (error) {
      console.error("Signup Error:", error);
      return {
        ok: false,
        error: "Backend server (port 8000) is offline. Start the backend or click 'Explore as Guest' below to test immediately."
      };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { ok: false, error: data.message || "Login failed" };
      }

      setUser(data.user);
      return { ok: true, user: data.user };
    } catch (error) {
      console.error("Login Error:", error);
      return {
        ok: false,
        error: "Backend server (port 8000) is offline. Start the backend or click 'Explore as Guest' below to test immediately."
      };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("algoatlas_user");
      await fetch("http://localhost:8000/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setUser(null);
    }
    return { ok: true };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, guestLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
