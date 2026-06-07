"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Shield, Users } from "lucide-react";

const CourtScene = dynamic(
  () => import("@/components/three/CourtScene").then((m) => m.CourtScene),
  { ssr: false }
);

const trustBadges = [
  { icon: Users, label: "Free for founding players" },
  { icon: MapPin, label: "Built for real local games" },
  { icon: Shield, label: "No password needed" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-[72px]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#fffdf6_0%,#eaff9f_32%,#8af8ff_68%,#ffd8ec_100%)]" />
      <div className="court-grid absolute inset-0 opacity-40" />
      <div className="noise-overlay absolute inset-0 opacity-25" />
      <div className="absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-white/40 blur-3xl" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
        <div className="flex min-h-[calc(100vh-72px)] flex-col-reverse lg:flex-row items-center gap-10 lg:gap-14 py-12 lg:py-0">
          {/* LEFT — 3D Court Scene */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute -left-5 top-10 z-10 rotate-[-8deg] rounded-full bg-white px-5 py-3 font-heading text-sm font-bold shadow-xl shadow-black/10">
              Founding players wanted
            </div>
            <div className="absolute -right-3 bottom-12 z-10 rotate-[6deg] rounded-3xl bg-pop-lime px-5 py-4 font-heading text-lg font-extrabold text-pop-ink shadow-xl shadow-black/10">
              RSVP. Show up. Play.
            </div>
            <div className="relative w-full aspect-square max-w-[560px] mx-auto overflow-hidden rounded-[2.25rem] border-[10px] border-white/70 bg-gradient-to-br from-court-blue via-court-surface to-pickle-green shadow-[0_35px_90px_rgba(16,24,40,0.22)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(217,255,67,0.4),transparent_30%),radial-gradient(circle_at_80%_85%,rgba(255,92,170,0.25),transparent_35%)]" />
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
            <span className="badge-pill mb-5 border-pop-ink/10 bg-white/70 text-pop-ink shadow-sm">
              Pickleball without the group chat mess
            </span>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-extrabold text-pop-ink leading-[0.95] tracking-[-0.05em]">
              Play more.
              <br />
              <span className="gradient-text">Plan less.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg md:text-xl text-pop-ink/75 leading-relaxed">
              A colorful player network for finding courts, joining sessions,
              and filling games without stale spreadsheets, lost texts, or
              last-minute no-show confusion.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/go-play"
                className="gradient-btn text-lg px-8 py-4 rounded-2xl inline-flex items-center gap-2"
              >
                Join Early Access
                <span aria-hidden>→</span>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center px-8 py-4 rounded-2xl border border-pop-ink/10 bg-white/70 text-pop-ink font-bold text-lg shadow-sm backdrop-blur hover:bg-white transition-all"
              >
                See how it works
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-sm font-semibold text-pop-ink/75 shadow-sm backdrop-blur"
                >
                  <Icon size={16} className="text-pickle-dark" />
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
