"use client";

import { motion } from "framer-motion";
import { PAIN_POINTS } from "@/lib/constants";

export function PainPoints() {
  return (
    <section className="section-padding bg-surface-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <p className="text-pickle-green font-mono text-sm tracking-widest uppercase mb-3">
            Why players love us
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Stop searching. Start playing.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {PAIN_POINTS.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-4xl block mb-4">{point.icon}</span>
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
                {point.title}
              </h3>
              <p className="text-slate-500 leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
