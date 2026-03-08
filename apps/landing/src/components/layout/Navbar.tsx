"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <span className="text-2xl">🏓</span>
              <span className="font-heading font-bold text-xl tracking-tight text-text-primary">
                OldPickleball
              </span>
            </Link>

            {/* Desktop Links — centered */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link
                href="/go-play"
                className="gradient-btn text-sm px-5 py-2.5 rounded-xl"
              >
                Go Play
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-text-primary"
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
                className="text-lg font-heading font-semibold text-text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/go-play"
              onClick={() => setMobileOpen(false)}
              className="gradient-btn text-center py-3 rounded-xl mt-4"
            >
              Go Play — It&apos;s Free
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
