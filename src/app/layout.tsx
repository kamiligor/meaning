import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/lib/locale";
import { SITE_HOSTS } from "@/lib/domains";
import { t } from "@/lib/i18n";
import { JsonLd } from "@/components/json-ld";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
});

const BRAND = "Just have a little meaning";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const d = t(locale);
  const siteUrl = `https://${SITE_HOSTS[locale]}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: BRAND,
      template: `%s — ${BRAND}`,
    },
    description: d.siteDescription,
    alternates: {
      canonical: "/",
      languages: {
        en: `https://${SITE_HOSTS.en}`,
        pl: `https://${SITE_HOSTS.pl}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: BRAND,
      title: BRAND,
      description: d.siteDescription,
      url: siteUrl,
      locale: locale === "pl" ? "pl_PL" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: BRAND,
      description: d.siteDescription,
    },
  };
}

export default async function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode;
  auth: React.ReactNode;
}>) {
  const locale = await getLocale();
  const d = t(locale);
  const siteUrl = `https://${SITE_HOSTS[locale]}`;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Just Meaning",
    alternateName: BRAND,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: ["https://www.instagram.com/justhavealittlemeaning"],
    description: d.siteDescription,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND,
    url: siteUrl,
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: "Just Meaning",
      url: siteUrl,
    },
  };

  return (
    <html lang={locale}>
      <body className={`${outfit.variable} font-sans antialiased`}>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        {children}
        {auth}
      </body>
    </html>
  );
}
