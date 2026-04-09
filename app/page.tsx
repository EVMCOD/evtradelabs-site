import type { Metadata } from "next";
import Link from "next/link";
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
      <VideoHero />

      {/* Trust logos */}
      <section className="py-16 px-5 bg-[#0a0a0f]">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-center text-[0.7rem] text-white/25 uppercase tracking-[0.2em] mb-8">
            Compatible con las principales plataformas
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
            {['MetaTrader 5', 'TradingView', 'Interactive Brokers', 'NinjaTrader', 'Vantage', 'VT Markets'].map((platform) => (
              <div key={platform} className="text-white/25 text-[0.85rem] font-medium tracking-wide">
                {platform}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-28 px-5 bg-[#0a0a0f]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#667eea] mb-4">
              Qué hacemos
            </span>
            <h2 className="text-[2.5rem] font-black tracking-tight">
              Automatiza tu trading
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
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
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 hover:border-[#667eea]/25 transition-all group card-animated">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-[1.05rem] font-bold mb-2">{item.title}</h3>
                <p className="text-white/45 text-[0.88rem] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="productos" className="py-28 px-5 bg-[#0a0a0f]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#667eea] mb-4">
              Productos
            </span>
            <h2 className="text-[2.5rem] font-black tracking-tight">
              Herramientas para traders serios
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: "EV Quant Lab", slug: "ev-quant-lab", icon: "📊", desc: "Construye, valida y optimiza estrategias como un profesional.", price: "€99.99/mes" },
              { name: "Master of Liquidity", slug: "master-of-liquidity", icon: "🎯", desc: "8 estrategias integradas con gestión de riesgo avanzada.", price: "€48.99/mes" },
              { name: "Replicador", slug: "replicador", icon: "⚡", desc: "Replicación de cuentas master a múltiples followers en tiempo real.", price: "€18.99/mes" },
              { name: "Local App", slug: "local-app", icon: "💻", desc: "Tu entorno de trading en local, sin dependencias cloud.", price: "€79" },
            ].map((p, i) => (
              <div key={p.slug} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-[#667eea]/25 transition-all card-animated animate-fade-in-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}>
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="font-bold mb-1">{p.name}</h3>
                <p className="text-white/45 text-[0.85rem] mb-4 leading-relaxed">{p.desc}</p>
                <div className="text-[1.1rem] font-black text-[#667eea] mb-4">{p.price}</div>
                <Link href={`/products#${p.slug}`} className="inline-block px-4 py-2 rounded-lg bg-[#667eea]/15 text-[#667eea] text-[0.82rem] font-semibold hover:bg-[#667eea]/25 transition-colors">
                  Más información →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 px-5 bg-[#0a0a0f]">
        <div className="max-w-[700px] mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#667eea] mb-4">
              FAQ
            </span>
            <h2 className="text-[2.5rem] font-black tracking-tight">
              Preguntas frecuentes
            </h2>
          </div>

          <div className="space-y-0">
            {[
              { q: "¿Necesito experiencia previa?", a: "No. Cada producto incluye documentación y soporte para empezar." },
              { q: "¿Funciona con MT5?", a: "Sí. Todos nuestros sistemas son para MetaTrader 5." },
              { q: "¿Puedo probar antes de comprar?", a: "Sí. Dispones de versiones demo para evaluar." },
              { q: "¿Cómo recibo mi licencia?", a: "Automáticamente por email tras el pago." },
            ].map((faq, i) => (
              <div key={i} className="py-6 border-b border-white/[0.05]">
                <h3 className="font-bold text-[0.95rem] mb-2">{faq.q}</h3>
                <p className="text-white/45 text-[0.88rem]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-5 bg-[#0a0a0f]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
                  <span className="text-white font-black text-sm">EV</span>
                </div>
                <span className="font-semibold text-white">EV Trading Labs</span>
              </div>
              <p className="text-white/40 text-[0.88rem] max-w-[300px] leading-relaxed">
                Sistemas de trading automatizados para MetaTrader 5. Diseñado para traders que operan con estructura.
              </p>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-semibold text-[0.75rem] uppercase tracking-wider text-white/30 mb-4">Productos</h4>
              <div className="space-y-2.5">
                <Link href="/products" className="block text-white/50 hover:text-white text-[0.85rem] transition-colors">Todos los productos</Link>
                <Link href="/products#ev-quant-lab" className="block text-white/50 hover:text-white text-[0.85rem] transition-colors">EV Quant Lab</Link>
                <Link href="/products#master-of-liquidity" className="block text-white/50 hover:text-white text-[0.85rem] transition-colors">Master of Liquidity</Link>
                <Link href="/products#replicador" className="block text-white/50 hover:text-white text-[0.85rem] transition-colors">Replicador</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-[0.75rem] uppercase tracking-wider text-white/30 mb-4">Legal</h4>
              <div className="space-y-2.5">
                <Link href="/terms" className="block text-white/50 hover:text-white text-[0.85rem] transition-colors">Términos</Link>
                <Link href="/privacy" className="block text-white/50 hover:text-white text-[0.85rem] transition-colors">Privacidad</Link>
                <Link href="/refund" className="block text-white/50 hover:text-white text-[0.85rem] transition-colors">Reembolso</Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/25 text-[0.8rem]">
              © {new Date().getFullYear()} EV Trading Labs
            </p>
            <a href="mailto:contact@evtradelabs.com" className="text-white/25 text-[0.8rem] hover:text-white/50 transition-colors">
              contact@evtradelabs.com
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
