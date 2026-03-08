"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FEATURES } from "@/lib/constants";

export default function FeaturesContent() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-pill text-pickle-green border-pickle-green/20 bg-pickle-green/5 mb-4">
              Features
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-text-primary tracking-tight mb-6 mt-4">
              Everything you need to play more pickleball
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
              From finding courts to organizing games — all in one app built by
              players, for players.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="section-padding bg-warm-peach-light">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-[1.7] text-[15px]">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 via-green-50 to-warm-peach text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Ready to try it?
          </h2>
          <p className="text-text-secondary mb-8">
            Sign up in 60 seconds. No credit card required.
          </p>
          <Link
            href="/go-play"
            className="gradient-btn inline-flex items-center gap-2 text-lg px-8 py-4 rounded-xl"
          >
            Go Play — It&apos;s Free
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
