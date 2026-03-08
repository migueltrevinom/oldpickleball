"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { STEPS } from "@/lib/constants";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <span className="badge-pill text-pickle-green border-pickle-green/20 bg-pickle-green/5 mb-4">
            Start playing in 60 seconds
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-text-primary tracking-tight mt-4">
            Three steps. Zero friction.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-16 relative">
          {/* Connecting dashed line (desktop) */}
          <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px border-t-2 border-dashed border-gray-200" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="text-center relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pickle-green to-emerald-500 flex items-center justify-center mx-auto mb-6 relative z-10 shadow-md shadow-pickle-green/20">
                <span className="font-heading text-white font-bold text-lg">
                  {step.number}
                </span>
              </div>
              <h3 className="font-heading text-xl font-bold text-text-primary mb-3">
                {step.title}
              </h3>
              <p className="text-text-secondary leading-[1.7] max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            href="/go-play"
            className="gradient-btn inline-flex items-center gap-2 px-8 py-4 text-lg rounded-xl"
          >
            Go Play
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
