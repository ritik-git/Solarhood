"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";

/* ─── Data ──────────────────────────────────────────────────
   Replace these IDs / URLs with your real content.
   YouTube ID  → everything after ?v= in the video URL
   Instagram   → the post shortcode in https://www.instagram.com/p/{SHORTCODE}/
──────────────────────────────────────────────────────────── */

const YOUTUBE_VIDEOS = [
  {
    id: "L--JIBmXLVo",
    title: "Solarhood Installation – See It Live",
    views: "Watch on YouTube",
  },
  {
    id: "J1Qh_-7Djuk",
    title: "Solarhood – Solar Panel Installation India",
    views: "Watch on YouTube",
  },
];

const INSTAGRAM_REELS = [
  {
    url: "https://www.instagram.com/reel/REPLACE_ME_1/",
    thumb: null,                  // ← set to "/insta1.jpg" once you add images
    caption: "Watch a full rooftop installation in 60 seconds ⚡",
    tag: "#SolarInstallation",
  },
  {
    url: "https://www.instagram.com/reel/REPLACE_ME_2/",
    thumb: null,
    caption: "Customer saves ₹4,200/month after going solar 🌞",
    tag: "#SolarSavings",
  },
  {
    url: "https://www.instagram.com/reel/REPLACE_ME_3/",
    thumb: null,
    caption: "Waaree 445W panels — unboxing & quality check ✅",
    tag: "#SolarPanels",
  },
];

const YT_CHANNEL  = "https://www.youtube.com/@SolarHoodIndia";
const IG_PROFILE  = "https://www.instagram.com/solarhood.in?igsh=cXV0MTA1MHd6bXpy";

/* ─── YouTube Player ───────────────────────────────────────── */
function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const thumbUrl = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-black group cursor-pointer"
      style={{ aspectRatio: "16/9" }}
      onClick={() => setPlaying(true)}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&modestbranding=1&rel=0&color=white`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      ) : (
        <>
          {/* Thumbnail */}
          <img
            src={thumbUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
            }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

          {/* Play button */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            whileHover={{ scale: 1.08 }}
          >
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-2xl shadow-red-600/50">
              <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

/* ─── YouTube Thumbnail Card ────────────────────────────────── */
function YouTubeThumb({ id, title, views }: { id: string; title: string; views: string }) {
  const [playing, setPlaying] = useState(false);
  const thumbUrl = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

  return (
    <div
      className="relative rounded-xl overflow-hidden bg-black cursor-pointer group flex-1"
      style={{ aspectRatio: "16/9" }}
      onClick={() => setPlaying(true)}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&modestbranding=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      ) : (
        <>
          <img
            src={thumbUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* Title + views bar */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
            <p className="text-white text-xs font-medium leading-snug line-clamp-2">{title}</p>
            <p className="text-gray-400 text-[10px] mt-0.5">{views}</p>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Instagram Reel Card ───────────────────────────────────── */
function InstagramReel({
  url, thumb, caption, tag, index,
}: {
  url: string; thumb: string | null; caption: string; tag: string; index: number;
}) {
  const gradients = [
    "from-purple-600 via-pink-500 to-orange-400",
    "from-yellow-400 via-pink-500 to-purple-600",
    "from-blue-500 via-purple-500 to-pink-500",
  ];
  const grad = gradients[index % gradients.length];

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className="relative flex flex-col overflow-hidden rounded-2xl group flex-1 no-underline"
      style={{ aspectRatio: "9/16", minWidth: 0 }}
    >
      {/* Background: real thumb or gradient */}
      {thumb ? (
        <img src={thumb} alt={caption} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-b ${grad}`} />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

      {/* Instagram icon top */}
      <div className="relative z-10 p-3 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          {/* Instagram icon */}
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          <span className="text-white text-xs font-semibold">Reel</span>
        </div>
        {/* Play icon */}
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 ml-0.5">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Center label for placeholder */}
      {!thumb && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-2 px-4">
          <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="text-white/60 text-xs text-center">Tap to watch on Instagram</p>
        </div>
      )}

      {/* Bottom caption */}
      <div className="relative z-10 p-3 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white text-xs font-medium leading-snug line-clamp-3">{caption}</p>
        <p className="text-pink-300 text-[10px] mt-1 font-semibold">{tag}</p>
      </div>
    </motion.a>
  );
}

/* ─── Main Section ──────────────────────────────────────────── */
export default function VideoShowcase() {
  const [featured, setFeatured] = useState(0);

  const fade: Variants = {
    hidden: { opacity: 0, y: 28 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
  };

  return (
    <section id="videos" className="relative py-20 bg-gray-950 overflow-hidden">

      {/* Subtle grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Gradient blobs */}
      <div aria-hidden className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-red-600/10 blur-[100px] pointer-events-none" />
      <div aria-hidden className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-pink-600/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* ── Header ───────────────────────────────────────── */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={fade}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            See Us In Action
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Real Installations.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              Real People. Real Savings.
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Watch our team work across Indore and beyond — from roof audit to final commissioning.
          </p>
        </motion.div>

        {/* ── Two-zone grid ─────────────────────────────────
              Left  (58%): YouTube  — landscape 16:9
              Right (42%): Instagram — portrait 9:16
        ─────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 lg:grid-cols-[58fr_42fr] gap-6"
        >

          {/* ══ YouTube Column ══════════════════════════════ */}
          <motion.div variants={fade} className="flex flex-col gap-4">

            {/* Platform badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/40">
                  {/* YouTube icon */}
                  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">YouTube</p>
                  <p className="text-gray-500 text-xs">Installation videos</p>
                </div>
              </div>
              <a
                href={YT_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors border border-red-500/30 hover:border-red-400/50 px-3 py-1.5 rounded-full"
              >
                Subscribe
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* Featured player */}
            <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
              <YouTubeEmbed
                id={YOUTUBE_VIDEOS[featured].id}
                title={YOUTUBE_VIDEOS[featured].title}
              />
            </div>

            {/* Title of featured */}
            <p className="text-white font-semibold text-sm px-1 line-clamp-1">
              {YOUTUBE_VIDEOS[featured].title}
            </p>

            {/* Thumbnail row — clicking changes featured */}
            <div className="flex gap-3">
              {YOUTUBE_VIDEOS.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setFeatured(i)}
                  className={`flex-1 rounded-xl overflow-hidden transition-all duration-200 ring-2 ${
                    featured === i
                      ? "ring-red-500 opacity-100"
                      : "ring-transparent opacity-60 hover:opacity-90"
                  }`}
                  style={{ aspectRatio: "16/9" }}
                  aria-label={v.title}
                >
                  <img
                    src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                    alt={v.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* View channel CTA */}
            <a
              href={YT_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-semibold"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              View Full YouTube Channel
            </a>
          </motion.div>

          {/* ══ Instagram Column ════════════════════════════ */}
          <motion.div variants={fade} className="flex flex-col gap-4">

            {/* Platform badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Instagram Reels</p>
                  <p className="text-gray-500 text-xs">@solarhood.in</p>
                </div>
              </div>
              <a
                href={IG_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-pink-400 hover:text-pink-300 transition-colors border border-pink-500/30 hover:border-pink-400/50 px-3 py-1.5 rounded-full"
              >
                Follow
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Reels grid — 3 portrait cards */}
            <div className="flex gap-3 flex-1">
              {INSTAGRAM_REELS.map((reel, i) => (
                <InstagramReel key={i} {...reel} index={i} />
              ))}
            </div>

            {/* Follow CTA */}
            <a
              href={IG_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, rgba(240,148,51,0.15), rgba(220,39,67,0.15), rgba(188,24,136,0.15))",
                border: "1px solid rgba(220,39,67,0.3)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-pink-400">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Follow @solarhood.in on Instagram
            </a>
          </motion.div>
        </motion.div>

        {/* ── Stats bar ─────────────────────────────────── */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={fade}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: "500+",    label: "Installations Documented", icon: "🎬" },
            { value: "25K+",    label: "YouTube Subscribers",      icon: "🔴" },
            { value: "40K+",    label: "Instagram Followers",      icon: "📸" },
            { value: "4.9 ★",  label: "Average Rating",           icon: "⭐" },
          ].map(({ value, label, icon }) => (
            <div
              key={label}
              className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center hover:border-green-500/30 transition-colors"
            >
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-white font-black text-xl">{value}</div>
              <div className="text-gray-500 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
