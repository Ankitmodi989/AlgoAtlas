import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from './ThemeProvider';
import { Eye, EyeOff, Lock, Mail, User, Zap, CheckCircle } from 'lucide-react';

const Signup = ({ setUser }) => {
  const { dark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);

    setTimeout(() => {
      const user = { name: form.name, email: form.email, password: form.password };
      localStorage.setItem('algoatlas_user', JSON.stringify(user));
      setUser(user);
      navigate('/');
    }, 800);
  };

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={{ ...styles.card, background: dark ? '#0f1724' : '#fff', color: dark ? '#e2e8f0' : '#1a202c', boxShadow: dark ? '0 8px 48px rgba(55,138,221,0.18)' : '0 8px 48px rgba(0,0,0,0.12)' }}>

        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.iconWrap}><Zap size={28} color="#378ADD" /></div>
          <span style={styles.brandName}>AlgoAtlas</span>
        </div>

        <h1 style={styles.title}>Create account</h1>
        <p style={{ ...styles.sub, color: dark ? '#94a3b8' : '#64748b' }}>Start mastering algorithms today</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Name */}
          <div style={styles.field}>
            <label style={{ ...styles.label, color: dark ? '#cbd5e1' : '#475569' }}>Full Name</label>
            <div style={{ ...styles.inputWrap, borderColor: dark ? '#1e3a5f' : '#e2e8f0', background: dark ? '#1e2939' : '#f8fafc' }}>
              <User size={18} color="#378ADD" />
              <input name="name" type="text" placeholder="John Doe" value={form.name}
                onChange={handleChange}
                style={{ ...styles.input, color: dark ? '#e2e8f0' : '#1a202c', background: 'transparent' }} />
            </div>
          </div>

          {/* Email */}
          <div style={styles.field}>
            <label style={{ ...styles.label, color: dark ? '#cbd5e1' : '#475569' }}>Email</label>
            <div style={{ ...styles.inputWrap, borderColor: dark ? '#1e3a5f' : '#e2e8f0', background: dark ? '#1e2939' : '#f8fafc' }}>
              <Mail size={18} color="#378ADD" />
              <input name="email" type="email" placeholder="you@example.com" value={form.email}
                onChange={handleChange}
                style={{ ...styles.input, color: dark ? '#e2e8f0' : '#1a202c', background: 'transparent' }} />
            </div>
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={{ ...styles.label, color: dark ? '#cbd5e1' : '#475569' }}>Password</label>
            <div style={{ ...styles.inputWrap, borderColor: dark ? '#1e3a5f' : '#e2e8f0', background: dark ? '#1e2939' : '#f8fafc' }}>
              <Lock size={18} color="#378ADD" />
              <input name="password" type={showPass ? 'text' : 'password'} placeholder="Min 6 characters"
                value={form.password} onChange={handleChange}
                style={{ ...styles.input, color: dark ? '#e2e8f0' : '#1a202c', background: 'transparent' }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                {showPass ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={styles.field}>
            <label style={{ ...styles.label, color: dark ? '#cbd5e1' : '#475569' }}>Confirm Password</label>
            <div style={{ ...styles.inputWrap, borderColor: dark ? '#1e3a5f' : '#e2e8f0', background: dark ? '#1e2939' : '#f8fafc' }}>
              <Lock size={18} color="#378ADD" />
              <input name="confirm" type="password" placeholder="Repeat password"
                value={form.confirm} onChange={handleChange}
                style={{ ...styles.input, color: dark ? '#e2e8f0' : '#1a202c', background: 'transparent' }} />
              {form.confirm && form.confirm === form.password && (
                <CheckCircle size={18} color="#22c55e" />
              )}
            </div>
          </div>

          <button type="submit"
            style={{ ...styles.btn, opacity: loading ? 0.75 : 1 }}
            disabled={loading}>
            {loading ? 'Creating account…' : 'Get Started →'}
          </button>
        </form>

        <p style={{ ...styles.switchText, color: dark ? '#94a3b8' : '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden', padding: '2rem',
  },
  blob1: {
    position: 'fixed', top: '-100px', left: '-80px',
    width: 380, height: 380, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.16) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'fixed', bottom: '-80px', right: '-60px',
    width: 300, height: 300, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(55,138,221,0.14) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    width: '100%', maxWidth: 440,
    borderRadius: 20, padding: '2.5rem 2rem',
    position: 'relative', zIndex: 1,
    border: '1px solid rgba(55,138,221,0.12)',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.8rem' },
  iconWrap: {
    width: 44, height: 44, borderRadius: 12,
    background: 'rgba(55,138,221,0.12)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  brandName: {
    fontSize: 22, fontWeight: 800,
    background: 'linear-gradient(135deg, #378ADD, #6366f1)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  title: { fontSize: 28, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' },
  sub: { fontSize: 15, margin: '0 0 1.4rem' },
  errorBox: {
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
    color: '#ef4444', borderRadius: 10, padding: '10px 14px',
    fontSize: 14, marginBottom: '1rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, letterSpacing: '0.3px' },
  inputWrap: {
    display: 'flex', alignItems: 'center', gap: 10,
    border: '1.5px solid', borderRadius: 12, padding: '12px 14px',
    transition: 'border-color 0.2s',
  },
  input: { flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: 'inherit' },
  eyeBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' },
  strengthBarBg: { display: 'flex', gap: 4, marginTop: 6 },
  strengthSegment: { flex: 1, height: 4, borderRadius: 999, transition: 'background 0.3s' },
  btn: {
    background: 'linear-gradient(135deg, #378ADD, #6366f1)',
    color: 'white', border: 'none', padding: '14px',
    borderRadius: 12, fontSize: 16, fontWeight: 700,
    cursor: 'pointer', marginTop: 4, letterSpacing: '0.2px',
    transition: 'opacity 0.2s',
  },
  switchText: { textAlign: 'center', marginTop: '1.4rem', fontSize: 14 },
  link: { color: '#378ADD', fontWeight: 600, textDecoration: 'none' },
};

export default Signup;
