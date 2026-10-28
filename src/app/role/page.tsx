import type { Metadata } from "next";
import { RoleEditor } from "@/components/role-editor";

export const metadata: Metadata = {
  title: "Role",
};

export default function RolePage() {
  return <RoleEditor />;
}
