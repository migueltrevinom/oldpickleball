"use client";

import { motion } from "framer-motion";
import { LAUNCH_PROOF } from "@/lib/constants";

export function LaunchProof() {
  return (
    <section className="py-20 md:py-28 bg-pop-ink relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 flex overflow-hidden whitespace-nowrap bg-pop-lime py-3 font-heading text-sm font-extrabold uppercase tracking-[0.22em] text-pop-ink">
        <div className="flex min-w-full animate-[marquee_22s_linear_infinite] gap-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i}>
              Join early access · Founding players wanted · Build the local play
              graph · No fake stats ·
            </span>
          ))}
        </div>
      </div>
      <div className="court-grid absolute inset-0 opacity-10 invert" />
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-pop-aqua/25 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-pop-pink/25 blur-3xl" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mb-12 md:mb-16"
        >
          <span className="badge-pill text-pop-lime border-pop-lime/30 bg-pop-lime/10 mb-5">
            Honest launch energy
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white tracking-tight">
            No fake numbers. Just a better way to get a game going.
          </h2>
          <p className="mt-5 text-lg text-emerald-50/75 leading-relaxed">
            The first version is about one clear job: help players discover who
            is playing, where it is happening, and how to claim a spot.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {LAUNCH_PROOF.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/20 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.12]"
            >
              <div className="mb-8 h-12 w-12 rounded-2xl bg-gradient-to-br from-pop-lime to-pop-aqua shadow-lg shadow-pop-aqua/10" />
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-pop-lime">
                {item.eyebrow}
              </p>
              <h3 className="mt-4 font-heading text-xl font-bold leading-tight text-white">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-emerald-50/70">
                {item.description}
              </p>
              <div className="mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-pickle-green to-emerald-300 transition-all duration-300 group-hover:w-20" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
