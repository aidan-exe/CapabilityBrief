import type { Metadata } from "next";
import { ProjectEditor } from "@/components/project-editor";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return <ProjectEditor />;
}
