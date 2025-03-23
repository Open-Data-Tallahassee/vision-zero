import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vision Zero TLH",
  description:
    "Tracking and visualizing traffic accidents, injuries, and fatalities in Tallahassee, FL",
  openGraph: {
    title: "Vision Zero TLH",
    description:
      "Tracking and visualizing traffic accidents, injuries, and fatalities in Tallahassee, FL",
    url: "https://vision-zero-tlh.vercel.app",
    siteName: "Vision Zero TLH",
    images: [
      {
        url: "https://open-tallahassee.s3.us-east-1.amazonaws.com/Vision-Zero-logo-transparent-2.png", // Must be an absolute URL
        width: 500,
        height: 500,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
