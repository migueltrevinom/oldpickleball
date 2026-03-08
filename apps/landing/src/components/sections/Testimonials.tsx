"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TESTIMONIALS } from "@/lib/constants";

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-pickle-green font-mono text-sm tracking-widest uppercase mb-12">
          What players say
        </p>

        <div className="relative min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <blockquote className="font-heading text-2xl md:text-3xl font-semibold text-slate-900 leading-relaxed mb-8">
                &ldquo;{TESTIMONIALS[current].quote}&rdquo;
              </blockquote>
              <div>
                <p className="font-semibold text-slate-900">
                  {TESTIMONIALS[current].name}
                </p>
                <p className="text-slate-400 text-sm">
                  {TESTIMONIALS[current].location} · Skill{" "}
                  {TESTIMONIALS[current].skill}
                </p>
                <div className="mt-2 text-ball-yellow text-sm">★★★★★</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current
                  ? "bg-pickle-green w-6"
                  : "bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
