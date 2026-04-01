import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EV Trading Labs — Portafolios automatizados y gestión del riesgo para MT5",
  description:
    "Portafolios automatizados, herramientas de gestión del riesgo y soluciones para cuentas de fondeo. Asesores Expertos para MetaTrader 5.",
  openGraph: {
    title: "EV Trading Labs",
    description:
      "Sistemas de trading automatizados, gestión del riesgo y soluciones para MT5.",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} scroll-smooth`}>
      <body className="bg-[#faf7f1] text-[#171717] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
