"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Star, Shield, Smartphone, QrCode } from "lucide-react";

const CourtScene = dynamic(
  () => import("@/components/three/CourtScene").then((m) => m.CourtScene),
  { ssr: false }
);

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-[80px] flex items-center bg-[#fffdf6]">
      {/* Premium vibrant HSL-curated background gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#fffdf6_0%,#eaff9f_28%,#8af8ff_65%,#ffd8ec_100%)]" />
      <div className="court-grid absolute inset-0 opacity-[0.35]" />
      <div className="noise-overlay absolute inset-0 opacity-20" />
      
      {/* Glowing backdrop elements */}
      <div className="absolute left-1/3 top-1/4 h-[350px] w-[350px] rounded-full bg-pop-lime/30 blur-[120px]" />
      <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-pop-aqua/20 blur-[130px]" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN — Value Prop & CTA Download Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 text-left"
          >
            <span className="badge-pill mb-6 border-pop-ink/10 bg-white/70 text-pop-ink shadow-sm">
              ⚡️ The Pickleball Super App
            </span>
            
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold text-pop-ink leading-[0.95] tracking-[-0.05em]">
              Play more.
              <br />
              <span className="gradient-text">Plan less.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg md:text-xl text-pop-ink/75 leading-relaxed font-body">
              Discover local courts, RSVP to skill-matched games, and coordinate
              details with in-app chat. No spam group texts, no no-shows, and zero setup friction.
            </p>

            {/* App Store / Google Play styled buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {/* App Store button */}
              <a
                href="/go-play"
                className="flex items-center gap-3.5 bg-pop-ink text-white px-6 py-3.5 rounded-2xl hover:scale-[1.03] transition-all shadow-[0_16px_40px_rgba(16,24,40,0.15)] group"
              >
                {/* Custom Apple logo path for sharpness */}
                <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.1,16.67C20.08,16.74 19.67,18.11 18.71,19.5M15.97,4.17C16.63,3.37 17.07,2.28 16.95,1C16,1.04 14.9,1.6 14.24,2.38C13.68,3.04 13.19,4.14 13.34,5.39C14.39,5.47 15.4,4.88 15.97,4.17Z" />
                </svg>
                <div className="text-left leading-none">
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block mb-0.5">Download on the</span>
                  <span className="text-base font-extrabold font-heading text-white">App Store</span>
                </div>
                <div className="border-l border-white/10 pl-3.5 ml-1 text-left hidden sm:block">
                  <div className="flex items-center text-xs font-extrabold text-pop-lime">
                    <Star size={11} className="fill-current mr-0.5" /> 4.8
                  </div>
                  <div className="text-[9px] opacity-40 uppercase tracking-wider font-semibold">10k+ Ratings</div>
                </div>
              </a>

              {/* Google Play button */}
              <a
                href="/go-play"
                className="flex items-center gap-3.5 bg-pop-ink text-white px-6 py-3.5 rounded-2xl hover:scale-[1.03] transition-all shadow-[0_16px_40px_rgba(16,24,40,0.15)] group"
              >
                {/* Custom Google Play logo path for sharpness */}
                <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                  <path d="M5,3.29A2.43,2.43,0,0,0,4.28,5.08v13.8a2.53,2.53,0,0,0,.71,1.83l.08.07L13,12.91v-.15L5.07,3.22Z" />
                  <path d="M16.29,16.14,13,12.87v-.07l3.3,3.34.08-.05,3.87-2.2A1.91,1.91,0,0,0,21.36,12a1.88,1.88,0,0,0-1.12-1.74l-3.87-2.2-.08-.05L13,11.28v.07l3.29,3.31Z" />
                  <path d="M13,11.35,5.07,3.29a1.69,1.69,0,0,0-1,0l8.94,8.1Z" />
                  <path d="M13,14.41l-8.94,8.1c.32,0,.7-.07,1-.25l8.94-8.1Z" />
                </svg>
                <div className="text-left leading-none">
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block mb-0.5">Get it on</span>
                  <span className="text-base font-extrabold font-heading text-white">Google Play</span>
                </div>
                <div className="border-l border-white/10 pl-3.5 ml-1 text-left hidden sm:block">
                  <div className="flex items-center text-xs font-extrabold text-pop-aqua">
                    <Star size={11} className="fill-current mr-0.5" /> 4.7
                  </div>
                  <div className="text-[9px] opacity-40 uppercase tracking-wider font-semibold">50k+ Installs</div>
                </div>
              </a>
            </div>

            {/* Quick Web app link / trust signals */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-pop-ink/60">
              <span className="flex items-center gap-1.5 font-semibold">
                <Shield size={16} className="text-pickle-dark" />
                No account password needed
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Smartphone size={16} className="text-pickle-dark" />
                Works on Web, iOS, & Android
              </span>
            </div>
          </motion.div>

          {/* RIGHT COLUMN — Glassmorphic Phone device mockup containing 3D court and App UI mockup overlays */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            {/* Phone Shadow and glowing background ring */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[660px] rounded-[3.5rem] bg-gradient-to-tr from-pop-lime/20 via-pop-aqua/30 to-pop-pink/15 blur-2xl -z-10" />

            {/* Smartphone Outer Container */}
            <div className="relative w-[310px] h-[620px] mx-auto rounded-[3.25rem] border-[10px] border-pop-ink bg-pop-ink shadow-[0_30px_70px_rgba(16,24,40,0.35)] overflow-hidden">
              
              {/* Dynamic Island Notched area */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 rounded-full bg-pop-ink z-30 flex items-center justify-between px-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]" />
                <div className="w-8 h-1 rounded-full bg-[#1a1a1a]" />
              </div>

              {/* Status bar mock */}
              <div className="absolute top-0.5 left-0 right-0 h-8 px-6 flex items-center justify-between text-[10px] font-extrabold text-pop-ink/75 z-30 select-none font-mono">
                <span>9:41 AM</span>
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <div className="w-4 h-2 rounded-sm border border-pop-ink/70 p-[1px] flex items-center">
                    <div className="w-2.5 h-full bg-pop-ink/80 rounded-[1px]" />
                  </div>
                </div>
              </div>

              {/* Screen Contents wrapper */}
              <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-court-blue via-court-surface to-[#eaff9f]/30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(217,255,67,0.2),transparent_35%),radial-gradient(circle_at_80%_85%,rgba(255,92,170,0.15),transparent_40%)]" />

                {/* Interactive 3D Canvas Scene inside phone */}
                <div className="absolute inset-0 z-0">
                  <CourtScene />
                </div>

                {/* APP UI MOCK: Search Bar Header Overlay */}
                <div className="absolute top-11 left-4 right-4 z-20">
                  <div className="flex items-center gap-2 bg-white/85 backdrop-blur border border-white/50 rounded-full px-4 py-2.5 shadow-[0_8px_24px_rgba(16,24,40,0.08)]">
                    <span className="text-xs">🔍</span>
                    <span className="text-[11px] font-semibold text-pop-ink/65 tracking-tight">
                      Search courts in Memorial Park...
                    </span>
                  </div>
                </div>

                {/* APP UI MOCK: Interactive Court Pin */}
                <div className="absolute top-[42%] left-[45%] z-20 flex flex-col items-center">
                  <div className="bg-pop-ink text-white font-extrabold text-[9px] px-2.5 py-1 rounded-full shadow-lg border border-white/20 whitespace-nowrap animate-float flex items-center gap-1">
                    <span>🏓 Court 1 Active</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-pop-lime animate-pulse" />
                  </div>
                  <div className="w-2 h-2 bg-pop-ink rotate-45 -mt-1 shadow-md" />
                </div>

                {/* APP UI MOCK: Bottom Floating Game Card */}
                <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur border border-white/25 rounded-2xl p-4 shadow-[0_16px_32px_rgba(16,24,40,0.18)]">
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <h4 className="font-heading text-xs font-bold text-pop-ink leading-tight">
                        Memorial Park Courts
                      </h4>
                      <p className="text-[9px] text-pop-ink/60 font-semibold mt-0.5">
                        Today • 6:30 PM • Session #4
                      </p>
                    </div>
                    <span className="text-[9px] font-bold tracking-wider text-pop-purple uppercase bg-pop-purple/10 border border-pop-purple/15 px-2 py-0.5 rounded-full">
                      4.0+ Skill
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3.5">
                    {/* Avatars */}
                    <div className="flex -space-x-1.5">
                      {["👤", "👨", "👩"].map((emoji, idx) => (
                        <div
                          key={idx}
                          className="w-5 h-5 rounded-full border border-white bg-pop-aqua/20 flex items-center justify-center text-[10px] shadow-sm"
                        >
                          {emoji}
                        </div>
                      ))}
                      <div className="w-5 h-5 rounded-full border border-white bg-pop-lime flex items-center justify-center text-[7px] font-extrabold text-pop-ink shadow-sm">
                        +1
                      </div>
                    </div>

                    <a
                      href="/go-play"
                      className="bg-pickle-green hover:bg-pickle-dark text-pop-ink font-extrabold text-[10px] px-3.5 py-1.5 rounded-xl transition-all shadow-[0_4px_12px_rgba(34,197,94,0.3)]"
                    >
                      Join Game →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Badge overlay: Founding players RSVP */}
            <div className="absolute -left-6 bottom-14 z-20 rotate-[-6deg] hidden md:flex items-center gap-2.5 rounded-2xl bg-white px-4.5 py-3 font-heading text-xs font-extrabold text-pop-ink shadow-xl shadow-black/5 border border-pop-ink/5">
              <span>🎟️ Free Early Access</span>
            </div>
            <div className="absolute -right-4 top-16 z-20 rotate-[5deg] hidden md:flex items-center gap-2 rounded-2xl bg-pop-lime px-4 py-3 font-heading text-xs font-extrabold text-pop-ink shadow-xl shadow-black/5">
              <span>⚡️ Plan games in seconds</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

