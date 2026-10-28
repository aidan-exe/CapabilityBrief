"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const links = [
  { href: "/", label: "Overview" },
  { href: "/role", label: "Role" },
  { href: "/projects", label: "Projects" },
  { href: "/brief", label: "Brief" },
  { href: "/about", label: "About" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:rounded-md focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="no-print border-b border-stone-300/80 bg-[#f7f3ea]">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <Link href="/" className="font-serif text-xl text-stone-950">
              Capability Brief
            </Link>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-600">
              Credify 2026 · Area 04
            </p>
          </div>
          <nav aria-label="Primary" className="flex flex-wrap gap-2">
            {links.map((link) => {
              const current = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                    current
                      ? "bg-stone-900 text-white"
                      : "bg-white text-stone-800 ring-1 ring-stone-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main id="content" className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
      <footer className="no-print border-t border-stone-300/80 px-4 py-6 text-sm leading-6 text-stone-600 sm:px-6">
        <p className="mx-auto max-w-5xl">
          Prototype by Aidan Lottering. He owns the concept and the decisions. AI assistants
          helped with implementation. This is an evidence summary for a human reviewer. It is
          not an applicant tracking system and it does not make a hiring decision.
        </p>
      </footer>
    </div>
  );
}
