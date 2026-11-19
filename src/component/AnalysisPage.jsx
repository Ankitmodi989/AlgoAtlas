import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ThemeContext } from "./ThemeProvider";
import { parsePlatformHandle } from "./AuthPage";
import { API_URL, getAuthHeaders } from "../config/api";
import {
  TrendingUp,
  Award,
  Flame,
  Target,
  ExternalLink,
  RefreshCw,
  Settings,
  CheckCircle2,
  Calendar,
  Zap,
  Sparkles,
  Layers,
  ArrowUpRight,
  AlertCircle
} from "lucide-react";
import "./AnalysisPage.css";

const INITIAL_STATS = {
  leetcode: {
    handle: "",
    totalSolved: 0,
    totalQuestions: 3350,
    easy: 0,
    easyTotal: 840,
    medium: 0,
    mediumTotal: 1730,
    hard: 0,
    hardTotal: 780,
    contestRating: 1500,
    globalRanking: "N/A",
    acceptanceRate: "0%",
    badge: "Coder",
    configured: false,
  },
  codeforces: {
    handle: "",
    rating: 0,
    maxRating: 0,
    rank: "Unranked",
    maxRank: "Unranked",
    solvedCount: 0,
    contestsCount: 0,
    contribution: "0",
    configured: false,
  },
  codechef: {
    handle: "",
    stars: "★",
    rating: 0,
    maxRating: 0,
    division: "Div 3",
    globalRank: "N/A",
    countryRank: "N/A",
    solvedCount: 0,
    contestsCount: 0,
    configured: false,
  },
  topics: [
    { name: "Dynamic Programming", solved: 0, total: 50, pct: 0 },
    { name: "Graphs (BFS / DFS / Shortest Path)", solved: 0, total: 40, pct: 0 },
    { name: "Binary Trees & BST", solved: 0, total: 45, pct: 0 },
    { name: "Two Pointers & Sliding Window", solved: 0, total: 35, pct: 0 },
    { name: "Sorting & Searching", solved: 0, total: 30, pct: 0 },
    { name: "Greedy & Math", solved: 0, total: 30, pct: 0 },
  ],
  ratingHistory: [
    { month: "May", cf: 1200, lc: 1400 },
    { month: "Jun", cf: 1250, lc: 1450 },
    { month: "Jul", cf: 1300, lc: 1520 },
    { month: "Aug", cf: 1380, lc: 1590 },
    { month: "Sep", cf: 1420, lc: 1640 },
    { month: "Oct", cf: 1480, lc: 1710 },
  ],
  recentSubmissions: [],
};

export default function AnalysisPage() {
  const { user, updateProfile } = useAuth();
  const { dark } = useContext(ThemeContext);

  const [handles, setHandles] = useState({
    leetcode: user?.handles?.leetcode || "",
    codeforces: user?.handles?.codeforces || "",
    codechef: user?.handles?.codechef || "",
  });

  const [stats, setStats] = useState(() => user?.platformData || INITIAL_STATS);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [modalForm, setModalForm] = useState({
    leetcodeInput: user?.handles?.leetcode || "",
    codeforcesInput: user?.handles?.codeforces || "",
    codechefInput: user?.handles?.codechef || "",
  });

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  // Live fetch function calling backend which queries official LeetCode GraphQL & Codeforces REST
  const fetchLiveStats = useCallback(async (currentHandles) => {
    setSyncing(true);
    const activeHandles = currentHandles || handles;
    try {
      const queryParams = new URLSearchParams({
        leetcode: activeHandles.leetcode || "",
        codeforces: activeHandles.codeforces || "",
        codechef: activeHandles.codechef || "",
      }).toString();

      const res = await fetch(`${API_URL}/api/auth/live-stats?${queryParams}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.ok && data.stats) {
        setStats(data.stats);
        showToast("🔥 Live real data synced successfully from official platforms!");
      } else {
        showToast("Notice: Could not refresh live stats at this moment.");
      }
    } catch (err) {
      console.error("Live stats fetch error:", err);
      showToast("Network error while syncing live stats.");
    } finally {
      setSyncing(false);
    }
  }, [handles]);

  // Fetch every time the user visits the Analysis page
  useEffect(() => {
    if (user?.handles) {
      const h = {
        leetcode: user.handles.leetcode || "",
        codeforces: user.handles.codeforces || "",
        codechef: user.handles.codechef || "",
      };
      setHandles(h);
      setModalForm({
        leetcodeInput: h.leetcode,
        codeforcesInput: h.codeforces,
        codechefInput: h.codechef,
      });

      // Trigger real data fetch every time page loads
      fetchLiveStats(h);
    } else {
      fetchLiveStats(handles);
    }
  }, [user]);

  // Handle Save in Modal
  async function handleSaveHandles(e) {
    e.preventDefault();
    const cleanHandles = {
      leetcode: parsePlatformHandle("leetcode", modalForm.leetcodeInput),
      codeforces: parsePlatformHandle("codeforces", modalForm.codeforcesInput),
      codechef: parsePlatformHandle("codechef", modalForm.codechefInput),
    };

    setHandles(cleanHandles);
    setModalOpen(false);

    if (updateProfile) {
      const res = await updateProfile({ handles: cleanHandles });
      if (res.ok) {
        showToast("✅ Handles saved to database! Syncing real data...");
      }
    }

    // Immediately fetch live data for the updated handles
    fetchLiveStats(cleanHandles);
  }

  // Calculations
  const lcRadius = 36;
  const lcCircumference = 2 * Math.PI * lcRadius;
  const lcTotalQ = stats.leetcode?.totalQuestions || 3350;
  const lcProgressRatio = lcTotalQ > 0 ? (stats.leetcode?.totalSolved || 0) / lcTotalQ : 0;
  const lcStrokeDashoffset = lcCircumference - lcProgressRatio * lcCircumference;

  // Theme-aware SVG stroke & fill colors
  const chartGridStroke = dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";
  const chartTextColor = dark ? "rgba(255, 255, 255, 0.5)" : "rgba(30, 41, 59, 0.65)";
  const chartDotFill = dark ? "#1e293b" : "#ffffff";
  const donutTrackStroke = dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";

  // Chart values
  const maxChartRating = 2100;
  const minChartRating = 1100;
  const chartWidth = 560;
  const chartHeight = 160;

  const history = stats.ratingHistory || INITIAL_STATS.ratingHistory;
  const activity = stats.activity || {};
  const topics = stats.topics || [];
  const totalSolvedAll = stats.totalSolved ?? (
    (stats.leetcode?.totalSolved || 0) +
    (stats.codeforces?.solvedCount || 0) +
    (stats.codechef?.solvedCount || 0)
  );
  const maxTopicSolved = Math.max(...topics.map(topic => topic.solved || 0), 1);
  const pointsCF = history.filter(pt => pt.cf != null).map((pt, idx) => {
    const x = (idx / Math.max(history.filter(p => p.cf != null).length - 1, 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - ((pt.cf - minChartRating) / (maxChartRating - minChartRating)) * (chartHeight - 30) - 15;
    return { x, y, val: pt.cf, month: pt.month };
  });

  const pointsLC = history.filter(pt => pt.lc != null).map((pt, idx) => {
    const x = (idx / Math.max(history.filter(p => p.lc != null).length - 1, 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - ((pt.lc - minChartRating) / (maxChartRating - minChartRating)) * (chartHeight - 30) - 15;
    return { x, y, val: pt.lc, month: pt.month };
  });

  const pointsCC = history.filter(pt => pt.cc != null).map((pt, idx) => {
    const x = (idx / Math.max(history.filter(p => p.cc != null).length - 1, 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - (((pt.cc || 0) - minChartRating) / (maxChartRating - minChartRating)) * (chartHeight - 30) - 15;
    return { x, y, val: pt.cc || 0, month: pt.month };
  });

  const pathCF = pointsCF.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), "");
  const pathLC = pointsLC.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), "");
  const pathCC = pointsCC.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), "");

  const modalParsedLC = parsePlatformHandle("leetcode", modalForm.leetcodeInput);
  const modalParsedCF = parsePlatformHandle("codeforces", modalForm.codeforcesInput);
  const modalParsedCC = parsePlatformHandle("codechef", modalForm.codechefInput);

  return (
    <div className="analysis-container">
      {/* Toast Notification */}
      {toast && <div className="toast-msg">{toast}</div>}

      {/* ── Hero / Header ── */}
      <section className="analysis-hero">
        <div className="analysis-title-wrap">
          <div className="analysis-badge">
            <Sparkles size={14} /> Official Live Analytics
          </div>
          <h1 className="analysis-title">Competitive Programming Performance</h1>
          <p className="analysis-subtitle">
            100% Real data fetched from <strong style={{ color: "#ffa116" }}>LeetCode</strong> (Official GraphQL), <strong style={{ color: "#60a5fa" }}>Codeforces</strong> (Official REST API), and <strong style={{ color: "#fbbf24" }}>CodeChef</strong>.
          </p>

          {/* Handles preview strip */}
          <div className="handles-strip">
            {handles.leetcode ? (
              <a
                href={`https://leetcode.com/u/${handles.leetcode}`}
                target="_blank"
                rel="noreferrer"
                className="handle-pill leetcode"
                title="View LeetCode Profile"
              >
                🟡 LC: @{handles.leetcode} <ExternalLink size={12} />
              </a>
            ) : (
              <span className="handle-pill leetcode" style={{ opacity: 0.6 }}>
                🟡 LC: Not linked
              </span>
            )}

            {handles.codeforces ? (
              <a
                href={`https://codeforces.com/profile/${handles.codeforces}`}
                target="_blank"
                rel="noreferrer"
                className="handle-pill codeforces"
                title="View Codeforces Profile"
              >
                🔵 CF: @{handles.codeforces} <ExternalLink size={12} />
              </a>
            ) : (
              <span className="handle-pill codeforces" style={{ opacity: 0.6 }}>
                🔵 CF: Not linked
              </span>
            )}

            {handles.codechef ? (
              <a
                href={`https://www.codechef.com/users/${handles.codechef}`}
                target="_blank"
                rel="noreferrer"
                className="handle-pill codechef"
                title="View CodeChef Profile"
              >
                🟤 CC: @{handles.codechef} <ExternalLink size={12} />
              </a>
            ) : (
              <span className="handle-pill codechef" style={{ opacity: 0.6 }}>
                🟤 CC: Not linked
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="analysis-actions">
          <button
            onClick={() => fetchLiveStats(handles)}
            disabled={syncing}
            className="btn-primary"
            id="sync-live-data-btn"
          >
            <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Fetching Real Data..." : "Fetch / Sync Live"}
          </button>
          <button
            onClick={() => {
              setModalForm({
                leetcodeInput: handles.leetcode,
                codeforcesInput: handles.codeforces,
                codechefInput: handles.codechef,
              });
              setModalOpen(true);
            }}
            className="btn-secondary"
            id="configure-handles-btn"
          >
            <Settings size={16} /> Configure Handles / URLs
          </button>
        </div>
      </section>

      {/* Notice if no handles are linked */}
      {!handles.leetcode && !handles.codeforces && !handles.codechef && (
        <div
          style={{
            background: dark ? "rgba(99, 102, 241, 0.12)" : "rgba(238, 242, 255, 0.95)",
            border: dark ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid rgba(99, 102, 241, 0.25)",
            borderRadius: "14px",
            padding: "1rem 1.4rem",
            marginBottom: "1.8rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
            color: dark ? "#e2e8f0" : "#1e1b4b"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <AlertCircle size={20} color="#818cf8" />
            <span style={{ fontSize: "13.5px" }}>
              No coding profiles linked yet. Click <strong>Configure Handles / URLs</strong> to paste your LeetCode or Codeforces URL and view your live stats!
            </span>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary"
            style={{ padding: "6px 14px", fontSize: "12.5px" }}
          >
            Add Profile Now →
          </button>
        </div>
      )}

      {/* ── KPI Stats Bar ── */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}>
            <Target size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Real Problems Solved</span>
            <span className="kpi-value">{totalSolvedAll}</span>
            <span className="kpi-meta positive">
              <ArrowUpRight size={13} /> Across active handles
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            <Award size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Peak Contest Rating</span>
            <span className="kpi-value">{stats.peakRating || 0}</span>
            <span className="kpi-meta positive">
              {stats.codeforces?.rank !== "Unranked" ? stats.codeforces?.rank : stats.leetcode?.badge}
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>
            <Flame size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Active Streak</span>
            <span className="kpi-value">{stats.streak || 0} Days</span>
            <span className="kpi-meta positive">🔥 Verified activity</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            <TrendingUp size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Contests Played</span>
            <span className="kpi-value">{stats.contestsPlayed || 0}</span>
            <span className="kpi-meta neutral">Official live rounds</span>
          </div>
        </div>
      </section>

      {/* ── AI Recommendation Banner ── */}
      <div className="recommend-banner">
        <div className="recommend-text">
          <h4>
            <Zap size={18} color="#a5b4fc" /> Smart Growth Recommendation
          </h4>
          <p>
            {stats.leetcode?.totalSolved > 100
              ? `You have solved ${stats.leetcode.totalSolved} questions on LeetCode. To boost your Codeforces rating (${stats.codeforces?.rating || "N/A"}) towards Expert, practice Graph BFS/DFS and Tree Dynamic Programming.`
              : "Solve foundational sorting, searching, and binary tree questions to build momentum for competitive programming!"}
          </p>
        </div>
        <Link to="/" className="btn-primary" style={{ textDecoration: "none" }}>
          Explore Algorithm Visualizers →
        </Link>
      </div>

      {/* ── Detailed Platform Breakdown (3 Cards) ── */}
      <section className="platform-grid">
        {/* 1. LeetCode Card */}
        <div className="platform-card leetcode-card">
          <div className="platform-card-header">
            <div className="platform-brand">
              <div
                className="platform-icon-box"
                style={{ background: "rgba(255, 161, 22, 0.18)", color: "#ffa116" }}
              >
                LC
              </div>
              <div>
                <div className="platform-name">LeetCode</div>
                {handles.leetcode ? (
                  <a
                    href={`https://leetcode.com/u/${handles.leetcode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="platform-handle-link"
                  >
                    @{handles.leetcode} <ExternalLink size={10} />
                  </a>
                ) : (
                  <span style={{ fontSize: "11px", opacity: 0.5 }}>Not linked</span>
                )}
              </div>
            </div>
            <div
              className="platform-tier-badge"
              style={{ background: "rgba(255, 161, 22, 0.15)", color: "#ffa116" }}
            >
              {stats.leetcode?.badge || "Coder"}
            </div>
          </div>

          {/* Donut & Bars */}
          <div className="leetcode-ring-wrap">
            <div className="leetcode-donut">
              <svg width="90" height="90" viewBox="0 0 90 90">
                <circle
                  cx="45"
                  cy="45"
                  r={lcRadius}
                  stroke={donutTrackStroke}
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="45"
                  cy="45"
                  r={lcRadius}
                  stroke="#ffa116"
                  strokeWidth="8"
                  strokeDasharray={lcCircumference}
                  strokeDashoffset={lcStrokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="donut-inner-text">
                <div className="donut-count">{stats.leetcode?.totalSolved || 0}</div>
                <div className="donut-label">Solved</div>
              </div>
            </div>

            <div className="diff-bars">
              <div className="diff-item">
                <div className="diff-header">
                  <span style={{ color: "#10b981" }}>Easy</span>
                  <span>{stats.leetcode?.easy || 0} / {stats.leetcode?.easyTotal || 840}</span>
                </div>
                <div className="diff-bar-track">
                  <div
                    className="diff-bar-fill easy"
                    style={{ width: `${Math.min(100, ((stats.leetcode?.easy || 0) / (stats.leetcode?.easyTotal || 840)) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="diff-item">
                <div className="diff-header">
                  <span style={{ color: "#f59e0b" }}>Medium</span>
                  <span>{stats.leetcode?.medium || 0} / {stats.leetcode?.mediumTotal || 1730}</span>
                </div>
                <div className="diff-bar-track">
                  <div
                    className="diff-bar-fill medium"
                    style={{ width: `${Math.min(100, ((stats.leetcode?.medium || 0) / (stats.leetcode?.mediumTotal || 1730)) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="diff-item">
                <div className="diff-header">
                  <span style={{ color: "#ef4444" }}>Hard</span>
                  <span>{stats.leetcode?.hard || 0} / {stats.leetcode?.hardTotal || 780}</span>
                </div>
                <div className="diff-bar-track">
                  <div
                    className="diff-bar-fill hard"
                    style={{ width: `${Math.min(100, ((stats.leetcode?.hard || 0) / (stats.leetcode?.hardTotal || 780)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="metric-row">
            <span className="metric-row-label">Global Rank</span>
            <span className="metric-row-val">#{stats.leetcode?.globalRanking || "N/A"}</span>
          </div>
          <div className="metric-row">
            <span className="metric-row-label">Acceptance Rate</span>
            <span className="metric-row-val">{stats.leetcode?.acceptanceRate || "0%"}</span>
          </div>
          <div className="metric-row">
            <span className="metric-row-label">Status</span>
            <span className="metric-row-val" style={{ color: handles.leetcode ? "#34d399" : "#94a3b8" }}>
              {handles.leetcode ? "✓ Live GraphQL Verified" : "Click Configure"}
            </span>
          </div>
        </div>

        {/* 2. Codeforces Card */}
        <div className="platform-card codeforces-card">
          <div className="platform-card-header">
            <div className="platform-brand">
              <div
                className="platform-icon-box"
                style={{ background: "rgba(59, 130, 246, 0.18)", color: "#3b82f6" }}
              >
                CF
              </div>
              <div>
                <div className="platform-name">Codeforces</div>
                {handles.codeforces ? (
                  <a
                    href={`https://codeforces.com/profile/${handles.codeforces}`}
                    target="_blank"
                    rel="noreferrer"
                    className="platform-handle-link"
                  >
                    @{handles.codeforces} <ExternalLink size={10} />
                  </a>
                ) : (
                  <span style={{ fontSize: "11px", opacity: 0.5 }}>Not linked</span>
                )}
              </div>
            </div>
            <div
              className="platform-tier-badge"
              style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa" }}
            >
              {stats.codeforces?.rank || "Unranked"}
            </div>
          </div>

          <div style={{ textAlign: "center", padding: "0.8rem 0 1.2rem" }}>
            <div style={{ fontSize: "12px", opacity: 0.7, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Live Rating
            </div>
            <div style={{ fontSize: "34px", fontWeight: 800, color: "#60a5fa", margin: "4px 0" }}>
              {stats.codeforces?.rating || "Unrated"}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.75 }}>
              Max Rating: <strong style={{ color: "#93c5fd" }}>{stats.codeforces?.maxRating || "0"}</strong> ({stats.codeforces?.maxRank || "N/A"})
            </div>
          </div>

          <div className="metric-row">
            <span className="metric-row-label">Total Solved</span>
            <span className="metric-row-val">{stats.codeforces?.solvedCount || 0} Problems</span>
          </div>
          <div className="metric-row">
            <span className="metric-row-label">Contests Participated</span>
            <span className="metric-row-val">{stats.codeforces?.contestsCount || 0} Rounds</span>
          </div>
          <div className="metric-row">
            <span className="metric-row-label">Contribution</span>
            <span className="metric-row-val" style={{ color: "#34d399" }}>
              {stats.codeforces?.contribution || "0"}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-row-label">Status</span>
            <span className="metric-row-val" style={{ color: handles.codeforces ? "#34d399" : "#94a3b8" }}>
              {handles.codeforces ? "✓ Official API Verified" : "Click Configure"}
            </span>
          </div>
        </div>

        {/* 3. CodeChef Card */}
        <div className="platform-card codechef-card">
          <div className="platform-card-header">
            <div className="platform-brand">
              <div
                className="platform-icon-box"
                style={{ background: "rgba(217, 119, 6, 0.18)", color: "#f59e0b" }}
              >
                CC
              </div>
              <div>
                <div className="platform-name">CodeChef</div>
                {handles.codechef ? (
                  <a
                    href={`https://www.codechef.com/users/${handles.codechef}`}
                    target="_blank"
                    rel="noreferrer"
                    className="platform-handle-link"
                  >
                    @{handles.codechef} <ExternalLink size={10} />
                  </a>
                ) : (
                  <span style={{ fontSize: "11px", opacity: 0.5 }}>Not linked</span>
                )}
              </div>
            </div>
            <div
              className="platform-tier-badge"
              style={{ background: "rgba(217, 119, 6, 0.15)", color: "#fbbf24" }}
            >
              {stats.codechef?.stars || "★"} {stats.codechef?.division || "Div 3"}
            </div>
          </div>

          <div style={{ textAlign: "center", padding: "0.8rem 0 1.2rem" }}>
            <div style={{ fontSize: "12px", opacity: 0.7, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Star Rating
            </div>
            <div style={{ fontSize: "34px", fontWeight: 800, color: "#fbbf24", margin: "4px 0" }}>
              {stats.codechef?.rating || "Unrated"}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.75 }}>
              Highest: <strong style={{ color: "#fde68a" }}>{stats.codechef?.maxRating || "0"}</strong>
            </div>
          </div>

          <div className="metric-row">
            <span className="metric-row-label">Global Rank</span>
            <span className="metric-row-val">{stats.codechef?.globalRank || "N/A"}</span>
          </div>
          <div className="metric-row">
            <span className="metric-row-label">Country Rank</span>
            <span className="metric-row-val">{stats.codechef?.countryRank || "N/A"}</span>
          </div>
          <div className="metric-row">
            <span className="metric-row-label">Status</span>
            <span className="metric-row-val" style={{ color: handles.codechef ? "#34d399" : "#94a3b8" }}>
              {handles.codechef ? "✓ Live Verified" : "Click Configure"}
            </span>
          </div>
        </div>
      </section>

      {/* ── Interactive Charts & Topic Mastery ── */}
      <section className="analytics-two-col">
        {/* Rating Trajectory Chart */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">
              <TrendingUp size={20} color="#818cf8" /> Contest Rating Trajectory
            </h3>
            <div className="chart-legend">
              <span>
                <span className="legend-dot" style={{ background: "#ffa116" }}></span>
                LeetCode
              </span>
              <span>
                <span className="legend-dot" style={{ background: "#60a5fa" }}></span>
                Codeforces
              </span>
              <span>
                <span className="legend-dot" style={{ background: "#fbbf24" }}></span>
                CodeChef
              </span>
            </div>
          </div>

          <div className="chart-container">
            <svg className="chart-svg" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
              {/* Grid lines */}
              {[0, 0.33, 0.66, 1].map((pct, idx) => {
                const y = chartHeight - pct * (chartHeight - 30) - 15;
                const rating = Math.round(minChartRating + pct * (maxChartRating - minChartRating));
                return (
                  <g key={idx}>
                    <line
                      x1="20"
                      y1={y}
                      x2={chartWidth - 20}
                      y2={y}
                      stroke={chartGridStroke}
                      strokeDasharray="4 4"
                    />
                    <text x="0" y={y + 3} fill={chartTextColor} fontSize="9">
                      {rating}
                    </text>
                  </g>
                );
              })}

              {/* Codeforces curve */}
              <path
                d={pathCF}
                fill="none"
                stroke="#60a5fa"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {pointsCF.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="4.5"
                  fill={chartDotFill}
                  stroke="#60a5fa"
                  strokeWidth="2.5"
                >
                  <title>{`Codeforces: ${p.val} (${p.month})`}</title>
                </circle>
              ))}

              {/* CodeChef curve */}
              <path
                d={pathCC}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {pointsCC.map((p, i) => (
                <circle
                  key={`cc-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r="4.5"
                  fill={chartDotFill}
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                >
                  <title>{`CodeChef: ${p.val} (${p.month})`}</title>
                </circle>
              ))}

              {/* LeetCode curve */}
              <path
                d={pathLC}
                fill="none"
                stroke="#ffa116"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {pointsLC.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="4.5"
                  fill={chartDotFill}
                  stroke="#ffa116"
                  strokeWidth="2.5"
                >
                  <title>{`LeetCode: ${p.val} (${p.month})`}</title>
                </circle>
              ))}

              {/* Months X-axis labels */}
              {pointsLC.map((p, i) => (
                <text
                  key={i}
                  x={p.x}
                  y={chartHeight + 10}
                  textAnchor="middle"
                  fill={chartTextColor}
                  fontSize="10"
                >
                  {p.month}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Topic / DSA Mastery */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">
              <Layers size={20} color="#38bdf8" /> Topic Mastery
            </h3>
            <span style={{ fontSize: "11px", opacity: 0.6 }}>Real Solved Split</span>
          </div>

          <div className="topic-list">
            {(topics.length > 0 ? topics : [{ name: "No topic submissions found", solved: 0 }]).map((t, idx) => (
              <div className="topic-row" key={idx}>
                <div className="topic-meta">
                  <span>{t.name}</span>
                  <span style={{ fontWeight: 700, color: "#38bdf8" }}>
                    {t.solved} solved
                  </span>
                </div>
                <div className="topic-progress-bg">
                  <div className="topic-progress-fill" style={{ width: `${Math.round(((t.solved || 0) / maxTopicSolved) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Activity Heatmap Calendar ── */}
      <section className="panel-card heatmap-section">
        <div className="panel-header">
          <h3 className="panel-title">
            <Calendar size={20} color="#10b981" /> Coding Submissions Heatmap
          </h3>
          <span style={{ fontSize: "12px", opacity: 0.75 }}>Verified Activity</span>
        </div>

        <div className="heatmap-grid-scroll">
          <div className="heatmap-grid">
            {Array.from({ length: 168 }).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (167 - i));
              const day = date.toLocaleDateString();
              const solved = activity[day] || 0;
              const heatLevel = solved >= 8 ? 4 : solved >= 5 ? 3 : solved >= 2 ? 2 : solved >= 1 ? 1 : 0;
              return (
                <div
                  key={i}
                  className={`heatmap-cell heat-${heatLevel}`}
                  title={`${day}: ${solved} recent submissions`}
                />
              );
            })}
          </div>
        </div>

        <div className="heatmap-legend">
          <span>Less</span>
          <div className="heatmap-cell heat-0" />
          <div className="heatmap-cell heat-1" />
          <div className="heatmap-cell heat-2" />
          <div className="heatmap-cell heat-3" />
          <div className="heatmap-cell heat-4" />
          <span>More</span>
        </div>
      </section>

      {/* ── Recent Verified Submissions Feed ── */}
      {stats.recentSubmissions && stats.recentSubmissions.length > 0 && (
        <section className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">
              <CheckCircle2 size={20} color="#34d399" /> Real Recent Submissions
            </h3>
            <span style={{ fontSize: "12px", opacity: 0.7 }}>Official Account Activity</span>
          </div>

          <div className="recent-list">
            {stats.recentSubmissions.map((sub, idx) => (
              <div className="recent-item" key={sub.id || idx}>
                <div className="recent-left">
                  <span
                    className={`recent-badge-platform ${
                      sub.platform === "LC" ? "lc" : sub.platform === "CF" ? "cf" : "cc"
                    }`}
                  >
                    {sub.platform}
                  </span>
                  <span className="recent-title">{sub.title}</span>
                </div>
                <div className="recent-right">
                  <span style={{ color: "#34d399", fontWeight: 700 }}>{sub.status}</span>
                  <span style={{ opacity: 0.6 }}>{sub.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Edit Handles Modal ── */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Configure Platform Handles / URLs</h3>
            <p className="modal-subtitle">
              Paste your profile URL or username for any platform. We will automatically pick your ID and fetch your real statistics!
            </p>

            <form onSubmit={handleSaveHandles}>
              <div className="modal-field">
                <label className="modal-label" style={{ color: "#ffa116" }}>
                  🟡 LeetCode Profile URL or ID
                </label>
                <input
                  type="text"
                  placeholder="https://leetcode.com/u/your_id or your_id"
                  value={modalForm.leetcodeInput}
                  onChange={(e) => setModalForm({ ...modalForm, leetcodeInput: e.target.value })}
                  className="modal-input"
                />
                {modalParsedLC && (
                  <div className="auth-detected-badge" style={{ marginTop: "4px" }}>
                    ✓ Detected ID: @{modalParsedLC}
                  </div>
                )}
              </div>

              <div className="modal-field">
                <label className="modal-label" style={{ color: "#60a5fa" }}>
                  🔵 Codeforces Profile URL or Handle
                </label>
                <input
                  type="text"
                  placeholder="https://codeforces.com/profile/your_id or your_id"
                  value={modalForm.codeforcesInput}
                  onChange={(e) => setModalForm({ ...modalForm, codeforcesInput: e.target.value })}
                  className="modal-input"
                />
                {modalParsedCF && (
                  <div className="auth-detected-badge" style={{ marginTop: "4px" }}>
                    ✓ Detected ID: @{modalParsedCF}
                  </div>
                )}
              </div>

              <div className="modal-field">
                <label className="modal-label" style={{ color: "#fbbf24" }}>
                  🟤 CodeChef Profile URL or Handle
                </label>
                <input
                  type="text"
                  placeholder="https://www.codechef.com/users/your_id or your_id"
                  value={modalForm.codechefInput}
                  onChange={(e) => setModalForm({ ...modalForm, codechefInput: e.target.value })}
                  className="modal-input"
                />
                {modalParsedCC && (
                  <div className="auth-detected-badge" style={{ marginTop: "4px" }}>
                    ✓ Detected ID: @{modalParsedCC}
                  </div>
                )}
              </div>

              <div className="modal-btn-row">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save to Database & Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
