import { LEVEL_LABEL, type EvidenceLevel } from "@/lib/types";

const styles: Record<EvidenceLevel, string> = {
  gap: "border-orange-300 bg-orange-50 text-orange-950",
  some: "border-amber-300 bg-amber-50 text-amber-950",
  clear: "border-emerald-300 bg-emerald-50 text-emerald-950",
  strong: "border-emerald-800 bg-emerald-800 text-white",
};

export function LevelPill({ level }: { level: EvidenceLevel }) {
  return (
    <span
      className={`inline-flex min-w-16 items-center justify-center rounded-full border px-3 py-1 text-sm font-semibold tracking-wide ${styles[level]}`}
    >
      {LEVEL_LABEL[level]}
    </span>
  );
}
