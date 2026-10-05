import type { Metadata } from "next";
import "./invitation.css";

export const metadata: Metadata = {
  title: "Clive & Rubie | Together, at last",
  description: "Celebrate love, family, and Filipino heritage with Clive and Rubie. Our wedding invitation, story, venues and celebration details.",
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/invitation/favicon-new.png",
    shortcut: "/invitation/favicon-new.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/invitation/amsterdam.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/invitation/playfair-display.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/invitation/cormorant.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/invitation/cormorant-italic.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
