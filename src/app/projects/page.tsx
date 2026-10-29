import type { Metadata } from "next";
import { ProjectEditor } from "@/components/project-editor";
import { SplitWorkspace } from "@/components/split-workspace";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <SplitWorkspace>
      <ProjectEditor />
    </SplitWorkspace>
  );
}
