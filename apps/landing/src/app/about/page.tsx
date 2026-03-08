import dynamic from "next/dynamic";

const AboutContent = dynamic(
  () => import("@/components/pages/AboutContent"),
  { ssr: false }
);

export default function AboutPage() {
  return <AboutContent />;
}
