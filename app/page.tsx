import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "EV Trading Labs — Sistemas automatizados para MT5",
  description:
    "Sistemas de trading automatizados, gestión del riesgo y replicación de cuentas para MetaTrader 5.",
  alternates: {
    canonical: "https://evtradelabs.com",
    languages: {
      "es-ES": "https://evtradelabs.com",
      "en-GB": "https://evtradelabs.com/en-gb",
      "en-US": "https://evtradelabs.com/en-us",
      "x-default": "https://evtradelabs.com",
    },
  },
};

const PRODUCTS = [
  { name: "EV Quant Lab", price: "€99.99/mes", slug: "ev-quant-lab" },
  { name: "Master of Liquidity", price: "€48.99/mes", slug: "master-of-liquidity" },
  { name: "Replicador", price: "€18.99/mes", slug: "replicador" },
  { name: "Local App", price: "€79", slug: "local-app" },
];

const FAQ = [
  { q: "¿Necesito experiencia previa?", a: "No. Cada producto incluye documentación y soporte para empezar." },
  { q: "¿Funciona con MT5?", a: "Sí. Todos nuestros sistemas son para MetaTrader 5." },
  { q: "¿Puedo probar antes de comprar?", a: "Sí. Dispones de versiones demo para evaluar." },
  { q: "¿Cómo recibo mi licencia?", a: "Automáticamente por email tras el pago." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#faf7f1] text-[#171717]">
      {/* Simple Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e5ddd4]/50">
        <div className="max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
              <span className="text-white font-black text-sm">EV</span>
            </div>
            <span className="font-semibold text-[0.95rem]">EV Trading Labs</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[0.88rem]">
            <Link href="/products" className="hover:text-[#667eea] transition-colors">Productos</Link>
            <Link href="/#pricing" className="hover:text-[#667eea] transition-colors">Precios</Link>
            <Link href="/dashboard" className="hover:text-[#667eea] transition-colors">Dashboard</Link>
          </div>
          <Link href="/login" className="px-4 py-2 rounded-lg bg-[#667eea] text-white text-[0.85rem] font-semibold hover:bg-[#5a7fd8] transition-colors">
            Acceder
          </Link>
        </div>
      </nav>

      {/* Simple Hero */}
      <section className="py-24 px-5 text-center">
        <div className="max-w-[800px] mx-auto">
          <span className="inline-block text-[0.72rem] font-bold tracking-[0.2em] uppercase text-[#667eea] mb-4">
            Trading automatizado
          </span>
          <h1 className="text-[clamp(2.2rem,5vw,3.5rem)] font-black text-[#171717] tracking-tight leading-[1.1] mb-6">
            Sistemas, herramientas e infraestructura para traders
          </h1>
          <p className="text-[1.05rem] text-[#6b7280] leading-relaxed mb-10 max-w-[600px] mx-auto">
            Asesores Expertos, gestión del riesgo y replicación de cuentas para MetaTrader 5. Diseñado para traders que operan con estructura.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="px-6 py-3.5 rounded-xl bg-[#667eea] text-white font-semibold hover:bg-[#5a7fd8] transition-colors">
              Ver productos
            </Link>
            <Link href="/dashboard" className="px-6 py-3.5 rounded-xl border border-[#e5ddd4] text-[#6b7280] font-semibold hover:border-[#667eea] hover:text-[#667eea] transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <h2 id="productos" className="text-[1.8rem] font-black text-center mb-12">Productos</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((p) => (
              <div key={p.slug} className="rounded-2xl border border-[#e5ddd4] p-6 hover:border-[#667eea]/30 hover:shadow-lg transition-all">
                <h3 className="font-bold text-[1.05rem] mb-2">{p.name}</h3>
                <p className="text-[#667eea] font-semibold text-[1.1rem] mb-4">{p.price}</p>
                <Link href={`/products#${p.slug}`} className="text-[0.85rem] text-[#667eea] font-semibold hover:underline">
                  Más información →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-5">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-[1.8rem] font-black mb-4">Precios simples</h2>
          <p className="text-[#6b7280] mb-12">Sin sorpresas. Cancela cuando quieras.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[900px] mx-auto">
            {PRODUCTS.map((p) => (
              <div key={p.slug} className="rounded-2xl border border-[#e5ddd4] p-6 text-left">
                <h3 className="font-bold mb-2">{p.name}</h3>
                <div className="text-[1.5rem] font-black text-[#667eea] mb-4">{p.price}</div>
                <Link href={`/checkout?product=${p.slug}`} className="block text-center px-4 py-2.5 rounded-xl bg-[#667eea] text-white font-semibold text-[0.88rem] hover:bg-[#5a7fd8] transition-colors">
                  Suscribirse
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-[1.8rem] font-black text-center mb-12">Preguntas frecuentes</h2>
          <div className="space-y-6">
            {FAQ.map((f, i) => (
              <div key={i} className="border-b border-[#e5ddd4] pb-6">
                <h3 className="font-bold text-[1rem] mb-2">{f.q}</h3>
                <p className="text-[#6b7280] text-[0.95rem]">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-5 border-t border-[#e5ddd4]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
                  <span className="text-white font-black text-sm">EV</span>
                </div>
                <span className="font-semibold">EV Trading Labs</span>
              </div>
              <p className="text-[#6b7280] text-[0.88rem] max-w-[280px]">
                Sistemas de trading automatizados para MetaTrader 5.
              </p>
            </div>
            <div className="flex gap-12 text-[0.88rem]">
              <div>
                <h4 className="font-semibold mb-3">Productos</h4>
                <div className="space-y-2 text-[#6b7280]">
                  <Link href="/products" className="block hover:text-[#667eea]">Todos</Link>
                  <Link href="/products#ev-quant-lab" className="block hover:text-[#667eea]">EV Quant Lab</Link>
                  <Link href="/products#master-of-liquidity" className="block hover:text-[#667eea]">Master of Liquidity</Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Legal</h4>
                <div className="space-y-2 text-[#6b7280]">
                  <Link href="/terms" className="block hover:text-[#667eea]">Términos</Link>
                  <Link href="/privacy" className="block hover:text-[#667eea]">Privacidad</Link>
                  <Link href="/refund" className="block hover:text-[#667eea]">Reembolso</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-[#e5ddd4] text-center text-[0.82rem] text-[#9a9087]">
            © {new Date().getFullYear()} EV Trading Labs
          </div>
        </div>
      </footer>
    </main>
  );
}
