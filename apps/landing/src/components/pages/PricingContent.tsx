"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { PRICING_PLANS, FAQ } from "@/lib/constants";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="font-heading font-semibold text-slate-900 group-hover:text-pickle-green transition-colors pr-4">
          {question}
        </span>
        <ChevronDown
          size={20}
          className={`text-slate-400 shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
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
            <p className="pb-5 text-slate-500 leading-relaxed">{answer}</p>
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
      <section className="pt-32 pb-16 bg-gradient-to-b from-slate-950 to-court-blue">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-pickle-green font-mono text-sm tracking-widest uppercase mb-4">
              Pricing
            </p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
              Simple pricing.
              <br />
              No surprises.
            </h1>
            <p className="text-slate-300 text-lg">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-padding bg-surface-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {PRICING_PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`rounded-3xl p-8 md:p-10 ${
                  plan.highlighted
                    ? "bg-slate-900 text-white ring-2 ring-pickle-green shadow-2xl shadow-pickle-green/10"
                    : "bg-white border border-slate-200 shadow-sm"
                }`}
              >
                {plan.highlighted && (
                  <span className="inline-block bg-pickle-green text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                    Most Popular
                  </span>
                )}
                <h3
                  className={`font-heading text-2xl font-bold mb-1 ${
                    plan.highlighted ? "text-white" : "text-slate-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span
                    className={`font-heading text-5xl font-extrabold ${
                      plan.highlighted ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={
                      plan.highlighted ? "text-slate-400" : "text-slate-500"
                    }
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  className={`mb-8 ${
                    plan.highlighted ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-10">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        size={18}
                        className={`mt-0.5 shrink-0 ${
                          plan.highlighted
                            ? "text-pickle-green"
                            : "text-pickle-green"
                        }`}
                      />
                      <span
                        className={`text-[15px] ${
                          plan.highlighted ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className={`block text-center font-bold py-3.5 rounded-full transition-all ${
                    plan.highlighted
                      ? "bg-pickle-green hover:bg-pickle-dark text-white shadow-lg shadow-pickle-green/25 hover:scale-105"
                      : "bg-slate-900 hover:bg-slate-800 text-white hover:scale-105"
                  } ${plan.cta === "Coming Soon" ? "opacity-60 pointer-events-none" : ""}`}
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="bg-surface-light rounded-2xl p-6 md:p-8">
            {FAQ.map((item) => (
              <FAQItem key={item.question} {...item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
