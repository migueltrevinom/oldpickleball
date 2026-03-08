"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🏓</span>
              <span
                className={`font-heading font-bold text-xl tracking-tight ${
                  scrolled ? "text-slate-900" : "text-white"
                }`}
              >
                OldPickleball
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-pickle-green ${
                    scrolled ? "text-slate-600" : "text-white/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link
                href="/go-play"
                className="bg-pickle-green hover:bg-pickle-dark text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all hover:scale-105 animate-pulse-soft"
              >
                Go Play
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`md:hidden p-2 ${
                  scrolled ? "text-slate-900" : "text-white"
                }`}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-20 px-6 md:hidden">
          <div className="flex flex-col gap-6 pt-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-heading font-semibold text-slate-900"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/go-play"
              onClick={() => setMobileOpen(false)}
              className="bg-pickle-green text-white font-semibold text-center py-3 rounded-full mt-4"
            >
              Go Play — It&apos;s Free
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
