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
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="badge-pill text-pickle-green border-pickle-green/20 bg-pickle-green/5 mb-6">
          What players say
        </span>

        <div className="relative min-h-[240px] mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <blockquote className="font-heading text-2xl md:text-4xl font-bold text-text-primary leading-snug mb-10">
                &ldquo;{TESTIMONIALS[current].quote}&rdquo;
              </blockquote>
              <div>
                <p className="font-semibold text-text-primary text-lg">
                  {TESTIMONIALS[current].name}
                </p>
                <p className="text-text-muted text-sm mt-1">
                  {TESTIMONIALS[current].location} · Skill{" "}
                  {TESTIMONIALS[current].skill}
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
                  ? "bg-pickle-green w-8"
                  : "bg-gray-200 w-2.5 hover:bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
