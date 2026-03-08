"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const previews = [
  {
    title: "Real-Time Court Finder",
    description:
      "Interactive map showing every court near you. Filter by surface, indoor/outdoor, lighting, and open play schedules. Community-verified and always up to date.",
    visual: "📍🗺️",
    bgColor: "bg-warm-peach",
  },
  {
    title: "Smart RSVP & Waitlist",
    description:
      "One-tap join with automatic waitlist promotion when spots open. Skill-filtered sessions, reminders 24h before, and reliability tracking to stop no-shows.",
    visual: "📋✅",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Session Group Chat",
    description:
      'Per-game chat rooms that replace WhatsApp chaos. Coordinate gear, confirm attendance, and trash talk — all in one place. "Who\'s bringing extra balls?"',
    visual: "💬🏓",
    bgColor: "bg-warm-peach-light",
  },
];

export function FeaturePreview() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <span className="badge-pill text-pickle-green border-pickle-green/20 bg-pickle-green/5 mb-4">
            Everything you need to play more
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-text-primary tracking-tight mt-4">
            Built for pickleball players
          </h2>
        </motion.div>

        <div className="space-y-12">
          {previews.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.1 }}
              className={`flex flex-col ${
                i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              } gap-8 lg:gap-12 items-center`}
            >
              {/* Visual placeholder */}
              <div
                className={`flex-1 w-full aspect-[4/3] md:aspect-auto md:min-h-[320px] rounded-2xl ${feature.bgColor} flex items-center justify-center`}
              >
                <span className="text-7xl md:text-8xl opacity-60">
                  {feature.visual}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-4">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-lg leading-[1.7]">
                  {feature.description}
                </p>
                <Link
                  href="/features"
                  className="inline-flex items-center gap-1 text-pickle-green font-semibold mt-6 hover:gap-2 transition-all"
                >
                  Learn more
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
