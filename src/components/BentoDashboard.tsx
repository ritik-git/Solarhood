"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Real-time Solar Energy Hook (IST-based) ────────────────────────────
   India Standard Time = UTC + 5h30m
   Solar output follows a Gaussian bell curve:
     • Sunrise  ≈ 06:00 IST   (output = 0 kW)
     • Solar noon ≈ 12:15 IST  (peak = 2.1 kW)
     • Sunset   ≈ 18:30 IST   (output = 0 kW)
   Min-user energy = equivalent output of the smallest 1 kW residential system
   ─────────────────────────────────────────────────────────────────────── */
function computeSolarStats() {
  const now = new Date();
  // Convert to IST (UTC + 5:30)
  const istMs = now.getTime() + 5.5 * 3600 * 1000;
  const ist = new Date(istMs);
  const hours = ist.getUTCHours() + ist.getUTCMinutes() / 60;

  const PEAK_KW   = 2.1;   // max system output at noon
  const SUNRISE   = 6.0;   // 06:00 IST
  const SUNSET    = 18.5;  // 18:30 IST
  const SOLAR_NOON = 12.25; // 12:15 IST
  const HALF_DAY  = (SUNSET - SUNRISE) / 2;

  let currentKw = 0;
  if (hours > SUNRISE && hours < SUNSET) {
    const x = (hours - SOLAR_NOON) / HALF_DAY;
    // Gaussian bell: tighter than pure sine, matches real-world irradiance
    currentKw = PEAK_KW * Math.exp(-0.5 * x * x * 2.2);
    currentKw = Math.max(0, Math.min(PEAK_KW, currentKw));
  }

  // Minimum user: a 1 kW rooftop running at ~72 % of the peak ratio
  const minUserW = Math.round((currentKw / PEAK_KW) * 1000 * 0.72);

  return {
    peakToday : PEAK_KW,                            // 2.1 kW — day's max
    currentKw : parseFloat(currentKw.toFixed(2)),   // live output
    minUserW  : Math.max(0, minUserW),              // live min-user watts
  };
}

function useLiveSolarStats() {
  const [stats, setStats] = useState({
    peakToday: 2.1,
    currentKw: 0,
    minUserW : 0,
  });

  useEffect(() => {
    const refresh = () => setStats(computeSolarStats());
    refresh();                               // compute immediately on mount
    const id = setInterval(refresh, 60_000); // refresh every minute
    return () => clearInterval(id);
  }, []);

  return stats;
}

const cardAnim = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/* ─── Card A: Energy Wave ─────────────────────────────────── */
function EnergyWaveCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let t = 0, raf: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      t += 0.022;
      const waves: [number, number, string, number, string][] = [
        [0.18, 0, "rgba(16,185,129,0.85)", 2.5, "#10B981"],
        [0.12, Math.PI / 3, "rgba(245,158,11,0.55)", 1.8, "#F59E0B"],
        [0.08, Math.PI * 0.7, "rgba(16,185,129,0.35)", 1.2, "#10B981"],
      ];
      for (const [amp, phase, color, lw, glow] of waves) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const y = h * 0.5 + h * amp * Math.sin((x / w) * Math.PI * 4 + t + phase);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = color; ctx.lineWidth = lw;
        ctx.shadowBlur = 12; ctx.shadowColor = glow;
        ctx.stroke(); ctx.shadowBlur = 0;
      }
      const dotX = ((t * 0.3) % 1) * w;
      const dotY = h * 0.5 + h * 0.18 * Math.sin((dotX / w) * Math.PI * 4 + t);
      ctx.beginPath(); ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#10B981"; ctx.shadowBlur = 20; ctx.shadowColor = "#10B981";
      ctx.fill(); ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
}

/* ─── Card C: ROI Counter ─────────────────────────────────── */
function ROICounter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0.0);
  useEffect(() => {
    if (!inView) return;
    const target = 4.2, steps = 60, step = target / steps;
    let current = 0;
    const id = setInterval(() => {
      current += step;
      if (current >= target) { setDisplay(target); clearInterval(id); }
      else setDisplay(parseFloat(current.toFixed(1)));
    }, 25);
    return () => clearInterval(id);
  }, [inView]);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontSize: "clamp(3rem,6vw,5rem)", fontWeight: 900, color: "#F59E0B", lineHeight: 1, textShadow: "0 0 40px rgba(245,158,11,0.4)", fontVariantNumeric: "tabular-nums" }}>
        {display.toFixed(1)}<span style={{ fontSize: "0.4em", color: "rgba(255,255,255,0.5)", marginLeft: "0.2em" }}>yr</span>
      </div>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", marginTop: "0.5rem", letterSpacing: "0.05em" }}>Average Payback Period</p>
      <div style={{ marginTop: "1.4rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {[{ label: "Subsidy", pct: 40, color: "#10B981" }, { label: "Net Savings", pct: 72, color: "#F59E0B" }, { label: "ROI 25yr", pct: 90, color: "#60A5FA" }].map(({ label, pct, color }) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem" }}>{label}</span>
              <span style={{ color, fontSize: "0.65rem", fontWeight: 700 }}>{pct}%</span>
            </div>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "9999px", overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={inView ? { width: `${pct}%` } : { width: 0 }} transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} style={{ height: "100%", background: color, borderRadius: "9999px" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Card D: India Map ───────────────────────────────────── */
function IndiaMap() {
  const installations = [
    { name: "Indore", x: 39, y: 52, highlight: true, count: "500+" },
    { name: "Mumbai", x: 30, y: 67, highlight: false, count: "180+" },
    { name: "Ahmedabad", x: 26, y: 48, highlight: false, count: "220+" },
    { name: "Delhi", x: 45, y: 27, highlight: false, count: "310+" },
    { name: "Pune", x: 34, y: 69, highlight: false, count: "140+" },
    { name: "Nagpur", x: 50, y: 58, highlight: false, count: "95+" },
    { name: "Jaipur", x: 40, y: 38, highlight: false, count: "170+" },
  ];
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 100 120" style={{ width: "100%", height: "100%", maxHeight: "220px" }}>
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(16,185,129,0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <path d="M46 7 L52 8 L60 12 L66 16 L70 24 L72 32 L70 38 L66 36 L62 40 L64 48 L62 56 L58 64 L54 72 L50 80 L48 76 L44 70 L40 64 L34 58 L28 52 L24 46 L22 40 L24 32 L26 26 L30 18 L36 12 Z" fill="url(#mapGlow)" stroke="rgba(16,185,129,0.35)" strokeWidth="0.8" />
        {installations.map(({ name, x, y, highlight }, idx) => (
          <g key={name}>
            {highlight && <circle cx={x} cy={y} r="8" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="0.8" style={{ animation: "pinRing 2.2s ease-out infinite" }} />}
            <circle cx={x} cy={y} r={highlight ? 2.8 : 1.8} fill={highlight ? "#10B981" : "rgba(245,158,11,0.82)"} style={{ animation: `pinPop ${1.8 + idx * 0.25}s ease-in-out infinite`, animationDelay: `${idx * 0.3}s` }} />
          </g>
        ))}
      </svg>
      <div style={{ position: "absolute", top: "38%", left: "34%", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: "8px", padding: "4px 8px", pointerEvents: "none" }}>
        <div style={{ color: "#10B981", fontSize: "0.62rem", fontWeight: 700 }}>Indore</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.55rem" }}>500+ installs</div>
      </div>
    </div>
  );
}

/* ─── Savings Calculator (inside Card B) ─────────────────── */
/*  Calculation table from reference sheet:
    kW  | Monthly Gen | Monthly Saving | Area | CO2 t/yr
    1   | 127 units   | ₹1,100         | 75   | 0.6
    2   | 255 units   | ₹2,200         | 150  | 1.3
    3   | 382 units   | ₹3,300         | 225  | 1.9
    5   | 637 units   | ₹5,500         | 375  | 3.2
    8   | 1020 units  | ₹8,800         | 600  | 5.1
    10  | 1275 units  | ₹11,000        | 750  | 6.4
    Rate: ₹9/unit | Cost: ₹50,000/kW | Subsidy: 40% | EMI: 36 months 0% */

const RATE_PER_UNIT = 9;
const UNITS_PER_KW_MO = 127.5;      // avg monthly generation per kW
const SIZING_FACTOR = 1.7;         // oversize factor (buffer + export)
const COST_PER_KW = 50000;
const SUBSIDY_PCT = 0.40;
const EMI_MONTHS = 36;

function calcSavings(bill: number) {
  const rawKw = (bill / RATE_PER_UNIT / UNITS_PER_KW_MO) * SIZING_FACTOR;
  const kw = Math.max(1, Math.min(10, Math.round(rawKw * 2) / 2));   // snap to 0.5kW, cap 10kW

  const systemCost = kw * COST_PER_KW;
  const subsidy = systemCost * SUBSIDY_PCT;
  const yourCost = systemCost - subsidy;
  const emi = Math.floor(yourCost / EMI_MONTHS / 100) * 100;   // round down ₹100

  // savings capped at bill (can't save more than you spend)
  const grossMonthly = kw * 1100;
  const effMonthly = Math.min(grossMonthly, bill);
  const annualSaving = effMonthly * 12;
  const savings25yr = effMonthly * 300 - yourCost;                     // 25yr net savings

  const breakEvenMo = yourCost / effMonthly;
  const breakEvenYr = breakEvenMo / 12;

  const co2 = parseFloat((kw * 0.64).toFixed(1));              // tons CO2/yr
  const trees = Math.round(kw * 19.3);                           // equivalent trees

  return { kw, systemCost, subsidy, yourCost, emi, effMonthly, annualSaving, savings25yr, breakEvenYr, co2, trees };
}

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n.toFixed(0)}`;
}

function SavingsCalc() {
  const [bill, setBill] = useState(3000);
  const r = calcSavings(bill);

  const pct = Math.min(100, Math.round((r.breakEvenYr / 10) * 100));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", flex: 1 }}>

      {/* Slider */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ color: "#fff", fontSize: "0.75rem", fontWeight: 600 }}>Monthly Electricity Bill</span>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: "1rem" }}>{fmt(bill)}</span>
        </div>
        <input
          type="range" min={1000} max={30000} step={500}
          value={bill}
          onChange={e => setBill(Number(e.target.value))}
          className="bento-slider"
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.62rem" }}>₹1,000</span>
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.62rem" }}>₹30,000</span>
        </div>
      </div>

      {/* System size badge */}
      <div style={{ textAlign: "center", background: "rgba(255,255,255,0.18)", borderRadius: "12px", padding: "12px 0", border: "1px solid rgba(255,255,255,0.25)" }}>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>Recommended System</div>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: "2rem", lineHeight: 1.2, marginTop: "2px" }}>
          {r.kw} <span style={{ fontSize: "1rem", fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>kWp</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.63rem", marginTop: "3px" }}>~{r.kw * 75} sq ft roof area needed</div>
      </div>

      {/* Cost breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {[
          { label: "System Cost", val: fmt(r.systemCost), sub: "before subsidy", color: "#fff" },
          { label: "Govt. Subsidy (40%)", val: fmt(r.subsidy), sub: "MNRE scheme", color: "#86efac" },
          { label: "Your Cost", val: fmt(r.yourCost), sub: "after subsidy", color: "#fff" },
          { label: `EMI (${EMI_MONTHS} mo, 0%)`, val: `${fmt(r.emi)}/mo`, sub: "zero interest", color: "#fde68a" },
        ].map(({ label, val, sub, color }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: "10px", padding: "10px", border: "1px solid rgba(255,255,255,0.2)" }}>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.6rem", marginBottom: "3px", fontWeight: 600 }}>{label}</div>
            <div style={{ color, fontWeight: 900, fontSize: "0.92rem", lineHeight: 1 }}>{val}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.58rem", marginTop: "3px" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Break-even bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
          <span style={{ color: "#fff", fontSize: "0.65rem", fontWeight: 600 }}>Break-even</span>
          <span style={{ color: "#fde68a", fontWeight: 900, fontSize: "0.78rem" }}>~{r.breakEvenYr.toFixed(1)} Years</span>
        </div>
        <div style={{ height: "5px", background: "rgba(255,255,255,0.1)", borderRadius: "9999px" }}>
          <motion.div
            key={pct}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", background: "linear-gradient(90deg,#10B981,#F59E0B)", borderRadius: "9999px" }}
          />
        </div>
      </div>

      {/* 25yr savings hero */}
      <div style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.65rem", marginBottom: "4px", fontWeight: 600 }}>💰 Savings Over 25 Years</div>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: "1.7rem", lineHeight: 1 }}>{fmt(Math.max(0, r.savings25yr))}</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.6rem", marginTop: "4px" }}>
          {fmt(r.effMonthly)}/mo off your bill
        </div>
      </div>

      {/* Eco row */}
      <div style={{ display: "flex", gap: "8px" }}>
        {[
          { icon: "🌿", val: `${r.co2} T`, label: "CO₂/year" },
          { icon: "🌳", val: `${r.trees}`, label: "Trees equiv." },
        ].map(({ icon, val, label }) => (
          <div key={label} style={{ flex: 1, background: "rgba(0,0,0,0.18)", borderRadius: "10px", padding: "8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.18)" }}>
            <div style={{ fontSize: "1.1rem" }}>{icon}</div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: "0.85rem" }}>{val}</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.58rem", fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── BentoDashboard ──────────────────────────────────────── */
const WA_NUMBER = "919111157797";

export default function BentoDashboard() {
  const solar = useLiveSolarStats();
  return (
    <section id="bento" style={{ background: "#050505", padding: "5rem 1.5rem 7rem", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", top: "-10%", right: "-5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.06), transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "48rem", margin: "0 auto 4rem", textAlign: "center" }}>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ color: "#10B981", fontSize: "0.7rem", fontFamily: "'Courier New',monospace", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "1rem" }}>
          ◉ &nbsp; Real-Time Intelligence
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} style={{ fontSize: "clamp(2rem,5vw,3.6rem)", fontWeight: 900, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          Your Energy,{" "}<span style={{ color: "#10B981" }}>Intelligently Managed.</span>
        </motion.h2>
      </div>

      <div className="bento-responsive" style={{ maxWidth: "72rem", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gridTemplateRows: "auto auto", gap: "0.9rem" }}>

        {/* Card A: Energy Wave */}
        <motion.div custom={0} variants={cardAnim} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="bento-card bento-a" style={{ gridColumn: "1 / 3", padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.2rem" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#10B981", fontSize: "0.65rem", fontWeight: 700, padding: "4px 10px", borderRadius: "9999px", marginBottom: "0.6rem" }}>
                <span style={{ width: "6px", height: "6px", background: "#10B981", borderRadius: "50%", animation: "pulse 2s infinite" }} />Live
              </div>
              <h3 style={{ color: "white", fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.02em" }}>Real-time Efficiency</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginTop: "2px" }}>Energy flow across all our system 5000+ homes</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#10B981", fontSize: "2rem", fontWeight: 900, lineHeight: 1 }}>67000+</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.65rem" }}>kWh today</div>
            </div>
          </div>
          <div style={{ height: "120px", borderRadius: "12px", overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
            <EnergyWaveCanvas />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.6rem", marginTop: "1rem" }}>
            {/* Stat 1 — Peak Today (day's maximum, always 2.1 kW) */}
            {[
              {
                label : "Peak Today",
                value : `${solar.peakToday.toFixed(1)} kW`,
                sub   : "day's maximum",
                color : "#10B981",
              },
              {
                label : "Current Output",
                value : solar.currentKw > 0
                          ? `${solar.currentKw} kW`
                          : "No Sun",
                sub   : (() => {
                  const now = new Date();
                  const istMs = now.getTime() + 5.5 * 3600 * 1000;
                  const ist   = new Date(istMs);
                  return `${ist.getUTCHours().toString().padStart(2,"0")}:${ist.getUTCMinutes().toString().padStart(2,"0")} IST`;
                })(),
                color : solar.currentKw > 0 ? "#F59E0B" : "rgba(255,255,255,0.3)",
              },
              {
                label : "Min. User Now",
                value : solar.minUserW > 0
                          ? `${solar.minUserW} W`
                          : "Offline",
                sub   : "single 1 kW home",
                color : "#60A5FA",
              },
            ].map(({ label, value, sub, color }) => (
              <div
                key={label}
                style={{
                  background   : "rgba(255,255,255,0.03)",
                  border       : "1px solid rgba(255,255,255,0.06)",
                  borderRadius : "10px",
                  padding      : "0.7rem",
                  textAlign    : "center",
                }}
              >
                <div style={{ color, fontWeight: 700, fontSize: "0.9rem" }}>{value}</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.6rem", marginTop: "2px" }}>{label}</div>
                <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.55rem", marginTop: "1px" }}>{sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Card B: See Your Savings Calculator ────────── */}
        <motion.div
          custom={1} variants={cardAnim} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="bento-card bento-b"
          style={{
            gridColumn: "3", gridRow: "1 / 3", padding: "1.6rem",
            background: "linear-gradient(160deg,#065f46 0%,#047857 40%,#059669 100%)",
            border: "1px solid rgba(16,185,129,0.35)",
            display: "flex", flexDirection: "column", gap: "0px",
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>☀️</div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>The Independence Kit</div>
                <h3 style={{ color: "white", fontWeight: 900, fontSize: "1.1rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}>See Your Savings</h3>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.73rem", lineHeight: 1.5 }}>
              Move the slider — we calculate your solar system &amp; savings using real data.
            </p>
          </div>

          {/* Calculator */}
          <SavingsCalc />

          {/* CTA */}
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi Solarhood! 👋 I'd like a free solar quote for my home. Please help me design my rooftop system.")}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              background: "white", color: "#047857",
              fontWeight: 800, fontSize: "0.88rem",
              padding: "13px", borderRadius: "12px",
              textDecoration: "none", marginTop: "14px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#25D366" }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Get My Free Quote
          </a>
        </motion.div>

        {/* Card C: ROI Tracker */}
        <motion.div custom={2} variants={cardAnim} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="bento-card bento-c" style={{ gridColumn: "1", gridRow: "2", padding: "1.8rem" }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", fontFamily: "'Courier New',monospace", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.2rem" }}>ROI Tracker</div>
          <ROICounter />
        </motion.div>

        {/* Card D: Local Impact */}
        <motion.div custom={3} variants={cardAnim} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="bento-card bento-d" style={{ gridColumn: "2", gridRow: "2", padding: "1.8rem" }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", fontFamily: "'Courier New',monospace", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.6rem" }}>Local Impact</div>
          <div style={{ color: "white", fontWeight: 800, fontSize: "1.1rem", marginBottom: "1rem", letterSpacing: "-0.02em" }}>
            5000+ Installations
            <span style={{ display: "inline-block", marginLeft: "0.5rem", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981", fontSize: "0.6rem", padding: "2px 8px", borderRadius: "9999px" }}>Indore</span>
          </div>
          <div style={{ height: "180px", position: "relative" }}>
            <IndiaMap />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
