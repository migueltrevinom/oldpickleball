"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FAQ as FAQ_DATA } from "@/lib/constants";

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
          <Minus
            size={20}
            className="text-pickle-green shrink-0"
          />
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

export function FAQ() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* LEFT — Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:w-5/12 lg:sticky lg:top-32 lg:self-start"
          >
            <span className="badge-pill text-pickle-green border-pickle-green/20 bg-pickle-green/5 mb-4">
              FAQ
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight mt-4">
              Frequently asked questions
            </h2>
            <p className="text-text-secondary mt-4 leading-relaxed">
              Everything you need to know about OldPickleball. Can&apos;t find the
              answer you&apos;re looking for? Reach out to us.
            </p>
          </motion.div>

          {/* RIGHT — Accordion */}
          <div className="lg:w-7/12">
            {FAQ_DATA.map((item) => (
              <FAQItem key={item.question} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
