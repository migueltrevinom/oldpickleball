"use client";

import { Hero } from "@/components/sections/Hero";
import { PainPoints } from "@/components/sections/PainPoints";
import { LaunchProof } from "@/components/sections/Metrics";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FeaturePreview } from "@/components/sections/FeaturePreview";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function HomeContent() {
  return (
    <>
      <Hero />
      <PainPoints />
      <LaunchProof />
      <HowItWorks />
      <FeaturePreview />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  );
}
