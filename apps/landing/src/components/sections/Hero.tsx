"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Zap, Clock } from "lucide-react";

const CourtScene = dynamic(
  () => import("@/components/three/CourtScene").then((m) => m.CourtScene),
  { ssr: false }
);

const trustBadges = [
  { icon: Shield, label: "No password needed" },
  { icon: Zap, label: "Free forever" },
  { icon: Clock, label: "Takes 60 seconds" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-white pt-[72px]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16 py-12 lg:py-0">
          {/* LEFT — 3D Court Scene */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative w-full aspect-square max-w-[560px] mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 to-warm-peach">
              <CourtScene />
            </div>
          </div>

          {/* RIGHT — Text + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold text-text-primary leading-[1.08] tracking-tight">
              Find Your Court.
              <br />
              <span className="gradient-text">Join the Game.</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-text-secondary leading-relaxed max-w-lg">
              The app that connects players, fills courts, and kills no-shows.
              Your next pickleball game starts here.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/go-play"
                className="gradient-btn text-lg px-8 py-4 rounded-xl inline-flex items-center gap-2"
              >
                Go Play — It&apos;s Free
                <span aria-hidden>→</span>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center px-8 py-4 rounded-xl border border-gray-200 bg-white text-text-primary font-semibold text-lg hover:border-gray-300 transition-all"
              >
                See How It Works
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-sm text-text-secondary"
                >
                  <Icon size={16} className="text-pickle-green" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
