import { useEffect, useRef, useState, useCallback } from "react";

const CELL   = 30;
const PAD    = 7;
const RX     = 6;
const ROW_H  = 90;
const GAP    = 24;
const ARROW  = "#888780";
const SPEEDS = [900, 600, 380, 200, 80];

function rand(n) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 89) + 10);
}

function makeNode(arr, id, depth) {
  return { id, arr: [...arr], depth, children: [], state: "idle", visible: false, pivot: -1, cx: 0, cy: 0, _w: 0 };
}

function flatMap(node, m = {}) {
  m[node.id] = node;
  node.children.forEach((c) => flatMap(c, m));
  return m;
}

function nodePixelW(arr) {
  return arr.length * CELL + PAD * 2;
}

function buildSteps(root, map) {
  const steps = [];

  function snap(msg, highlight, phase) {
    const s = {};
    Object.keys(map).forEach((k) => {
      s[k] = { arr: [...map[k].arr], state: map[k].state, visible: map[k].visible, pivot: map[k].pivot };
    });
    steps.push({ snap: s, highlight, phase, msg });
  }

  function qs(node) {
    node.visible = true;

    if (node.arr.length <= 1) {
      node.state = "sorted";
      node.pivot = -1;
      snap(`[${node.arr}] — base case, already sorted`, node.id, "sorted");
      return [...node.arr];
    }

    const pv = node.arr[node.arr.length - 1];
    node.state = "partitioning";
    node.pivot = node.arr.length - 1;
    snap(`Partitioning [${node.arr}]  →  pivot = ${pv}`, node.id, "partition");

    const L = [], R = [];
    for (let i = 0; i < node.arr.length - 1; i++) {
      (node.arr[i] <= pv ? L : R).push(node.arr[i]);
    }
    snap(
      `left [${L.length ? L : "∅"}]  |  pivot [${pv}]  |  right [${R.length ? R : "∅"}]`,
      node.id, "partition"
    );

    const lId = node.id + "L";
    const pId = node.id + "P";
    const rId = node.id + "R";

    const lNode = makeNode(L,    lId, node.depth + 1);
    const pNode = makeNode([pv], pId, node.depth + 1);
    const rNode = makeNode(R,    rId, node.depth + 1);

    map[lId] = lNode;
    map[pId] = pNode;
    map[rId] = rNode;
    node.children = [lNode, pNode, rNode];

    lNode.visible = true; lNode.state = "subarray";
    pNode.visible = true; pNode.state = "pivot-placed";
    rNode.visible = true; rNode.state = "subarray";
    snap(`Split into 3 sub-arrays`, node.id, "show-children");

    const sL = L.length ? qs(lNode) : [];
    const sR = R.length ? qs(rNode) : [];

    lNode.visible = false;
    pNode.visible = false;
    rNode.visible = false;

    const merged = [...sL, pv, ...sR];
    node.arr   = [...merged];
    node.state = "sorted";
    node.pivot = -1;
    snap(`Merged → [${merged}]`, node.id, "sorted");
    return merged;
  }

  qs(root);
  snap(`Sorting complete!  [${root.arr}]`, root.id, "done");
  return steps;
}

/* Bottom-up layout: measure widths first, then assign positions top-down */
function layoutTree(canvas, root, map) {
  function measure(node) {
    const own = nodePixelW(node.arr);
    if (!node.children.length) { node._w = own; return own; }
    const childSpan = node.children.reduce((s, c) => s + measure(c), 0)
      + GAP * (node.children.length - 1);
    node._w = Math.max(own, childSpan);
    return node._w;
  }
  measure(root);

  const W = root._w + GAP * 2;
  const depths = {};
  Object.values(map).forEach((n) => {
    if (!depths[n.depth]) depths[n.depth] = [];
    depths[n.depth].push(n);
  });
  const maxD = Math.max(...Object.keys(depths).map(Number));
  const H = (maxD + 1) * ROW_H + 60;

  if (canvas) { canvas.width = W; canvas.height = H; }

  function assign(node, left, right) {
    node.cx = (left + right) / 2;
    node.cy = node.depth * ROW_H + 44;
    if (!node.children.length) return;
    const total = node.children.reduce((s, c) => s + c._w, 0)
      + GAP * (node.children.length - 1);
    let cursor = node.cx - total / 2;
    node.children.forEach((child) => {
      assign(child, cursor, cursor + child._w);
      cursor += child._w + GAP;
    });
  }
  assign(root, GAP, W - GAP);
  return { W, H };
}

function getColors(state) {
  switch (state) {
    case "partitioning": return { bg: "#EEEDFE", border: "#7F77DD", cellBg: "#AFA9EC", cellText: "#26215C" };
    case "pivot-placed": return { bg: "#FAECE7", border: "#D85A30", cellBg: "#F0997B", cellText: "#4A1B0C" };
    case "subarray":     return { bg: "#E6F1FB", border: "#378ADD", cellBg: "#B5D4F4", cellText: "#0C447C" };
    case "sorted":       return { bg: "#E1F5EE", border: "#1D9E75", cellBg: "#9FE1CB", cellText: "#085041" };
    default:             return { bg: "#F1EFE8", border: "#B4B2A9", cellBg: "#D3D1C7", cellText: "#444441" };
  }
}

function drawArrow(ctx, x1, y1, x2, y2) {
  ctx.save();
  ctx.strokeStyle = ARROW; ctx.lineWidth = 1.3;
  ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.setLineDash([]);
  const a = Math.atan2(y2 - y1, x2 - x1), hs = 8;
  ctx.fillStyle = ARROW;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - hs * Math.cos(a - 0.35), y2 - hs * Math.sin(a - 0.35));
  ctx.lineTo(x2 - hs * Math.cos(a + 0.35), y2 - hs * Math.sin(a + 0.35));
  ctx.closePath(); ctx.fill(); ctx.restore();
}

function drawNode(ctx, node, state, pivotIdx) {
  const w = nodePixelW(node.arr);
  const h = CELL + PAD * 2;
  const x = node.cx - w / 2;
  const y = node.cy - h / 2;
  const { bg, border, cellBg, cellText } = getColors(state);

  ctx.save();
  ctx.beginPath(); ctx.roundRect(x, y, w, h, RX);
  ctx.fillStyle = bg; ctx.fill();
  ctx.strokeStyle = border; ctx.lineWidth = 1.8; ctx.stroke();

  node.arr.forEach((v, i) => {
    const cx = x + PAD + i * CELL + CELL / 2;
    const cy = node.cy;
    const isPiv = state === "partitioning" && i === pivotIdx;
    ctx.beginPath();
    ctx.roundRect(cx - CELL / 2 + 1, cy - CELL / 2 + 1, CELL - 2, CELL - 2, 4);
    ctx.fillStyle = isPiv ? "#D85A30" : cellBg; ctx.fill();
    if (isPiv) { ctx.strokeStyle = "#993C1D"; ctx.lineWidth = 1.5; ctx.stroke(); }
    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = isPiv ? "#fff" : cellText;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(v, cx, cy);
  });
  ctx.restore();
}

function renderStep(canvas, step, map) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const { snap, highlight, phase } = step;
  const h = CELL + PAD * 2;

  Object.values(map).forEach((node) => {
    const ns = snap[node.id];
    if (!ns || !ns.visible) return;
    node.children.forEach((child) => {
      const cs = snap[child.id];
      if (!cs || !cs.visible) return;
      drawArrow(ctx, node.cx, node.cy + h / 2, child.cx, child.cy - h / 2);
    });
  });

  Object.values(map).forEach((node) => {
    const ns = snap[node.id];
    if (!ns || !ns.visible) return;
    node.arr = ns.arr;
    const st =
      node.id === highlight
        ? phase === "partition" || phase === "show-children" ? "partitioning"
          : phase === "sorted"  || phase === "done"          ? "sorted"
          : ns.state
        : ns.state;
    drawNode(ctx, node, st, ns.pivot);
  });
}

export default function QuickSort() {
  const canvasRef  = useRef(null);
  const timerRef   = useRef(null);
  const stepIdxRef = useRef(0);
  const stepsRef   = useRef([]);
  const mapRef     = useRef({});
  const runningRef = useRef(false);

  const [size, setSize]       = useState(5);
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
    setStatus((prev) => (prev === "running" ? "paused" : prev));
  }, []);

  const tick = useCallback(() => {
    const idx = stepIdxRef.current;
    if (idx >= stepsRef.current.length) { stopAuto(); setStatus("done"); return; }
    showStep(idx);
    stepIdxRef.current = idx + 1;
    if (stepIdxRef.current < stepsRef.current.length) {
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

    const n    = newSize ?? size;
    const arr  = rand(n);
    const root = makeNode(arr, "root", 0);
    const map  = flatMap(root, {});

    const newSteps = buildSteps(root, map);
    layoutTree(canvasRef.current, root, map);

    stepsRef.current = newSteps;
    mapRef.current   = map;
    setTotal(newSteps.length);
    setStepIdx(0);
    setStatus("idle");
    setMsg(`Original array: [${arr}] — ready. Press Start.`);

    root.visible = true;
    root.arr     = [...arr];
    const initSnap = {};
    Object.keys(map).forEach((k) => {
      initSnap[k] = { arr: [...map[k].arr], state: "idle", visible: k === "root", pivot: -1 };
    });
    renderStep(canvasRef.current, { snap: initSnap, highlight: "root", phase: "idle", msg: "" }, map);
  }, [size]);

  useEffect(() => { reset(); }, []);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleStart = () => {
    if (runningRef.current) { stopAuto(); return; }
    if (status === "done")  { reset(); return; }
    runningRef.current = true;
    setStatus("running");
    timerRef.current = setTimeout(tick, SPEEDS[speed - 1]);
  };

  const handlePrev = () => {
    stopAuto();
    const prev = stepIdxRef.current - 2;
    if (prev >= 0) { showStep(prev); stepIdxRef.current = prev + 1; }
  };

  const handleNext = () => {
    stopAuto();
    const next = stepIdxRef.current;
    if (next < stepsRef.current.length) { showStep(next); stepIdxRef.current = next + 1; }
  };

  const btnLabel =
    status === "done"    ? "Done ✓" :
    status === "running" ? "Pause"  :
    stepIdx > 0          ? "Resume" : "Start";

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 940, margin: "0 auto", padding: "1.5rem 1rem"}}>

      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 4px" }}>Quick Sort</h1>
        <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
          Pick a pivot, partition into left / right sub-arrays, recurse until sorted.
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 13, color: "#666" }}>Array size</label>
          <input type="range" min={4} max={7} value={size} step={1}
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

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12, color: "#666", marginBottom: "0.8rem" }}>
        {[
          { label: "partitioning", color: "#7F77DD" },
          { label: "pivot",        color: "#D85A30" },
          { label: "sub-array",    color: "#378ADD" },
          { label: "sorted",       color: "#1D9E75" },
        ].map(({ label, color }) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: "inline-block" }} />
            {label}
          </span>
        ))}
      </div>

      <div style={{ overflowX: "auto", borderRadius: 8, marginBottom: "0.5rem" }}>
        <canvas ref={canvasRef} style={{ display: "block" }} />
      </div>

      <div style={{ fontSize: 13, color: "#555", minHeight: 22, marginBottom: "1rem" }}>
        {msg}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={handleStart} disabled={status === "done"}
          style={{
            padding: "8px 20px", borderRadius: 6, border: "1px solid #ccc",
            background: status === "done" ? "#f0f0f0" : "#7F77DD",
            color:      status === "done" ? "#888"    : "#fff",
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