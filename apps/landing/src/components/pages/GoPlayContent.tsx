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
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-warm-peach relative overflow-hidden">
      {/* Decorative blurred circle */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pickle-green/5 rounded-full blur-3xl" />

      <div className="relative max-w-lg w-full mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-100">
            <span className="text-4xl">🏓</span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">
            Let&apos;s get you on the court
          </h1>
          <p className="text-text-secondary text-lg mb-10">
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-pickle-green focus:ring-2 focus:ring-pickle-green/10 transition-all text-lg"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-btn text-lg py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
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
              className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-pickle-green" />
              </div>
              <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
                Check your email!
              </h3>
              <p className="text-text-secondary">
                We sent a 6-digit code to{" "}
                <span className="text-text-primary font-medium">{email}</span>.
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
                <span className="text-text-muted text-xs">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
