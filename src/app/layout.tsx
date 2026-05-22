import type { Metadata } from "next";
import { Inter, Newsreader, Space_Grotesk } from "next/font/google";
import { SimProvider } from "@/context/SimContext";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PhishNet AI — Human Firewall Intelligence Platform",
  description: "Enterprise-grade AI-powered phishing simulation, real-time SOC threat dashboard, and adaptive awareness training platform.",
  keywords: ["cybersecurity", "phishing simulation", "human risk intelligence", "SOC dashboard", "security awareness training"],
  authors: [{ name: "PhishNet AI Security" }],
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛡️</text></svg>" />
      </head>
      <body
        className={`${newsreader.variable} ${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-[#050505] text-[#EBEBEB] min-h-screen`}
      >
        <SimProvider>
          {children}
        </SimProvider>
      </body>
    </html>
  );
}
