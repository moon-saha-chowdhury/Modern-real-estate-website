import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/layout/Providers";
import { SkipLink } from "@/components/layout/SkipLink";
import { company } from "@/data/company";
import { siteConfig } from "@/lib/constants/site";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${company.name} — Architecture-led property development`,
    template: `%s — ${company.name}`,
  },
  description: company.description,
  openGraph: {
    type: "website",
    siteName: company.name,
    locale: siteConfig.locale,
  },
};

export const viewport: Viewport = {
  themeColor: "#101713",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <Providers>
          <SkipLink />
          <Navbar />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
