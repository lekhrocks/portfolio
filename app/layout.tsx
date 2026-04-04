import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  title: "Lekhraj Kumar — Software Engineer",
    description:
      "Software Engineer with 5+ years building high-throughput distributed systems in payments and SaaS. Full stack experience with Java, Spring Boot, React, and Kafka-powered microservices.",
  keywords: [
    "Software Engineer",
    "Backend Engineer",
    "Full Stack Engineer",
    "Java Developer",
    "Distributed Systems",
    "Microservices",
    "Kafka",
    "Spring Boot",
    "System Design",
    "Software Engineer",
    "Lekhraj Kumar",
  ],
  authors: [{ name: "Lekhraj Kumar", url: "https://github.com/lekhrajkumar" }],
  openGraph: {
    title: "Lekhraj Kumar — Software Engineer",
    description:
      "Building high-throughput distributed systems at scale. 5+ years in payments, Kafka, microservices, and Java.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lekhraj Kumar — Software Engineer",
    description: "Building high-throughput distributed systems at scale.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050510] text-[#f0f4ff]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
