"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Check, Shield, Zap, Clock } from "lucide-react";

export default function GoPlayContent() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate API call (will connect to real API later)
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-court-blue to-slate-950 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pickle-green/5 rounded-full blur-3xl" />

      <div className="relative max-w-lg w-full mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-pickle-green/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl">🏓</span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Let&apos;s get you on the court
          </h1>
          <p className="text-slate-400 text-lg mb-10">
            Enter your email to start playing in 60 seconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-pickle-green focus:ring-2 focus:ring-pickle-green/20 transition-all text-lg"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pickle-green hover:bg-pickle-dark text-white font-bold text-lg py-4 rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-pickle-green/25 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send Verification Code
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-pickle-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-pickle-green" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-2">
                Check your email!
              </h3>
              <p className="text-slate-400">
                We sent a 6-digit code to{" "}
                <span className="text-white font-medium">{email}</span>.
                Enter it in the app to get started.
              </p>
            </motion.div>
          )}

          {/* Trust signals */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { icon: Shield, label: "No password needed" },
              { icon: Zap, label: "Free forever" },
              { icon: Clock, label: "Takes 60 seconds" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="text-center">
                <Icon
                  size={18}
                  className="text-pickle-green mx-auto mb-1.5"
                />
                <span className="text-slate-500 text-xs">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
