import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_DESCRIPTION =
  "RM Connect — software sob demanda e automação inteligente com IA. " +
  "Sites, dashboards, branding e bots de WhatsApp end-to-end que eliminam a sobrecarga operacional.";

export const metadata: Metadata = {
  metadataBase: new URL("https://rmconnect.dev"),
  title: {
    default: "RM Connect — Software sob demanda & Automação inteligente",
    template: "%s · RM Connect",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "RM Connect",
    "automação",
    "IA",
    "bots WhatsApp",
    "dashboards",
    "desenvolvimento web",
    "n8n",
    "RPA",
  ],
  authors: [{ name: "RM Connect" }],
  openGraph: {
    title: "RM Connect — Software sob demanda & Automação inteligente",
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "pt_BR",
    siteName: "RM Connect",
  },
  twitter: {
    card: "summary_large_image",
    title: "RM Connect",
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#08070d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
