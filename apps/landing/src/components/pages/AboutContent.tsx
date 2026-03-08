"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const values = [
  {
    icon: "🤝",
    title: "Community First",
    description:
      "Every feature we build starts with one question: does this help players connect and play more?",
  },
  {
    icon: "🏓",
    title: "Player-Driven",
    description:
      "Built by pickleball players who know the pain of empty courts, flaky groups, and mismatched games.",
  },
  {
    icon: "🚀",
    title: "Always Improving",
    description:
      "We ship fast, listen to feedback, and iterate relentlessly. The best version of OldPickleball is the next one.",
  },
];

export default function AboutContent() {
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
              About Us
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-text-primary tracking-tight mb-6 mt-4">
              We&apos;re on a mission to fill every court
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
              OldPickleball was born from a simple frustration: finding people
              to play with shouldn&apos;t be harder than the game itself.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-warm-peach-light">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
              The story
            </h2>
            <div className="space-y-4">
              <p className="text-text-secondary leading-[1.7]">
                We were tired of scrolling through Facebook groups, managing
                endless WhatsApp threads, and showing up to courts not knowing
                if anyone else would be there. Sound familiar?
              </p>
              <p className="text-text-secondary leading-[1.7]">
                Pickleball is the fastest-growing sport in America, but the
                infrastructure for finding games, matching by skill, and
                organizing play is stuck in the stone age. We knew there had
                to be a better way.
              </p>
              <p className="text-text-secondary leading-[1.7]">
                So we built OldPickleball — a super app that makes it as easy
                to find your next pickleball game as it is to order food or
                book a ride. Real-time court finder, smart matching, RSVP
                with waitlists, group chat, and a community that shows up.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl md:text-4xl font-bold text-text-primary text-center mb-16"
          >
            What we believe
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center bg-warm-peach rounded-2xl p-8"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                  <span className="text-2xl">{value.icon}</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
                  {value.title}
                </h3>
                <p className="text-text-secondary leading-[1.7]">
                  {value.description}
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
            Join the community
          </h2>
          <p className="text-text-secondary mb-8">
            Be part of the movement that&apos;s making pickleball more accessible
            for everyone.
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
