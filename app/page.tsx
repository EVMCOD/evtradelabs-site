import type { Metadata } from "next";
import Link from "next/link";
import { VideoHero } from "./_components/VideoHero";
import FreeToolsSection from "./_components/FreeToolsSection";
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

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Ejecución precisa",
                desc: "Elimina emociones de tu operativa. Operaciones ejecutadas con precisión milimétrica, sin retrasos ni slippage.",
                accent: "from-[#a78bfa] to-[#667eea]",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="14" cy="14" r="6" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="14" cy="14" r="2" fill="currentColor"/>
                    <path d="M14 2v4M14 22v4M2 14h4M22 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                title: "Gestión del riesgo",
                desc: "Protección automática de capital con stops inteligentes, límites de exposición y control de drawdown en tiempo real.",
                accent: "from-[#a78bfa] to-[#667eea]",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 3L4 9v10l10 6 10-6V9L14 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M14 3v13M4 9l10 6 10-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                ),
              },
              {
                title: "Multi-cuenta",
                desc: "Gestiona múltiples cuentas desde un solo dashboard. Replicación en tiempo real, sincronizada y sin latencia.",
                accent: "from-[#a78bfa] to-[#667eea]",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="4" y="8" width="8" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <rect x="16" y="8" width="8" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 14h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M20 11v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div 
                key={item.title} 
                className="group relative rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" 
                style={{ animationDelay: `${i * 120}ms`, animationFillMode: 'forwards', opacity: 0 }}
              >
                {/* Gradient accent */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-[0.05] group-hover:opacity-[0.09] transition-opacity duration-300`} />
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`relative mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br ${item.accent} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                
                {/* Content */}
                <div className="relative">
                  <h3 className="text-[1.15rem] font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/50 text-[0.88rem] leading-relaxed">{item.desc}</p>
                </div>
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

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                name: "EV Quant Lab", 
                slug: "ev-quant-lab", 
                tag: "QUANT RESEARCH",
                desc: "Plataforma quant para construir, validar y optimizar estrategias. Cloud + local. Backtesting y análisis Monte Carlo.",
                prices: [{ label: "Mensual", price: "€99.99/mes" }, { label: "Lifetime", price: "€399" }],
              },
              { 
                name: "Master of Liquidity", 
                slug: "master-of-liquidity", 
                tag: "MT5 EA",
                desc: "Asesor Experto para MetaTrader 5. 8 estrategias de liquidez integradas con gestión de riesgo avanzada.",
                prices: [{ label: "Mensual", price: "€48.99/mes" }, { label: "Lifetime", price: "€199" }],
              },
              { 
                name: "Replicador", 
                slug: "replicador", 
                tag: "COPY TRADING",
                desc: "Replicación de cuentas master a múltiples followers en tiempo real. Control total de lotajes y filtros.",
                prices: [{ label: "Mensual", price: "€18.99/mes" }, { label: "Lifetime", price: "€79" }],
              },
            ].map((p, i) => (
              <div 
                key={p.slug} 
                className="group relative rounded-2xl p-8 animate-fade-in-up" 
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards', opacity: 0 }}
              >
                {/* Animated lime border — full perimeter */}
                <div className="absolute inset-0 rounded-2xl animated-border pointer-events-none" />
                
                {/* Glass card */}
                <div className="relative rounded-2xl p-8 h-full backdrop-blur-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                  }}
                >
                  {/* Inner glow on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at center, rgba(167,139,250,0.08) 0%, transparent 70%)' }}
                  />
                  
                  {/* Tag */}
                  <div className="relative mb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#a78bfa] border border-[#a78bfa]/30 bg-[#a78bfa]/10">
                      {p.tag}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-[1.3rem] font-bold text-white mb-3">{p.name}</h3>
                    <p className="text-white/50 text-[0.88rem] mb-6 leading-relaxed">{p.desc}</p>
                    
                    {/* Prices */}
                    <div className="space-y-2 mb-6">
                      {p.prices.map((pr) => (
                        <div key={pr.label} className="flex items-center justify-between">
                          <span className="text-white/40 text-[0.8rem]">{pr.label}</span>
                          <span className="font-bold text-[#a78bfa]">{pr.price}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* CTA */}
                    <Link 
                      href={`/products#${p.slug}`} 
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[#a78bfa] text-[0.85rem] font-semibold border border-[#a78bfa]/30 hover:bg-[#a78bfa]/10 transition-all"
                    >
                      <span>Ver producto</span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop App Downloads */}
      <section className="py-28 px-5 bg-[#0a0a0f]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#38bdf8] mb-4">
              Descargas
            </span>
            <h2 className="text-[2.5rem] font-black tracking-tight">
              App de Escritorio
            </h2>
            <p className="text-white/50 text-[0.95rem] mt-4 max-w-[600px] mx-auto">
              Descarga la aplicación de escritorio para Windows, macOS y Linux. 
              Accede a herramientas avanzadas de trading con datos en tiempo real y ejecución local.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                name: "Windows", 
                icon: (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="4" y="4" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <rect x="18" y="4" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <rect x="4" y="18" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <rect x="18" y="18" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                ),
                versions: "Windows 10/11 (64-bit)",
                size: "180 MB",
                color: "#38bdf8",
              },
              { 
                name: "macOS", 
                icon: (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M20 26c1.5 1 4-1 5-2.5M16 23c2.5 1 5.5 0 7.5-2M10 9c0-1.5 1.5-3 4-3s4 1.5 4 3c0 2.5-3 4-4 5-1-1-4-2.5-4-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
                versions: "macOS 12+ (Intel + Apple Silicon)",
                size: "150 MB",
                color: "#a78bfa",
              },
              { 
                name: "Linux", 
                icon: (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 5v22M10 9c0 0 2 3 6 3s6-3 6-3M8 21c2-1 4-1 6-1s4 0 6 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
                versions: "Ubuntu 20.04+ / Debian",
                size: "120 MB",
                color: "#34d399",
              },
            ].map((app, i) => (
              <div 
                key={app.name} 
                className="group relative rounded-2xl p-8 animate-fade-in-up" 
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards', opacity: 0 }}
              >
                {/* Border gradient */}
                <div className="absolute inset-0 rounded-2xl" 
                  style={{ 
                    background: 'linear-gradient(135deg, transparent 0%, transparent 50%, rgba(56,189,248,0.1) 100%)',
                    padding: '1px'
                  }}
                >
                  <div className="w-full h-full rounded-2xl bg-[#0a0a0f]" />
                </div>
                
                <div className="relative">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ 
                      background: `linear-gradient(135deg, ${app.color}22 0%, ${app.color}11 100%)`,
                      color: app.color 
                    }}
                  >
                    {app.icon}
                  </div>
                  
                  <h3 className="text-[1.3rem] font-bold text-white mb-2">{app.name}</h3>
                  <p className="text-white/40 text-[0.88rem] mb-4">{app.versions}</p>
                  <p className="text-white/30 text-[0.75rem] mb-6">{app.size}</p>
                  
                  <button 
                    className="w-full py-3 rounded-xl font-semibold text-[0.85rem] transition-all duration-300 flex items-center justify-center gap-2"
                    style={{ 
                      background: `linear-gradient(135deg, ${app.color}22 0%, ${app.color}11 100%)`,
                      border: `1px solid ${app.color}33`,
                      color: app.color,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v9M4 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Descargar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/local-app" 
              className="inline-flex items-center gap-2 text-[0.9rem] text-white/50 hover:text-white transition-colors"
            >
              Ver todas las versiones y requisitos →
            </Link>
          </div>
        </div>
      </section>

      <FreeToolsSection />

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
              { q: "¿Necesito experiencia previa?", a: "No. Cada producto incluye documentación detallada y soporte para empezar desde cero." },
              { q: "¿Funciona con MT5?", a: "Sí. Todos nuestros sistemas sonpara MetaTrader 5, la plataforma más usada por traders profesionales." },
              { q: "¿Puedo probar antes de comprar?", a: "Sí. Dispones de versiones demo para evaluar cada producto sin compromiso." },
              { q: "¿Cómo recibo mi licencia?", a: "Automáticamente por email tras el pago. Recibirás tus credenciales al instante." },
              { q: "¿Ofrecéis soporte?", a: "Sí. Soporte por email y comunidad privada para todos los usuarios." },
            ].map((faq, i) => (
              <div 
                key={i} 
                className="group py-5 border-b border-[#a78bfa]/20 last:border-0 cursor-pointer"
              >
                <h3 className="font-bold text-[0.95rem] text-white/70 group-hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <span className="text-[#a78bfa] text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">▸</span>
                  {faq.q}
                </h3>
                <p className="text-white/40 text-[0.88rem] leading-relaxed max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-300 mt-0 group-hover:mt-2">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-5 glass mt-4">
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

          <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4">
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
