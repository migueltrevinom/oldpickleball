"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { STEPS } from "@/lib/constants";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-white relative overflow-hidden">
      <div className="court-grid absolute inset-0 opacity-30" />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative text-center mb-20"
        >
          <span className="badge-pill text-pickle-dark border-pickle-green/20 bg-pop-lime/60 mb-4">
            Simple enough to explain in one scroll
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-text-primary tracking-tight mt-4">
            See a game. Claim a spot. Show up.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Connecting dashed line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[18%] right-[18%] h-px border-t-2 border-dashed border-pop-purple/25" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative rounded-[2rem] border border-gray-100 bg-white/85 p-8 text-center shadow-[0_18px_50px_rgba(16,24,40,0.08)] backdrop-blur"
            >
              <div className="w-20 h-20 rounded-[1.75rem] bg-gradient-to-br from-pop-purple via-pop-pink to-pop-orange flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg shadow-pop-pink/20">
                <span className="font-heading text-white font-extrabold text-xl">
                  {step.number}
                </span>
              </div>
              <h3 className="font-heading text-2xl font-extrabold text-text-primary mb-3">
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
            className="gradient-btn inline-flex items-center gap-2 px-8 py-4 text-lg rounded-2xl"
          >
            Join Early Access
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
