import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("algoatlas_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const signup = (name, email, password) => {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      return { ok: false, error: "Email already registered." };
    }
    const newUser = { id: Date.now().toString(), name, email, password, joinedAt: new Date().toISOString() };
    localStorage.setItem("algoatlas_users", JSON.stringify([...users, newUser]));
    const { password: _, ...safeUser } = newUser;
    localStorage.setItem("algoatlas_user", JSON.stringify(safeUser));
    setUser(safeUser);
    return { ok: true };
  };

  // Login — check credentials
  const login = (email, password) => {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { ok: false, error: "Invalid email or password." };
    const { password: _, ...safeUser } = found;
    localStorage.setItem("algoatlas_user", JSON.stringify(safeUser));
    setUser(safeUser);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem("algoatlas_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

function getUsers() {
  try {
    const saved = localStorage.getItem("algoatlas_users");
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

export const useAuth = () => useContext(AuthContext);
