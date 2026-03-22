"use client";

import { motion } from "framer-motion";
import { Sun, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

const links = {
  Company: ["About Us", "Careers", "Blog", "Press"],
  Services: ["Compare Brands", "Savings Calculator", "Site Audit", "Net Metering"],
  Support: ["Help Center", "Installation Guide", "Subsidy Info", "Contact Us"],
  Legal: ["Privacy Policy", "Terms of Service", "Warranty Terms", "Refund Policy"],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-10 mb-14">
          {/* Brand column */}
          <div className="col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Real logo */}
              <div className="mb-5">
                <Image
                  src="/logo.png"
                  alt="Solarhood – My Solar • My Savings"
                  width={150}
                  height={50}
                  className="h-12 w-auto object-contain brightness-0 invert"
                />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
                India&apos;s trusted multi-brand solar marketplace. Compare, choose, and install with confidence.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-gray-400 text-sm">
                  <MapPin size={14} className="text-green-400 mt-0.5 shrink-0" />
                  <span>Plot No. 30, Ram Nagar, Sch No. 54,<br />Behind Sayaji Hotel,<br />Indore (M.P) 452011</span>
                </div>
                <a href="tel:9111157797" className="flex items-center gap-2 text-gray-400 hover:text-green-400 text-sm transition-colors">
                  <Phone size={13} className="text-green-400" />
                  91111-57797
                </a>
                <a href="mailto:solarhoodindia@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-green-400 text-sm transition-colors">
                  <Mail size={13} className="text-green-400" />
                  solarhoodindia@gmail.com
                </a>
              </div>
            </motion.div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">© 2026 Solarhood Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {["MNRE Approved", "ISO 9001:2015", "BIS Certified"].map((badge) => (
              <span key={badge} className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
