"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const WA_NUMBER = "9111157797"; // no + or spaces
const WA_MESSAGE = encodeURIComponent(
  "Hi Solarhood! I'm interested in solar panel installation for my rooftop. Please share more details."
);
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.8rem",
        right: "1.8rem",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        flexDirection: "row-reverse",
      }}
    >
      {/* Tooltip label */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 12, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            style={{
              background: "#25D366",
              color: "white",
              fontWeight: 700,
              fontSize: "0.82rem",
              padding: "0.5rem 1rem",
              borderRadius: "9999px",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
              pointerEvents: "none",
            }}
          >
            Chat with us on WhatsApp
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.94 }}
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(37,211,102,0.55)",
            "0 0 0 14px rgba(37,211,102,0)",
            "0 0 0 0 rgba(37,211,102,0)",
          ],
        }}
        transition={{
          boxShadow: { duration: 2.2, repeat: Infinity, ease: "easeOut" },
          scale: { type: "spring", stiffness: 300, damping: 18 },
        }}
        style={{
          width: "62px",
          height: "62px",
          borderRadius: "50%",
          background: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        {/* WhatsApp SVG icon */}
        <svg
          viewBox="0 0 32 32"
          fill="white"
          width="34"
          height="34"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.64 4.64 1.84 6.64L2.667 29.333l6.88-1.813A13.267 13.267 0 0016.004 29.333c7.36 0 13.333-5.973 13.333-13.333 0-7.36-5.973-13.333-13.333-13.333zm0 24c-2.12 0-4.173-.573-5.96-1.653l-.427-.253-4.08 1.08 1.08-4-.28-.44A10.64 10.64 0 015.334 16c0-5.893 4.773-10.667 10.667-10.667S26.667 10.107 26.667 16 21.893 26.667 16 26.667zm5.827-7.96c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.347-.493-2.56-1.573-.947-.84-1.587-1.88-1.773-2.2-.187-.32-.02-.493.14-.653.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.26-.627-.52-.54-.72-.547h-.613c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.253 3.44 5.467 4.827.76.333 1.36.533 1.827.68.76.24 1.453.213 2 .133.613-.093 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z" />
        </svg>
      </motion.a>
    </div>
  );
}
