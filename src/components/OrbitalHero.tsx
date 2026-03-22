"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import * as THREE from "three";

/* ─── Starfield Canvas ────────────────────────────────────── */
function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const stars = Array.from({ length: 250 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.3 + 0.2,
      a: Math.random() * 0.55 + 0.3,
      s: Math.random() * 0.016 + 0.003,
      t: Math.random() * Math.PI * 2,
    }));

    let raf: number;
    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.t += s.s;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${(s.a * (0.5 + 0.5 * Math.sin(s.t))).toFixed(2)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
    />
  );
}

/* ─── Three.js Globe ──────────────────────────────────────── */
function ThreeGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.offsetWidth;
    const H = mount.offsetHeight;

    /* Scene */
    const scene = new THREE.Scene();
    /* Narrower FOV + farther camera = sphere well inside canvas with no edge clipping */
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 1000);
    camera.position.z = 3.0;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* Resize */
    const onResize = () => {
      const w = mount.offsetWidth, h = mount.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    /* Texture loader */
    const loader = new THREE.TextureLoader();

    /* Earth sphere */
    const geo = new THREE.SphereGeometry(1, 64, 64);

    // NASA Blue Marble texture (loaded in-browser, no CORS issues via Three.js)
    const earthTex = loader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg"
    );
    const bumpTex = loader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg"
    );
    const specTex = loader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg"
    );

    const mat = new THREE.MeshPhongMaterial({
      map: earthTex,
      bumpMap: bumpTex,
      bumpScale: 0.05,
      specularMap: specTex,
      specular: new THREE.Color(0x333333),
      shininess: 18,
    });

    const earth = new THREE.Mesh(geo, mat);
    // Tilt to show India / subcontinent more prominently
    earth.rotation.x = THREE.MathUtils.degToRad(15);
    earth.rotation.y = THREE.MathUtils.degToRad(75); // center on India
    scene.add(earth);

    /* Atmosphere glow */
    const atmosGeo = new THREE.SphereGeometry(1.025, 64, 64);
    const atmosMat = new THREE.MeshPhongMaterial({
      color: 0x4fc3f7,
      transparent: true,
      opacity: 0.08,
      side: THREE.FrontSide,
    });
    scene.add(new THREE.Mesh(atmosGeo, atmosMat));

    /* Outer glow halo */
    const haloGeo = new THREE.SphereGeometry(1.08, 64, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.04,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(haloGeo, haloMat));

    /* Solar panel hotspots — glowing points over India */
    const solarPoints = [
      // [lat, lon] pairs over major Indian solar states
      [23.0, 76.0],  // Madhya Pradesh (Indore)
      [22.5, 72.0],  // Gujarat
      [19.0, 76.0],  // Maharashtra
      [27.0, 75.0],  // Rajasthan
      [12.0, 78.0],  // Tamil Nadu
      [28.6, 77.2],  // Delhi
    ] as [number, number][];

    const dotGeo = new THREE.SphereGeometry(0.012, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const dotMat2 = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.4 });

    for (const [lat, lon] of solarPoints) {
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon + 180);
      const x = -(Math.sin(phi) * Math.cos(theta));
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);

      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(x, y, z);
      earth.add(dot);

      // Glow ring
      const ringGeo = new THREE.SphereGeometry(0.024, 8, 8);
      const ring = new THREE.Mesh(ringGeo, dotMat2);
      ring.position.set(x, y, z);
      earth.add(ring);
    }

    /* Lights */
    // Key light (sun direction — from upper left)
    const sunLight = new THREE.DirectionalLight(0xfff5e4, 2.2);
    sunLight.position.set(-5, 3, 5);
    scene.add(sunLight);

    // Soft fill
    const fillLight = new THREE.AmbientLight(0x112244, 0.6);
    scene.add(fillLight);

    // Emerald rim light (from right)
    const rimLight = new THREE.DirectionalLight(0x10b981, 0.4);
    rimLight.position.set(5, -1, -3);
    scene.add(rimLight);

    /* Animate */
    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      earth.rotation.y += 0.0012; // slow eastward rotation
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}

/* ─── Rooftop Solar Panel Scene ──────────────────────────── */
function RooftopScene() {
  return (
    <div style={{
      position: "absolute",
      bottom: "10%", left: "50%",
      transform: "translateX(-50%)",
      width: "clamp(300px, 62vw, 720px)",
      background: "linear-gradient(160deg, #1c2e1c 0%, #0f1f0f 50%, #080e08 100%)",
      borderRadius: "28px 28px 10px 10px",
      overflow: "hidden",
      boxShadow: "0 -30px 80px rgba(16,185,129,0.15), 0 0 0 1px rgba(16,185,129,0.12)",
      padding: "12px 12px 4px",
    }}>
      {/* Label */}
      <div style={{
        position: "absolute", top: "8px", left: "50%", transform: "translateX(-50%)",
        background: "rgba(16,185,129,0.18)", border: "1px solid rgba(16,185,129,0.4)",
        color: "#10B981", fontSize: "0.55rem", fontWeight: 700,
        padding: "3px 10px", borderRadius: "9999px", whiteSpace: "nowrap", zIndex: 2,
        letterSpacing: "0.1em", textTransform: "uppercase",
      }}>
        ☀️ Your Roof · Generating Power
      </div>

      {/* Ridge */}
      <div style={{
        height: "2px",
        background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)",
        marginBottom: "8px", borderRadius: "2px", marginTop: "18px",
      }} />

      {/* Panel rows */}
      {[0, 1, 2, 3].map((row) => (
        <div key={row} style={{ display: "flex", gap: "5px", marginBottom: "5px" }}>
          {[0, 1, 2, 3, 4, 5, 6].map((col) => (
            <div key={col} style={{
              flex: 1,
              height: "clamp(18px, 3.2vh, 36px)",
              background: "linear-gradient(140deg, #1a2a4a 0%, #0d1a36 40%, #152236 70%, #0a1528 100%)",
              borderRadius: "3px",
              border: "1px solid rgba(245,158,11,0.12)",
              position: "relative", overflow: "hidden",
            }}>
              {/* Cell lines */}
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)," +
                  "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "33% 50%",
              }} />
              {/* Gold sheen */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(105deg, transparent 30%, rgba(245,158,11,0.15) 50%, transparent 70%)",
                animation: `panelSheen ${2.4 + col * 0.2 + row * 0.3}s ease-in-out infinite`,
                animationDelay: `${col * 0.12 + row * 0.18}s`,
              }} />
            </div>
          ))}
        </div>
      ))}

      {/* Status bar */}
      <div style={{
        display: "flex", justifyContent: "space-around", alignItems: "center",
        padding: "6px 4px 4px",
        borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "4px",
      }}>
        {[
          { label: "Generating", value: "7.4 kWh", color: "#10B981" },
          { label: "Daily Saving", value: "₹ 320", color: "#F59E0B" },
          { label: "CO₂ Offset", value: "2.1 kg", color: "#60A5FA" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ color, fontSize: "clamp(0.6rem, 1.5vw, 0.82rem)", fontWeight: 700 }}>{value}</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.5rem", marginTop: "1px" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Magnetic CTA hook ───────────────────────────────────── */
function useMagnetic(strength = 42) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 20 });
  const sy = useSpring(y, { stiffness: 180, damping: 20 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      if (dist < 90) {
        const pull = (1 - dist / 90) * strength;
        x.set((dx / dist) * pull);
        y.set((dy / dist) * pull);
      } else { x.set(0); y.set(0); }
    };
    const onLeave = () => { x.set(0); y.set(0); };
    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [x, y, strength]);

  return { ref, sx, sy };
}

/* ─── OrbitalHero ─────────────────────────────────────────── */
export default function OrbitalHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const earthScale = useTransform(scrollYProgress, [0, 0.55], [1, 2.8]);
  const earthOpacity = useTransform(scrollYProgress, [0.28, 0.55], [1, 0]);

  const rooftopOpacity = useTransform(scrollYProgress, [0.22, 0.52], [0, 1]);
  const rooftopScale = useTransform(scrollYProgress, [0.22, 0.58], [1.18, 1]);

  const t1Opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const t1Y = useTransform(scrollYProgress, [0, 0.2], [0, -55]);

  const t2Opacity = useTransform(scrollYProgress, [0.28, 0.5], [0, 1]);
  const t2Y = useTransform(scrollYProgress, [0.28, 0.5], [55, 0]);

  const { ref: ctaRef, sx, sy } = useMagnetic(42);

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />

      <div ref={containerRef} style={{ height: "220vh", position: "relative" }} id="orbital-hero">
        <div style={{
          position: "sticky", top: 0, height: "100vh",
          overflow: "hidden", background: "#050505",
        }}>
          <Starfield />

          {/* Vignette */}
          <div aria-hidden style={{
            position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
            background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(5,5,5,0.7) 100%)",
          }} />

          {/* ── Three.js Earth — fills full viewport, no clipping ── */}
          <motion.div
            style={{
              scale: earthScale, opacity: earthOpacity,
              position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
            }}
          >
            <ThreeGlobe />
          </motion.div>

          {/* ── Rooftop reveal ─────────────────────────── */}
          <motion.div
            style={{
              opacity: rooftopOpacity, scale: rooftopScale,
              position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
              background:
                "radial-gradient(ellipse 90% 75% at 50% 65%, rgba(16,185,129,0.1) 0%, transparent 70%)," +
                "linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(5,5,5,0.5) 30%, rgba(5,5,5,0.88) 100%)",
              maskImage: "radial-gradient(ellipse 85% 72% at 50% 62%, black 15%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse 85% 72% at 50% 62%, black 15%, transparent 80%)",
            }}
          >
            <RooftopScene />
          </motion.div>

          {/* ── Phase 1: "Power from the Stars." ─────── */}
          <motion.div
            style={{
              opacity: t1Opacity, y: t1Y,
              position: "absolute", inset: 0, zIndex: 10,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              textAlign: "center", padding: "0 1.5rem", pointerEvents: "none",
            }}
          >
            {/* Company badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)",
              color: "#10B981", fontSize: "0.72rem", fontWeight: 700,
              padding: "6px 16px", borderRadius: "9999px", marginBottom: "1.8rem",
              letterSpacing: "0.08em",
            }}>
              <span style={{ width: "6px", height: "6px", background: "#10B981", borderRadius: "50%", animation: "pulse 2s infinite" }} />
              India&apos;s #1 Solar Panel Marketplace
            </div>

            <h1 style={{
              fontSize: "clamp(3rem, 10vw, 8.5rem)",
              fontWeight: 900, color: "white",
              lineHeight: 1.04, letterSpacing: "-0.035em",
              textShadow: "0 4px 48px rgba(0,0,0,0.55)",
              marginBottom: "1.2rem",
            }}>
              Power from<br />the Sun .
            </h1>

            {/* Clear company descriptor */}
            <p style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "clamp(0.9rem, 1.8vw, 1.15rem)",
              maxWidth: "520px", lineHeight: 1.65,
            }}>
              We sell &amp; install <strong style={{ color: "white" }}>Waaree, Adani &amp; Tata solar panels</strong> on your rooftop —
              from quote to commissioning, zero hassle.
            </p>
          </motion.div>

          {/* ── Phase 2: "Autonomous Energy." + CTA ──── */}
          <motion.div
            style={{
              opacity: t2Opacity, y: t2Y,
              position: "absolute", inset: 0, zIndex: 10,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              textAlign: "center", padding: "0 1.5rem",
            }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)",
              color: "#F59E0B", fontSize: "0.72rem", fontWeight: 700,
              padding: "6px 16px", borderRadius: "9999px", marginBottom: "1.8rem",
              letterSpacing: "0.08em",
            }}>
              ☀️ &nbsp; Your Rooftop is Generating Power
            </div>

            <h1 style={{
              fontSize: "clamp(2.6rem, 9vw, 7.5rem)",
              fontWeight: 900, color: "white",
              lineHeight: 1.04, letterSpacing: "-0.035em",
              marginBottom: "1.2rem",
              textShadow: "0 4px 48px rgba(0,0,0,0.55)",
            }}>
              Install Solar.<br />
              <span style={{ color: "#10B981" }}>Save More.</span>
            </h1>

            <p style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)",
              maxWidth: "480px", lineHeight: 1.65, marginBottom: "2.5rem",
            }}>
              Compare top brands. Get 40% government subsidy.
              Our experts handle installation in <strong style={{ color: "white" }}>7 days or less.</strong>
            </p>

            {/* Two CTAs */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
              <motion.a
                ref={ctaRef}
                href="#calculator"
                style={{ x: sx, y: sy }}
                className="magnetic-cta"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
              >
                <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  Get Free Quote
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </motion.a>

              <motion.a
                href="#brands"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)",
                  fontWeight: 700, fontSize: "1rem", padding: "1rem 2rem",
                  borderRadius: "9999px", textDecoration: "none",
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)", transition: "border-color 0.3s",
                }}
              >
                Compare Brands
              </motion.a>
            </div>
          </motion.div>

          {/* ── Scroll caret ────────────────────────────── */}
          <motion.div
            style={{
              opacity: t1Opacity,
              position: "absolute", bottom: "2.5rem", left: "50%",
              transform: "translateX(-50%)", zIndex: 10,
              display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
              pointerEvents: "none",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>
              Scroll to Explore
            </p>
            <motion.div
              animate={{ y: [0, 9, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              style={{ width: "1.5px", height: "2.2rem", background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)" }}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
}
