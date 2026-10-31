"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";
import type { ReactNode } from "react";
import { GuideTip, GuideToggle, useGuide } from "@/components/guide-me";
import { BriefStateProvider } from "@/lib/use-brief-state";

const links = [
  { href: "/", label: "Overview" },
  { href: "/role", label: "Role" },
  { href: "/projects", label: "Projects" },
  { href: "/brief", label: "Brief" },
  { href: "/about", label: "About" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { guide, toggle, dismiss } = useGuide();
  const guideOn = guide?.on === true;

  return (
    <div className="min-h-screen">
      <header className="no-print bg-heading text-white">
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <div className="mx-auto max-w-7xl px-4 pb-5 pt-5 sm:px-6 sm:pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="inline-flex items-center gap-2 font-display text-lg text-white">
              <FileText className="size-5 text-emerald" aria-hidden="true" />
              Capability Brief
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-medium text-quiet">Credify 2026 · Area 04</p>
              <GuideToggle pressed={guideOn} onToggle={toggle} />
            </div>
          </div>
          <p className="mt-6 max-w-2xl font-display text-2xl leading-tight text-white sm:text-3xl">
            What can you show, instead of how many years have you worked?
          </p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-quiet">
            A one-page evidence brief for the role. No overall score. A person decides.
          </p>
          <div className="mt-4 h-1 w-14 rounded-sm bg-emerald" aria-hidden="true" />
          <nav aria-label="Primary" className="mt-5 flex flex-wrap gap-1">
            {links.map((link) => {
              const current = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  className={`rounded-[10px] px-3 py-2 text-sm font-medium text-white transition-colors duration-150 ${
                    current ? "bg-[#16312b] shadow-[inset_0_-2px_0_#03ba81]" : "hover:bg-[#16312b]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <BriefStateProvider>
        <main id="content" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <GuideTip pathname={pathname} guide={guide} onDismiss={dismiss} />
          {children}
        </main>
      </BriefStateProvider>
      <footer className="no-print border-t border-line px-4 py-5 text-sm leading-6 text-ink sm:px-6">
        <p className="mx-auto max-w-7xl">
          Evidence summary for a human reviewer. Not an applicant tracking system and not a
          hiring decision.
        </p>
      </footer>
    </div>
  );
}
