import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./AuthPage.css";

// Extract clean username/handle from profile URL or raw username
export function parsePlatformHandle(platform, input) {
  if (!input) return "";
  const trimmed = input.trim();
  if (!trimmed) return "";

  try {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.includes(".com/")) {
      const urlStr = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
      const url = new URL(urlStr);
      const segments = url.pathname.split("/").filter(Boolean);

      if (platform === "leetcode") {
        if (segments[0] === "u" && segments[1]) return segments[1];
        if (segments[0] && segments[0] !== "problemset" && segments[0] !== "contest") return segments[0];
      }

      if (platform === "codeforces") {
        if (segments[0] === "profile" && segments[1]) return segments[1];
        if (segments[0]) return segments[0];
      }

      if (platform === "codechef") {
        if (segments[0] === "users" && segments[1]) return segments[1];
        if (segments[0]) return segments[0];
      }

      if (segments.length > 0) {
        return segments[segments.length - 1];
      }
    }
  } catch {
    // fallback if not a strict URL
  }

  return trimmed.replace(/^[@/]+/, "").replace(/\/+$/, "").trim();
}

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignupRoute = location.pathname === "/signup";
  const [activeTab, setActiveTab] = useState(null);
  const mode = activeTab ?? (isSignupRoute ? "signup" : "login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    leetcodeUrl: "",
    codeforcesUrl: "",
    codechefUrl: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, login, signup, guestLogin } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

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

    const handles = {
      leetcode: parsePlatformHandle("leetcode", form.leetcodeUrl),
      codeforces: parsePlatformHandle("codeforces", form.codeforcesUrl),
      codechef: parsePlatformHandle("codechef", form.codechefUrl)
    };

    const result = await (mode === "login"
      ? login(form.email, form.password)
      : signup(form.name, form.email, form.password, handles));
    setLoading(false);
    if (result.ok) navigate("/");
    else setErrors({ general: result.error });
  }

  function switchMode(m) {
    setActiveTab(m);
    setForm({
      name: "",
      email: "",
      password: "",
      confirm: "",
      leetcodeUrl: "",
      codeforcesUrl: "",
      codechefUrl: ""
    });
    setErrors({});
    navigate(m === "signup" ? "/signup" : "/login", { replace: true });
  }

  const isLogin = mode === "login";

  // Real-time extracted IDs for visual feedback
  const parsedLC = parsePlatformHandle("leetcode", form.leetcodeUrl);
  const parsedCF = parsePlatformHandle("codeforces", form.codeforcesUrl);
  const parsedCC = parsePlatformHandle("codechef", form.codechefUrl);

  return (
    <div className="auth-page-container">
      {/* ── Card ── */}
      <div className={`auth-card ${!isLogin ? 'signup-mode' : ''}`}>

        {/* Logo + brand */}
        <div className="auth-header">
          <div className="auth-logo-icon">⚡</div>
          <h1 className="auth-title">AlgoAtlas</h1>
          <p className="auth-subtitle">
            {isLogin ? "Welcome back! Sign in to continue." : "Create your account & sync coding stats."}
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

          {/* ── Coding Profile URLs Section for Signup ── */}
          {!isLogin && (
            <>
              <div className="auth-section-divider">
                <span>Coding Profiles (For Real Data)</span>
              </div>

              <div>
                <label className="auth-input-label" style={{ color: "#ffa116" }}>
                  🟡 LeetCode Profile URL or Username
                </label>
                <input
                  type="text"
                  placeholder="https://leetcode.com/u/your_id or your_id"
                  value={form.leetcodeUrl}
                  onChange={e => set("leetcodeUrl", e.target.value)}
                  className="auth-input"
                />
                {parsedLC && (
                  <div className="auth-detected-badge">
                    ✓ ID picked: @{parsedLC}
                  </div>
                )}
                <span className="auth-input-helper">
                  Paste your LeetCode profile URL — we will extract your ID & fetch your real stats.
                </span>
              </div>

              <div>
                <label className="auth-input-label" style={{ color: "#60a5fa" }}>
                  🔵 Codeforces Profile URL or Handle (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://codeforces.com/profile/your_id or your_id"
                  value={form.codeforcesUrl}
                  onChange={e => set("codeforcesUrl", e.target.value)}
                  className="auth-input"
                />
                {parsedCF && (
                  <div className="auth-detected-badge">
                    ✓ ID picked: @{parsedCF}
                  </div>
                )}
              </div>

              <div>
                <label className="auth-input-label" style={{ color: "#fbbf24" }}>
                  🟤 CodeChef Profile URL or Handle (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://www.codechef.com/users/your_id or your_id"
                  value={form.codechefUrl}
                  onChange={e => set("codechefUrl", e.target.value)}
                  className="auth-input"
                />
                {parsedCC && (
                  <div className="auth-detected-badge">
                    ✓ ID picked: @{parsedCC}
                  </div>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? "Please wait..." : isLogin ? "Log In →" : "Create Account & Sync Stats →"}
          </button>

          {/* Guest bypass divider */}
          <div style={{ display: "flex", alignItems: "center", margin: "14px 0 10px", opacity: 0.4 }}>
            <div style={{ flex: 1, height: "1px", background: "currentColor" }} />
            <span style={{ padding: "0 10px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "currentColor" }} />
          </div>

          {/* Guest access button */}
          <button
            type="button"
            onClick={() => {
              guestLogin();
              navigate("/");
            }}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid rgba(99, 102, 241, 0.4)",
              background: "rgba(99, 102, 241, 0.12)",
              color: "inherit",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(99, 102, 241, 0.24)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(99, 102, 241, 0.12)"}
          >
            <span>🚀 Explore as Guest (Instant Preview)</span>
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