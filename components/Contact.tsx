"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import SectionHeader from "@/components/console/SectionHeader";
import StatusPill from "@/components/console/StatusPill";

const CHANNELS = [
  {
    icon: Mail,
    label: "email",
    value: "lekh.nith@gmail.com",
    href: "mailto:lekh.nith@gmail.com",
    sla: "≤ 24h",
  },
  {
    icon: GithubIcon,
    label: "github",
    value: "github.com/lekhrocks",
    href: "https://github.com/lekhrocks",
    sla: "best-effort",
  },
  {
    icon: LinkedinIcon,
    label: "linkedin",
    value: "linkedin.com/in/lekhrajkumar",
    href: "https://linkedin.com/in/lekhrajkumar",
    sla: "≤ 48h",
  },
  {
    icon: MapPin,
    label: "location",
    value: "Pune, IN · UTC+5:30",
    href: null as string | null,
    sla: "biz hours",
  },
];

type FormState = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<FormState>("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
    try {
      await emailjs.sendForm(
        serviceId,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        publicKey,
      );
      await emailjs.send(
        serviceId,
        process.env.NEXT_PUBLIC_EMAILJS_AUTO_REPLY_TEMPLATE_ID!,
        { ...form },
        publicKey,
      );
      setFormState("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setFormState("error");
    }
  };

  return (
    <section id="contact" className="section-padding scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          id="07.on-call"
          title="Page on-call"
          subtitle="Open to senior backend roles, system design discussions, or interesting technical collaborations. The on-call engineer is currently me."
          meta={
            <StatusPill tone="ok" pulse>
              accepting pages
            </StatusPill>
          }
        />

        <div className="grid lg:grid-cols-5 gap-3">
          {/* ── Channels ── */}
          <div className="lg:col-span-2 space-y-3">
            {/* Availability banner */}
            <div className="panel p-5">
              <div className="mono-label mb-2">availability</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Currently serving notice. Looking for{" "}
                <span className="text-white">Senior / Staff backend</span> roles —
                Java, Spring Boot, Kafka, React, distributed systems. Open to remote
                or Pune / Bengaluru.
              </p>
            </div>

            {/* Channel rows */}
            <div className="panel overflow-hidden">
              <div className="px-4 py-3 panel-divider border-t-0 flex items-center justify-between">
                <span className="mono-label">channels</span>
                <span className="mono-tag text-[var(--text-chrome)]">
                  {CHANNELS.length} routes
                </span>
              </div>
              <ul>
                {CHANNELS.map(({ icon: Icon, label, value, href, sla }, i) => {
                  const inner = (
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--panel-bg-hover)] transition-colors">
                      <Icon size={13} className="text-[var(--accent)] flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="mono-label">{label}</div>
                        <div className="text-xs text-slate-300 truncate">{value}</div>
                      </div>
                      <span className="mono-tag text-[var(--text-chrome)] shrink-0">
                        {sla}
                      </span>
                    </div>
                  );
                  return (
                    <li key={label} className={i > 0 ? "panel-divider" : ""}>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                        >
                          {inner}
                        </a>
                      ) : (
                        inner
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* ── Form panel ── */}
          <div className="lg:col-span-3">
            <div className="panel overflow-hidden">
              <div className="px-5 py-3 panel-divider border-t-0 flex items-center justify-between">
                <span className="mono-label">POST /api/page</span>
                <span className="mono-tag text-[var(--text-chrome)]">
                  encrypted in transit
                </span>
              </div>

              {formState === "success" ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-10 text-center flex flex-col items-center gap-3"
                >
                  <CheckCircle size={28} className="text-green-400" />
                  <h3 className="text-white font-medium">202 Accepted</h3>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Page received. I&apos;ll respond within 24 hours.
                  </p>
                  <button
                    onClick={() => setFormState("idle")}
                    className="mt-2 px-3 py-1.5 rounded-md text-xs border border-[var(--panel-border)] text-slate-300 hover:text-white hover:border-[var(--panel-border-hover)] transition-colors"
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="p-5 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field
                      name="name"
                      label="name"
                      type="text"
                      placeholder="your name"
                      value={form.name}
                      onChange={handleChange}
                    />
                    <Field
                      name="email"
                      label="email"
                      type="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <Field
                    name="subject"
                    label="subject"
                    type="text"
                    placeholder="job opportunity / technical discussion"
                    value={form.subject}
                    onChange={handleChange}
                  />
                  <div>
                    <label className="mono-label block mb-1.5">message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell me about the role, the system, the team…"
                      className="w-full px-3 py-2.5 rounded-md bg-[var(--bg-primary)] border border-[var(--panel-border)] text-sm text-white placeholder:text-[var(--text-chrome)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 transition-all resize-none font-mono"
                    />
                  </div>

                  {formState === "error" && (
                    <div className="flex items-center gap-2 text-red-400 text-xs border border-red-500/20 bg-red-500/5 rounded-md px-3 py-2">
                      <AlertCircle size={12} />
                      Failed to send. Email me directly at lekh.nith@gmail.com
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formState === "sending"}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-[var(--accent)] text-black font-medium text-sm hover:bg-[#67e8f9] transition-colors disabled:opacity-60"
                  >
                    {formState === "sending" ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        Send page
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label htmlFor={name} className="mono-label block mb-1.5">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-md bg-[var(--bg-primary)] border border-[var(--panel-border)] text-sm text-white placeholder:text-[var(--text-chrome)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 transition-all font-mono"
      />
    </div>
  );
}
