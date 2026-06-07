"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 bg-[linear-gradient(135deg,#D9FF43_0%,#56F1FF_46%,#FF5CAA_100%)] relative overflow-hidden">
      <div className="court-grid absolute inset-0 opacity-25" />
      <div className="noise-overlay absolute inset-0 opacity-25" />
      <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="badge-pill mb-6 border-pop-ink/10 bg-white/70 text-pop-ink">
            Founding players make the map
          </span>
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extrabold text-pop-ink tracking-[-0.05em] mb-6">
            Be early to the court that everyone joins later.
          </h2>
          <p className="text-pop-ink/75 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Join early access as a founding player. No credit card, no
            downloads, no fake launch numbers.
          </p>
          <Link
            href="/go-play"
            className="inline-flex items-center gap-2 rounded-2xl bg-pop-ink px-10 py-5 text-lg font-extrabold text-white shadow-[0_24px_60px_rgba(16,24,40,0.25)] transition-all hover:scale-[1.02]"
          >
            Join Early Access
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
