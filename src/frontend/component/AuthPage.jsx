import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const INPUT = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.06)",
  color: "var(--primary-color)",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

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
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
    }}>
      <div style={{
        width: "100%", maxWidth: 420,
        background: "var(--card-bg)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20,
        padding: "2.4rem 2rem",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
      }}>

        {/* Logo + brand */}
        <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 12px", fontSize: 24,
          }}>⚡</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px", color: "var(--primary-color)" }}>AlgoAtlas</h1>
          <p style={{ fontSize: 13, opacity: 0.5, margin: 0 }}>
            {isLogin ? "Welcome back! Sign in to continue." : "Create your free account."}
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 4, marginBottom: "1.6rem", border: "1px solid rgba(255,255,255,0.08)" }}>
          {["login", "signup"].map(m => (
            <button key={m} onClick={() => switchMode(m)} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer",
              background: mode === m ? "#6366f1" : "transparent",
              color: mode === m ? "#fff" : "var(--primary-color)",
              fontWeight: mode === m ? 700 : 400,
              fontSize: 13, transition: "all 0.2s",
              opacity: mode === m ? 1 : 0.55,
            }}>
              {m === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {errors.general && (
            <div style={{ background: "#ef444420", border: "1px solid #ef444455", borderRadius: 9, padding: "10px 13px", fontSize: 13, color: "#ef4444" }}>
              ⚠ {errors.general}
            </div>
          )}

          {!isLogin && (
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, marginBottom: 5, display: "block" }}>Full Name</label>
              <input
                type="text" placeholder="Rahul Sharma"
                value={form.name} onChange={e => set("name", e.target.value)}
                style={{ ...INPUT, borderColor: errors.name ? "#ef4444" : undefined }}
              />
              {errors.name && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{errors.name}</div>}
            </div>
          )}

          <div>
            <label style={{ fontSize: 12, opacity: 0.6, marginBottom: 5, display: "block" }}>Email</label>
            <input
              type="email" placeholder="you@example.com"
              value={form.email} onChange={e => set("email", e.target.value)}
              style={{ ...INPUT, borderColor: errors.email ? "#ef4444" : undefined }}
            />
            {errors.email && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{errors.email}</div>}
          </div>

          <div>
            <label style={{ fontSize: 12, opacity: 0.6, marginBottom: 5, display: "block" }}>Password</label>
            <input
              type="password" placeholder="Min 6 characters"
              value={form.password} onChange={e => set("password", e.target.value)}
              style={{ ...INPUT, borderColor: errors.password ? "#ef4444" : undefined }}
            />
            {errors.password && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{errors.password}</div>}
          </div>

          {!isLogin && (
            <div>
              <label style={{ fontSize: 12, opacity: 0.6, marginBottom: 5, display: "block" }}>Confirm Password</label>
              <input
                type="password" placeholder="Repeat your password"
                value={form.confirm} onChange={e => set("confirm", e.target.value)}
                style={{ ...INPUT, borderColor: errors.confirm ? "#ef4444" : undefined }}
              />
              {errors.confirm && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{errors.confirm}</div>}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "12px", borderRadius: 10, border: "none",
              background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", fontWeight: 700, fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: 4, letterSpacing: "0.02em",
              transition: "opacity 0.2s, transform 0.1s",
              transform: loading ? "scale(0.98)" : "scale(1)",
            }}
          >
            {loading ? "Please wait..." : isLogin ? "Log In →" : "Create Account →"}
          </button>

        </form>

        <p style={{ textAlign: "center", fontSize: 13, opacity: 0.5, marginTop: "1.4rem", marginBottom: 0 }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => switchMode(isLogin ? "signup" : "login")}
            style={{ color: "#6366f1", cursor: "pointer", fontWeight: 600, opacity: 1 }}
          >
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </p>

      </div>
    </div>
  );
}