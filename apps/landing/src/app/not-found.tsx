import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-court-blue">
      <div className="text-center px-4">
        <h1 className="font-heading text-6xl md:text-8xl font-bold text-white mb-4">
          404
        </h1>
        <p className="text-slate-300 text-lg mb-8">
          This court doesn&apos;t exist. Let&apos;s get you back in the game.
        </p>
        <Link
          href="/"
          className="inline-flex bg-pickle-green hover:bg-pickle-dark text-white font-bold text-lg px-8 py-4 rounded-full transition-all hover:scale-105 shadow-lg shadow-pickle-green/20"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
