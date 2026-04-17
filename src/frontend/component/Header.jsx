import React, { useContext, useState } from 'react'
import { ThemeContext } from './ThemeProvider'
import { useAuth } from './AuthContext'
import logo from '../../assets/unnamed.jpg.jpeg'
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const { dark, setDark } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);

  // Initials from user name e.g. "Rahul Sharma" → "RS"
  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  function handleLogout() {
    setDropOpen(false);
    logout();
    navigate("/login");
  }

  return (
    <div
      className='h-16 w-full font-bold flex items-center justify-between space-x-4 border-b-2'
      style={{
        background: 'var(--navbar-bg)',
      }}
    >
      {/* Logo */}
      <Link to="/">
        <div className="logo ml-5 cursor-pointer">
          <img src={logo} height={50} width={60} className='rounded-[25px]' />
        </div>
      </Link>

      {/* Nav links */}
      <div className="flex mr-5 space-x-4 items-center" style={{ position: "relative" }}>

        {user && (
          <>
            <Link to="/">
              <div className="cursor-pointer hover:text-red-500">Home</div>
            </Link>
            <Link to="/favour">
              <div className="cursor-pointer hover:text-red-500">Wishlist</div>
            </Link>
            <Link to="/tracker">
              <div className="cursor-pointer hover:text-blue-400">📋 Tracker</div>
            </Link>
          </>
        )}
        <Link to="/about">
          <div className="about cursor-pointer hover:text-red-500">About</div>
        </Link>
        <div className="mode cursor-pointer hover:text-red-500">
          {dark
            ? <span onClick={() => setDark(false)}>☀ Light</span>
            : <span onClick={() => setDark(true)}>🌙 Dark</span>}
        </div>

        {/* ── If NOT logged in — show Login / SignUp ── */}
        {!user && (
          <>
            <Link to="/login">
              <div className="cursor-pointer hover:text-red-500">Login</div>
            </Link>
            <Link to="/signup">
              <div
                className="cursor-pointer"
                style={{
                  background: "#6366f1", color: "#fff",
                  padding: "6px 14px", borderRadius: 8, fontSize: 13,
                }}
              >
                Sign Up
              </div>
            </Link>
          </>
        )}

        {/* ── If logged in — show avatar + dropdown ── */}
        {user && (
          <div style={{ position: "relative" }}>
            {/* Avatar button */}
            <div
              onClick={() => setDropOpen(o => !o)}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 13,
                cursor: "pointer", userSelect: "none",
                border: "2px solid rgba(99,102,241,0.4)",
              }}
              title={user.name}
            >
              {initials}
            </div>

            {/* Dropdown */}
            {dropOpen && (
              <div
                style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "var(--navbar-bg)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12, padding: "8px 0",
                  minWidth: 180, zIndex: 2000,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                }}
              >
                {/* User info */}
                <div style={{ padding: "10px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{user.name}</div>
                  <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>{user.email}</div>
                </div>

                {/* Menu items */}
                {[
                  { label: "🏠 Home", to: "/" },
                  { label: "❤ Wishlist", to: "/favour" },
                  { label: "📋 Tracker", to: "/tracker" },
                ].map(item => (
                  <Link key={item.to} to={item.to} onClick={() => setDropOpen(false)}>
                    <div style={{
                      padding: "9px 16px", fontSize: 13, cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      {item.label}
                    </div>
                  </Link>
                ))}

                {/* Logout */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 4 }}>
                  <div
                    onClick={handleLogout}
                    style={{
                      padding: "9px 16px", fontSize: 13, cursor: "pointer",
                      color: "#ef4444", transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    🚪 Log Out
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;