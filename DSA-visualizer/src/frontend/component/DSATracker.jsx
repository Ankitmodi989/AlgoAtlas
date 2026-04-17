
import { useState, useEffect } from "react";
import "./DSATracker.css";

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
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("dsa_tasks");
      return saved ? JSON.parse(saved) : SAMPLE_TASKS;
    } catch { return SAMPLE_TASKS; }
  });

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");
  const [filterTag, setFilterTag] = useState("All");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", tag: "Array", difficulty: "Easy", status: "To Do", note: "", link: "" });

  useEffect(() => {
    try { localStorage.setItem("dsa_tasks", JSON.stringify(tasks)); } catch {}
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

  function handleSubmit() {
    if (!form.title.trim()) return;
    if (editId) {
      setTasks(ts => ts.map(t => t.id === editId ? { ...t, ...form } : t));
    } else {
      setTasks(ts => [{ id: uid(), ...form, createdAt: Date.now() }, ...ts]);
    }
    setShowForm(false);
    setEditId(null);
  }

  function deleteTask(id) {
    setTasks(ts => ts.filter(t => t.id !== id));
  }

  function cycleStatus(id) {
    setTasks(ts => ts.map(t => {
      if (t.id !== id) return t;
      const idx = STATUSES.indexOf(t.status);
      return { ...t, status: STATUSES[(idx + 1) % STATUSES.length] };
    }));
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

  return (
    <div className="dsa-wrapper">

      {/* ── Header ── */}
      <div className="dsa-header">
        <div>
          <h1>DSA Practice Tracker</h1>
          <p>Track your questions, mark progress, add notes</p>
        </div>
        <button onClick={openAdd} className="dsa-add-btn">+ Add Question</button>
      </div>

      {/* ── Stats ── */}
      <div className="dsa-stats">
        {[
          ["Total", stats.total, "#3b82f6"],
          ["Done", stats.done, "#10b981"],
          ["In Progress", stats.inProgress, "#f59e0b"],
          ["To Do", stats.todo, "#8b5cf6"],
        ].map(([label, val, col]) => (
          <div
            key={label}
            className="dsa-stat-card"
            style={{ background: col + "14", border: `1px solid ${col}33` }}
          >
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
                {/* Title row */}
                <div className="dsa-task-title-row">
                  <span className={`dsa-task-title ${task.status === "Done" ? "dsa-task-title--done" : ""}`}>
                    {task.title}
                  </span>
                  {task.link && (
                    <a href={task.link} target="_blank" rel="noreferrer" className="dsa-task-link">↗ LeetCode</a>
                  )}
                </div>

                {/* Badges */}
                <div className={`dsa-badges ${task.note ? "dsa-badges--with-note" : ""}`}>
                  <span
                    className="dsa-badge"
                    style={{
                      background: DIFF_COLOR[task.difficulty] + "22",
                      color: DIFF_COLOR[task.difficulty],
                      border: `1px solid ${DIFF_COLOR[task.difficulty]}44`,
                    }}
                  >{task.difficulty}</span>
                  <span className="dsa-badge dsa-badge--tag">{task.tag}</span>
                  <span
                    className="dsa-badge dsa-badge--status"
                    style={{
                      background: STATUS_BG[task.status],
                      color: STATUS_COLOR[task.status],
                      border: `1px solid ${STATUS_COLOR[task.status]}44`,
                    }}
                    onClick={() => cycleStatus(task.id)}
                    title="Click to cycle status"
                  >
                    {task.status} ↻
                  </span>
                </div>

                {/* Note */}
                {task.note && (
                  <div className="dsa-task-note">📝 {task.note}</div>
                )}
              </div>

              {/* Action buttons */}
              <div className="dsa-task-actions">
                <button onClick={() => openEdit(task)} className="dsa-btn-edit">Edit</button>
                <button onClick={() => deleteTask(task.id)} className="dsa-btn-delete">Del</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Add/Edit Modal ── */}
      {showForm && (
        <div
          className="dsa-modal-overlay"
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div className="dsa-modal">
            <h2>{editId ? "Edit Question" : "Add Question"}</h2>

            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Question title *"
              className="dsa-input"
            />

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

            <input
              value={form.link}
              onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
              placeholder="LeetCode / GFG link (optional)"
              className="dsa-input"
            />

            <textarea
              value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              placeholder="Notes, approach, hints... (optional)"
              rows={3}
              className="dsa-input dsa-textarea"
            />

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