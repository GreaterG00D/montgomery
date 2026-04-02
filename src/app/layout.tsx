import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#050508",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://williamfmontgomery.com"),
  title: "William Montgomery — I Ain't NEVER GONNA STAAAAAHP",
  description:
    "William Montgomery. Content creator, entertainer, and relentless force of nature. YouTube, merch, Cameo, and everything else — because stopping is simply not an option.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://williamfmontgomery.com",
    siteName: "William Montgomery",
    title: "William Montgomery — I Ain't NEVER GONNA STAAAAAHP",
    description:
      "Content creator, entertainer, relentless force of nature. YouTube, merch, Cameo — never stopping.",
  },
  twitter: {
    card: "summary",
    title: "William Montgomery — I Ain't NEVER GONNA STAAAAAHP",
    description: "Content creator. Never stopping.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable}`}
      style={{ background: "#050508" }}
    >
      <body>{children}</body>
    </html>
  );
}
