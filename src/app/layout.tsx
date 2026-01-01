import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PWAInit from "@/components/PWAInit";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PollutionX Bhubaneswar - Air Quality Monitor",
  description: "Interactive Environmental GIS Application for Air Quality Monitoring in Bhubaneswar. Track pollution hotspots, report environmental issues, and stay informed about air quality in your area.",
  keywords: "air quality, pollution monitoring, Bhubaneswar, environmental GIS, AQI tracker, pollution hotspots",
  authors: [{ name: "Vinit", url: "https://github.com/vinit-codes" }],
  creator: "Vinit",
  publisher: "PollutionX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pollutionx.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PollutionX Bhubaneswar - Air Quality Monitor',
    description: 'Interactive Environmental GIS Application for Air Quality Monitoring in Bhubaneswar',
    url: 'https://pollutionx.vercel.app',
    siteName: 'PollutionX',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'PollutionX App Icon',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PollutionX Bhubaneswar - Air Quality Monitor',
    description: 'Interactive Environmental GIS Application for Air Quality Monitoring in Bhubaneswar',
    images: ['/icons/icon-512x512.png'],
  },
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/icon.svg',
        color: '#1f2937',
      },
    ],
  },
  manifest: '/manifest.json',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1f2937' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    title: 'PollutionX',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'application-name': 'PollutionX',
    'msapplication-TileColor': '#1f2937',
    'msapplication-TileImage': '/icons/icon-144x144.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1f2937" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PollutionX" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PWAInit />
        {children}
      </body>
    </html>
  );
}
