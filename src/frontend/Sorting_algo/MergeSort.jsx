import { useEffect, useRef, useState, useCallback } from "react";

const CELL = 28;
const PAD = 6;
const RX = 6;
const ROW_H = 70;
const ARROW_CLR = "#888780";

function rand(n) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 89) + 10);
}

function buildTree(a, id, depth, pos, parent) {
  const node = { id, arr: [...a], depth, pos, parent, children: [], state: "hidden", visible: false };
  if (a.length > 1) {
    const m = Math.floor(a.length / 2);
    node.children.push(buildTree(a.slice(0, m), id + "L", depth + 1, pos * 2, id));
    node.children.push(buildTree(a.slice(m), id + "R", depth + 1, pos * 2 + 1, id));
  }
  return node;
}

function flattenTree(node, map = {}) {
  map[node.id] = node;
  node.children.forEach((c) => flattenTree(c, map));
  return map;
}

function buildSteps(root, map) {
  const steps = [];

  function snap(msg, highlight, phase) {
    const s = {};
    Object.keys(map).forEach((k) => {
      s[k] = { arr: [...map[k].arr], state: map[k].state, visible: map[k].visible };
    });
    steps.push({ snap: s, highlight, phase, msg });
  }

  function ms(node) {
    node.visible = true;
    node.state = "splitting";
    snap(`Split [${node.arr}]`, node.id, "split");

    if (node.arr.length <= 1) {
      node.state = "sorted";
      snap(`[${node.arr}] — base case, already sorted`, node.id, "sorted");
      return [...node.arr];
    }

    const [lc, rc] = node.children;
    const L = ms(lc);
    const R = ms(rc);

    node.state = "merging";
    snap(`Merging [${L}] + [${R}]`, node.id, "merge");

    const merged = [];
    let i = 0, j = 0;
    while (i < L.length && j < R.length) {
      merged.push(L[i] <= R[j] ? L[i++] : R[j++]);
    }
    while (i < L.length) merged.push(L[i++]);
    while (j < R.length) merged.push(R[j++]);

    node.arr = [...merged];
    lc.visible = false;
    rc.visible = false;
    node.state = "sorted";
    snap(`Merged → [${merged}]`, node.id, "sorted");
    return merged;
  }

  root.visible = true;
  root.state = "idle";
  ms(root);
  snap(`Sorting complete! [${root.arr}]`, root.id, "done");
  return steps;
}

function layoutTree(root, map, arrLen) {
  const depths = {};
  Object.values(map).forEach((n) => {
    if (!depths[n.depth]) depths[n.depth] = [];
    depths[n.depth].push(n);
  });
  const maxDepth = Math.max(...Object.keys(depths).map(Number));
  const leafCount = depths[maxDepth].length;
  const nodeW = arrLen * CELL + PAD * 2;
  const gap = 20;
  const totalW = leafCount * (nodeW + gap) + gap;
  const W = Math.max(totalW, 400);
  const H = (maxDepth + 1) * ROW_H + 60;

  function assignX(node, left, right) {
    node.cx = (left + right) / 2;
    node.cy = node.depth * ROW_H + 40;
    if (node.children.length === 2) {
      const mid = (left + right) / 2;
      assignX(node.children[0], left, mid);
      assignX(node.children[1], mid, right);
    }
  }
  assignX(root, 0, W);
  return { W, H };
}

function getNodeColors(state) {
  switch (state) {
    case "splitting": return { bg: "#FAEEDA", border: "#EF9F27", cellBg: "#FAC775", cellText: "#633806" };
    case "merging":   return { bg: "#E6F1FB", border: "#378ADD", cellBg: "#B5D4F4", cellText: "#0C447C" };
    case "sorted":    return { bg: "#E1F5EE", border: "#1D9E75", cellBg: "#9FE1CB", cellText: "#085041" };
    default:          return { bg: "#F1EFE8", border: "#B4B2A9", cellBg: "#D3D1C7", cellText: "#444441" };
  }
}

function drawArrow(ctx, x1, y1, x2, y2) {
  ctx.save();
  ctx.strokeStyle = ARROW_CLR;
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const hs = 7;
  ctx.fillStyle = ARROW_CLR;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - hs * Math.cos(ang - 0.4), y2 - hs * Math.sin(ang - 0.4));
  ctx.lineTo(x2 - hs * Math.cos(ang + 0.4), y2 - hs * Math.sin(ang + 0.4));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawNode(ctx, node, state) {
  const w = node.arr.length * CELL + PAD * 2;
  const h = CELL + PAD * 2;
  const x = node.cx - w / 2;
  const y = node.cy - h / 2;
  const { bg, border, cellBg, cellText } = getNodeColors(state);

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, RX);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  node.arr.forEach((v, i) => {
    const cx = x + PAD + i * CELL + CELL / 2;
    const cy = node.cy;
    ctx.beginPath();
    ctx.roundRect(cx - CELL / 2 + 1, cy - CELL / 2 + 1, CELL - 2, CELL - 2, 3);
    ctx.fillStyle = cellBg;
    ctx.fill();
    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = cellText;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(v, cx, cy);
  });
  ctx.restore();
}

function renderStep(canvas, step, map) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const { snap, highlight, phase } = step;

  Object.values(map).forEach((node) => {
    const ns = snap[node.id];
    if (!ns || !ns.visible) return;
    node.children.forEach((child) => {
      const cs = snap[child.id];
      if (!cs || !cs.visible) return;
      const h = CELL + PAD * 2;
      drawArrow(ctx, node.cx, node.cy + h / 2, child.cx, child.cy - h / 2);
    });
  });

  Object.values(map).forEach((node) => {
    const ns = snap[node.id];
    if (!ns || !ns.visible) return;
    node.arr = ns.arr;
    const activeState =
      node.id === highlight
        ? phase === "split" ? "splitting" : phase === "merge" ? "merging" : "sorted"
        : ns.state;
    drawNode(ctx, node, activeState);
  });
}

const SPEEDS = [900, 600, 380, 200, 80];

export default function MergeSort() {
  const canvasRef   = useRef(null);
  const timerRef    = useRef(null);
  const stepIdxRef  = useRef(0);
  const stepsRef    = useRef([]);
  const mapRef      = useRef({});
  const runningRef  = useRef(false);

  const [size, setSize]       = useState(6);
  const [speed, setSpeed]     = useState(3);
  const [stepIdx, setStepIdx] = useState(0);
  const [total, setTotal]     = useState(0);
  const [msg, setMsg]         = useState("Press Start to begin.");
  const [status, setStatus]   = useState("idle");

  const showStep = useCallback((idx) => {
    const steps = stepsRef.current;
    const map   = mapRef.current;
    if (idx < 0 || idx >= steps.length) return;
    const s = steps[idx];
    Object.values(map).forEach((n) => { const ns = s.snap[n.id]; if (ns) n.arr = ns.arr; });
    renderStep(canvasRef.current, s, map);
    setMsg(s.msg);
    setStepIdx(idx);
  }, []);

  const stopAuto = useCallback(() => {
    clearTimeout(timerRef.current);
    runningRef.current = false;
    setStatus("paused");
  }, []);

  const tick = useCallback(() => {
    const steps = stepsRef.current;
    const idx   = stepIdxRef.current;
    if (idx >= steps.length) { stopAuto(); setStatus("done"); return; }
    showStep(idx);
    stepIdxRef.current = idx + 1;
    if (stepIdxRef.current < steps.length) {
      timerRef.current = setTimeout(tick, SPEEDS[speed - 1]);
    } else {
      stopAuto();
      setStatus("done");
    }
  }, [showStep, stopAuto, speed]);

  const reset = useCallback((newSize) => {
    clearTimeout(timerRef.current);
    runningRef.current = false;
    stepIdxRef.current = 0;
    const n   = newSize ?? size;
    const arr = rand(n);
    const root = buildTree(arr, "root", 0, 0, null);
    const map  = flattenTree(root, {});
    const { W, H } = layoutTree(root, map, n);

    if (canvasRef.current) {
      canvasRef.current.width  = W;
      canvasRef.current.height = H;
    }

    const steps = buildSteps(root, map);
    stepsRef.current  = steps;
    mapRef.current    = map;
    setTotal(steps.length);
    setStepIdx(0);
    setStatus("idle");
    setMsg(`Original array: [${arr}] — ready. Press Start.`);

    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, W, H);
      map["root"].visible = true;
      map["root"].arr     = [...arr];
      const initSnap = {};
      Object.keys(map).forEach((k) => {
        initSnap[k] = { arr: [...map[k].arr], state: "idle", visible: k === "root" };
      });
      renderStep(canvasRef.current, { snap: initSnap, highlight: "root", phase: "idle", msg: "" }, map);
    }
  }, [size]);

  useEffect(() => { reset(); }, []);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleStart = () => {
    if (runningRef.current) { stopAuto(); return; }
    if (status === "done") { reset(); return; }
    runningRef.current = true;
    setStatus("running");
    timerRef.current = setTimeout(tick, SPEEDS[speed - 1]);
  };

  const handlePrev = () => { stopAuto(); showStep(stepIdxRef.current - 2); stepIdxRef.current = Math.max(0, stepIdxRef.current - 1); };
  const handleNext = () => { stopAuto(); showStep(stepIdxRef.current); stepIdxRef.current = Math.min(stepsRef.current.length, stepIdxRef.current + 1); };

  const btnLabel = status === "done" ? "Done ✓" : status === "running" ? "Pause" : stepIdx > 0 ? "Resume" : "Start";

  const phaseColor = (ph) => ({
    split:  { bg: "#FAEEDA", color: "#633806" },
    merge:  { bg: "#E6F1FB", color: "#0C447C" },
    sorted: { bg: "#E1F5EE", color: "#085041" },
    done:   { bg: "#E1F5EE", color: "#085041" },
  }[ph] ?? {});

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 860, margin: "0 auto", padding: "1.5rem 1rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 4px" }}>Merge Sort</h1>
        <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
          Divide the array recursively, then merge sorted halves back together.
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 13, color: "#666" }}>Array size</label>
          <input type="range" min={4} max={8} value={size} step={1}
            onChange={(e) => { const n = Number(e.target.value); setSize(n); reset(n); }}
            style={{ width: 100 }} />
          <span style={{ fontSize: 13, fontWeight: 500, minWidth: 16 }}>{size}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 13, color: "#666" }}>Speed</label>
          <input type="range" min={1} max={5} value={speed} step={1}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ width: 90 }} />
          <span style={{ fontSize: 13, fontWeight: 500, minWidth: 16 }}>{speed}</span>
        </div>

        <span style={{ marginLeft: "auto", fontSize: 13, color: "#666" }}>
          Step <strong style={{ color: "#111" }}>{stepIdx}</strong> / {total}
        </span>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12, color: "#666", marginBottom: "0.8rem" }}>
        {[
          { label: "splitting", color: "#EF9F27" },
          { label: "merging",   color: "#378ADD" },
          { label: "sorted",    color: "#1D9E75" },
        ].map(({ label, color }) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: "inline-block" }} />
            {label}
          </span>
        ))}
      </div>

      {/* Canvas */}
      <div style={{ overflowX: "auto", borderRadius: 8, marginBottom: "0.5rem" }}>
        <canvas ref={canvasRef} style={{ display: "block" }} />
      </div>

      {/* Step message */}
      <div style={{ fontSize: 13, color: "#555", minHeight: 22, marginBottom: "1rem" }}>
        {msg}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={handleStart}
          disabled={status === "done"}
          style={{
            padding: "8px 20px", borderRadius: 6,
            border: "1px solid #ccc",
            background: status === "done" ? "#f0f0f0" : "#378ADD",
            color: status === "done" ? "#888" : "#fff",
            fontWeight: 500, fontSize: 14,
            cursor: status === "done" ? "default" : "pointer",
          }}>
          {btnLabel}
        </button>

        <button onClick={handlePrev} disabled={stepIdx <= 0}
          style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #ccc", background: "transparent", fontSize: 14, cursor: "pointer" }}>
          Prev
        </button>

        <button onClick={handleNext} disabled={stepIdx >= total}
          style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #ccc", background: "transparent", fontSize: 14, cursor: "pointer" }}>
          Next
        </button>

        <button onClick={() => reset()}
          style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #ccc", background: "transparent", fontSize: 14, cursor: "pointer" }}>
          New array
        </button>
      </div>
    </div>
  );
}