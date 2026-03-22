"use client";

import { motion } from "framer-motion";

/* ── All logos are local /public files — no CDN, no fallback needed ─── */
const brands = [
  { name: "Waaree",           logo: "/waaree.png"           },
  { name: "Premier Solar",    logo: "/premier-solar.jpg"    },
  { name: "Adani Solar",      logo: "/adani-solar.png"      },
  { name: "Tata Power Solar", logo: "/tata-power-solar.webp"},
  { name: "Goldi Solar",      logo: "/goldi-solar.jpg"      },
  { name: "Vikram Solar",     logo: "/vikram-solar.png"     },
  { name: "Sungrow",          logo: "/sungrow.svg"          },
  { name: "Solis",            logo: "/solis.webp"           },
  { name: "SolarEdge",        logo: "/solaredge.jpg"        },
  { name: "Sineng",           logo: "/sineng.png"           },
  { name: "APL Apollo",       logo: "/apl-apollo.png"       },
];

/* Duplicate for seamless infinite scroll */
const allBrands = [...brands, ...brands];

function BrandLogo({ brand }: { brand: (typeof brands)[0] }) {
  return (
    <div className="flex-shrink-0 mx-4 group">
      <div
        className="flex items-center justify-center bg-white
                   border border-gray-200 hover:border-green-300
                   rounded-2xl px-6 py-4 w-36 h-20
                   shadow-sm hover:shadow-md
                   transition-all duration-300 cursor-pointer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={brand.logo}
          alt={brand.name}
          className="object-contain max-h-12 w-auto
                     grayscale group-hover:grayscale-0
                     transition-all duration-300"
        />
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
      {/* Heading */}
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

      {/* Scrolling carousel */}
      <div className="relative">
        {/* Fade masks */}
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
