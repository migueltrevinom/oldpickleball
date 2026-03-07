import dynamic from "next/dynamic";

const GoPlayContent = dynamic(
  () => import("@/components/pages/GoPlayContent"),
  { ssr: false }
);

export default function GoPlayPage() {
  return <GoPlayContent />;
}
