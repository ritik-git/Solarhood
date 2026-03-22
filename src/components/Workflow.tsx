"use client";

import { motion } from "framer-motion";
import { Search, ClipboardCheck, Wrench, LifeBuoy } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Digital Discovery",
    subtitle: "Compare & Estimate",
    description:
      "Explore 10+ solar brands side-by-side and get an AI-driven savings estimate based on your electricity bill, roof area, and location—all in under 60 seconds.",
    detail: "No salespeople. No pressure. Just data.",
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    border: "border-green-200",
    tagColor: "text-green-700 bg-green-50 border-green-200",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "Expert Site Audit",
    subtitle: "Free Home Visit",
    description:
      "Our MNRE-certified engineers visit your home for a detailed technical feasibility assessment—roof strength, shading analysis, and optimal panel layout planning.",
    detail: "Completed within 48 hours of booking.",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    border: "border-blue-200",
    tagColor: "text-blue-700 bg-blue-50 border-blue-200",
  },
  {
    number: "03",
    icon: Wrench,
    title: "Seamless Installation",
    subtitle: "In Just 48 Hours",
    description:
      "Certified Solarhood technicians install your chosen system with precision. We handle all structural work, wiring, inverter setup, and commissioning.",
    detail: "Zero impact on your daily routine.",
    iconColor: "text-yellow-600",
    iconBg: "bg-yellow-50",
    border: "border-yellow-200",
    tagColor: "text-yellow-700 bg-yellow-50 border-yellow-200",
  },
  {
    number: "04",
    icon: LifeBuoy,
    title: "Lifetime Support",
    subtitle: "We've Got You Covered",
    description:
      "From subsidy applications and net-metering approvals to annual maintenance and app-based performance monitoring—we're your solar partner for life.",
    detail: "Dedicated support, always one call away.",
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    border: "border-purple-200",
    tagColor: "text-purple-700 bg-purple-50 border-purple-200",
  },
];

export default function Workflow() {
  return (
    <section className="relative py-24 bg-white" id="workflow">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full">
            White-Glove Service
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mt-4 mb-5">
            From Quote to Kilowatts
            <br />
            <span className="gradient-text">in 4 Simple Steps</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            We&apos;ve streamlined the entire solar journey so you can go green with zero hassle.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical accent line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-100 hidden md:block" />
          <div
            className="absolute left-8 top-0 bottom-0 w-px hidden md:block"
            style={{ background: "linear-gradient(to bottom, #22C55E, #3B82F6, #EAB308, #A855F7)" }}
          />

          <div className="space-y-5">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="relative md:pl-24 group"
                >
                  {/* Node dot */}
                  <div className={`absolute left-[26px] top-8 w-5 h-5 rounded-full border-2 border-current ${step.iconColor} bg-white hidden md:flex items-center justify-center z-10`}>
                    <div className={`w-1.5 h-1.5 rounded-full bg-current ${step.iconColor}`} />
                  </div>

                  <div className={`bg-white rounded-3xl border ${step.border} p-7 shadow-sm transition-all duration-300 group-hover:shadow-md`}>
                    <div className="flex items-start gap-5">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-2xl ${step.iconBg} border ${step.border} flex items-center justify-center`}>
                        <Icon size={24} className={step.iconColor} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-gray-300 font-black text-xs">{step.number}</span>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${step.tagColor}`}>{step.subtitle}</span>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-3">{step.description}</p>
                        <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${step.tagColor}`}>
                          <span className="w-1 h-1 rounded-full bg-current" />
                          {step.detail}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <a
            href="#calculator"
            className="inline-flex items-center gap-3 bg-gray-900 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all duration-300 shadow-xl hover:-translate-y-0.5"
          >
            Start Your Solar Journey Today
            <span className="text-lg">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
