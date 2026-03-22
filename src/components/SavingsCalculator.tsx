"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { IndianRupee, Leaf, Sun, Zap } from "lucide-react";

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad",
  "Pune", "Ahmedabad", "Jaipur", "Kolkata", "Surat",
];

const SAVINGS_PER_KWP = 18000;
const KWP_PER_1000_SQFT = 1;
const BILL_TO_KWP = 0.005;

export default function SavingsCalculator() {
  const [bill, setBill] = useState(5000);
  const [area, setArea] = useState(800);
  const [city, setCity] = useState("Mumbai");

  const results = useMemo(() => {
    const kWpFromBill = bill * BILL_TO_KWP;
    const kWpFromArea = (area / 1000) * KWP_PER_1000_SQFT * 3;
    const systemSize = Math.min(kWpFromBill, kWpFromArea, 10);
    const yearlySavings = Math.round(systemSize * SAVINGS_PER_KWP);
    const trees = Math.round(systemSize * 25);
    const co2 = (systemSize * 1.5).toFixed(1);
    let brand1 = "Waaree";
    let brand2 = "Loom Solar";
    if (bill > 8000) { brand1 = "Adani Solar"; brand2 = "Waaree"; }
    if (bill > 15000) { brand1 = "Tata Power Solar"; brand2 = "Vikram Solar"; }
    return { yearlySavings, trees, co2, brand1, brand2, systemSize: systemSize.toFixed(1) };
  }, [bill, area]);

  const billPct = ((bill - 1000) / 29000) * 100;
  const areaPct = ((area - 200) / 4800) * 100;

  return (
    <section className="py-24 bg-gray-50" id="calculator">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold text-yellow-700 uppercase tracking-widest mb-3 bg-yellow-50 border border-yellow-200 px-4 py-1.5 rounded-full">
            Solar Savings Engine
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mt-4 mb-5">
            How Much Can You Save?
          </h2>
          <p className="text-gray-500 text-lg">
            Get an instant estimate based on your electricity usage and roof.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm"
          >
            <h3 className="text-gray-900 font-bold text-lg mb-8">Tell us about your home</h3>

            {/* Monthly Bill Slider */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="text-gray-600 text-sm font-medium flex items-center gap-2">
                  <IndianRupee size={14} className="text-green-500" />
                  Monthly Electricity Bill
                </label>
                <span className="text-green-600 font-bold text-lg">₹{bill.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={30000}
                step={500}
                value={bill}
                onChange={(e) => setBill(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #22C55E ${billPct}%, #E5E7EB ${billPct}%)`,
                }}
                className="w-full"
              />
              <div className="flex justify-between text-gray-400 text-xs mt-1.5">
                <span>₹1,000</span><span>₹30,000</span>
              </div>
            </div>

            {/* Roof Area Slider */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="text-gray-600 text-sm font-medium flex items-center gap-2">
                  <Sun size={14} className="text-yellow-500" />
                  Roof Area Available
                </label>
                <span className="text-yellow-600 font-bold text-lg">{area} sq.ft</span>
              </div>
              <input
                type="range"
                min={200}
                max={5000}
                step={100}
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #FACC15 ${areaPct}%, #E5E7EB ${areaPct}%)`,
                }}
                className="w-full"
              />
              <div className="flex justify-between text-gray-400 text-xs mt-1.5">
                <span>200 sq.ft</span><span>5,000 sq.ft</span>
              </div>
            </div>

            {/* City Select */}
            <div>
              <label className="text-gray-600 text-sm font-medium flex items-center gap-2 mb-3">
                <Zap size={14} className="text-blue-500" />
                Your City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all appearance-none cursor-pointer"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            {/* System Size */}
            <div className="bg-white rounded-2xl px-6 py-4 border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Recommended System</p>
                <p className="text-gray-900 font-bold text-2xl mt-0.5">{results.systemSize} kWp</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center border border-yellow-100">
                <Sun size={22} className="text-yellow-500" />
              </div>
            </div>

            {/* Yearly Savings hero card */}
            <motion.div
              key={results.yearlySavings}
              initial={{ scale: 0.97, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-3xl overflow-hidden border border-green-200 shadow-xl shadow-green-500/10"
              style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-green-300/20 rounded-full -translate-y-1/4 translate-x-1/4 blur-2xl" />
              <div className="relative p-8">
                <p className="text-green-600 text-sm font-medium mb-1">Estimated Annual Savings</p>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-6xl font-black text-gray-900">
                    ₹{results.yearlySavings.toLocaleString()}
                  </span>
                  <span className="text-green-600 text-sm font-medium mb-3">/year</span>
                </div>
                <p className="text-gray-500 text-sm">
                  That&apos;s ₹{Math.round(results.yearlySavings / 12).toLocaleString()} off your monthly bill in {city}
                </p>
              </div>
            </motion.div>

            {/* Impact & Brand row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <Leaf size={18} className="text-green-500 mb-2" />
                <p className="text-gray-900 font-bold text-2xl">{results.trees}</p>
                <p className="text-gray-400 text-xs mt-0.5">Trees planted equivalent</p>
                <p className="text-gray-300 text-xs">{results.co2} tonnes CO₂/year</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <Zap size={18} className="text-yellow-500 mb-2" />
                <p className="text-gray-700 font-bold text-sm leading-snug">Best fit for you:</p>
                <p className="text-green-600 font-bold text-sm mt-1">{results.brand1}</p>
                <p className="text-gray-400 text-xs">or {results.brand2}</p>
              </div>
            </div>

            <a
              href="#workflow"
              className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-600/30 hover:-translate-y-0.5 text-sm"
            >
              Book a Free Site Visit →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
