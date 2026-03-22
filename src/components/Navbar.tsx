"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import Image from "next/image";

const links = [
  { label: "Compare Brands",     href: "#brands"     },
  { label: "Savings Calculator", href: "#calculator"  },
  { label: "How It Works",       href: "#workflow"    },
  { label: "Why Solarhood",      href: "#trust"       },
];

const PHONE   = "91111-57797";
const PHONE_HREF = "tel:9111157797";

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/92 backdrop-blur-xl border-b border-gray-200/80 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* ── Logo ──────────────────────────────────── */}
        <a href="#" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Solarhood – My Solar • My Savings"
            width={160}
            height={52}
            priority
            className="h-11 w-auto object-contain"
          />
        </a>

        {/* ── Desktop nav links ─────────────────────── */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* ── Desktop CTA ───────────────────────────── */}
        <div className="hidden md:flex items-center gap-3">
          {/* Phone number — replaces Sign In */}
          <a
            href={PHONE_HREF}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors"
          >
            <Phone size={14} className="text-green-500" />
            {PHONE}
          </a>
          <a
            href="#calculator"
            className="text-sm font-semibold bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-green-500/25 hover:shadow-green-600/30"
          >
            Get Free Quote
          </a>
        </div>

        {/* ── Mobile hamburger ─────────────────────── */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ── Mobile menu ──────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-lg"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
              {/* Phone in mobile menu */}
              <a
                href={PHONE_HREF}
                className="flex items-center gap-2 text-sm font-semibold text-green-600"
              >
                <Phone size={14} />
                Call us: {PHONE}
              </a>
              <a
                href="#calculator"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold bg-green-500 text-white px-5 py-2.5 rounded-xl text-center"
              >
                Get Free Quote
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
