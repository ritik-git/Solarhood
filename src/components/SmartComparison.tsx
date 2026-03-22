"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WA_NUMBER = "919111157797";
function waLink(brand: string, model: string, watt: string) {
  const msg = encodeURIComponent(
    `Hi Solarhood! 👋 I'm interested in *${brand} ${model} ${watt}W* solar panels.\nPlease share pricing & availability. 🌞`
  );
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

/* ── Realistic Solar Panel SVG ───────────────────────────── */
function SolarPanelImage({
  brandColor,
  type,
  watt,
}: {
  brandColor: string;
  type: string;
  watt: number;
}) {
  const isBifacial = type.toLowerCase().includes("bifacial");
  const isPoly     = type.toLowerCase().includes("poly");
  const isInverter = watt >= 1000;

  const panelBg    = isBifacial ? "#0d2240" : isPoly ? "#102030" : "#091628";
  const cellColor  = isBifacial ? "rgba(100,160,255,0.10)" : "rgba(80,130,220,0.09)";
  const cellBorder = isBifacial ? "rgba(130,190,255,0.18)" : "rgba(100,150,220,0.14)";

  if (isInverter) {
    return (
      <svg viewBox="0 0 280 160" style={{ width: "100%", display: "block" }}>
        <defs>
          <linearGradient id={`inv-bg-${watt}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
          <linearGradient id={`inv-shine-${watt}`} x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {/* Body */}
        <rect x="30" y="10" width="220" height="140" rx="12" fill={`url(#inv-bg-${watt})`} />
        <rect x="30" y="10" width="220" height="140" rx="12" fill={`url(#inv-shine-${watt})`} />
        <rect x="30" y="10" width="220" height="140" rx="12" fill="none" stroke={brandColor} strokeWidth="1.5" opacity="0.5" />
        {/* Display */}
        <rect x="55" y="30" width="170" height="60" rx="6" fill="rgba(0,0,0,0.5)" />
        <rect x="55" y="30" width="170" height="60" rx="6" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <text x="140" y="56" textAnchor="middle" fill={brandColor} fontSize="14" fontWeight="800" fontFamily="monospace">
          {watt >= 1000 ? `${watt / 1000}kW` : `${watt}W`}
        </text>
        <text x="140" y="74" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="monospace">
          SOLAR INVERTER
        </text>
        {/* Ports */}
        {[70, 110, 150, 190].map((x) => (
          <rect key={x} x={x} y="106" width="18" height="10" rx="2" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        ))}
        {/* LED */}
        <circle cx="230" cy="32" r="5" fill={brandColor} opacity="0.9" />
        <circle cx="230" cy="32" r="8" fill={brandColor} opacity="0.2" />
      </svg>
    );
  }

  /* Standard panel grid: 6 cols × 10 rows */
  const cols = 6, rows = 10;
  const padX = 14, padY = 14;
  const gW = 280 - padX * 2, gH = 160 - padY * 2;
  const cW = gW / cols, cH = gH / rows;
  const gap = 2;

  return (
    <svg viewBox="0 0 280 160" style={{ width: "100%", display: "block" }}>
      <defs>
        <linearGradient id={`bg-${watt}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={panelBg} />
          <stop offset="100%" stopColor="#040c1a" />
        </linearGradient>
        <linearGradient id={`shine-${watt}`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="45%" stopColor="rgba(255,255,255,0.03)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id={`frame-${watt}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c8cdd4" />
          <stop offset="100%" stopColor="#8a9099" />
        </linearGradient>
      </defs>

      {/* Frame */}
      <rect x="2" y="2" width="276" height="156" rx="6" fill={`url(#frame-${watt})`} />
      {/* Panel surface */}
      <rect x={padX - 2} y={padY - 2} width={gW + 4} height={gH + 4} rx="3" fill={`url(#bg-${watt})`} />

      {/* Cell grid */}
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={padX + c * cW + gap / 2}
            y={padY + r * cH + gap / 2}
            width={cW - gap}
            height={cH - gap}
            rx="1"
            fill={cellColor}
            stroke={cellBorder}
            strokeWidth="0.5"
          />
        ))
      )}

      {/* Busbar lines */}
      {Array.from({ length: cols }, (_, c) => (
        <line
          key={`bus-${c}`}
          x1={padX + c * cW + cW / 2}
          y1={padY}
          x2={padX + c * cW + cW / 2}
          y2={padY + gH}
          stroke="rgba(200,220,255,0.12)"
          strokeWidth="0.8"
        />
      ))}

      {/* Shine overlay */}
      <rect x={padX - 2} y={padY - 2} width={gW + 4} height={gH + 4} rx="3" fill={`url(#shine-${watt})`} />

      {/* Brand accent border */}
      <rect x="2" y="2" width="276" height="156" rx="6" fill="none" stroke={brandColor} strokeWidth="1" opacity="0.35" />

      {/* Junction box */}
      <rect x="122" y={padY + gH + 4} width="36" height="6" rx="2" fill="#555" />

      {/* Bifacial badge */}
      {isBifacial && (
        <g>
          <rect x="188" y="6" width="52" height="14" rx="4" fill={brandColor} opacity="0.9" />
          <text x="214" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="sans-serif">BIFACIAL</text>
        </g>
      )}
    </svg>
  );
}

/* ── Data ─────────────────────────────────────────────────── */
const BRAND_META: Record<string, { color: string; bg: string; light: string }> = {
  adani:   { color: "#0062A3", bg: "linear-gradient(135deg,#0062A3,#0082d4)", light: "#EFF6FF" },
  vikram:  { color: "#006837", bg: "linear-gradient(135deg,#006837,#00944e)", light: "#F0FDF4" },
  waaree:  { color: "#E85D04", bg: "linear-gradient(135deg,#E85D04,#f97316)", light: "#FFF7ED" },
  tata:    { color: "#1B3A7A", bg: "linear-gradient(135deg,#1B3A7A,#2c55b0)", light: "#EFF6FF" },
  sungrow: { color: "#FF6900", bg: "linear-gradient(135deg,#FF6900,#ff8c00)", light: "#FFF7ED" },
  solace:  { color: "#7C3AED", bg: "linear-gradient(135deg,#7C3AED,#9f67f5)", light: "#F5F3FF" },
};

const BRANDS = [
  { key: "all",     label: "All",     color: "#374151" },
  { key: "adani",   label: "Adani",   color: "#0062A3" },
  { key: "vikram",  label: "Vikram",  color: "#006837" },
  { key: "waaree",  label: "Waaree",  color: "#E85D04" },
  { key: "tata",    label: "Tata",    color: "#1B3A7A" },
  { key: "sungrow", label: "Sungrow", color: "#FF6900" },
  { key: "solace",  label: "Solace",  color: "#7C3AED" },
];

type Product = {
  id: string; brand: string; model: string; watt: number;
  type: string; efficiency: string; warranty: string;
  badge?: string; features: string[];
};

const PRODUCTS: Product[] = [
  { id:"a1", brand:"adani",   model:"BiHiKu6 Series",    watt:545,   type:"N-Type TOPCon Bifacial", efficiency:"21.1%", warranty:"30 yr", badge:"Best Seller", features:["Bifacial — both sides generate","30-yr linear guarantee","Salt & ammonia resistant"] },
  { id:"a2", brand:"adani",   model:"HiKu5 Mono PERC",   watt:440,   type:"Mono PERC",              efficiency:"20.3%", warranty:"25 yr", features:["PID resistant","Low light optimised","BIS & IEC certified"] },
  { id:"v1", brand:"vikram",  model:"Eldora Supreme",    watt:550,   type:"Mono PERC Half-Cut",     efficiency:"21.3%", warranty:"25 yr", badge:"Top Rated",   features:["Industry-leading efficiency","Shade tolerant","Anti-reflective coating"] },
  { id:"v2", brand:"vikram",  model:"SOMERA Pro",        watt:415,   type:"Mono PERC",              efficiency:"20.5%", warranty:"25 yr", features:["Export grade quality","5400 Pa frame tested","High current output"] },
  { id:"w1", brand:"waaree",  model:"Arka Bifacial",     watt:550,   type:"Bifacial PERC",          efficiency:"21.4%", warranty:"30 yr", badge:"India's #1",  features:["30% more energy rear-side","Glass-glass build","Made in India — Surat"] },
  { id:"w2", brand:"waaree",  model:"Meraki Mono",       watt:440,   type:"Mono PERC",              efficiency:"20.8%", warranty:"25 yr", features:["Most popular residential","0.55%/yr degradation","Fastest ROI"] },
  { id:"t1", brand:"tata",    model:"TP440MH48M",        watt:440,   type:"Mono PERC",              efficiency:"20.6%", warranty:"25 yr", badge:"Trusted",     features:["Tata Group quality","Anti-PID & anti-hotspot","All inverter compatible"] },
  { id:"t2", brand:"tata",    model:"TP335SH60",         watt:335,   type:"Mono PERC",              efficiency:"19.4%", warranty:"25 yr", features:["Ideal for small homes","Budget Tata quality","Widely serviced"] },
  { id:"s1", brand:"sungrow", model:"SH5.0RS Hybrid",   watt:5000,  type:"Hybrid Inverter",        efficiency:"98.4%", warranty:"10 yr", badge:"Battery-Ready",features:["App monitoring (iSolarCloud)","Zero export ready","Works with all brands"] },
  { id:"s2", brand:"sungrow", model:"SG10RS String",    watt:10000, type:"String Inverter",        efficiency:"98.4%", warranty:"10 yr", features:["WiFi + LAN built-in","IP65 outdoor rated","THD < 3%"] },
  { id:"sl1",brand:"solace",  model:"Alpha 440 Pro",    watt:440,   type:"Mono PERC",              efficiency:"20.5%", warranty:"25 yr", badge:"Value Pick",  features:["BIS & IEC certified","Strong after-sales","Cost-effective"] },
  { id:"sl2",brand:"solace",  model:"Gamma 335 Poly",   watt:335,   type:"Polycrystalline",        efficiency:"18.5%", warranty:"25 yr", features:["Most affordable option","Works in diffuse light","Easy maintenance"] },
];

/* ── WhatsApp Icon ─────────────────────────────────────────── */
function WAIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

/* ── Product Card ─────────────────────────────────────────── */
function ProductCard({ p }: { p: Product }) {
  const meta = BRAND_META[p.brand];
  const brandLabel = p.brand.charAt(0).toUpperCase() + p.brand.slice(1);
  const isInverter = p.watt >= 1000;
  const wattLabel  = isInverter ? (p.watt >= 1000 ? `${p.watt / 1000}kW` : `${p.watt}W`) : `${p.watt}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.28 }}
      style={{
        flex: "0 0 260px",
        width: "260px",
        background: "#fff",
        borderRadius: "20px",
        border: "1px solid #E5E7EB",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        scrollSnapAlign: "start",
        position: "relative",
      }}
    >
      {/* Badge */}
      {p.badge && (
        <div style={{
          position: "absolute", top: "10px", left: "10px", zIndex: 2,
          background: meta.color, color: "#fff",
          fontSize: "0.58rem", fontWeight: 800,
          padding: "3px 9px", borderRadius: "999px",
          letterSpacing: "0.07em", textTransform: "uppercase",
        }}>
          ⭐ {p.badge}
        </div>
      )}

      {/* Panel image */}
      <div style={{
        background: `linear-gradient(160deg, #0a0f1e 0%, #0d1930 100%)`,
        padding: "16px 14px 8px",
        position: "relative",
      }}>
        {/* Brand band at very top */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "3px", background: meta.bg,
        }} />
        <SolarPanelImage brandColor={meta.color} type={p.type} watt={p.watt} />
      </div>

      {/* Content */}
      <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Brand + model */}
        <div>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, color: meta.color, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {brandLabel} Solar
          </div>
          <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111827", lineHeight: 1.25, marginTop: "2px" }}>
            {p.model}
          </div>
        </div>

        {/* Wattage + type */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ fontWeight: 900, fontSize: "1.6rem", color: "#111827", lineHeight: 1 }}>
            {wattLabel}
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#9CA3AF", marginLeft: "2px" }}>
              {isInverter ? "" : "Wp"}
            </span>
          </div>
          <div style={{
            background: meta.light, color: meta.color,
            border: `1px solid ${meta.color}30`,
            fontSize: "0.58rem", fontWeight: 700,
            padding: "3px 8px", borderRadius: "999px",
            whiteSpace: "nowrap", flexShrink: 0,
          }}>
            {p.type}
          </div>
        </div>

        {/* Key specs row */}
        <div style={{ display: "flex", gap: "6px" }}>
          {[
            { label: "Efficiency", val: p.efficiency },
            { label: "Warranty",   val: p.warranty   },
          ].map(({ label, val }) => (
            <div key={label} style={{
              flex: 1, background: "#F9FAFB",
              border: "1px solid #F3F4F6",
              borderRadius: "10px", padding: "7px 6px", textAlign: "center",
            }}>
              <div style={{ fontWeight: 800, fontSize: "0.78rem", color: meta.color }}>{val}</div>
              <div style={{ fontSize: "0.58rem", color: "#9CA3AF", marginTop: "1px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {p.features.map((f) => (
            <li key={f} style={{ display: "flex", gap: "6px", fontSize: "0.73rem", color: "#4B5563", lineHeight: 1.4 }}>
              <span style={{ color: meta.color, fontWeight: 900, flexShrink: 0 }}>✓</span>
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href={waLink(brandLabel, p.model, wattLabel)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "7px", background: "linear-gradient(135deg,#22C55E,#16A34A)",
            color: "#fff", fontWeight: 800, fontSize: "0.82rem",
            padding: "11px 0", borderRadius: "12px",
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(34,197,94,0.3)",
            marginTop: "auto",
          }}
        >
          <WAIcon /> Buy Now on WhatsApp
        </a>
      </div>
    </motion.div>
  );
}

/* ── Main ─────────────────────────────────────────────────── */
export default function SmartComparison() {
  const [activeBrand, setActiveBrand] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = activeBrand === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.brand === activeBrand);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 560 : -560, behavior: "smooth" });
  };

  return (
    <section className="py-24 bg-gray-50" id="products" style={{ position: "relative", overflow: "hidden" }}>
      {/* Dot pattern */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(rgba(0,0,0,.05) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{ textAlign: "center", marginBottom: "2rem" }}
        >
          <span style={{
            display: "inline-block", fontSize: "0.68rem", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.1em",
            color: "#16A34A", background: "#F0FDF4",
            border: "1px solid #BBF7D0", padding: "5px 16px",
            borderRadius: "9999px", marginBottom: "0.9rem",
          }}>
            Our Product Range
          </span>
          <h2 style={{ fontSize: "clamp(1.8rem,4.5vw,3rem)", fontWeight: 900, color: "#111827", letterSpacing: "-0.03em", marginBottom: "0.7rem" }}>
            Find Your Perfect Panel
          </h2>
          <p style={{ color: "#6B7280", fontSize: "1rem", maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>
            Top brands, real specs. Tap <strong style={{ color: "#111" }}>Buy Now</strong> to connect on WhatsApp instantly.
          </p>
        </motion.div>

        {/* Brand filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "2rem" }}
        >
          {BRANDS.map((b) => {
            const active = activeBrand === b.key;
            return (
              <button
                key={b.key}
                onClick={() => setActiveBrand(b.key)}
                style={{
                  padding: "7px 18px", borderRadius: "999px",
                  border: `2px solid ${active ? b.color : "#E5E7EB"}`,
                  background: active ? b.color : "#fff",
                  color: active ? "#fff" : "#374151",
                  fontWeight: 700, fontSize: "0.78rem",
                  cursor: "pointer", transition: "all 0.2s",
                  boxShadow: active ? `0 4px 14px ${b.color}40` : "none",
                }}
              >
                {b.label}
              </button>
            );
          })}
        </motion.div>

        {/* Scroll container + arrows */}
        <div style={{ position: "relative" }}>
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            style={{
              position: "absolute", left: "-18px", top: "50%", transform: "translateY(-50%)",
              zIndex: 10, width: "40px", height: "40px", borderRadius: "50%",
              background: "#fff", border: "1px solid #E5E7EB",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#374151", fontSize: "1.1rem", transition: "box-shadow 0.2s",
            }}
          >
            ‹
          </button>

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            style={{
              display: "flex", gap: "16px",
              overflowX: "auto", scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              paddingBottom: "12px",
              paddingLeft: "4px", paddingRight: "4px",
            }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </AnimatePresence>
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            style={{
              position: "absolute", right: "-18px", top: "50%", transform: "translateY(-50%)",
              zIndex: 10, width: "40px", height: "40px", borderRadius: "50%",
              background: "#fff", border: "1px solid #E5E7EB",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#374151", fontSize: "1.1rem", transition: "box-shadow 0.2s",
            }}
          >
            ›
          </button>
        </div>

        {/* Count hint */}
        <div style={{ textAlign: "center", marginTop: "1.2rem", color: "#9CA3AF", fontSize: "0.75rem" }}>
          {filtered.length} product{filtered.length !== 1 ? "s" : ""} · scroll to explore →
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
          style={{
            marginTop: "2.5rem",
            background: "linear-gradient(135deg,#111827,#1F2937)",
            borderRadius: "22px",
            padding: "clamp(1.25rem,3.5vw,2rem) clamp(1.25rem,4vw,2.5rem)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "1.2rem",
          }}
        >
          <div>
            <div style={{ color: "#9CA3AF", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
              Not sure which panel suits your roof?
            </div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(1rem,2.2vw,1.35rem)" }}>
              Get a <span style={{ color: "#22C55E" }}>free expert consultation</span> on WhatsApp
            </div>
          </div>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi Solarhood! 👋 I'd like a free consultation to find the right solar panel for my roof.")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "linear-gradient(135deg,#22C55E,#16A34A)",
              color: "#fff", fontWeight: 800, fontSize: "0.9rem",
              padding: "12px 24px", borderRadius: "12px",
              textDecoration: "none",
              boxShadow: "0 4px 18px rgba(34,197,94,0.38)",
              whiteSpace: "nowrap",
            }}
          >
            <WAIcon /> Chat with an Expert
          </a>
        </motion.div>
      </div>
    </section>
  );
}
