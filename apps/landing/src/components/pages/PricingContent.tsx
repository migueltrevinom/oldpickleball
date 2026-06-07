"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check, Plus, Minus } from "lucide-react";
import { PRICING_PLANS, FAQ } from "@/lib/constants";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="font-heading font-semibold text-text-primary text-lg pr-4 group-hover:text-pickle-green transition-colors">
          {question}
        </span>
        {open ? (
          <Minus size={20} className="text-pickle-green shrink-0" />
        ) : (
          <Plus
            size={20}
            className="text-text-muted shrink-0 group-hover:text-pickle-green transition-colors"
          />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-text-secondary leading-[1.7]">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PricingContent() {
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
              Pricing
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-text-primary tracking-tight mb-6 mt-4">
              Simple pricing.
              <br />
              No surprises.
            </h1>
            <p className="text-text-secondary text-lg">
              Early access is free while the player network takes shape.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-padding bg-warm-peach-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {PRICING_PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`rounded-2xl p-8 md:p-10 ${
                  plan.highlighted
                    ? "bg-white ring-2 ring-pickle-green shadow-xl shadow-pickle-green/10"
                    : "bg-white border border-gray-200"
                }`}
              >
                {plan.highlighted && (
                  <span className="inline-block bg-pickle-green/10 text-pickle-green text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 border border-pickle-green/20">
                    Planned
                  </span>
                )}
                <h3 className="font-heading text-2xl font-bold text-text-primary mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-heading text-5xl font-extrabold text-text-primary">
                    {plan.price}
                  </span>
                  <span className="text-text-muted">{plan.period}</span>
                </div>
                <p className="mb-8 text-text-secondary">{plan.description}</p>

                <ul className="space-y-3 mb-10">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        size={18}
                        className="mt-0.5 shrink-0 text-pickle-green"
                      />
                      <span className="text-[15px] text-text-secondary">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className={`block text-center font-bold py-3.5 rounded-xl transition-all ${
                    plan.highlighted
                      ? "gradient-btn"
                      : "bg-text-primary text-white hover:bg-gray-800 hover:scale-[1.02]"
                  } ${
                    plan.cta === "Coming Soon"
                      ? "opacity-60 pointer-events-none"
                      : ""
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:w-5/12 lg:sticky lg:top-32 lg:self-start"
            >
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
                Frequently asked questions
              </h2>
            </motion.div>
            <div className="lg:w-7/12">
              {FAQ.map((item) => (
                <FAQItem key={item.question} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
