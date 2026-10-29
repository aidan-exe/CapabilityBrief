import { LEVEL_LABEL, type EvidenceLevel } from "@/lib/types";

const styles: Record<EvidenceLevel, string> = {
  gap: "border-dashed border-ink bg-sheet text-ink",
  some: "border-solid border-muted bg-sheet text-ink",
  clear: "border-solid border-emerald-deep bg-sheet text-emerald-deep",
  strong: "border-solid border-heading bg-heading text-white",
};

export function LevelPill({ level }: { level: EvidenceLevel }) {
  return (
    <span
      className={`inline-flex min-w-16 items-center justify-center rounded-sm border px-2 py-1 text-sm font-semibold ${styles[level]}`}
    >
      {LEVEL_LABEL[level]}
    </span>
  );
}
