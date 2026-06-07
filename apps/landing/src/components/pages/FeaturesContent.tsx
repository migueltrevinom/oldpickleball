"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FEATURES } from "@/lib/constants";
import {
  CalendarCheck,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Users,
} from "lucide-react";

const previews = [
  {
    title: "Real-Time Court Finder",
    description:
      "A cleaner court map for locations, amenities, indoor/outdoor notes, lighting, and open play schedules as players add local knowledge.",
    visual: "map",
    bgColor: "from-pop-lime to-pop-aqua",
  },
  {
    title: "Smart RSVP & Waitlist",
    description:
      "One-tap join, skill-filtered sessions, reminders, and waitlists designed to make planned games easier to fill.",
    visual: "rsvp",
    bgColor: "from-pop-purple to-pop-pink",
  },
  {
    title: "Session Group Chat",
    description:
      'Per-game chat rooms for gear, arrivals, last-minute changes, and the one question every session asks: "Who is bringing extra balls?"',
    visual: "chat",
    bgColor: "from-pop-orange to-ball-yellow",
  },
] as const;

function FeatureVisual({ type }: { type: (typeof previews)[number]["visual"] }) {
  if (type === "map") {
    return (
      <div className="relative h-full min-h-[220px] w-full overflow-hidden rounded-3xl border border-pop-ink/10 bg-[#f4fff8]">
        <div className="court-grid absolute inset-0 opacity-60" />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 420 220"
          role="img"
          aria-label="Stylized map of nearby pickleball courts"
        >
          <path
            d="M28 166 C104 92 159 194 230 112 S340 61 395 103"
            fill="none"
            stroke="#101828"
            strokeDasharray="10 10"
            strokeLinecap="round"
            strokeWidth="5"
            opacity="0.16"
          />
        </svg>
        <div className="absolute left-[7%] top-[16%] h-20 w-28 rotate-[-5deg] rounded-[1.25rem] border-[3px] border-white bg-pop-aqua/80 p-2 shadow-lg">
          <div className="h-full rounded-xl border-2 border-white/80">
            <div className="h-1/2 border-b-2 border-white/80" />
            <div className="mx-auto h-full w-px -translate-y-1/2 bg-white/80" />
          </div>
        </div>
        <div className="absolute right-[8%] top-[13%] h-20 w-24 rotate-[7deg] rounded-[1.25rem] border-[3px] border-white bg-pop-lime/90 p-2 shadow-lg">
          <div className="h-full rounded-xl border-2 border-pop-ink/20">
            <div className="h-1/2 border-b-2 border-pop-ink/20" />
            <div className="mx-auto h-full w-px -translate-y-1/2 bg-pop-ink/20" />
          </div>
        </div>
        <div className="absolute bottom-[18%] left-[25%] h-24 w-36 rotate-[3deg] rounded-[1.5rem] border-[3px] border-white bg-pop-orange/80 p-2 shadow-lg">
          <div className="h-full rounded-2xl border-2 border-white/80">
            <div className="h-1/2 border-b-2 border-white/80" />
            <div className="mx-auto h-full w-px -translate-y-1/2 bg-white/80" />
          </div>
        </div>
        <div className="absolute left-[42%] top-[24%] rounded-full bg-pop-ink p-3 text-white shadow-xl ring-4 ring-white">
          <MapPin size={24} fill="currentColor" />
        </div>
        <div className="absolute right-[24%] bottom-[36%] rounded-full bg-white p-2 text-pickle-green shadow-xl ring-4 ring-pop-lime">
          <MapPin size={18} fill="currentColor" />
        </div>
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-heading text-base font-extrabold text-pop-ink">
                Riverside Courts
              </p>
              <p className="mt-0.5 text-xs font-semibold text-pop-ink/55">
                2.1 mi away · 4 open spots at 6:30
              </p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-pop-lime text-pop-ink">
              <Navigation size={20} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "rsvp") {
    return (
      <div className="h-full rounded-3xl border border-pop-ink/10 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-heading text-lg font-extrabold text-pop-ink">
              Tonight, 6:30 PM
            </p>
            <p className="text-sm font-semibold text-pop-ink/50">
              Mixed doubles - 3.0 to 3.5
            </p>
          </div>
          <CalendarCheck className="text-pop-purple" size={30} />
        </div>
        <div className="space-y-3">
          {[
            ["Miguel", "In"],
            ["Ana", "In"],
            ["Jordan", "Waitlist"],
          ].map(([name, status]) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-2xl bg-pop-ink px-4 py-3 text-white"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
                  <Users size={17} />
                </div>
                <span className="font-bold">{name}</span>
              </div>
              <span className="rounded-full bg-pop-lime px-3 py-1 text-xs font-extrabold text-pop-ink">
                {status}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl bg-pop-lime/45 p-4 text-sm font-bold text-pop-ink">
          1 spot left. Auto-promote waitlist if someone cancels.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full rounded-3xl border border-pop-ink/10 bg-[#fffaf0] p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pop-ink text-white">
          <MessageCircle size={24} />
        </div>
        <div>
          <p className="font-heading text-lg font-extrabold text-pop-ink">
            Court 4 chat
          </p>
          <p className="flex items-center gap-1 text-sm font-semibold text-pop-ink/50">
            <Clock size={14} /> Starts in 42 min
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="mr-10 rounded-[1.25rem] rounded-tl-sm bg-white p-4 text-sm font-semibold text-pop-ink shadow-sm">
          I have two extra balls.
        </div>
        <div className="ml-10 rounded-[1.25rem] rounded-tr-sm bg-pop-aqua p-4 text-sm font-bold text-pop-ink shadow-sm">
          Great. I am grabbing court 4.
        </div>
        <div className="mr-16 rounded-[1.25rem] rounded-tl-sm bg-white p-4 text-sm font-semibold text-pop-ink shadow-sm">
          Running five minutes late.
        </div>
      </div>
    </div>
  );
}

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

      {/* Visual Feature Previews */}
      <section className="py-20 bg-white/50 border-t border-b border-pop-ink/5">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <span className="badge-pill text-pop-purple border-pop-purple/20 bg-white mb-4">
              The product, in plain English
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-text-primary tracking-tight mt-4">
              One place for the messy stuff before the match.
            </h2>
          </motion.div>

          <div className="space-y-24">
            {previews.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 }}
                className={`flex flex-col ${
                  i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                } gap-8 lg:gap-16 items-center`}
              >
                {/* Product-style visual */}
                <div
                  className={`relative flex-1 w-full aspect-[4/3] md:aspect-auto md:min-h-[340px] overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${feature.bgColor} p-6 shadow-[0_28px_70px_rgba(16,24,40,0.13)]`}
                >
                  <div className="court-grid absolute inset-0 opacity-20" />
                  <div className="relative h-full rounded-[1.75rem] border border-white/50 bg-white/75 p-5 shadow-xl backdrop-blur">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-pop-ink/60">
                        Live board
                      </span>
                      <span className="rounded-full bg-pop-lime px-3 py-1 text-xs font-bold text-pop-ink">
                        Early
                      </span>
                    </div>
                    <div className="min-h-[220px] rounded-3xl border border-pop-ink/10 bg-white">
                      <FeatureVisual type={feature.visual} />
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {["Court", "Skill", "Spots"].map((label) => (
                        <div
                          key={label}
                          className="rounded-2xl bg-pop-ink px-3 py-2 text-center text-xs font-bold text-white"
                        >
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="font-heading text-3xl md:text-4xl font-extrabold text-text-primary mb-4 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-lg leading-[1.7]">
                    {feature.description}
                  </p>
                  <Link
                    href="/go-play"
                    className="inline-flex items-center gap-1.5 text-pickle-green font-bold mt-6 hover:gap-2.5 transition-all text-base"
                  >
                    Get early access
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="section-padding bg-warm-peach-light">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge-pill text-pop-orange border-pop-orange/20 bg-white mb-4">
              All Features
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary tracking-tight mt-4">
              Built for how players actually coordinate
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 group shadow-sm border border-pop-ink/5"
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
