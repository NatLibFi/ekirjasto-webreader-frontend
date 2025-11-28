import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { eKirjastoPreferences } from "../preferences/eKirjastoPreferences";


import { ThStoreProvider } from "@/lib/ThStoreProvider";
import { ThPreferencesProvider } from "@/preferences/ThPreferencesProvider";
import { ThI18nProvider } from "@/i18n/ThI18nProvider";

export const runtime = "edge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Thorium Web",
  description: "Play with the capabilities of the Readium Web Toolkit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={ inter.className }>
        <ThStoreProvider>
          <ThPreferencesProvider initialPreferences={eKirjastoPreferences}>
            <ThI18nProvider>
              { children }
            </ThI18nProvider>
          </ThPreferencesProvider>
        </ThStoreProvider>
      </body>
    </html>
  );
}
