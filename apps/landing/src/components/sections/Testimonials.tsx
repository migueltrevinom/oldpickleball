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
    <section className="section-padding bg-pop-ink relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(217,255,67,0.18),transparent_30%),radial-gradient(circle_at_85%_70%,rgba(255,92,170,0.16),transparent_28%)]" />
      <div className="relative max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="badge-pill text-pop-lime border-pop-lime/30 bg-pop-lime/10 mb-6">
          What we are building around
        </span>

        <div className="relative min-h-[260px] mt-10 rounded-[2rem] border border-white/10 bg-white/[0.07] p-8 md:p-12 shadow-2xl shadow-black/20 backdrop-blur">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <blockquote className="font-heading text-3xl md:text-5xl font-extrabold text-white leading-tight mb-10 tracking-tight">
                &ldquo;{TESTIMONIALS[current].quote}&rdquo;
              </blockquote>
              <div>
                <p className="font-semibold text-pop-lime text-lg">
                  {TESTIMONIALS[current].label}
                </p>
                <p className="text-white/60 text-sm mt-1">
                  {TESTIMONIALS[current].detail}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2.5 mt-10">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-pop-lime w-8"
                  : "bg-white/20 w-2.5 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
