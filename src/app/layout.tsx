import type { Metadata } from "next";
import {
  Be_Vietnam_Pro,
  Caveat,
  Cormorant_Garamond,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LangBootstrapScript, LangProvider } from "@/components/lang";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-viet",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mississauga Wedding Solutions",
    template: "%s — Mississauga Wedding Solutions",
  },
  description:
    "Traditional Vietnamese wedding services in Mississauga, Ontario. Tea ceremonies, áo dài, MC, and full ceremonial coordination.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://mws.kho-ai.com"),
  openGraph: {
    title: "Mississauga Wedding Solutions",
    description:
      "Traditional Vietnamese wedding services in Mississauga, Ontario.",
    type: "website",
    locale: "en_CA",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = [
    inter.variable,
    cormorant.variable,
    beVietnam.variable,
    jetbrainsMono.variable,
    caveat.variable,
  ].join(" ");

  return (
    <html lang="en" className={fontVars}>
      <head>
        <LangBootstrapScript />
        <style>{`
          :root {
            --sans: var(--font-sans), -apple-system, BlinkMacSystemFont, sans-serif;
            --serif: var(--font-serif), "Cormorant Garamond", Georgia, serif;
            --viet: var(--font-viet), "Inter", sans-serif;
            --mono: var(--font-mono), ui-monospace, monospace;
          }
          .founder-body .sig { font-family: var(--font-script), cursive; }
        `}</style>
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <LangProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
