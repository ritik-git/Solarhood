"use client";

import { motion, type Variants } from "framer-motion";
import { Zap, TrendingUp, Shield } from "lucide-react";

const stats = [
  { icon: Zap, value: "10,000+", label: "Installations Done" },
  { icon: TrendingUp, value: "₹2.4Cr+", label: "Customer Savings" },
  { icon: Shield, value: "25 Yr", label: "Performance Warranty" },
];

const floatingCard: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen hero-gradient flex items-center overflow-hidden" id="hero">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-green-200/40 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-yellow-200/30 blur-[80px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-green-100 border border-green-200 text-green-700 text-xs font-semibold px-4 py-2 rounded-full mb-6"
          >
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            India&apos;s #1 Solar Marketplace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6"
          >
            Your Roof,
            <br />
            <span className="gradient-text">Your Choice,</span>
            <br />
            Our Expertise.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg text-gray-500 leading-relaxed mb-10 max-w-lg"
          >
            Compare top-tier solar brands like{" "}
            <span className="text-gray-800 font-semibold">Waaree, Adani,</span> and{" "}
            <span className="text-gray-800 font-semibold">Tata</span>. We handle the selection,
            financing, and certified installation—so you just enjoy the savings.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap gap-4"
            id="hero-cta"
          >
            <a
              href="#calculator"
              className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all duration-300 shadow-xl shadow-green-500/30 hover:shadow-green-600/40 hover:-translate-y-0.5"
            >
              <Zap size={18} />
              Get an Instant Quote
            </a>
            <a
              href="#brands"
              className="inline-flex items-center gap-2 border-2 border-gray-200 hover:border-green-400 text-gray-700 hover:text-green-600 font-semibold px-8 py-4 rounded-2xl text-base transition-all duration-300 hover:-translate-y-0.5 bg-white/70"
            >
              Compare Brands
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-8 mt-12 pt-10 border-t border-gray-200"
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
                  <Icon size={16} className="text-green-500" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-400">{label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Dashboard UI Card */}
        <motion.div
          variants={floatingCard}
          initial="hidden"
          animate="visible"
          className="hidden lg:block relative"
        >
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute -inset-4 bg-green-500/8 rounded-3xl blur-2xl" />

            <div className="relative bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-800">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Live Energy</p>
                  <p className="text-white text-lg font-bold mt-0.5">Your Solar Dashboard</p>
                </div>
                <div className="flex items-center gap-1.5 bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Live
                </div>
              </div>

              {/* Main metric */}
              <div className="text-center py-6 mb-6 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-6xl font-black text-white mb-1">7.4</div>
                <div className="text-green-400 font-semibold text-sm">kWh Generated Today</div>
                <div className="text-gray-500 text-xs mt-1">↑ 12% vs yesterday</div>
              </div>

              {/* Mini chart */}
              <div className="flex items-end gap-1.5 h-16 mb-4">
                {[40, 65, 55, 80, 70, 90, 75, 85, 60, 95, 82, 88].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.8 + i * 0.04, duration: 0.4 }}
                    className="flex-1 rounded-t-sm origin-bottom"
                    style={{
                      height: `${h}%`,
                      background: i === 10 ? "#22C55E" : "rgba(255,255,255,0.1)",
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-gray-500 text-xs">
                <span>6AM</span><span>12PM</span><span>6PM</span>
              </div>

              {/* Bottom stats */}
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  { label: "Savings", value: "₹3,240", color: "text-green-400" },
                  { label: "CO₂ Offset", value: "2.1 kg", color: "text-blue-400" },
                  { label: "Grid Export", value: "1.8 kWh", color: "text-yellow-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                    <div className={`text-sm font-bold ${color}`}>{value}</div>
                    <div className="text-gray-500 text-[10px] mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl px-4 py-3 shadow-xl border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">☀️</span>
                </div>
                <div>
                  <div className="text-gray-900 text-sm font-bold">Waaree 545W</div>
                  <div className="text-gray-400 text-xs">Recommended for you</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
