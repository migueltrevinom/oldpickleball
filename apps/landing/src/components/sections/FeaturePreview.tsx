"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const previews = [
  {
    title: "Real-Time Court Finder",
    description:
      "Interactive map showing every court near you. Filter by surface, indoor/outdoor, lighting, and open play schedules. Community-verified and always up to date.",
    visual: "📍🗺️",
    color: "from-blue-500/10 to-cyan-500/10",
  },
  {
    title: "Smart RSVP & Waitlist",
    description:
      "One-tap join with automatic waitlist promotion when spots open. Skill-filtered sessions, reminders 24h before, and reliability tracking to stop no-shows.",
    visual: "📋✅",
    color: "from-green-500/10 to-emerald-500/10",
  },
  {
    title: "Session Group Chat",
    description:
      'Per-game chat rooms that replace WhatsApp chaos. Coordinate gear, confirm attendance, and trash talk — all in one place. "Who\'s bringing extra balls?"',
    visual: "💬🏓",
    color: "from-purple-500/10 to-pink-500/10",
  },
];

export function FeaturePreview() {
  return (
    <section className="section-padding bg-surface-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <p className="text-pickle-green font-mono text-sm tracking-widest uppercase mb-3">
            Everything you need to play more
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Built for pickleball players
          </h2>
        </motion.div>

        <div className="space-y-8">
          {previews.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.1 }}
              className={`flex flex-col ${
                i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              } gap-8 items-center bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm`}
            >
              {/* Visual placeholder */}
              <div
                className={`flex-1 w-full aspect-[4/3] md:aspect-auto md:min-h-[280px] rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}
              >
                <span className="text-7xl md:text-8xl opacity-60">
                  {feature.visual}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/features"
            className="text-pickle-green hover:text-pickle-dark font-semibold inline-flex items-center gap-1 transition-colors"
          >
            See All Features →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
