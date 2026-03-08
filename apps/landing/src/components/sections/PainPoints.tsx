"use client";

import { motion } from "framer-motion";
import { PAIN_POINTS } from "@/lib/constants";

export function PainPoints() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="badge-pill text-pickle-green border-pickle-green/20 bg-pickle-green/5 mb-4">
            Why players love us
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-text-primary tracking-tight mt-4">
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
              className="bg-warm-peach rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
                <span className="text-2xl">{point.icon}</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
                {point.title}
              </h3>
              <p className="text-text-secondary leading-[1.7]">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
