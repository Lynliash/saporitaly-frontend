import type { Metadata } from "next";
import { Libre_Caslon_Text, Work_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const libreCaslon = Libre_Caslon_Text({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-headline",
});

const workSans = Work_Sans({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body",
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
      <body className={`${libreCaslon.variable} ${workSans.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}