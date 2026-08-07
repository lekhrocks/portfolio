"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";

const navItems = [
  { id: "01", label: "owner",       href: "#about" },
  { id: "02", label: "stack",       href: "#skills" },
  { id: "03", label: "deployments", href: "#experience" },
  { id: "04", label: "services",    href: "#projects" },
  { id: "05", label: "oss",         href: "#opensource" },
  { id: "06", label: "topology",    href: "#architecture" },
  { id: "07", label: "on-call",     href: "#contact" },
];

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [healthy, setHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
      const sections = navItems.map((it) => it.href.slice(1));
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) current = id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let cancel = false;
    fetch("/api/health", { cache: "no-store" })
      .then((r) => !cancel && setHealthy(r.ok))
      .catch(() => !cancel && setHealthy(false));
    return () => {
      cancel = true;
    };
  }, []);

  const handleNavClick = (href: string) => {
  setIsOpen(false);
  const id = href.slice(1);
  // If we're on the homepage, the section exists — scroll straight to it.
  if (window.location.pathname === "/") {
    scrollToSection(id);
    return;
  }
  // On any other page (case studies, resume, …) the section doesn't exist,
  // so navigate home first and then scroll once the homepage is mounted.
  router.push("/#" + id);
  // The hash-jump can fire before the homepage hydrates; re-scroll after a
  // beat so the smooth-scroll lands reliably.
  setTimeout(scrollToSection, 400, id);
};

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors ${
        scrolled
          ? "border-b border-[var(--panel-border)] bg-[var(--bg-primary)]/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand block */}
          <a href="#" className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-md bg-[var(--accent)] text-black font-mono font-bold text-[12px] flex items-center justify-center">
              LK
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xs font-mono text-white">lekhrajkumar</span>
              <span className="flex items-center gap-1.5 mono-tag text-[var(--text-chrome)] text-[10px]">
                <span
                  className="dot dot-pulse"
                  style={{
                    width: 5,
                    height: 5,
                    background:
                      healthy === false ? "var(--status-err)" : "var(--status-ok)",
                  }}
                />
                {healthy === false ? "degraded" : "healthy"} · ap-south-1
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((it) => {
              const isActive = active === it.href.slice(1);
              return (
                <button
                  key={it.id}
                  onClick={() => handleNavClick(it.href)}
                  className={`group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono transition-colors ${
                    isActive
                      ? "text-white bg-[var(--panel-bg)]"
                      : "text-slate-400 hover:text-white hover:bg-[var(--panel-bg)]"
                  }`}
                >
                  <span className="text-[var(--text-chrome)] group-hover:text-[var(--accent)] transition-colors">
                    {it.id}
                  </span>
                  <span>{it.label}</span>
                </button>
              );
            })}

            <a
              href="/Lekhraj_Kumar_Resume.pdf"
              download
              className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--accent)] text-black hover:bg-[#67e8f9] transition-colors"
            >
              <Download size={12} />
              resume.pdf
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-slate-300 hover:text-white p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[var(--panel-border)] bg-[var(--bg-primary)]"
          >
            <div className="px-4 py-3 flex flex-col">
              {navItems.map((it) => (
                <button
                  key={it.id}
                  onClick={() => handleNavClick(it.href)}
                  className="text-left flex items-center gap-3 px-2 py-2 rounded-md text-xs font-mono text-slate-300 hover:bg-[var(--panel-bg)] hover:text-white transition-colors"
                >
                  <span className="text-[var(--text-chrome)] w-6">{it.id}</span>
                  <span>{it.label}</span>
                </button>
              ))}
              <a
                href="/Lekhraj_Kumar_Resume.pdf"
                download
                className="mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium bg-[var(--accent)] text-black"
              >
                <Download size={12} />
                resume.pdf
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
