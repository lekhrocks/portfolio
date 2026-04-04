"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, Calendar, MapPin, ChevronRight } from "lucide-react";

const companyLogos: Record<string, React.ReactNode> = {
  AppDirect: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="40" height="40" rx="8" fill="#1B5EE0"/>
      <path d="M20 8L30 28H10L20 8Z" fill="white" opacity="0.9"/>
      <rect x="13" y="22" width="14" height="2.5" rx="1.25" fill="#60a5fa" opacity="0.8"/>
    </svg>
  ),
  Infosys: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="40" height="40" rx="8" fill="#007CC3"/>
      <rect x="9"  y="10" width="5" height="5" rx="1" fill="#F48024"/>
      <rect x="16" y="10" width="5" height="5" rx="1" fill="#00B050"/>
      <rect x="23" y="10" width="5" height="5" rx="1" fill="#E31E24"/>
      <rect x="9"  y="17" width="5" height="5" rx="1" fill="#00AEEF"/>
      <rect x="16" y="17" width="5" height="5" rx="1" fill="#F48024"/>
      <rect x="23" y="17" width="5" height="5" rx="1" fill="#00B050"/>
      <text x="20" y="33" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="0.5">INFOSYS</text>
    </svg>
  ),
};

type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  type: string;
  current: boolean;
  color: string;
  borderColor: string;
  glowColor: string;
  logo: string;
  logoUrl: string;
  highlights: string[];
  tags: string[];
};

function CompanyLogo({ exp }: { exp: Experience }) {
  const [failed, setFailed] = useState(false);
  const svgFallback = companyLogos[exp.company];

  if (!failed) {
    return (
      <div
        className="hidden sm:flex absolute left-0 top-6 w-12 h-12 rounded-xl items-center justify-center overflow-hidden bg-white shadow-lg"
        style={{ boxShadow: `0 0 20px ${exp.glowColor}` }}
      >
        <img
          src={exp.logoUrl}
          alt={`${exp.company} logo`}
          className="w-9 h-9 object-contain"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  if (svgFallback) {
    return (
      <div
        className="hidden sm:flex absolute left-0 top-6 w-12 h-12 rounded-xl items-center justify-center overflow-hidden shadow-lg"
        style={{ boxShadow: `0 0 20px ${exp.glowColor}` }}
      >
        {svgFallback}
      </div>
    );
  }

  return (
    <div
      className={`hidden sm:flex absolute left-0 top-6 w-12 h-12 rounded-xl bg-gradient-to-br ${exp.color} items-center justify-center text-white font-bold text-sm font-mono shadow-lg`}
      style={{ boxShadow: `0 0 20px ${exp.glowColor}` }}
    >
      {exp.logo}
    </div>
  );
}

const experiences = [
  {
    company: "AppDirect",
    role: "Software Development Engineer II",
    period: "Sep 2022 – Present",
    location: "Pune, India",
    type: "Full-time",
    current: true,
    color: "from-blue-500 to-cyan-400",
    borderColor: "border-blue-500/20",
    glowColor: "rgba(59,130,246,0.15)",
    logo: "AD",
    logoUrl: "https://www.google.com/s2/favicons?domain=appdirect.com&sz=128",
    highlights: [
      "Designed and owned multiple high-availability microservices for Billing, Checkout, Notifications, and Payments supporting thousands of concurrent requests with p99 latency < 200ms and 99.9%+ availability.",
      "Built integrations with PayPal, Stripe, and Billpay via custom connectors ensuring secure and reliable payment processing.",
      "Migrated legacy RabbitMQ event pipelines to Kafka — improving event throughput by ~4x, enabling horizontal scalability, replayability, and fault-tolerant processing for workflows handling millions of events/day.",
      "Decomposed a monolithic system into domain-aligned microservices using event-driven architecture, enabling independent scaling, faster deployments, and improved fault isolation.",
      "Developed MicroUI components using React and Mantine for real-time user features and operational visibility.",
      "Practiced TDD with JUnit and Mockito, delivered CI/CD pipelines using GitHub Actions.",
      "On-call rotations: debugging and resolving production incidents, performing RCA, and implementing long-term reliability fixes.",
    ],
    tags: ["Java", "Spring Boot", "Kafka", "Microservices", "React", "Docker", "K8s", "Prometheus"],
  },
  {
    company: "Infosys",
    role: "Senior Systems Engineer",
    period: "Nov 2020 – Sep 2022",
    location: "Pune, India",
    type: "Full-time",
    current: false,
    color: "from-purple-500 to-violet-400",
    borderColor: "border-purple-500/20",
    glowColor: "rgba(139,92,246,0.12)",
    logo: "IN",
    logoUrl: "https://www.google.com/s2/favicons?domain=infosys.com&sz=128",
    highlights: [
      "Customized and extended core banking modules using Java and JavaScript to meet client-specific regulatory requirements in mission-critical banking systems.",
      "Migrated legacy Finacle scripts to modern Java-based microservices, improving maintainability, testability, and deployment reliability.",
      "Built and maintained EOD/BOD automation workflows to streamline time-sensitive banking operations, reducing manual effort and operational risk.",
      "Delivered scalable solutions across CASA, Loans, and Term Deposit modules, ensuring transactional integrity and data consistency.",
      "Investigated and resolved production issues, performed root cause analysis, and implemented fixes to stabilize live banking systems.",
    ],
    tags: ["Java", "JavaScript", "Finacle", "Banking", "Microservices", "MySQL"],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="section-padding bg-gradient-to-b from-transparent to-[#0a0a1a]/30">
      <div className="max-w-5xl mx-auto" ref={ref}>
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-blue-500/20 text-blue-400 text-xs font-mono mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            03 / Experience
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="section-title text-white mb-4"
          >
            Work Experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 max-w-xl mx-auto"
          >
            5+ years building production systems at scale
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 timeline-line hidden sm:block" />

          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.2 }}
                className="relative sm:pl-20"
              >
                {/* Timeline Dot */}
                <CompanyLogo exp={exp} />

                {/* Card */}
                <div
                  className={`glass glass-hover rounded-2xl border ${exp.borderColor} p-6 relative overflow-hidden`}
                  style={{ boxShadow: `0 0 40px ${exp.glowColor}` }}
                >
                  {/* Background Glow */}
                  <div
                    className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${exp.color} opacity-5 blur-3xl pointer-events-none`}
                  />

                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase size={14} className="text-slate-500" />
                        <h3
                          className={`text-lg font-bold bg-gradient-to-r ${exp.color} bg-clip-text text-transparent`}
                        >
                          {exp.company}
                        </h3>
                        {exp.current && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-400">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75" />
                              <span className="relative rounded-full h-1.5 w-1.5 bg-green-400" />
                            </span>
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-white font-semibold text-sm">{exp.role}</p>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                      <div className="flex items-center gap-1 text-slate-400 text-xs justify-end">
                        <Calendar size={11} />
                        {exp.period}
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 text-xs justify-end">
                        <MapPin size={11} />
                        {exp.location}
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <ul className="space-y-2 mb-4">
                    {exp.highlights.map((item, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.4 + i * 0.2 + j * 0.04 }}
                        className="flex items-start gap-2 text-slate-400 text-sm"
                      >
                        <ChevronRight
                          size={13}
                          className={`flex-shrink-0 mt-0.5 bg-gradient-to-r ${exp.color} bg-clip-text`}
                          style={{ color: i === 0 ? "#3b82f6" : "#8b5cf6" }}
                        />
                        <span className="leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-xs font-mono glass border border-white/8 text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
