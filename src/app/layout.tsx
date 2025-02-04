"use client";

import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import themes from "../../themes.json";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [universityId, setUniversityId] = useState<string>("");

  useEffect(() => {
    fetch("/api/university")
      .then((res) => res.json())
      .then((data) => {
        if (data.universityId) {
          setUniversityId(data.universityId);
        }
      })
      .catch((err) => console.error("Failed to get university ID", err));
  }, []);

  const theme = themes[universityId as keyof typeof themes] || themes.default;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen" style={{ backgroundColor: theme.primaryColor }}>
          {children}
        </div>
      </body>
    </html>
  );
}
