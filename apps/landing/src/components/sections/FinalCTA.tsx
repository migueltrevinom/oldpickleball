"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-emerald-50 via-green-50 to-warm-peach relative overflow-hidden">
      {/* Decorative blurred circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pickle-green/5 rounded-full blur-3xl" />

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight mb-6">
            Ready to find your next game?
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto">
            No credit card. No downloads. Just play.
          </p>
          <Link
            href="/go-play"
            className="gradient-btn inline-flex items-center gap-2 text-lg px-10 py-5 rounded-xl"
          >
            Go Play — It&apos;s Free
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
