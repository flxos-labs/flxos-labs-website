"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const pathname = usePathname();

  return (
    <main className="relative min-h-[80vh] flex items-center justify-center text-center px-6 py-16">
      {/* Glitch mesh background */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-500/8 blur-[80px]" />
      </div>

      <div className="w-full max-w-lg space-y-8 animate-reveal-up">
        {/* Error Code */}
        <div className="space-y-2">
          <span className="block font-display text-[7rem] md:text-[9rem] font-black leading-none bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent-3)] bg-clip-text text-transparent tracking-tighter">
            404
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-[color:var(--ink)]">
            Page Not Found
          </h1>
          <p className="text-sm md:text-base text-[color:var(--muted)] max-w-md mx-auto leading-relaxed">
            Looks like this page got lost in the build process. The route you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>

        {/* Mock Terminal Widget */}
        <div className="bg-[#0c0d0f] border border-[rgba(255,255,255,0.06)] rounded-2xl p-5 text-left font-mono text-xs md:text-sm text-gray-300 shadow-xl space-y-2 max-w-md mx-auto">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            <span className="text-[10px] text-[color:var(--muted)] pl-2">flxos_terminal</span>
          </div>
          <div>
            <span className="text-emerald-500">$</span> flxos navigate --to{" "}
            <span className="text-[color:var(--accent)]">{pathname}</span>
          </div>
          <div className="text-red-400">
            Error: Route not found in active board profile.
          </div>
          <div className="text-gray-400">
            Suggestion: try navigating to &quot;/&quot; or &quot;/docs&quot; instead.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3.5 pt-2">
          <Link href="/" className="btn-primary gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>
            <span>Go Home</span>
          </Link>
          <Link href="/docs" className="btn-secondary gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10M6 14h6"/></svg>
            <span>Read Docs</span>
          </Link>
          <a
            href="https://github.com/flxos-labs/flxos/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01" /></svg>
            <span>Report Issue</span>
          </a>
        </div>
      </div>
    </main>
  );
}
