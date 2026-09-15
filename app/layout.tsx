import type { Metadata } from "next";
import "./globals.css";
import "./crs.css";

export const metadata: Metadata = {
  title: "CRS 2.0 — Complaint Routing System",
  description: "Raise an issue. Route it right. Track the change.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
