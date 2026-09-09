import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Isabel & Mateo | Together, at last",
  description: "Celebrate love, family, and Filipino heritage with Isabel and Mateo. February 20, 2027, Intramuros, Manila.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
