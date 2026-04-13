import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "@/styles/shortlisted-theme.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shortlisted — Built to get you shortlisted",
  description: "See what ATS sees. Fix what gets you ghosted.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}