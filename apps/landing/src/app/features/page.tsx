import dynamic from "next/dynamic";

const FeaturesContent = dynamic(
  () => import("@/components/pages/FeaturesContent"),
  { ssr: false }
);

export default function FeaturesPage() {
  return <FeaturesContent />;
}
