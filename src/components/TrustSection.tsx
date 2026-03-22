"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const comparisonRows = [
  { feature: "Panel Warranty", solarhood: "25-Year Performance Warranty", local: "Varies (often none)" },
  { feature: "Installation Warranty", solarhood: "5-Year Workmanship Guarantee", local: "No written guarantee" },
  { feature: "Power Output Guarantee", solarhood: "Linear degradation ≤ 0.5%/yr", local: "Not specified" },
  { feature: "Brand Options", solarhood: "6+ top certified brands", local: "1–2 options, often unbranded" },
  { feature: "Subsidy Assistance", solarhood: "End-to-end handled by us", local: "DIY — you figure it out" },
  { feature: "Net Metering", solarhood: "Solarhood files your application", local: "Your responsibility" },
  { feature: "App Monitoring", solarhood: "Real-time 24/7 dashboard", local: "Usually not included" },
  { feature: "Post-Install Support", solarhood: "Dedicated support team", local: "Hard to reach after payment" },
];

const testimonials = [
  {
    name: "Priya Mehta", city: "Mumbai", initials: "PM", rating: 5,
    text: "Solarhood made the entire process so smooth. From choosing Waaree panels to net metering approval—they handled everything. Saving ₹6,200 every month now!",
    color: "bg-green-500",
  },
  {
    name: "Rajesh Kumar", city: "Pune", initials: "RK", rating: 5,
    text: "I compared 4 quotes from local dealers and Solarhood. Night and day difference—their transparency and the 5-year installation warranty sold me immediately.",
    color: "bg-blue-500",
  },
  {
    name: "Ananya Sharma", city: "Bangalore", initials: "AS", rating: 5,
    text: "The app monitoring is incredible. I can see exactly how much power I'm generating and what I'm earning through grid export. Worth every rupee.",
    color: "bg-purple-500",
  },
];

export default function TrustSection() {
  return (
    <section className="py-24 bg-gray-50" id="trust">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-green-600 uppercase tracking-widest mb-3 bg-green-50 border border-green-200 px-4 py-1.5 rounded-full">
            Transparency & Trust
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mt-4 mb-5">
            The Anti-Sales Approach
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            We believe in full transparency. See exactly why Solarhood is different from a local contractor.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl border border-gray-200 overflow-hidden mb-20 shadow-sm"
        >
          {/* Table header */}
          <div className="grid grid-cols-3 gap-0 bg-gray-50 border-b border-gray-200">
            <div className="p-5 text-gray-400 text-sm font-semibold">Feature</div>
            <div className="p-5 border-l border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-green-500 flex items-center justify-center">
                  <span className="text-white text-[10px] font-black">S</span>
                </div>
                <span className="text-green-600 font-bold text-sm">Solarhood</span>
              </div>
            </div>
            <div className="p-5 border-l border-gray-100">
              <span className="text-gray-400 font-semibold text-sm">Local Contractor</span>
            </div>
          </div>

          {comparisonRows.map((row, i) => (
            <motion.div
              key={row.feature}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`grid grid-cols-3 border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
            >
              <div className="p-4 md:p-5 text-gray-600 text-xs md:text-sm font-medium flex items-center">{row.feature}</div>
              <div className="p-4 md:p-5 border-l border-gray-100 flex items-center gap-2">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <Check size={11} className="text-green-600" />
                </div>
                <span className="text-gray-700 text-xs md:text-sm">{row.solarhood}</span>
              </div>
              <div className="p-4 md:p-5 border-l border-gray-100 flex items-center gap-2">
                <div className="flex-shrink-0 w-5 h-5 bg-red-50 rounded-full flex items-center justify-center">
                  <X size={11} className="text-red-400" />
                </div>
                <span className="text-gray-400 text-xs md:text-sm">{row.local}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl lg:text-3xl font-black text-gray-900">What Our Customers Say</h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-white rounded-3xl p-7 border border-gray-200 shadow-sm card-hover"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <span key={si} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-gray-900 font-semibold text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.city}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-3xl overflow-hidden bg-gray-900"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/15 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-green-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
          </div>
          <div className="relative px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-green-400 text-sm font-semibold mb-2 uppercase tracking-wider">Ready to Go Solar?</div>
              <h3 className="text-3xl font-black text-white mb-2">Get Your Free Quote in 60 Seconds</h3>
              <p className="text-gray-400">No commitment. No spam. Just clear numbers.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all duration-300 shadow-xl shadow-green-500/30"
              >
                Calculate My Savings
              </a>
              <a
                href="tel:+918001234567"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-semibold px-8 py-4 rounded-2xl text-sm transition-all duration-300"
              >
                📞 Talk to an Expert
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
