import type { Metadata } from "next";
import "./invitation.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://clivefoundhisrubie.love'),
  title: "Clive and Rubie",
  description: "Sa bawat bukas, ikaw.",
  openGraph: {
    title: "Clive and Rubie",
    description: "Sa bawat bukas, ikaw.",
    type: 'website',
    url: '/',
    siteName: 'Clive and Rubie',
    images: [{url:'/invitation/social-preview.jpg',alt:'Clive and Rubie wedding invitation',width:1587,height:2245,type:'image/jpeg'}],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Clive and Rubie",
    description: "Sa bawat bukas, ikaw.",
    images: ['/invitation/social-preview.jpg'],
  },
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
