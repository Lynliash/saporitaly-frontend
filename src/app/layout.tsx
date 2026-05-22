import type { Metadata } from "next";
import { Libre_Caslon_Text, Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";

const fontHeadline = Libre_Caslon_Text({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-headline",
});

const fontSans = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SaporItaly | Archivio Culinario",
  description: "Censimento delle Tradizioni Culinarie d'Italia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${fontHeadline.variable} ${fontSans.variable} bg-background text-foreground antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Providers>
            <Navbar />
            {children}
            {/* toaster di Sonner. funziona in tutto il sito*/}
            <Toaster richColors position="bottom-right" />
          </Providers>
        </div>
      </body>
    </html>
  );
}
