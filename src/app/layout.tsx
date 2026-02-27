import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "SAGHEER | Creative Portfolio",
  description: "Personal portfolio of Sagheer - Experience in UI/UX, Photography, and Software Mastery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${outfit.variable} ${plusJakarta.variable} antialiased`}
      >
        <div className="fixed inset-0 bg-[#050505] -z-20" />
        {/* Subtle noise/grain overlay for premium texture */}
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <main className="relative min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
