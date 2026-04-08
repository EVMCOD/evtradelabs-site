import type { Metadata } from "next";
import Page from "../page";

export const metadata: Metadata = {
  title: "EV Trading Labs — Automated Portfolios & Risk Management for MT5",
  description:
    "Automated portfolios, risk management tools, and solutions for funded accounts. Expert Advisors for MetaTrader 5.",
  openGraph: {
    title: "EV Trading Labs",
    description:
      "Automated trading systems, risk management, and solutions for MT5.",
    locale: "en-US",
    type: "website",
  },
  alternates: {
    canonical: "https://evtradelabs.com/en-gb",
    languages: {
      "es-ES": "https://evtradelabs.com",
      "en-GB": "https://evtradelabs.com/en-gb",
      "en-US": "https://evtradelabs.com/en-us",
      "x-default": "https://evtradelabs.com",
    },
  },
};

export default function UKPage() {
  return <Page />;
}
