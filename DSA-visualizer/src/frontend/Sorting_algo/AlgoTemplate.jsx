import { useState, useRef, useEffect, useCallback } from "react";

// ─── Sorting visualizer step builder ─────────────────────────────────────────
function randArr(n = 8) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 10);
}

function buildSortSteps(id, arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;

  function snap(sorted, comparing, swapped, msg, extra = {}) {
    steps.push({ arr: [...a], sorted, comparing, swapped, msg, ...extra });
  }

  if (id === "bubble") {
    for (let i = 0; i < n - 1; i++) {
      let swappedPass = false;
      for (let j = 0; j < n - i - 1; j++) {
        snap(i, [j, j + 1], false, `Comparing index ${j} (${a[j]}) and ${j+1} (${a[j+1]})`);
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          snap(i, [j, j + 1], true, `Swapped ${a[j+1]} and ${a[j]}`);
          swappedPass = true;
        }
      }
      if (!swappedPass) break;
    }
  } else if (id === "insertion") {
    for (let i = 1; i < n; i++) {
      const key = a[i]; let j = i - 1;
      snap(i, [i], false, `Key = ${key}, inserting into sorted region`);
      while (j >= 0 && a[j] > key) {
        snap(i, [j, j + 1], false, `${a[j]} > ${key}, shift right`);
        a[j + 1] = a[j]; j--;
      }
      a[j + 1] = key;
      snap(i, [j + 1], true, `Placed ${key} at index ${j + 1}`);
    }
  } else if (id === "selection") {
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        snap(i, [minIdx, j], false, `Comparing index ${j} with current min at ${minIdx}`);
        if (a[j] < a[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        [a[i], a[minIdx]] = [a[minIdx], a[i]];
        snap(i, [i, minIdx], true, `Swapped positions ${i} and ${minIdx}`);
      }
    }
  } else if (id === "heap") {
    function heapify(size, i) {
      let max = i, l = 2*i+1, r = 2*i+2;
      if (l < size && a[l] > a[max]) max = l;
      if (r < size && a[r] > a[max]) max = r;
      if (max !== i) {
        snap(n-size, [i, max], false, `Heapify: ${a[i]} and ${a[max]}`);
        [a[i], a[max]] = [a[max], a[i]];
        snap(n-size, [i, max], true, `Swapped ${a[max]} and ${a[i]}`);
        heapify(size, max);
      }
    }
    for (let i = Math.floor(n/2)-1; i >= 0; i--) heapify(n, i);
    for (let i = n-1; i > 0; i--) {
      snap(n-i, [0, i], false, `Extract max: swap root ${a[0]} with ${a[i]}`);
      [a[0], a[i]] = [a[i], a[0]];
      snap(n-i, [0, i], true, `Placed ${a[i]} at index ${i}`);
      heapify(i, 0);
    }
  } else if (id === "counting") {
    const max = Math.max(...a);
    const count = new Array(max + 1).fill(0);
    for (let v of a) count[v]++;
    for (let i = 1; i <= max; i++) count[i] += count[i - 1];
    const out = new Array(n);
    for (let i = n - 1; i >= 0; i--) out[--count[a[i]]] = a[i];
    for (let i = 0; i < n; i++) {
      a[i] = out[i];
      snap(i, [i], true, `Placed ${a[i]} at position ${i}`);
    }
  }

  steps.push({ arr: [...a], sorted: n, comparing: [], swapped: false, done: true, msg: "✅ Sorted!" });
  return steps;
}

// ─── Color helpers ────────────────────────────────────────────────────────────
const DIFF_COLOR = { Easy: "#10b981", Medium: "#f59e0b", Hard: "#ef4444" };

function Section({ title, accent = "#3b82f6", children }) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
        <div style={{ width: 4, height: 22, borderRadius: 2, background: accent }} />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--card-text-color)", margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Badge({ label, val, color }) {
  return (
    <div style={{ background: color + "18", border: `1px solid ${color}44`, borderRadius: 10, padding: "10px 18px", textAlign: "center", minWidth: 110 }}>
      <div style={{ fontSize: 11, color: "var(--card-text-color)", opacity: 0.6, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color, fontFamily: "monospace" }}>{val}</div>
    </div>
  );
}

function btn(color, disabled = false) {
  return {
    padding: "8px 15px", borderRadius: 8, border: `1px solid ${color}55`,
    background: color + "20", color, fontWeight: 600, fontSize: 13,
    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1,
  };
}

const SORTING_IDS = new Set(["bubble","insertion","selection","merge","quick","heap","counting"]);
const SPEEDS = [900, 600, 380, 200, 80];

// ─── Main Template ────────────────────────────────────────────────────────────
export default function AlgoTemplate({ data }) {
  if (!data) return <div style={{ padding: "3rem", color: "var(--card-text-color)" }}>Algorithm not found.</div>;

  const { id, title, category, color, tags, tagColors = {}, shortDesc, whatIs,
    howItWorks, steps, complexity, pros, cons, whenToUse, quiz: quizData, code } = data;

  const isSorting = SORTING_IDS.has(id);

  // ── visualizer state ───────────────────────────────────────────────────────
  const [inputVal, setInputVal] = useState("64, 25, 12, 22, 11, 90, 38");
  const [vizSteps, setVizSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const timerRef = useRef(null);

  const cur = vizSteps[stepIdx] ?? null;

  function loadArray(arr) {
    clearTimeout(timerRef.current);
    setPlaying(false); setStepIdx(0); setComparisons(0); setSwaps(0);
    setVizSteps(buildSortSteps(id, arr));
  }

  function handleGenerate() {
    const arr = randArr(8);
    setInputVal(arr.join(", "));
    loadArray(arr);
  }

  function handleUseArray() {
    const arr = inputVal.split(",").map(v => parseInt(v.trim())).filter(v => !isNaN(v)).slice(0, 12);
    if (arr.length >= 2) loadArray(arr);
  }

  useEffect(() => {
    if (!playing || stepIdx >= vizSteps.length - 1) { setPlaying(false); return; }
    timerRef.current = setTimeout(() => {
      setStepIdx(prev => {
        const next = prev + 1;
        const s = vizSteps[next];
        if (s?.swapped) setSwaps(sw => sw + 1);
        else if (!s?.done) setComparisons(c => c + 1);
        return next;
      });
    }, SPEEDS[speed - 1]);
    return () => clearTimeout(timerRef.current);
  }, [playing, stepIdx, vizSteps, speed]);

  function stepFwd() {
    if (stepIdx >= vizSteps.length - 1) return;
    const next = stepIdx + 1;
    const s = vizSteps[next];
    if (s?.swapped) setSwaps(sw => sw + 1);
    else if (!s?.done) setComparisons(c => c + 1);
    setStepIdx(next);
  }

  const barColor = (i) => {
    if (!cur) return color + "66";
    if (cur.done || i < cur.sorted) return "#10b981";
    if (cur.comparing?.includes(i)) return cur.swapped ? "#f59e0b" : "#ef4444";
    return color + "88";
  };

  const maxVal = cur ? Math.max(...cur.arr, 1) : 100;

  // ── quiz state ─────────────────────────────────────────────────────────────
  const [quizStarted, setQuizStarted] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  function handleAnswer(i) {
    if (answered) return;
    setSelected(i); setAnswered(true);
    if (i === quizData[qIdx].ans) setScore(s => s + 1);
  }
  function nextQ() {
    if (qIdx + 1 >= quizData.length) { setQuizDone(true); return; }
    setQIdx(q => q + 1); setSelected(null); setAnswered(false);
  }
  function restartQuiz() { setQIdx(0); setSelected(null); setAnswered(false); setScore(0); setQuizDone(false); setQuizStarted(false); }

  // ── code tab state ─────────────────────────────────────────────────────────
  const [lang, setLang] = useState("JavaScript");
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(code[lang] || "");
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1.2rem 4rem", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "var(--card-text-color)" }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 12, opacity: 0.45, marginBottom: "1.2rem", display: "flex", gap: 6 }}>
        <span>Home</span><span>/</span><span>Visualizer</span><span>/</span>
        <span>{category}</span><span>/</span>
        <span style={{ opacity: 1, fontWeight: 600 }}>{title}</span>
      </div>

      {/* Title */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 5, height: 32, borderRadius: 3, background: color }} />
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>{title}</h1>
        </div>
        <p style={{ fontSize: 14, opacity: 0.6, maxWidth: 600, lineHeight: 1.7, margin: 0 }}>{shortDesc}</p>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          {tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11, padding: "3px 10px", borderRadius: 20,
              border: `1px solid ${(tagColors[tag] || color) + "55"}`,
              color: tagColors[tag] || color,
              background: (tagColors[tag] || color) + "14",
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* What is it */}
      <Section title={`What is ${title}?`} accent={color}>
        <div style={{ background: "var(--card-bg)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.2rem 1.4rem", lineHeight: 1.8, fontSize: 14 }}>
          {whatIs.split('\n').map((line, i) => line.trim() && <p key={i} style={{ margin: "0 0 0.6rem" }}>{line.trim()}</p>)}
        </div>
      </Section>

      {/* How it works */}
      <Section title="How Does It Work?" accent="#8b5cf6">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {howItWorks.map(([label, before, action, after], i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: before && after ? "80px 1fr auto 1fr" : "80px 1fr 1fr",
              alignItems: "center", gap: 10, padding: "10px 14px",
              background: "var(--card-bg)", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)", fontSize: 13,
            }}>
              <span style={{ color, fontWeight: 700, fontSize: 12 }}>{label}</span>
              {before && <code style={{ fontFamily: "monospace", fontSize: 11, opacity: 0.85 }}>{before}</code>}
              <span style={{ fontSize: 11, color: "#f59e0b", textAlign: "center" }}>{action}</span>
              {after && <code style={{ fontFamily: "monospace", fontSize: 11, color: "#10b981" }}>{after}</code>}
            </div>
          ))}
        </div>
      </Section>

      {/* Algorithm Steps */}
      <Section title="Algorithm Steps" accent="#10b981">
        <ol style={{ paddingLeft: "1.4rem", margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {steps.map((step, i) => (
            <li key={i} style={{ fontSize: 14, lineHeight: 1.6, padding: "8px 12px", background: "var(--card-bg)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
              <strong style={{ color: "#10b981" }}>Step {i + 1}:</strong> {step}
            </li>
          ))}
        </ol>
      </Section>

      {/* Complexity */}
      <Section title="Time & Space Complexity" accent="#f59e0b">
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: "1rem" }}>
          <Badge label="Best Case" val={complexity.best} color="#10b981" />
          <Badge label="Average Case" val={complexity.avg} color="#f59e0b" />
          <Badge label="Worst Case" val={complexity.worst} color="#ef4444" />
          <Badge label="Space" val={complexity.space} color="#3b82f6" />
        </div>
      </Section>

      {/* Visualizer — only for sorting algos */}
      {isSorting && (
        <Section title={`Visualize ${title}`} accent="#ef4444">
          {/* Input */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            <input value={inputVal} onChange={e => setInputVal(e.target.value)}
              placeholder="e.g. 64, 25, 12, 22, 11"
              style={{ flex: 1, minWidth: 180, padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "var(--card-bg)", color: "var(--card-text-color)", fontSize: 13, outline: "none" }} />
            <button onClick={handleGenerate} style={btn("#8b5cf6")}>Random</button>
            <button onClick={handleUseArray} style={btn(color)}>Use Array</button>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
            <button onClick={() => { clearTimeout(timerRef.current); setPlaying(false); setStepIdx(0); setComparisons(0); setSwaps(0); }} style={btn("#666")}>Reset</button>
            <button onClick={() => { clearTimeout(timerRef.current); setPlaying(false); const p = stepIdx - 1; if (p >= 0) setStepIdx(p); }} disabled={stepIdx <= 0} style={btn(color, stepIdx <= 0)}>◀ Prev</button>
            <button
              onClick={() => setPlaying(p => !p)}
              disabled={vizSteps.length === 0 || stepIdx >= vizSteps.length - 1}
              style={btn(playing ? "#ef4444" : "#10b981", vizSteps.length === 0 || stepIdx >= vizSteps.length - 1)}
            >{playing ? "⏸ Pause" : stepIdx > 0 ? "▶ Resume" : "▶ Start"}</button>
            <button onClick={stepFwd} disabled={stepIdx >= vizSteps.length - 1} style={btn(color, stepIdx >= vizSteps.length - 1)}>Next ▶</button>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
              <span style={{ opacity: 0.6 }}>Speed</span>
              <input type="range" min={1} max={5} value={speed} step={1} onChange={e => setSpeed(Number(e.target.value))} style={{ width: 70 }} />
              <span style={{ opacity: 0.7 }}>{speed}x</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            {[["Comparisons", comparisons, "#f59e0b"], ["Swaps", swaps, "#ef4444"], ["Step", `${stepIdx}/${vizSteps.length}`, "#3b82f6"]].map(([l, v, c]) => (
              <div key={l} style={{ flex: 1, padding: "8px 10px", borderRadius: 10, background: c + "14", border: `1px solid ${c}33`, textAlign: "center" }}>
                <div style={{ fontSize: 10, color: c, marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: c }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 11, marginBottom: 8, opacity: 0.7 }}>
            {[["Sorted", "#10b981"], ["Comparing", "#ef4444"], ["Swapped", "#f59e0b"], ["Unsorted", color + "88"]].map(([l, c]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 9, height: 9, borderRadius: 2, background: c, display: "inline-block" }} />{l}
              </span>
            ))}
          </div>

          {/* Bar chart */}
          <div style={{ background: "var(--card-bg)", borderRadius: 14, padding: "1.2rem 1rem 0.8rem", border: "1px solid rgba(255,255,255,0.07)", minHeight: 180 }}>
            {cur ? (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 140 }}>
                {cur.arr.map((v, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: barColor(i) }}>{v}</span>
                    <div style={{ width: "100%", height: Math.max(6, (v / maxVal) * 120), background: barColor(i), borderRadius: "3px 3px 0 0", transition: "height 0.2s, background 0.15s" }} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "3rem 0", opacity: 0.35, fontSize: 13 }}>
                Click "Random" or "Use Array" to begin
              </div>
            )}
          </div>

          {cur && <div style={{ marginTop: 8, fontSize: 12, opacity: 0.6, textAlign: "center" }}>{cur.msg}</div>}
        </Section>
      )}

      {/* Pros & Cons */}
      <Section title="Advantages & Disadvantages" accent="#10b981">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: "#10b98110", border: "1px solid #10b98130", borderRadius: 12, padding: "1rem 1.2rem" }}>
            <div style={{ color: "#10b981", fontWeight: 700, marginBottom: 10, fontSize: 13 }}>✓ Advantages</div>
            {pros.map(t => <div key={t} style={{ fontSize: 13, marginBottom: 6, lineHeight: 1.5 }}>• {t}</div>)}
          </div>
          <div style={{ background: "#ef444410", border: "1px solid #ef444430", borderRadius: 12, padding: "1rem 1.2rem" }}>
            <div style={{ color: "#ef4444", fontWeight: 700, marginBottom: 10, fontSize: 13 }}>✗ Disadvantages</div>
            {cons.map(t => <div key={t} style={{ fontSize: 13, marginBottom: 6, lineHeight: 1.5 }}>• {t}</div>)}
          </div>
        </div>
      </Section>

      {/* When to use */}
      <Section title={`When to Use ${title}?`} accent={color}>
        <div style={{ background: "var(--card-bg)", borderRadius: 12, padding: "1.2rem 1.4rem", border: "1px solid rgba(255,255,255,0.06)", fontSize: 14, lineHeight: 1.8 }}>
          {whenToUse.split('\n').map((line, i) => line.trim() && <p key={i} style={{ margin: "0 0 0.5rem" }}>{line.trim()}</p>)}
        </div>
      </Section>

      {/* Quiz */}
      <Section title="Test Your Knowledge" accent="#f59e0b">
        {!quizStarted ? (
          <div style={{ background: "var(--card-bg)", borderRadius: 14, padding: "2rem", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🧠</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{title} Quiz</div>
            <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 20 }}>{quizData.length} questions · +1 for correct · Stars based on score</div>
            <button onClick={() => setQuizStarted(true)} style={btn("#f59e0b")}>Start Quiz</button>
          </div>
        ) : quizDone ? (
          <div style={{ background: "var(--card-bg)", borderRadius: 14, padding: "2rem", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{"⭐".repeat(Math.round((score / quizData.length) * 5))}</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{score}/{quizData.length}</div>
            <div style={{ fontSize: 13, opacity: 0.6, marginTop: 6, marginBottom: 20 }}>
              {score === quizData.length ? "Perfect! 🎉" : score >= 3 ? "Good job! 👍" : "Keep practicing! 💪"}
            </div>
            <button onClick={restartQuiz} style={btn("#f59e0b")}>Try Again</button>
          </div>
        ) : (
          <div style={{ background: "var(--card-bg)", borderRadius: 14, padding: "1.4rem 1.6rem", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 12, opacity: 0.5 }}>
              <span>Q {qIdx + 1} / {quizData.length}</span><span>Score: {score}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, lineHeight: 1.5 }}>{quizData[qIdx].q}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {quizData[qIdx].opts.map((opt, i) => {
                let bg = "var(--card-bg)", border = "rgba(255,255,255,0.12)";
                if (answered) {
                  if (i === quizData[qIdx].ans) { bg = "#10b98122"; border = "#10b981"; }
                  else if (i === selected) { bg = "#ef444422"; border = "#ef4444"; }
                }
                return (
                  <button key={i} onClick={() => handleAnswer(i)} style={{ padding: "10px 14px", borderRadius: 9, textAlign: "left", border: `1px solid ${border}`, background: bg, color: "var(--card-text-color)", fontSize: 13, cursor: answered ? "default" : "pointer", transition: "all 0.15s" }}>
                    <span style={{ opacity: 0.45, marginRight: 8 }}>{["A","B","C","D"][i]}.</span>{opt}
                  </button>
                );
              })}
            </div>
            {answered && <button onClick={nextQ} style={{ ...btn("#f59e0b"), marginTop: 14 }}>{qIdx + 1 >= quizData.length ? "See Results" : "Next →"}</button>}
          </div>
        )}
      </Section>

      {/* Code */}
      <Section title="Implementation" accent="#8b5cf6">
        <div style={{ background: "var(--card-bg)", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", overflowX: "auto" }}>
            {Object.keys(code).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: "10px 14px", border: "none", cursor: "pointer",
                background: lang === l ? "#8b5cf622" : "transparent",
                color: lang === l ? "#8b5cf6" : "var(--card-text-color)",
                fontWeight: lang === l ? 700 : 400, fontSize: 13,
                borderBottom: lang === l ? "2px solid #8b5cf6" : "2px solid transparent",
                whiteSpace: "nowrap",
              }}>{l}</button>
            ))}
            <button onClick={handleCopy} style={{ marginLeft: "auto", padding: "8px 14px", border: "none", cursor: "pointer", background: "transparent", color: copied ? "#10b981" : "var(--card-text-color)", fontSize: 12, opacity: 0.7 }}>
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
          <pre style={{ margin: 0, padding: "1.2rem 1.4rem", fontSize: 13, fontFamily: "'Fira Code', 'Cascadia Code', monospace", overflowX: "auto", lineHeight: 1.7, color: "var(--card-text-color)" }}>
            {code[lang]}
          </pre>
        </div>
      </Section>

    </div>
  );
}
