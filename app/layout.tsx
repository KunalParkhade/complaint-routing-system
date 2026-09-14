import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Complaint Routing System",
  description: "A modern complaint submission, routing, tracking, and resolution platform.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
