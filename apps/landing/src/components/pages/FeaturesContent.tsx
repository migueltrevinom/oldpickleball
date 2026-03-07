"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FEATURES } from "@/lib/constants";

export default function FeaturesContent() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-slate-950 to-court-blue">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-pickle-green font-mono text-sm tracking-widest uppercase mb-4">
              Features
            </p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
              Everything you need to play more pickleball
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              From finding courts to organizing games — all in one app built by
              players, for players.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="section-padding bg-surface-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </span>
                <h3 className="font-heading text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-[15px]">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ready to try it?
          </h2>
          <p className="text-slate-500 mb-8">
            Sign up in 60 seconds. No credit card required.
          </p>
          <Link
            href="/go-play"
            className="inline-flex bg-pickle-green hover:bg-pickle-dark text-white font-bold text-lg px-8 py-4 rounded-full transition-all hover:scale-105 shadow-lg shadow-pickle-green/20"
          >
            Go Play — It&apos;s Free
          </Link>
        </div>
      </section>
    </>
  );
}
