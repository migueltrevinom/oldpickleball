"use client";

import { motion } from "framer-motion";
import { PAIN_POINTS } from "@/lib/constants";

export function PainPoints() {
  return (
    <section className="section-padding bg-[#fffdf6] relative overflow-hidden">
      <div className="absolute left-0 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-pop-orange/20 blur-3xl" />
      <div className="absolute right-0 bottom-10 h-72 w-72 translate-x-1/3 rounded-full bg-pop-aqua/20 blur-3xl" />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative text-center mb-16"
        >
          <span className="badge-pill text-pop-purple border-pop-purple/20 bg-pop-purple/10 mb-4">
            The real villain
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-text-primary tracking-tight mt-4">
            Pickleball plans should not live in five different places.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
            The message is simple: less hunting, less guessing, more actual
            games with people at the right level.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {PAIN_POINTS.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15 }}
              className="relative overflow-hidden rounded-[2rem] border border-white bg-white/80 p-8 shadow-[0_24px_60px_rgba(16,24,40,0.08)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-pop-lime/60 to-pop-aqua/50" />
              <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-pop-lime to-pop-aqua flex items-center justify-center mb-6 shadow-lg shadow-pop-aqua/20">
                <span className="text-2xl">{point.icon}</span>
              </div>
              <h3 className="relative font-heading text-2xl font-extrabold text-text-primary mb-3">
                {point.title}
              </h3>
              <p className="relative text-text-secondary leading-[1.7]">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
