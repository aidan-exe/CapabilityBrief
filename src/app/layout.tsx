import type { Metadata } from "next";
import { Lexend, Poppins } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Capability Brief",
    template: "%s · Capability Brief",
  },
  description:
    "A one-page evidence brief for graduate hiring. Employers set a rubric. Graduates link projects. A person decides. No years-of-experience filter and no overall score.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${lexend.variable} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
