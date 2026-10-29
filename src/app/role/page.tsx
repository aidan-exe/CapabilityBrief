import type { Metadata } from "next";
import { RoleEditor } from "@/components/role-editor";
import { SplitWorkspace } from "@/components/split-workspace";

export const metadata: Metadata = {
  title: "Role",
};

export default function RolePage() {
  return (
    <SplitWorkspace>
      <RoleEditor />
    </SplitWorkspace>
  );
}
