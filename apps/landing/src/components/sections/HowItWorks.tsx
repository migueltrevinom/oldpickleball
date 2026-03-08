"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { STEPS } from "@/lib/constants";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <p className="text-pickle-green font-mono text-sm tracking-widest uppercase mb-3">
            Start playing in 60 seconds
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Three steps. Zero friction.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px border-t-2 border-dashed border-slate-200" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="text-center relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-pickle-green/10 flex items-center justify-center mx-auto mb-6 relative z-10">
                <span className="font-mono text-pickle-green font-bold text-lg">
                  {step.number}
                </span>
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Link
            href="/go-play"
            className="inline-flex bg-pickle-green hover:bg-pickle-dark text-white font-bold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-lg shadow-pickle-green/20"
          >
            Go Play →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
