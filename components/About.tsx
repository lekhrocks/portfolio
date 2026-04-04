"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, MapPin, Building2, Star } from "lucide-react";

const stats = [
  { value: "5+", label: "Years of Experience", sublabel: "2020 – Present" },
  { value: "10K+", label: "RPS Systems Built", sublabel: "Payments & SaaS" },
  { value: "4x", label: "Kafka Throughput", sublabel: "Event Pipeline" },
  { value: "200ms", label: "p99 Latency", sublabel: "Target Achieved" },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding bg-gradient-to-b from-transparent to-[#0a0a1a]/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-blue-500/20 text-blue-400 text-xs font-mono mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              01 / About
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="section-title text-white mb-4"
            >
              Who I Am
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-400 max-w-xl mx-auto"
            >
              Passionate backend engineer crafting systems that scale to millions
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left — Bio & Education */}
            <div className="space-y-6">
              {/* Bio Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass glass-hover rounded-2xl p-6 border border-white/5"
              >
                <p className="text-slate-300 leading-relaxed text-sm">
                  I&apos;m a Software Engineer with{" "}
                  <span className="text-blue-400 font-medium">5+ years</span> of experience
                  building and scaling high-throughput distributed systems in{" "}
                  <span className="text-cyan-400 font-medium">payments and SaaS</span> domains.
                </p>
                <p className="text-slate-300 leading-relaxed text-sm mt-3">
                  At <span className="text-white font-medium">AppDirect</span>, I design and own
                  high-availability microservices for Billing, Checkout, Notifications, and
                  Payments — supporting thousands of concurrent requests with sub-200ms p99
                  latency. I led the migration from{" "}
                  <span className="text-purple-400 font-medium">RabbitMQ to Kafka</span>,
                  achieving a{" "}
                  <span className="text-green-400 font-medium">4x throughput improvement</span>{" "}
                  for billing workflows processing millions of events per day.
                </p>
                <p className="text-slate-300 leading-relaxed text-sm mt-3">
                  My core expertise spans microservices architecture, event-driven systems, JVM
                  performance tuning, and building production-grade observability stacks with
                  Prometheus and Datadog APM.
                </p>
              </motion.div>

              {/* Location & Contact Quick Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                {[
                  { icon: MapPin, text: "Pune, Maharashtra, India" },
                  { icon: Building2, text: "AppDirect (Current)" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/5 text-slate-400 text-sm"
                  >
                    <Icon size={13} className="text-blue-400" />
                    {text}
                  </div>
                ))}
              </motion.div>

              {/* Education Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="glass glass-hover rounded-2xl p-6 border border-white/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 blur-2xl" />
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold text-sm">NIT Hamirpur</span>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs">
                        <Star size={10} className="fill-yellow-400" />
                        8.65 GPA
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs">
                      Dual Degree — B.Tech + M.Tech in Electronics & Communication Engineering
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      National Institute of Technology Hamirpur, India · 2015 – 2020
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right — Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, type: "spring" }}
                  className="glass glass-hover rounded-2xl p-6 border border-white/5 text-center group"
                >
                  <div className="text-3xl font-bold font-mono gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white text-sm font-medium mb-1">{stat.label}</div>
                  <div className="text-slate-500 text-xs">{stat.sublabel}</div>
                </motion.div>
              ))}

              {/* Extra Philosophy Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="glass rounded-2xl p-6 border border-blue-500/10 col-span-2 bg-gradient-to-br from-blue-950/30 to-cyan-950/20"
              >
                <p className="text-slate-300 text-sm italic leading-relaxed">
                  &ldquo;Great systems aren&apos;t just fast — they&apos;re observable, resilient,
                  and maintainable. I build for the 3am incident, not just the happy path.&rdquo;
                </p>
                <p className="text-blue-400 text-xs font-mono mt-3">— Engineering Philosophy</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
