import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./AuthPage.css";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "", general: "" }));
  }

  function validate() {
    const e = {};
    if (mode === "signup" && !form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Minimum 6 characters.";
    if (mode === "signup" && form.password !== form.confirm) e.confirm = "Passwords do not match.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = mode === "login"
      ? login(form.email, form.password)
      : signup(form.name, form.email, form.password);
    setLoading(false);
    if (result.ok) navigate("/");
    else setErrors({ general: result.error });
  }

  function switchMode(m) {
    setMode(m);
    setForm({ name: "", email: "", password: "", confirm: "" });
    setErrors({});
  }

  const isLogin = mode === "login";

  return (
    <div className="auth-page-container">
      {/* ── Card ── */}
      <div className="auth-card">

        {/* Logo + brand */}
        <div className="auth-header">
          <div className="auth-logo-icon">⚡</div>
          <h1 className="auth-title">AlgoAtlas</h1>
          <p className="auth-subtitle">
            {isLogin ? "Welcome back! Sign in to continue." : "Create your free account."}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="auth-toggle-container">
          {["login", "signup"].map(m => (
            <button key={m} onClick={() => switchMode(m)} className={`auth-toggle-btn ${mode === m ? 'active' : ''}`}>
              {m === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">

          {errors.general && (
            <div className="auth-general-error">
              ⚠ {errors.general}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="auth-input-label">Full Name</label>
              <input
                type="text" placeholder="Rahul Sharma"
                value={form.name} onChange={e => set("name", e.target.value)}
                className={`auth-input ${errors.name ? 'error' : ''}`}
              />
              {errors.name && <div className="auth-field-error">{errors.name}</div>}
            </div>
          )}

          <div>
            <label className="auth-input-label">Email</label>
            <input
              type="email" placeholder="you@example.com"
              value={form.email} onChange={e => set("email", e.target.value)}
              className={`auth-input ${errors.email ? 'error' : ''}`}
            />
            {errors.email && <div className="auth-field-error">{errors.email}</div>}
          </div>

          <div>
            <label className="auth-input-label">Password</label>
            <input
              type="password" placeholder="Min 6 characters"
              value={form.password} onChange={e => set("password", e.target.value)}
              className={`auth-input ${errors.password ? 'error' : ''}`}
            />
            {errors.password && <div className="auth-field-error">{errors.password}</div>}
          </div>

          {!isLogin && (
            <div>
              <label className="auth-input-label">Confirm Password</label>
              <input
                type="password" placeholder="Repeat your password"
                value={form.confirm} onChange={e => set("confirm", e.target.value)}
                className={`auth-input ${errors.confirm ? 'error' : ''}`}
              />
              {errors.confirm && <div className="auth-field-error">{errors.confirm}</div>}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? "Please wait..." : isLogin ? "Log In →" : "Create Account →"}
          </button>

        </form>

        {/* Bottom switch */}
        <p className="auth-bottom-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => switchMode(isLogin ? "signup" : "login")}
            className="auth-bottom-link"
          >
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </p>

      </div>
    </div>
  );
}