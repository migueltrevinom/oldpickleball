"use client";

import { useState } from "react";
import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Go Play", href: "/go-play" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "mailto:hello@oldpickleball.com" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Newsletter row */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading text-xl font-bold text-text-primary mb-1">
              Stay in the loop
            </h3>
            <p className="text-text-secondary text-sm">
              Get updates on new features, courts, and community events.
            </p>
          </div>
          {subscribed ? (
            <p className="text-pickle-green font-medium text-sm">
              ✓ You&apos;re subscribed!
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex items-center gap-3 w-full md:w-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="flex-1 md:w-64 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-pickle-green focus:ring-2 focus:ring-pickle-green/10 transition-all"
              />
              <button
                type="submit"
                className="gradient-btn px-5 py-2.5 text-sm rounded-xl whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏓</span>
              <span className="font-heading font-bold text-lg text-text-primary">
                OldPickleball
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              Find courts, join games, play more pickleball.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading font-semibold text-sm text-text-primary mb-4 uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-text-secondary text-sm hover:text-pickle-green transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social icons */}
        <div className="flex items-center justify-center gap-5 mt-12 mb-8">
          {["Twitter", "Instagram", "Facebook"].map((name) => (
            <a
              key={name}
              href="#"
              className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-text-muted hover:text-pickle-green hover:border-pickle-green/30 transition-all text-sm font-medium"
              aria-label={name}
            >
              {name[0]}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-gray-100">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} OldPickleball. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
