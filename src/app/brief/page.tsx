import type { Metadata } from "next";
import { BriefView } from "@/components/brief-view";

export const metadata: Metadata = {
  title: "Brief",
};

export default function BriefPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <BriefView />
    </div>
  );
}
