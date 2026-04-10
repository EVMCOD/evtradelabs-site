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

      {/* Free Tools — TradingView Indicators */}
      <section className="py-28 px-5 bg-[#0a0a0f]">
        <div className="max-w-[1200px] mx-auto mb-16">
          <div className="text-center">
            <span className="inline-block text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#a78bfa] mb-4">
              GRATIS
            </span>
            <h2 className="text-[2.5rem] font-black tracking-tight">
              Free Trading Tools
            </h2>
            <p className="text-white/40 mt-3 text-[0.9rem]">Indicadores públicos gratuitos en TradingView</p>
          </div>
        </div>

        {/* BigBeluga-style cards with mini chart visuals */}
        <div className="max-w-[1100px] mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Mini chart SVG components */}
            {[
              { 
                name: "EV Liquidity Zones", 
                desc: "Identifica zonas de liquidez donde institutions colocan órdenes.", 
                chart: (
                  <svg viewBox="0 0 200 100" className="w-full h-20">
                    <defs>
                      <linearGradient id="liq1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
                      </linearGradient>
                      <linearGradient id="liq2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    {/* Price line */}
                    <polyline points="10,80 40,75 60,70 90,72 110,55 140,58 160,45 190,40" fill="none" stroke="#f97316" strokeWidth="2"/>
                    {/* Liquidity zones */}
                    <rect x="55" y="68" width="12" height="32" fill="url(#liq1)" rx="2"/>
                    <rect x="135" y="55" width="12" height="45" fill="url(#liq2)" rx="2"/>
                    {/* Dashed lines */}
                    <line x1="55" y1="68" x2="67" y2="68" stroke="#f97316" strokeWidth="1" strokeDasharray="2,2"/>
                    <line x1="135" y1="55" x2="147" y2="55" stroke="#f97316" strokeWidth="1" strokeDasharray="2,2"/>
                  </svg>
                ),
              },
              { 
                name: "EV Volume Profile", 
                desc: "Visualiza áreas de alto volumen para identificar puntos de control.",
                chart: (
                  <svg viewBox="0 0 200 100" className="w-full h-20">
                    <defs>
                      <linearGradient id="vp1" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0.3"/>
                      </linearGradient>
                    </defs>
                    {/* Bars */}
                    {[20,35,55,45,70,60,80,65,90,75,85,60,40].map((h, i) => (
                      <rect key={i} x={10 + i * 14} y={90 - h/1.5} width="10" height={h/1.5} fill="url(#vp1)" rx="1" opacity={0.5 + (i / 13) * 0.5}/>
                    ))}
                    {/* POC line */}
                    <line x1="10" y1="62" x2="190" y2="62" stroke="#22c55e" strokeWidth="1" strokeDasharray="3,3" opacity="0.6"/>
                    <text x="170" y="58" fill="#22c55e" fontSize="8" fontFamily="monospace">POC</text>
                  </svg>
                ),
              },
              { 
                name: "EV Smart Money", 
                desc: "Detecta BOS y CHOCH para entender el flujo de instituciones.",
                chart: (
                  <svg viewBox="0 0 200 100" className="w-full h-20">
                    <polyline points="10,75 30,70 50,72 70,30 90,35 110,75 130,70 150,25 170,28 190,20" fill="none" stroke="#a78bfa" strokeWidth="2"/>
                    {/* BOS/CHOCH markers */}
                    <circle cx="70" cy="30" r="4" fill="#f97316"/>
                    <text x="74" y="28" fill="#f97316" fontSize="7" fontFamily="monospace">BOS</text>
                    <circle cx="150" cy="25" r="4" fill="#22c55e"/>
                    <text x="154" y="23" fill="#22c55e" fontSize="7" fontFamily="monospace">CH</text>
                    {/* Breaks */}
                    <line x1="70" y1="72" x2="70" y2="30" stroke="#f97316" strokeWidth="1" strokeDasharray="2,2" opacity="0.5"/>
                    <line x1="150" y1="70" x2="150" y2="25" stroke="#22c55e" strokeWidth="1" strokeDasharray="2,2" opacity="0.5"/>
                  </svg>
                ),
              },
              { 
                name: "EV Chart Patterns", 
                desc: "Reconoce canales, wedges y patrones chartistas automáticamente.",
                chart: (
                  <svg viewBox="0 0 200 100" className="w-full h-20">
                    {/* Trend channel */}
                    <line points="10,80 190,30" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,4" opacity="0.4"/>
                    <line points="10,90 190,40" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,4" opacity="0.4"/>
                    {/* Price action */}
                    <polyline points="10,85 30,78 50,82 70,65 90,70 110,50 130,55 150,40 170,45 190,35" fill="none" stroke="#a78bfa" strokeWidth="2"/>
                    {/* Wedge annotation */}
                    <text x="100" y="18" fill="#a78bfa" fontSize="8" fontFamily="monospace" textAnchor="middle">WEDGE</text>
                    <line x1="115" y1="22" x2="115" y2="50" stroke="#a78bfa" strokeWidth="1" strokeDasharray="2,2"/>
                  </svg>
                ),
              },
              { 
                name: "EV Money Flow", 
                desc: "Combina indicadores de flujo de dinero con señales de entrada.",
                chart: (
                  <svg viewBox="0 0 200 100" className="w-full h-20">
                    <defs>
                      <linearGradient id="mf1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4"/>
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
                      </linearGradient>
                      <linearGradient id="mf2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4"/>
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    {/* Positive flow */}
                    <rect x="10" y="30" width="80" height="60" fill="url(#mf1)" rx="2"/>
                    <text x="18" y="48" fill="#22c55e" fontSize="8" fontFamily="monospace">IN</text>
                    {/* Negative flow */}
                    <rect x="100" y="30" width="90" height="60" fill="url(#mf2)" rx="2"/>
                    <text x="170" y="48" fill="#ef4444" fontSize="8" fontFamily="monospace">OUT</text>
                    {/* Arrow */}
                    <line x1="90" y1="60" x2="100" y2="60" stroke="#ffffff" strokeWidth="1.5"/>
                  </svg>
                ),
              },
              { 
                name: "EV Support Resistance", 
                desc: "Auto-detecta niveles de soporte y resistencia con confluencias.",
                chart: (
                  <svg viewBox="0 0 200 100" className="w-full h-20">
                    <line points="10,70 190,70" stroke="#f97316" strokeWidth="1.5" strokeDasharray="6,3"/>
                    <line points="10,40 190,40" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6,3"/>
                    {/* Price line */}
                    <polyline points="10,85 40,80 60,75 80,72 100,68 120,60 140,65 160,55 190,50" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
                    {/* Touches */}
                    <circle cx="70" cy="70" r="3" fill="#f97316"/>
                    <circle cx="120" cy="40" r="3" fill="#22c55e"/>
                    <text x="74" y="68" fill="#f97316" fontSize="7" fontFamily="monospace">S</text>
                    <text x="124" y="38" fill="#22c55e" fontSize="7" fontFamily="monospace">R</text>
                  </svg>
                ),
              },
            ].map((tool, i) => (
              <div 
                key={tool.name}
                className="group relative rounded-2xl overflow-hidden cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards', opacity: 0 }}
              >
                {/* Card background */}
                <div 
                  className="relative p-6 h-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 'inherit',
                  }}
                >
                  {/* Chart visual */}
                  <div className="mb-4 -mx-2">
                    {tool.chart}
                  </div>
                  
                  {/* Text */}
                  <h3 className="text-white font-bold text-[1rem] mb-2 group-hover:text-[#a78bfa] transition-colors">{tool.name}</h3>
                  <p className="text-white/40 text-[0.82rem] leading-relaxed">{tool.desc}</p>
                  
                  {/* TV badge */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="px-2.5 py-1 rounded-md bg-[#1e293b] border border-white/10 text-[0.7rem] text-white/50 font-medium">
                      TradingView
                    </div>
                    <span className="text-[#a78bfa] text-[0.75rem] group-hover:underline">Ver indicador →</span>
                  </div>
                </div>
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
