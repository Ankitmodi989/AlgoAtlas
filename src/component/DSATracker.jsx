import { useState, useEffect } from "react";
import "./DSATracker.css";
import { useAuth } from "./AuthContext";
import { API_URL, getAuthHeaders } from "../config/api";

const TAGS = ["Array", "String", "Tree", "Graph", "DP", "Sorting", "Searching", "Greedy", "Backtracking", "Other"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const STATUSES = ["To Do", "In Progress", "Done"];

const DIFF_COLOR = { Easy: "#10b981", Medium: "#f59e0b", Hard: "#ef4444" };
const STATUS_COLOR = { "To Do": "#8b5cf6", "In Progress": "#3b82f6", "Done": "#10b981" };
const STATUS_BG = { "To Do": "#8b5cf622", "In Progress": "#3b82f622", "Done": "#10b98122" };

function uid() { return Math.random().toString(36).slice(2, 9); }

const SAMPLE_TASKS = [
  { id: uid(), title: "Two Sum", tag: "Array", difficulty: "Easy", status: "Done", note: "Use hashmap for O(n) solution", link: "https://leetcode.com/problems/two-sum/", createdAt: Date.now() - 86400000 * 3 },
  { id: uid(), title: "Binary Search", tag: "Searching", difficulty: "Easy", status: "Done", note: "Classic divide and conquer", link: "", createdAt: Date.now() - 86400000 * 2 },
  { id: uid(), title: "Merge Intervals", tag: "Array", difficulty: "Medium", status: "In Progress", note: "Sort first then merge overlapping", link: "https://leetcode.com/problems/merge-intervals/", createdAt: Date.now() - 86400000 },
  { id: uid(), title: "Longest Common Subsequence", tag: "DP", difficulty: "Medium", status: "To Do", note: "", link: "", createdAt: Date.now() },
];

export default function DSATracker() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("dsa_tasks");
      return saved ? JSON.parse(saved) : SAMPLE_TASKS;
    } catch { return SAMPLE_TASKS; }
  });

  const [dbStatus, setDbStatus] = useState("checking");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");
  const [filterTag, setFilterTag] = useState("All");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", tag: "Array", difficulty: "Easy", status: "To Do", note: "", link: "" });

  // ── Revision State ──
  const [showRevision, setShowRevision] = useState(false);
  const [revisionCount, setRevisionCount] = useState(2);
  const [revisionTag, setRevisionTag] = useState("All");
  const [revisionDiff, setRevisionDiff] = useState("All");
  const [revisionQuestions, setRevisionQuestions] = useState([]);
  const [revisionStarted, setRevisionStarted] = useState(false);
  const [currentRevIdx, setCurrentRevIdx] = useState(0);
  const [revisionDone, setRevisionDone] = useState(false);

  // ── Database Sync on load / user switch ──
  useEffect(() => {
    if (!user) {
      setDbStatus("local");
      return;
    }

    const fetchTasks = async () => {
      setDbStatus("syncing");
      try {
        const res = await fetch(`${API_URL}/api/user/tracker`, {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && Array.isArray(data.tasks)) {
          if (data.tasks.length > 0) {
            setTasks(data.tasks);
            localStorage.setItem("dsa_tasks", JSON.stringify(data.tasks));
            setDbStatus("synced");
          } else {
            // Database has no tasks for this user yet - sync initial/local tasks to DB
            const localTasks = tasks.length > 0 ? tasks : SAMPLE_TASKS;
            const syncRes = await fetch(`${API_URL}/api/user/tracker/sync`, {
              method: "POST",
              headers: getAuthHeaders(),
              credentials: "include",
              body: JSON.stringify({ tasks: localTasks }),
            });
            const syncData = await syncRes.json();
            if (syncRes.ok && Array.isArray(syncData.tasks)) {
              setTasks(syncData.tasks);
              localStorage.setItem("dsa_tasks", JSON.stringify(syncData.tasks));
            }
            setDbStatus("synced");
          }
        } else {
          setDbStatus("local");
        }
      } catch (err) {
        console.warn("Could not sync tasks with backend database:", err);
        setDbStatus("error");
      }
    };

    fetchTasks();
  }, [user]);

  // Keep localStorage updated as persistent fallback
  useEffect(() => {
    try {
      localStorage.setItem("dsa_tasks", JSON.stringify(tasks));
    } catch (err) {
      console.warn("Could not save tasks to localStorage:", err);
    }
  }, [tasks]);

  function openAdd() {
    setForm({ title: "", tag: "Array", difficulty: "Easy", status: "To Do", note: "", link: "" });
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(task) {
    setForm({ title: task.title, tag: task.tag, difficulty: task.difficulty, status: task.status, note: task.note, link: task.link });
    setEditId(task.id);
    setShowForm(true);
  }

  async function handleSubmit() {
    if (!form.title.trim()) return;

    if (editId) {
      const currentEditId = editId;
      setTasks(ts => ts.map(t => t.id === currentEditId ? { ...t, ...form } : t));
      setShowForm(false);
      setEditId(null);

      if (user) {
        try {
          setDbStatus("syncing");
          const res = await fetch(`${API_URL}/api/user/tracker/${currentEditId}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            credentials: "include",
            body: JSON.stringify(form),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.task) {
              setTasks(ts => ts.map(t => (t.id === currentEditId || t.id === data.task.id) ? { ...t, ...data.task } : t));
            }
            setDbStatus("synced");
          }
        } catch (err) {
          console.warn("Error updating task in database:", err);
          setDbStatus("error");
        }
      }
    } else {
      const tempId = uid();
      const newTask = { id: tempId, ...form, createdAt: Date.now() };
      setTasks(ts => [newTask, ...ts]);
      setShowForm(false);

      if (user) {
        try {
          setDbStatus("syncing");
          const res = await fetch(`${API_URL}/api/user/tracker`, {
            method: "POST",
            headers: getAuthHeaders(),
            credentials: "include",
            body: JSON.stringify(newTask),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.task) {
              setTasks(ts => ts.map(t => t.id === tempId ? { ...t, ...data.task, id: data.task.id || data.task._id } : t));
            }
            setDbStatus("synced");
          }
        } catch (err) {
          console.warn("Error saving task to database:", err);
          setDbStatus("error");
        }
      }
    }
  }

  async function deleteTask(id) {
    setTasks(ts => ts.filter(t => t.id !== id));

    if (user) {
      try {
        setDbStatus("syncing");
        const res = await fetch(`${API_URL}/api/user/tracker/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
          credentials: "include",
        });
        if (res.ok) {
          setDbStatus("synced");
        }
      } catch (err) {
        console.warn("Error deleting task from database:", err);
        setDbStatus("error");
      }
    }
  }

  async function cycleStatus(id) {
    let nextStatus = "To Do";
    setTasks(ts => ts.map(t => {
      if (t.id !== id) return t;
      const idx = STATUSES.indexOf(t.status);
      nextStatus = STATUSES[(idx + 1) % STATUSES.length];
      return { ...t, status: nextStatus };
    }));

    if (user) {
      try {
        setDbStatus("syncing");
        const res = await fetch(`${API_URL}/api/user/tracker/${id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({ status: nextStatus }),
        });
        if (res.ok) {
          setDbStatus("synced");
        }
      } catch (err) {
        console.warn("Error updating task status in database:", err);
        setDbStatus("error");
      }
    }
  }

  // ── Revision Logic ──
  function startRevision() {
    let pool = tasks.filter(t => t.status === "Done");
    if (revisionTag !== "All") pool = pool.filter(t => t.tag === revisionTag);
    if (revisionDiff !== "All") pool = pool.filter(t => t.difficulty === revisionDiff);

    if (pool.length === 0) {
      alert("No Done questions found for selected filters!");
      return;
    }

    // Shuffle and pick
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, Math.min(revisionCount, pool.length));
    setRevisionQuestions(picked);
    setCurrentRevIdx(0);
    setRevisionDone(false);
    setRevisionStarted(true);
  }

  function nextRevision() {
    if (currentRevIdx + 1 >= revisionQuestions.length) {
      setRevisionDone(true);
    } else {
      setCurrentRevIdx(i => i + 1);
    }
  }

  function resetRevision() {
    setRevisionStarted(false);
    setRevisionQuestions([]);
    setCurrentRevIdx(0);
    setRevisionDone(false);
  }

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.tag.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || t.status === filterStatus;
    const matchDiff = filterDiff === "All" || t.difficulty === filterDiff;
    const matchTag = filterTag === "All" || t.tag === filterTag;
    return matchSearch && matchStatus && matchDiff && matchTag;
  });

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === "Done").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    todo: tasks.filter(t => t.status === "To Do").length,
  };

  const pct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;
  const currentQ = revisionQuestions[currentRevIdx];

  return (
    <div className="dsa-wrapper">

      {/* ── Header ── */}
      <div className="dsa-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h1>DSA Practice Tracker</h1>
            {dbStatus === "synced" && (
              <span style={{ fontSize: "11px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2px 8px", borderRadius: "12px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <span>●</span> Database Synced
              </span>
            )}
            {dbStatus === "syncing" && (
              <span style={{ fontSize: "11px", background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "2px 8px", borderRadius: "12px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <span>↻</span> Syncing with DB...
              </span>
            )}
            {dbStatus === "local" && (
              <span style={{ fontSize: "11px", background: "rgba(139, 92, 246, 0.15)", color: "#a78bfa", border: "1px solid rgba(139, 92, 246, 0.3)", padding: "2px 8px", borderRadius: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <span>💾</span> Local Mode
              </span>
            )}
            {dbStatus === "error" && (
              <span style={{ fontSize: "11px", background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "2px 8px", borderRadius: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <span>⚠</span> Offline (Local Fallback)
              </span>
            )}
          </div>
          <p>Track your questions, mark progress, add notes — saved to cloud database</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => { setShowRevision(true); resetRevision(); }} className="dsa-add-btn" style={{ background: "#8b5cf6" }}>🔁 Revise</button>
          <button onClick={openAdd} className="dsa-add-btn">+ Add Question</button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="dsa-stats">
        {[
          ["Total", stats.total, "#3b82f6"],
          ["Done", stats.done, "#10b981"],
          ["In Progress", stats.inProgress, "#f59e0b"],
          ["To Do", stats.todo, "#8b5cf6"],
        ].map(([label, val, col]) => (
          <div key={label} className="dsa-stat-card" style={{ background: col + "14", border: `1px solid ${col}33` }}>
            <div className="dsa-stat-label" style={{ color: col }}>{label}</div>
            <div className="dsa-stat-value" style={{ color: col }}>{val}</div>
          </div>
        ))}
      </div>

      {/* ── Progress bar ── */}
      <div className="dsa-progress-wrap">
        <div className="dsa-progress-meta">
          <span>Overall Progress</span>
          <span>{pct}%</span>
        </div>
        <div className="dsa-progress-track">
          <div className="dsa-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="dsa-filters">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search questions..."
          className="dsa-input dsa-input--search"
        />
        {[
          ["Status", ["All", ...STATUSES], filterStatus, setFilterStatus],
          ["Difficulty", ["All", ...DIFFICULTIES], filterDiff, setFilterDiff],
          ["Tag", ["All", ...TAGS], filterTag, setFilterTag],
        ].map(([placeholder, opts, val, setter]) => (
          <select key={placeholder} value={val} onChange={e => setter(e.target.value)} className="dsa-input dsa-select dsa-select--filter">
            {opts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {/* ── Task list ── */}
      <div className="dsa-task-list">
        {filtered.length === 0 ? (
          <div className="dsa-empty">No questions found. Add your first one!</div>
        ) : (
          filtered.map(task => (
            <div
              key={task.id}
              className={`dsa-task-card ${task.status === "Done" ? "dsa-task-card--done" : ""}`}
              style={{ borderLeft: `3px solid ${STATUS_COLOR[task.status]}` }}
            >
              <div>
                <div className="dsa-task-title-row">
                  <span className={`dsa-task-title ${task.status === "Done" ? "dsa-task-title--done" : ""}`}>
                    {task.title}
                  </span>
                  {task.link && (
                    <a href={task.link} target="_blank" rel="noreferrer" className="dsa-task-link">↗ LeetCode</a>
                  )}
                </div>
                <div className={`dsa-badges ${task.note ? "dsa-badges--with-note" : ""}`}>
                  <span className="dsa-badge" style={{ background: DIFF_COLOR[task.difficulty] + "22", color: DIFF_COLOR[task.difficulty], border: `1px solid ${DIFF_COLOR[task.difficulty]}44` }}>{task.difficulty}</span>
                  <span className="dsa-badge dsa-badge--tag">{task.tag}</span>
                  <span className="dsa-badge dsa-badge--status" style={{ background: STATUS_BG[task.status], color: STATUS_COLOR[task.status], border: `1px solid ${STATUS_COLOR[task.status]}44` }} onClick={() => cycleStatus(task.id)} title="Click to cycle status">
                    {task.status} ↻
                  </span>
                </div>
                {task.note && <div className="dsa-task-note">📝 {task.note}</div>}
              </div>
              <div className="dsa-task-actions">
                <button onClick={() => openEdit(task)} className="dsa-btn-edit">Edit</button>
                <button onClick={() => deleteTask(task.id)} className="dsa-btn-delete">Del</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Revision Modal ── */}
      {showRevision && (
        <div className="dsa-modal-overlay" onClick={e => { if (e.target === e.currentTarget) { setShowRevision(false); resetRevision(); } }}>
          <div className="dsa-modal" style={{ maxWidth: "500px" }}>

            {!revisionStarted ? (
              <>
                <h2>🔁 Smart Revision</h2>
                <p style={{ color: "#9ca3af", marginBottom: "16px", fontSize: "14px" }}>
                  Select filters and number of questions to revise from your <strong style={{ color: "#10b981" }}>Done</strong> list randomly.
                </p>

                <label style={{ color: "#9ca3af", fontSize: "13px" }}>Number of Questions</label>
                <input
                  type="number"
                  min={1}
                  max={stats.done}
                  value={revisionCount}
                  onChange={e => setRevisionCount(Number(e.target.value))}
                  className="dsa-input"
                  style={{ marginBottom: "12px" }}
                />

                <label style={{ color: "#9ca3af", fontSize: "13px" }}>Topic (optional)</label>
                <select value={revisionTag} onChange={e => setRevisionTag(e.target.value)} className="dsa-input dsa-select" style={{ marginBottom: "12px" }}>
                  {["All", ...TAGS].map(t => <option key={t}>{t}</option>)}
                </select>

                <label style={{ color: "#9ca3af", fontSize: "13px" }}>Difficulty (optional)</label>
                <select value={revisionDiff} onChange={e => setRevisionDiff(e.target.value)} className="dsa-input dsa-select" style={{ marginBottom: "20px" }}>
                  {["All", ...DIFFICULTIES].map(d => <option key={d}>{d}</option>)}
                </select>

                <div style={{ background: "#10b98115", border: "1px solid #10b98133", borderRadius: "8px", padding: "10px 14px", marginBottom: "20px", fontSize: "13px", color: "#10b981" }}>
                  ✅ {stats.done} Done questions available for revision
                </div>

                <div className="dsa-modal-actions">
                  <button onClick={() => setShowRevision(false)} className="dsa-btn-cancel">Cancel</button>
                  <button onClick={startRevision} className="dsa-btn-submit" style={{ background: "#8b5cf6" }}>Start Revision 🚀</button>
                </div>
              </>
            ) : revisionDone ? (
              <>
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎉</div>
                  <h2>Revision Complete!</h2>
                  <p style={{ color: "#9ca3af", marginTop: "8px" }}>You revised {revisionQuestions.length} questions today. Great work!</p>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "24px" }}>
                    <button onClick={resetRevision} className="dsa-btn-cancel">Revise Again</button>
                    <button onClick={() => { setShowRevision(false); resetRevision(); }} className="dsa-btn-submit">Done ✅</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h2>🔁 Revision</h2>
                  <span style={{ color: "#9ca3af", fontSize: "13px" }}>{currentRevIdx + 1} / {revisionQuestions.length}</span>
                </div>

                {/* Progress bar */}
                <div style={{ background: "#ffffff15", borderRadius: "99px", height: "6px", marginBottom: "20px" }}>
                  <div style={{ background: "#8b5cf6", borderRadius: "99px", height: "6px", width: `${((currentRevIdx + 1) / revisionQuestions.length) * 100}%`, transition: "width 0.3s" }} />
                </div>

                {/* Question Card */}
                <div style={{ background: "#ffffff08", border: "1px solid #ffffff15", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <h3 style={{ color: "#f0f0f0", fontSize: "18px" }}>{currentQ.title}</h3>
                    {currentQ.link && (
                      <a href={currentQ.link} target="_blank" rel="noreferrer" style={{ color: "#3b82f6", fontSize: "12px", textDecoration: "none" }}>↗ Open</a>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                    <span style={{ background: DIFF_COLOR[currentQ.difficulty] + "22", color: DIFF_COLOR[currentQ.difficulty], border: `1px solid ${DIFF_COLOR[currentQ.difficulty]}44`, padding: "2px 10px", borderRadius: "99px", fontSize: "12px" }}>{currentQ.difficulty}</span>
                    <span style={{ background: "#ffffff10", color: "#9ca3af", padding: "2px 10px", borderRadius: "99px", fontSize: "12px" }}>{currentQ.tag}</span>
                  </div>

                  {currentQ.note && (
                    <div style={{ color: "#9ca3af", fontSize: "13px", fontStyle: "italic" }}>📝 {currentQ.note}</div>
                  )}
                </div>

                <div className="dsa-modal-actions">
                  <button onClick={() => { setShowRevision(false); resetRevision(); }} className="dsa-btn-cancel">Exit</button>
                  <button onClick={nextRevision} className="dsa-btn-submit" style={{ background: "#8b5cf6" }}>
                    {currentRevIdx + 1 === revisionQuestions.length ? "Finish 🎉" : "Next →"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {showForm && (
        <div className="dsa-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="dsa-modal">
            <h2>{editId ? "Edit Question" : "Add Question"}</h2>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Question title *" className="dsa-input" />
            <div className="dsa-modal-grid">
              <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} className="dsa-input dsa-select">
                {TAGS.map(t => <option key={t}>{t}</option>)}
              </select>
              <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} className="dsa-input dsa-select">
                {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
              </select>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="dsa-input dsa-select">
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="LeetCode / GFG link (optional)" className="dsa-input" />
            <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Notes, approach, hints... (optional)" rows={3} className="dsa-input dsa-textarea" />
            <div className="dsa-modal-actions">
              <button onClick={() => setShowForm(false)} className="dsa-btn-cancel">Cancel</button>
              <button onClick={handleSubmit} className="dsa-btn-submit">{editId ? "Save Changes" : "Add"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
