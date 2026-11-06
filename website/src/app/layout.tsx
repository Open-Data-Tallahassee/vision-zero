import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import RiseObserver from "@/components/site/RiseObserver";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { SITE } from "@/config/site";
import "./globals.css";

const boska = localFont({
  src: [
    { path: "./fonts/Boska-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Boska-Italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/Boska-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-boska",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: traffic crash map and data`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#1f3a2b",
  colorScheme: "light dark",
};

// Runs before first paint: saved choice, else the system setting.
const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" id="top" className={boska.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <RiseObserver />
      </body>
    </html>
  );
}
