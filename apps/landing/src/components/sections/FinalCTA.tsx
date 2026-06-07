"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 bg-[linear-gradient(135deg,#D9FF43_0%,#56F1FF_46%,#FF5CAA_100%)] relative overflow-hidden">
      <div className="court-grid absolute inset-0 opacity-[0.18]" />
      <div className="noise-overlay absolute inset-0 opacity-20" />
      <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-[120px]" />

      <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <span className="badge-pill mb-6 border-pop-ink/10 bg-white/70 text-pop-ink font-bold shadow-sm">
            ✨ START PLAYING TODAY
          </span>
          
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extrabold text-pop-ink tracking-[-0.05em] mb-6 leading-none">
            Ready to get on <br /> the court?
          </h2>
          
          <p className="text-pop-ink/75 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">
            Download the free super app today. Find local courts, RSVP for games in one tap,
            and coordinate with other players in seconds.
          </p>

          {/* App Store / Google Play styled buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4 w-full">
            {/* App Store button */}
            <a
              href="/go-play"
              className="flex items-center gap-3.5 bg-pop-ink text-white px-6 py-3.5 rounded-2xl hover:scale-[1.03] transition-all shadow-[0_20px_50px_rgba(16,24,40,0.2)] group"
            >
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
              className="flex items-center gap-3.5 bg-pop-ink text-white px-6 py-3.5 rounded-2xl hover:scale-[1.03] transition-all shadow-[0_20px_50px_rgba(16,24,40,0.2)] group"
            >
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
        </motion.div>
      </div>
    </section>
  );
}
