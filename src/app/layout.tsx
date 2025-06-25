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
  title: "Valorant Combo Slot",
  description: "A stylish Valorant team combo picker with slot machine vibes.",
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
        <div className="relative min-h-screen w-full overflow-hidden">
          <div className="absolute inset-0 z-0 bg-black/90"></div>
          <div className="absolute inset-0 bg-[url('/bg.png')] bg-cover bg-center z-[-1]" />
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
