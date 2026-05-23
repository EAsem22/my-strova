import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Strova IQ — Know your market. Own it.",
  description:
    "The intelligence layer for Lagos-based startups. Track trends, generate content, and outmanoeuvre your competition — all in one dashboard.",
  openGraph: {
    title: "Strova IQ — Know your market. Own it.",
    description:
      "The intelligence layer for Lagos-based startups. Track trends, generate content, and outmanoeuvre your competition.",
    type: "website",
    locale: "en_NG",
    siteName: "Strova IQ",
  },
  twitter: {
    card: "summary_large_image",
    title: "Strova IQ — Know your market. Own it.",
    description:
      "The intelligence layer for Lagos-based startups. Track trends, generate content, and outmanoeuvre your competition.",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
