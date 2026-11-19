import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the current authenticated user from the backend on app load.
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
          return;
        }
      } catch (error) {
        console.warn("Backend auth check unavailable:", error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signup = async (name, email, password, handles) => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password, handles }),
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
        error: "Unable to connect to the backend. Please try again."
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
        error: "Unable to connect to the backend. Please try again."
      };
    }
  };

  const logout = async () => {
    try {
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

  const updateProfile = async ({ handles, platformData }) => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ handles, platformData }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.message || "Failed to update profile" };
      }
      if (data.user) {
        setUser(data.user);
      }
      return { ok: true, user: data.user };
    } catch (error) {
      console.error("Update profile error:", error);
      return { ok: false, error: "Network error" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
