import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FAF7F4",
};

export const metadata: Metadata = {
  title: "Lidiane Carvalho — Clínica de Sobrancelhas | Sobrancelhas & Maquiagem em Aquiraz",
  description:
    "13 anos de experiência em design de sobrancelhas, brow lamination, lift de cílios e maquiagem em Aquiraz - CE. Agende seu horário online em menos de 1 minuto.",
  keywords: [
    "design de sobrancelhas Aquiraz",
    "brow lamination",
    "lift de cílios",
    "maquiagem Aquiraz",
    "Lidiane Carvalho",
  ],
  openGraph: {
    title: "Lidiane Carvalho — Clínica de Sobrancelhas",
    description:
      "Sobrancelhas impecáveis e maquiagem sofisticada em Aquiraz. 13 anos de experiência.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
