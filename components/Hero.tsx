"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Mail, ArrowDown, ExternalLink, Zap } from "lucide-react";
import { GithubIcon, LinkedinIcon, LeetcodeIcon } from "@/components/icons";
import MagneticButton from "@/components/MagneticButton";
import AnimatedNumber from "@/components/AnimatedNumber";

// Lazy-load 3D globe (Three.js bundle) — never blocks initial paint
const HeroGlobe = dynamic(() => import("@/components/HeroGlobe"), {
  ssr: false,
  loading: () => null,
});

const stats = [
  { value: "5+",    label: "Years Experience", color: "from-blue-600 to-cyan-500" },
  { value: "10K+",  label: "RPS Optimized",    color: "from-purple-600 to-pink-500" },
  { value: "99.9%", label: "SLA Achieved",     color: "from-green-600 to-cyan-500" },
  { value: "729+",  label: "LeetCode Solved",  color: "from-orange-500 to-yellow-400" },
];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax — different layers move at different speeds for depth
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const auroraY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid"
    >
      {/* Aurora background */}
      <motion.div
        style={{ y: auroraY }}
        className="absolute inset-0 aurora-bg pointer-events-none"
      />

      {/* 3D Globe — soft backdrop only */}
      <motion.div
        style={{
          y: orb1Y,
          opacity: contentOpacity,
          maskImage:
            "radial-gradient(ellipse 50% 35% at 50% 50%, transparent 30%, black 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 50% 35% at 50% 50%, transparent 30%, black 75%)",
        }}
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        <div className="w-[min(95vw,820px)] h-[min(95vw,820px)] opacity-55">
          <HeroGlobe />
        </div>
      </motion.div>

      {/* Animated Background Orbs — parallax */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ y: orb1Y }}
          className="orb-1 absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full opacity-20"
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </motion.div>
        <motion.div
          style={{ y: orb2Y }}
          className="orb-2 absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-15"
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </motion.div>
        <motion.div
          style={{ y: orb3Y }}
          className="orb-3 absolute top-2/3 left-1/2 w-[300px] h-[300px] rounded-full opacity-10"
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </motion.div>
      </div>

      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32"
      >
        <div className="flex flex-col items-center text-center">
          {/* Availability Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-8"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-green-500/20 text-green-400 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              Available for Software Engineer / Full Stack Roles · Serving Notice Period
            </div>
          </motion.div>

          {/* Avatar */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="relative w-28 h-28 rounded-full p-0.5 bg-gradient-to-br from-blue-500 to-cyan-400">
              <div className="w-full h-full rounded-full overflow-hidden">
                <Image
                  src="/lekhraj.png"
                  alt="Lekhraj Kumar"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover object-top rounded-full"
                  priority
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <Zap size={13} className="text-white" />
              </div>
            </div>
          </motion.div>

          {/* Name with neon halo */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4 leading-none"
          >
            {/* Glowing halo behind text */}
            <span
              aria-hidden
              className="absolute inset-0 blur-3xl opacity-50 pointer-events-none animate-pulse-slow"
              style={{
                background:
                  "linear-gradient(135deg, #3b82f6, #06b6d4 35%, #8b5cf6 70%, #ec4899)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Lekhraj Kumar
            </span>
            <span className="relative text-white drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]">
              Lekhraj
            </span>{" "}
            <span className="relative gradient-text-animated drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              Kumar
            </span>
          </motion.h1>

          {/* Typewriter Role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex items-center gap-2 text-xl sm:text-2xl text-slate-300 font-mono mb-6 h-8"
          >
            <span className="text-cyan-400">{">"}</span>
            <TypeAnimation
              sequence={[
                "Software Engineer II @ AppDirect",
                2000,
                "Backend & Frontend Engineer",
                2000,
                "Distributed Systems Expert",
                2000,
                "Kafka & Microservices Engineer",
                2000,
                "Java · Spring Boot · React",
                2000,
              ]}
              wrapper="span"
              speed={55}
              repeat={Infinity}
              className="text-white"
            />
            <span className="cursor-blink text-blue-400 font-light">|</span>
          </motion.div>

          {/* Summary */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-2xl text-slate-400 text-base sm:text-lg leading-relaxed mb-10"
          >
            Building and scaling{" "}
            <span className="text-blue-400 font-medium">high-throughput distributed systems</span>{" "}
            in payments and SaaS. Strong backend expertise with hands-on{" "}
            <span className="text-cyan-400 font-medium">React & UI development</span>{" "}
            experience. Systems handling{" "}
            <span className="text-cyan-400 font-medium">10K+ RPS</span> with{" "}
            <span className="text-green-400 font-medium">99.9%+ availability</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <MagneticButton strength={0.35}>
              <motion.button
                onClick={() => {
                  const el = document.getElementById("projects");
                  if (el)
                    window.scrollTo({
                      top: el.getBoundingClientRect().top + window.scrollY - 72,
                      behavior: "smooth",
                    });
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium shadow-lg shadow-blue-500/25 hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Projects
                <ExternalLink size={15} />
              </motion.button>
            </MagneticButton>

            <MagneticButton>
              <motion.a
                href="https://github.com/lekhrocks"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full glass border border-white/10 text-white font-medium hover:border-blue-400/40 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GithubIcon size={16} />
                GitHub
              </motion.a>
            </MagneticButton>

            <MagneticButton>
              <motion.a
                href="https://linkedin.com/in/lekhrajkumar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full glass border border-white/10 text-white font-medium hover:border-blue-400/40 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LinkedinIcon size={16} />
                LinkedIn
              </motion.a>
            </MagneticButton>

            <MagneticButton>
              <motion.a
                href="mailto:lekh.nith@gmail.com"
                className="flex items-center gap-2 px-6 py-3 rounded-full glass border border-white/10 text-white font-medium hover:border-blue-400/40 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={16} />
                Email
              </motion.a>
            </MagneticButton>

            <MagneticButton>
              <motion.a
                href="https://leetcode.com/u/lekh_nith/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full glass border border-orange-500/20 text-orange-400 font-medium hover:border-orange-400/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LeetcodeIcon size={16} />
                LeetCode
              </motion.a>
            </MagneticButton>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl"
            style={{ perspective: 1000 }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-4 text-center border border-white/5 hover:border-white/10 transition-colors shadow-3d"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className={`text-2xl font-bold font-mono bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                >
                  <AnimatedNumber value={stat.value} duration={1.8} />
                </div>
                <div className="text-xs text-slate-500 mt-1 leading-tight">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 cursor-pointer"
        onClick={() => {
          const el = document.getElementById("about");
          if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
        }}
      >
        <span className="text-xs tracking-widest uppercase font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
