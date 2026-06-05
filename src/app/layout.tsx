import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F4EFE9",
};

export const metadata: Metadata = {
  title: "Lidiane Carvalho — Estúdio de Beleza | Sobrancelhas & Maquiagem em Aquiraz",
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
    title: "Lidiane Carvalho — Estúdio de Beleza",
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
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
