"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const CourtScene = dynamic(
  () => import("@/components/three/CourtScene").then((m) => m.CourtScene),
  { ssr: false }
);

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark">
      <CourtScene />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.05] tracking-tight">
            Find Your Court.
            <br />
            Join the{" "}
            <span className="gradient-text">Game</span>.
            <br />
            Play More.
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto"
        >
          The app that connects players, fills courts, and kills no-shows.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/go-play"
            className="bg-pickle-green hover:bg-pickle-dark text-white font-bold text-lg px-8 py-4 rounded-full transition-all hover:scale-105 shadow-lg shadow-pickle-green/25"
          >
            Go Play — It&apos;s Free
          </Link>
          <a
            href="#how-it-works"
            className="text-white/70 hover:text-white font-medium flex items-center gap-1 transition-colors"
          >
            See How It Works
            <ChevronDown size={18} />
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown size={24} className="text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
