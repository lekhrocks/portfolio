"use client";

import { motion } from "framer-motion";
import { Mail, Code2, Heart } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <Code2 size={12} className="text-white" />
            </div>
            <span className="font-mono font-bold gradient-text">Lekhraj Kumar</span>
          </motion.div>

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-600 text-xs flex items-center gap-1"
          >
            © {year} · Built with{" "}
            <Heart size={10} className="text-red-500 fill-red-500 inline mx-0.5" />
            using Next.js · Deployed on Vercel
          </motion.p>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3"
          >
            {[
              { icon: GithubIcon, href: "https://github.com/lekhrocks", label: "GitHub" },
              { icon: LinkedinIcon, href: "https://linkedin.com/in/lekhrajkumar", label: "LinkedIn" },
              { icon: Mail, href: "mailto:lekh.nith@gmail.com", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-lg glass border border-white/8 flex items-center justify-center text-slate-500 hover:text-white hover:border-blue-500/30 transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon size={14} />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
