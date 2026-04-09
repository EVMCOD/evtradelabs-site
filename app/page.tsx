import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./_components/Navbar";

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

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-[#0a0a0f] text-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-5">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/20 via-[#0a0a0f] to-[#764ba2]/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#667eea]/10 via-transparent to-transparent" />

        <div className="relative z-10 max-w-[1200px] mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block text-[0.72rem] font-bold tracking-[0.2em] uppercase text-[#667eea] px-4 py-2 rounded-full border border-[#667eea]/30 bg-[#667eea]/10">
              Trading automatizado
            </span>
          </div>

          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black tracking-tight leading-[1.05] mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Sistemas, herramientas e infraestructura<br />para traders serios
          </h1>

          <p className="text-[1.1rem] text-white/60 max-w-[640px] mx-auto mb-10 leading-relaxed">
            Asesores Expertos, gestión del riesgo y replicación de cuentas para MetaTrader 5.
            Diseñado para traders que operan con estructura.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/products"
              className="px-8 py-4 rounded-xl bg-[#667eea] text-white font-bold text-[0.95rem] hover:bg-[#5a7fd8] transition-all hover:scale-105"
            >
              Ver productos
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-xl border border-white/20 text-white/80 font-semibold text-[0.95rem] hover:border-white/40 hover:text-white transition-all"
            >
              Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-[500px] mx-auto">
            {[
              { value: "5000+", label: "Usuarios" },
              { value: "8", label: "Estrategias" },
              { value: "24/7", label: "Operativa" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-[2rem] font-black text-white mb-1">{stat.value}</div>
                <div className="text-[0.8rem] text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="productos" className="py-24 px-5 bg-[#0a0a0f]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[0.72rem] font-bold tracking-[0.2em] uppercase text-[#667eea] mb-4">
              Productos
            </span>
            <h2 className="text-[2.5rem] font-black tracking-tight">
              Herramientas para traders serios
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "EV Quant Lab",
                price: "€99.99/mes",
                slug: "ev-quant-lab",
                icon: "📊",
                desc: "Construye, valida y optimiza estrategias como un profesional.",
              },
              {
                name: "Master of Liquidity",
                price: "€48.99/mes",
                slug: "master-of-liquidity",
                icon: "🎯",
                desc: "8 estrategias integradas con gestión de riesgo avanzada.",
              },
              {
                name: "Replicador",
                price: "€18.99/mes",
                slug: "replicador",
                icon: "⚡",
                desc: "Replicación de cuentas master a múltiples followers.",
              },
              {
                name: "Local App",
                price: "€79",
                slug: "local-app",
                icon: "💻",
                desc: "Tu entorno de trading en local, sin cloud.",
              },
            ].map((product) => (
              <div
                key={product.slug}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 hover:border-[#667eea]/30 transition-all group"
              >
                <div className="text-4xl mb-4">{product.icon}</div>
                <h3 className="text-[1.1rem] font-bold mb-2">{product.name}</h3>
                <p className="text-white/50 text-[0.88rem] mb-4 leading-relaxed">{product.desc}</p>
                <div className="text-[1.3rem] font-black text-[#667eea] mb-4">{product.price}</div>
                <Link
                  href={`/products#${product.slug}`}
                  className="inline-block px-4 py-2 rounded-lg bg-[#667eea]/20 text-[#667eea] text-[0.85rem] font-semibold hover:bg-[#667eea]/30 transition-colors"
                >
                  Más información →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-5 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f18]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[0.72rem] font-bold tracking-[0.2em] uppercase text-[#667eea] mb-4">
              Precios
            </span>
            <h2 className="text-[2.5rem] font-black tracking-tight mb-4">
              Sin sorpresas
            </h2>
            <p className="text-white/50">Precios claros. Cancela cuando quieras.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[900px] mx-auto">
            {[
              { name: "EV Quant Lab", price: "€99.99", period: "/mes", slug: "ev-quant-lab" },
              { name: "Master of Liquidity", price: "€48.99", period: "/mes", slug: "master-of-liquidity" },
              { name: "Replicador", price: "€18.99", period: "/mes", slug: "replicador" },
              { name: "Local App", price: "€79", period: "", slug: "local-app" },
            ].map((plan) => (
              <div key={plan.slug} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-center">
                <h3 className="font-bold mb-2">{plan.name}</h3>
                <div className="text-[1.8rem] font-black text-[#667eea] mb-1">{plan.price}</div>
                <div className="text-white/40 text-[0.85rem] mb-6">{plan.period}</div>
                <Link
                  href={`/checkout?product=${plan.slug}`}
                  className="block w-full py-3 rounded-xl bg-[#667eea] text-white font-semibold text-[0.9rem] hover:bg-[#5a7fd8] transition-colors"
                >
                  Suscribirse
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-5 bg-[#0a0a0f]">
        <div className="max-w-[700px] mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[0.72rem] font-bold tracking-[0.2em] uppercase text-[#667eea] mb-4">
              FAQ
            </span>
            <h2 className="text-[2.5rem] font-black tracking-tight">
              Preguntas frecuentes
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "¿Necesito experiencia previa?",
                a: "No. Cada producto incluye documentación y soporte para empezar.",
              },
              {
                q: "¿Funciona con MT5?",
                a: "Sí. Todos nuestros sistemas son para MetaTrader 5.",
              },
              {
                q: "¿Puedo probar antes de comprar?",
                a: "Sí. Dispones de versiones demo para evaluar.",
              },
              {
                q: "¿Cómo recibo mi licencia?",
                a: "Automáticamente por email tras el pago.",
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-white/[0.08] pb-6">
                <h3 className="font-bold text-[1rem] mb-2">{faq.q}</h3>
                <p className="text-white/50 text-[0.95rem]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-5 border-t border-white/[0.08] bg-[#0a0a0f]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid sm:grid-cols-[1fr_auto_auto] gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
                  <span className="text-white font-black text-sm">EV</span>
                </div>
                <span className="font-semibold">EV Trading Labs</span>
              </div>
              <p className="text-white/50 text-[0.88rem] max-w-[280px]">
                Sistemas de trading automatizados para MetaTrader 5.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[0.8rem] uppercase tracking-wider text-white/40 mb-4">
                Productos
              </h4>
              <div className="space-y-2">
                <Link href="/products" className="block text-white/60 hover:text-white text-[0.88rem] transition-colors">
                  Todos los productos
                </Link>
                <Link href="/products#ev-quant-lab" className="block text-white/60 hover:text-white text-[0.88rem] transition-colors">
                  EV Quant Lab
                </Link>
                <Link href="/products#master-of-liquidity" className="block text-white/60 hover:text-white text-[0.88rem] transition-colors">
                  Master of Liquidity
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-[0.8rem] uppercase tracking-wider text-white/40 mb-4">
                Legal
              </h4>
              <div className="space-y-2">
                <Link href="/terms" className="block text-white/60 hover:text-white text-[0.88rem] transition-colors">
                  Términos
                </Link>
                <Link href="/privacy" className="block text-white/60 hover:text-white text-[0.88rem] transition-colors">
                  Privacidad
                </Link>
                <Link href="/refund" className="block text-white/60 hover:text-white text-[0.88rem] transition-colors">
                  Reembolso
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-white/35 text-[0.82rem]">
              © {new Date().getFullYear()} EV Trading Labs
            </p>
            <a href="mailto:contact@evtradelabs.com" className="text-white/35 text-[0.82rem] hover:text-white transition-colors">
              contact@evtradelabs.com
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
