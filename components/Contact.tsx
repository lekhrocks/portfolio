"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import emailjs from "@emailjs/browser";

const socials = [
  {
    icon: Mail,
    label: "Email",
    value: "lekh.nith@gmail.com",
    href: "mailto:lekh.nith@gmail.com",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    value: "github.com/lekhrocks",
    href: "https://github.com/lekhrocks",
    color: "text-slate-300",
    bgColor: "bg-white/5",
    borderColor: "border-white/10",
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: "linkedin.com/in/lekhrajkumar",
    href: "https://linkedin.com/in/lekhrajkumar",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Pune, Maharashtra, India",
    href: null,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
];

type FormState = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const ref = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [formState, setFormState] = useState<FormState>("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        publicKey
      );

      await emailjs.send(
        serviceId,
        process.env.NEXT_PUBLIC_EMAILJS_AUTO_REPLY_TEMPLATE_ID!,
        {
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        },
        publicKey
      );

      setFormState("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setFormState("error");
    }
  };

  return (
    <section id="contact" className="section-padding">
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
            06 / Contact
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="section-title text-white mb-4"
          >
            Get In Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 max-w-xl mx-auto"
          >
            Open to senior backend engineering roles, system design discussions, or interesting
            technical collaborations.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left — Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Availability Banner */}
            <div className="glass rounded-2xl p-5 border border-green-500/20 bg-gradient-to-br from-green-950/30 to-cyan-950/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative rounded-full h-2.5 w-2.5 bg-green-400" />
                </span>
                <span className="text-green-400 text-sm font-semibold">Available for Opportunities</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Currently serving notice period. Actively looking for senior backend /
                distributed systems engineering roles. Interested in high-scale systems,
                payments, or SaaS platforms.
              </p>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              {socials.map(({ icon: Icon, label, value, href, color, bgColor, borderColor }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3.5 rounded-xl glass glass-hover border ${borderColor} transition-all group`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${bgColor} border ${borderColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={15} className={color} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-slate-500 font-medium">{label}</div>
                        <div className="text-slate-300 text-xs truncate group-hover:text-white transition-colors">
                          {value}
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className={`flex items-center gap-3 p-3.5 rounded-xl glass border ${borderColor}`}>
                      <div className={`w-8 h-8 rounded-lg ${bgColor} border ${borderColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={15} className={color} />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium">{label}</div>
                        <div className="text-slate-300 text-xs">{value}</div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="glass rounded-2xl border border-white/8 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/5 blur-3xl pointer-events-none" />

              {formState === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 gap-4 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">Message Sent!</h3>
                  <p className="text-slate-400 text-sm max-w-xs">
                    Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setFormState("idle")}
                    className="px-5 py-2 rounded-full text-sm glass border border-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { name: "name", label: "Name", type: "text", placeholder: "Your name" },
                      { name: "email", label: "Email", type: "email", placeholder: "your@email.com" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={form[field.name as keyof typeof form]}
                          onChange={handleChange}
                          required
                          placeholder={field.placeholder}
                          className="w-full px-3.5 py-2.5 rounded-xl glass border border-white/8 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      placeholder="Job opportunity / Technical discussion / Collaboration"
                      className="w-full px-3.5 py-2.5 rounded-xl glass border border-white/8 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell me about the role, project, or opportunity..."
                      className="w-full px-3.5 py-2.5 rounded-xl glass border border-white/8 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                    />
                  </div>

                  {formState === "error" && (
                    <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                      <AlertCircle size={13} />
                      Failed to send. Please try emailing me directly at lekh.nith@gmail.com
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={formState === "sending"}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity disabled:opacity-60"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {formState === "sending" ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
