import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "./_components/Navbar";
import { VideoHero } from "./_components/VideoHero";
import "./animations.css";

export const metadata: Metadata = {
  title: "EV Trading Labs — Sistemas automatizados para MT5",
  description: "Sistemas de trading automatizados, gestión del riesgo y replicación de cuentas para MetaTrader 5.",
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
      <VideoHero />

      {/* Trust logos */}
      <section className="py-16 px-5 bg-[#0a0a0f] border-y border-white/[0.05]">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-center text-[0.72rem] text-white/30 uppercase tracking-widest mb-8">
            Compatible con las principales plataformas
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {['MetaTrader 5', 'TradingView', 'Interactive Brokers', 'NinjaTrader', 'Vantage', 'VT Markets'].map((platform) => (
              <div key={platform} className="text-white/30 text-[0.88rem] font-medium">
                {platform}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 px-5 bg-[#0a0a0f]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[0.72rem] font-bold tracking-[0.2em] uppercase text-[#667eea] mb-4">
              Qué hacemos
            </span>
            <h2 className="text-[2.5rem] font-black tracking-tight">
              Automatiza tu trading
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Ejecución precisa",
                desc: "Elimina emociones de tu operativa. Operaciones ejecutadas con precisión milimétrica.",
                icon: "🎯",
              },
              {
                title: "Gestión del riesgo",
                desc: "Protección automática de capital con stops inteligentes y límites de exposición.",
                icon: "🛡️",
              },
              {
                title: "Multi-cuenta",
                desc: "Gestiona múltiples cuentas desde un solo dashboard con replicación en tiempo real.",
                icon: "⚡",
              },
            ].map((item, i) => (
              <div key={item.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 hover:border-[#667eea]/30 transition-all group card-animated">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-[1.1rem] font-bold mb-2">{item.title}</h3>
                <p className="text-white/50 text-[0.9rem] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="productos" className="py-24 px-5 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f18]">
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
              { name: "EV Quant Lab", price: "€99.99/mes", slug: "ev-quant-lab", icon: "📊", desc: "Construye y optimiza estrategias." },
              { name: "Master of Liquidity", price: "€48.99/mes", slug: "master-of-liquidity", icon: "🎯", desc: "8 estrategias con gestión de riesgo." },
              { name: "Replicador", price: "€18.99/mes", slug: "replicador", icon: "⚡", desc: "Replicación multi-cuenta en tiempo real." },
              { name: "Local App", price: "€79", slug: "local-app", icon: "💻", desc: "Tu entorno de trading en local." },
            ].map((p, i) => (
              <div key={p.slug} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 hover:border-[#667eea]/30 transition-all card-animated animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="font-bold mb-1">{p.name}</h3>
                <p className="text-white/50 text-[0.85rem] mb-3">{p.desc}</p>
                <div className="text-[1.2rem] font-black text-[#667eea] mb-4">{p.price}</div>
                <Link href={`/products#${p.slug}`} className="text-[#667eea] text-[0.85rem] font-semibold hover:underline">
                  Más información →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-5 bg-[#0a0a0f]">
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
            ].map((plan, i) => (
              <div key={plan.slug} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-center card-animated animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <h3 className="font-bold mb-2">{plan.name}</h3>
                <div className="text-[1.8rem] font-black text-[#667eea]">{plan.price}</div>
                <div className="text-white/40 text-[0.85rem] mb-6">{plan.period}</div>
                <Link href={`/checkout?product=${plan.slug}`} className="block w-full py-3 rounded-xl bg-[#667eea] text-white font-semibold text-[0.9rem] hover:bg-[#5a7fd8] transition-colors btn-animated">
                  Suscribirse
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-5 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f18]">
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
              { q: "¿Necesito experiencia previa?", a: "No. Cada producto incluye documentación y soporte para empezar." },
              { q: "¿Funciona con MT5?", a: "Sí. Todos nuestros sistemas son para MetaTrader 5." },
              { q: "¿Puedo probar antes de comprar?", a: "Sí. Dispones de versiones demo para evaluar." },
              { q: "¿Cómo recibo mi licencia?", a: "Automáticamente por email tras el pago." },
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
              <h4 className="font-semibold text-[0.8rem] uppercase tracking-wider text-white/40 mb-4">Productos</h4>
              <div className="space-y-2">
                <Link href="/products" className="block text-white/60 hover:text-white text-[0.88rem]">Todos</Link>
                <Link href="/products#ev-quant-lab" className="block text-white/60 hover:text-white text-[0.88rem]">EV Quant Lab</Link>
                <Link href="/products#master-of-liquidity" className="block text-white/60 hover:text-white text-[0.88rem]">Master of Liquidity</Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-[0.8rem] uppercase tracking-wider text-white/40 mb-4">Legal</h4>
              <div className="space-y-2">
                <Link href="/terms" className="block text-white/60 hover:text-white text-[0.88rem]">Términos</Link>
                <Link href="/privacy" className="block text-white/60 hover:text-white text-[0.88rem]">Privacidad</Link>
                <Link href="/refund" className="block text-white/60 hover:text-white text-[0.88rem]">Reembolso</Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-white/35 text-[0.82rem]">© {new Date().getFullYear()} EV Trading Labs</p>
            <a href="mailto:contact@evtradelabs.com" className="text-white/35 text-[0.82rem] hover:text-white transition-colors">
              contact@evtradelabs.com
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
