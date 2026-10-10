import type { Metadata } from "next";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/press-start-2p/400.css";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Rohit Quest | Backend & Full-Stack Engineer",
    template: "%s | Rohit Quest",
  },
  description:
    "Explore Rohit's engineering portfolio: NestJS APIs, multi-tenant products, PostgreSQL, and Next.js. Take the scenic route through a playable pixel-art world, or jump straight to the projects.",
  openGraph: {
    title: "Rohit Quest",
    description: "Reliable backends. Thoughtful products. A little adventure.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
