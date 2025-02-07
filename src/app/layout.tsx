"use client";

import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import themes from "../../themes.json";
import "./globals.css";
import { GA_MEASUREMENT_ID, pageview } from "@/utils/analytics";

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [universityId, setUniversityId] = useState<string>("");

  useEffect(() => {
    if (pathname && searchParams) {
      const url = pathname + searchParams.toString();
      pageview(url);
    }
  }, [pathname, searchParams]);

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
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen" style={{ backgroundColor: theme.primaryColor }}>
          {children}
        </div>
      </body>
    </html>
  );
}
