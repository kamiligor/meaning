import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { getLocaleFromCookies } from "@/lib/locale-cookie";
import { LocaleInitializer } from "@/components/locale-initializer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://meaning.igicode.com"),
  title: "just have a little meaning",
  description: "Psychology life hacks & mental health tips",
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

  return (
    <html lang={locale}>
      <body className={`${outfit.variable} font-sans antialiased`}>
        <LocaleInitializer />
        {children}
        {auth}
      </body>
    </html>
  );
}
