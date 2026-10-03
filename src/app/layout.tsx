import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { profile } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const title = `${profile.name} — Front-End Developer (${profile.stack})`;
const description =
  "Front-end developer crafting fast, modern and unforgettable websites and web apps with React, Next.js and TypeScript. Available for freelance projects worldwide.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  verification: { google: "BRhq45DE0NHpt6s7jyxd4jOoUhKBaNjv6an3HXBjZME" },
  title: { default: title, template: `%s — ${profile.name}` },
  description,
  keywords: [
    "Abolfazl Abbaspour",
    "Abolfazl Abbaspour Portfolio",
    "Front-End Developer",
    "Frontend Developer",
    "React Developer",
    "React.js Developer",
    "React js Developer",
    "Next.js Developer",
    "Next js Developer",
    "Next Developer",
    "Freelance Web Developer",
    "Freelancer Frontend Developer",
    "Freelancer Developer",
    "TypeScript",
    "Portfolio",
  ],
  authors: [{ name: profile.name, url: profile.github }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title,
    description,
    siteName: profile.name,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  applicationName: profile.name,
  publisher: profile.name,
  category: "technology",
  other: { copyright: `© ${new Date().getFullYear()} ${profile.name}. All rights reserved.` },
};

export const viewport: Viewport = {
  themeColor: "#030308",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: profile.name,
      jobTitle: profile.role,
      description,
      email: `mailto:${profile.email}`,
      url: siteUrl,
      image: `${siteUrl}/opengraph-image`,
      sameAs: [profile.github, profile.linkedin, profile.telegram],
      knowsAbout: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Web Performance", "Frontend Development"],
      knowsLanguage: ["en", "fa"],
      worksFor: { "@type": "Organization", name: "HRBOX", url: "https://hrbox.ir/" },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: profile.name,
      description,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#person` },
      copyrightHolder: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profile`,
      url: siteUrl,
      name: title,
      isPartOf: { "@id": `${siteUrl}/#website` },
      mainEntity: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>

      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
