import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { getLocaleFromCookies } from "@/lib/locale-cookie";
import { LocaleInitializer } from "@/components/locale-initializer";
import { JsonLd } from "@/components/json-ld";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://justmeaning.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Just have a little meaning",
    template: "%s — Just have a little meaning",
  },
  description:
    "Psychology life hacks and mental health insights you can actually use.",
  openGraph: {
    type: "website",
    siteName: "Just have a little meaning",
    title: "Just have a little meaning",
    description:
      "Psychology life hacks and mental health insights you can actually use.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Just have a little meaning",
    description:
      "Psychology life hacks and mental health insights you can actually use.",
  },
};

export default async function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode;
  auth: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookies(cookieStore);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Just Meaning",
    alternateName: "Just have a little meaning",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: ["https://www.instagram.com/justhavealittlemeaning"],
    description:
      "Psychology life hacks and mental health insights you can actually use.",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Just have a little meaning",
    url: SITE_URL,
    inLanguage: ["en", "pl"],
    publisher: {
      "@type": "Organization",
      name: "Just Meaning",
      url: SITE_URL,
    },
  };

  return (
    <html lang={locale}>
      <body className={`${outfit.variable} font-sans antialiased`}>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <LocaleInitializer />
        {children}
        {auth}
      </body>
    </html>
  );
}
