import dynamic from "next/dynamic";

const PricingContent = dynamic(
  () => import("@/components/pages/PricingContent"),
  { ssr: false }
);

export default function PricingPage() {
  return <PricingContent />;
}
