"use client";

import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import themes from "../../themes.json";
import "./globals.css";

const GA_MEASUREMENT_ID = 'G-6ZCYT8DPVB';

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
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`