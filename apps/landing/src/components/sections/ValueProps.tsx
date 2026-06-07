"use client";

import { motion } from "framer-motion";
import { MapPin, Users, MessageSquare } from "lucide-react";

const valueProps = [
  {
    icon: MapPin,
    badge: "Discover",
    title: "Real-Time Court Finder",
    description:
      "Interactive map with filters for surface type, indoor/outdoor, lighting, and player-submitted local play notes. Know where to play instantly.",
    color: "from-pop-lime/20 to-pop-aqua/20",
    iconColor: "text-pickle-dark",
    bgGradient: "from-pop-lime to-pop-aqua",
  },
  {
    icon: Users,
    badge: "Match",
    title: "Skill-Matched Games",
    description:
      "Join public sessions matching your level (e.g., 3.0, 4.5) in one tap. Automatic waitlist promotion handles last-minute cancellations.",
    color: "from-pop-orange/20 to-pop-pink/20",
    iconColor: "text-pop-orange",
    bgGradient: "from-pop-orange to-pop-pink",
  },
  {
    icon: MessageSquare,
    badge: "Coordinate",
    title: "No More Group Chat Chaos",
    description:
      "Every match gets a dedicated discussion room for logistics. No lost spreadsheets, spam texts, or confusing WhatsApp chains.",
    color: "from-pop-purple/20 to-pop-pink/20",
    iconColor: "text-pop-purple",
    bgGradient: "from-pop-purple to-pop-pink",
  },
];

export function ValueProps() {
  return (
    <section className="py-24 bg-[#fffdf6] relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute left-0 top-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-pop-lime/15 blur-[100px]" />
      <div className="absolute right-0 bottom-1/4 h-80 w-80 translate-x-1/2 rounded-full bg-pop-aqua/15 blur-[100px]" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="badge-pill text-pop-purple border-pop-purple/20 bg-pop-purple/10 mb-4">
            WHAT WE OFFER
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-pop-ink tracking-tight mt-3 leading-tight">
            Everything you need to play. <br className="hidden sm:inline" />
            <span className="gradient-text">Zero coordination chaos.</span>
          </h2>
          <p className="mt-5 text-lg text-pop-ink/70 max-w-2xl mx-auto leading-relaxed">
            OldPickleball organizes court maps, matchmaking, RSVPs, and session chats
            so you can spend less time scheduling and more time on the court.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {valueProps.map((prop, i) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group relative overflow-hidden rounded-[2.5rem] border border-pop-ink/5 bg-white/70 p-8 lg:p-10 shadow-[0_24px_60px_rgba(16,24,40,0.04)] backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_72px_rgba(16,24,40,0.08)]"
            >
              {/* Soft background glow on hover */}
              <div className={`absolute -right-20 -top-20 h-52 w-52 rounded-full bg-gradient-to-br ${prop.color} opacity-40 blur-2xl group-hover:scale-125 transition-transform duration-500`} />

              <div className="relative">
                <span className={`inline-block text-xs font-extrabold tracking-wider uppercase px-3.5 py-1 rounded-full border border-pop-ink/5 bg-white/95 text-pop-ink/80 shadow-sm mb-8`}>
                  {prop.badge}
                </span>

                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${prop.bgGradient} flex items-center justify-center mb-8 shadow-md shadow-black/5`}>
                  <prop.icon size={26} className="text-pop-ink" />
                </div>

                <h3 className="font-heading text-2xl font-extrabold text-pop-ink mb-4 group-hover:text-pickle-dark transition-colors">
                  {prop.title}
                </h3>
                
                <p className="text-pop-ink/70 leading-relaxed text-[15px] sm:text-base">
                  {prop.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
