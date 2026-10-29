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
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:rounded-sm focus:bg-sheet focus:px-3 focus:py-2 focus:text-heading"
      >
        Skip to content
      </a>
      <header className="no-print bg-heading text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3 sm:px-6">
          <Link href="/" className="font-display text-lg text-white">
            Capability Brief
          </Link>
          <p className="text-xs font-medium text-quiet">Credify 2026 · Area 04</p>
        </div>
        <nav aria-label="Primary" className="mx-auto flex max-w-5xl flex-wrap px-2 sm:px-4">
          {links.map((link) => {
            const current = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`border-b-2 px-3 py-2 text-sm font-medium text-white ${
                  current ? "border-emerald" : "border-transparent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main id="content" className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
      <footer className="no-print border-t border-line px-4 py-5 text-sm leading-6 text-ink sm:px-6">
        <p className="mx-auto max-w-5xl">
          Prototype by Aidan Lottering. He owns the concept and the decisions. AI assistants
          helped with implementation. This is an evidence summary for a human reviewer. It is
          not an applicant tracking system and it does not make a hiring decision.
        </p>
      </footer>
    </div>
  );
}
