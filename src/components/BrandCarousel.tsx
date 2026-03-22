"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

/* ── Brand list with cascading logo fallbacks ─────────────────────────────
   Priority: Clearbit CDN  →  Wikipedia / official CDN  →  Styled text card
   ───────────────────────────────────────────────────────────────────────── */
/* ── Local images (public/) take priority — always loads, no CDN dependency ── */
const brands = [
  {
    name: "Waaree",
    logos: ["/waaree.png", "https://logo.clearbit.com/waaree.com"],
    color: "#006838",
  },
  {
    name: "Premier Solar",
    logos: ["/premier-solar.jpg", "https://logo.clearbit.com/premiersolar.com"],
    color: "#003087",
  },
  {
    name: "Adani Solar",
    logos: ["/adani-solar.png", "https://logo.clearbit.com/adani.com"],
    color: "#003082",
  },
  {
    name: "Tata Power Solar",
    logos: [
      "https://logo.clearbit.com/tatapower.com",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/320px-Tata_logo.svg.png",
    ],
    color: "#004990",
  },
  {
    name: "Goldi Solar",
    logos: ["/goldi-solar.jpg", "https://logo.clearbit.com/goldisolar.com"],
    color: "#e8a000",
  },
  {
    name: "Vikram Solar",
    logos: ["/vikram-solar.png", "https://logo.clearbit.com/vikramsolar.com"],
    color: "#c0392b",
  },
  {
    name: "Sungrow",
    logos: ["/sungrow.svg", "https://logo.clearbit.com/sungrowpower.com"],
    color: "#1e8bc3",
  },
  {
    name: "Solis",
    logos: ["/solis.webp", "https://logo.clearbit.com/solisinverters.com"],
    color: "#e63946",
  },
  {
    name: "SolarEdge",
    logos: [
      "https://logo.clearbit.com/solaredge.com",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/SolarEdge_logo.svg/320px-SolarEdge_logo.svg.png",
    ],
    color: "#d62828",
  },
  {
    name: "Sineng",
    logos: ["/sineng.png", "https://logo.clearbit.com/si-neng.com"],
    color: "#1a6eb5",
  },
  {
    name: "APL Apollo",
    logos: ["/apl-apollo.png", "https://logo.clearbit.com/aplapollo.com"],
    color: "#c0392b",
  },
];

const allBrands = [...brands, ...brands];

/* ── BrandLogo: cascades through logo URLs before showing styled text ──── */
function BrandLogo({ brand }: { brand: (typeof brands)[0] }) {
  const [srcIdx, setSrcIdx] = useState(0);
  const allFailed = srcIdx >= brand.logos.length;

  const handleError = () => setSrcIdx((i) => i + 1);

  return (
    <div className="flex-shrink-0 mx-4 group">
      <div
        className="flex items-center justify-center bg-white hover:bg-green-50
                   border border-gray-200 hover:border-green-300 rounded-2xl
                   px-6 py-4 transition-all duration-300 cursor-pointer
                   shadow-sm hover:shadow-md w-36 h-20"
      >
        {!allFailed ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={srcIdx}
            src={brand.logos[srcIdx]}
            alt={brand.name}
            width={96}
            height={48}
            className="object-contain max-h-12 w-auto grayscale group-hover:grayscale-0 transition-all duration-300"
            onError={handleError}
            loading="lazy"
          />
        ) : (
          /* Styled brand-name pill — always looks clean */
          <div className="flex flex-col items-center justify-center gap-0.5">
            <span
              className="text-center leading-tight font-black text-xs uppercase tracking-tight transition-colors duration-300"
              style={{ color: brand.color }}
            >
              {brand.name}
            </span>
            <div
              className="h-[2px] w-8 rounded-full mt-0.5 transition-all duration-300 group-hover:w-12"
              style={{ background: brand.color }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrandCarousel() {
  return (
    <section
      className="bg-gray-50 py-20 overflow-hidden border-y border-gray-100"
      id="brands"
    >
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Authorized Installation Partner For
          </p>
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
            India&apos;s Leading Solar Manufacturers
          </h2>
        </motion.div>
      </div>

      {/* Scrolling carousel with fade masks */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee w-max">
          {allBrands.map((brand, i) => (
            <BrandLogo key={`${brand.name}-${i}`} brand={brand} />
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-7xl mx-auto px-6 mt-12 flex flex-wrap justify-center gap-4"
      >
        {[
          "✓ BIS Certified Products",
          "✓ MNRE Approved Installer",
          "✓ ISO 9001:2015 Certified",
          "✓ 5,000+ Happy Customers",
        ].map((badge) => (
          <div
            key={badge}
            className="text-sm text-green-700 font-medium bg-green-50 border border-green-200 px-5 py-2 rounded-full"
          >
            {badge}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
