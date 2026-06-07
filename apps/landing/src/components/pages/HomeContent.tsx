"use client";

import { Hero } from "@/components/sections/Hero";
import { ValueProps } from "@/components/sections/ValueProps";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function HomeContent() {
  return (
    <>
      <Hero />
      <ValueProps />
      <HowItWorks />
      <FAQ />
      <FinalCTA />
    </>
  );
}
