import { BadgeCheck, Circle, CircleCheck, CircleDashed, type LucideIcon } from "lucide-react";
import { LEVEL_LABEL, type EvidenceLevel } from "@/lib/types";

const styles: Record<
  EvidenceLevel,
  { icon: LucideIcon; chip: string; bar: string; width: string }
> = {
  gap: {
    icon: CircleDashed,
    chip: "border border-[#6d6d6d] bg-white text-ink",
    bar: "#6d6d6d",
    width: "16%",
  },
  some: {
    icon: Circle,
    chip: "border border-emerald-deep bg-[#f3fbf8] text-heading",
    bar: "#027a55",
    width: "42%",
  },
  clear: {
    icon: CircleCheck,
    chip: "border border-emerald-deep bg-[#e5f8f1] text-emerald-deep",
    bar: "#027a55",
    width: "70%",
  },
  strong: {
    icon: BadgeCheck,
    chip: "border border-heading bg-heading text-white",
    bar: "#027a55",
    width: "100%",
  },
};

export function LevelPill({ level }: { level: EvidenceLevel }) {
  const style = styles[level];
  const Icon = style.icon;

  return (
    <div className="w-full min-w-28 sm:w-36">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.chip}`}
      >
        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
        {LEVEL_LABEL[level]}
      </span>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#e8e8e8]" aria-hidden="true">
        <div className="h-full rounded-full" style={{ width: style.width, background: style.bar }} />
      </div>
    </div>
  );
}
