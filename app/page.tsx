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
      <section className="py-20 px-5" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d1117 50%, #0a0a0f 100%)' }}>
        <div className="max-w-[1200px] mx-auto mb-12">
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

        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:z-10">
              <div className="relative h-[160px] overflow-hidden" style={{ background: '#0d1117' }}>
                <svg viewBox="0 0 280 160" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                  <line x1="0" y1="40" x2="280" y2="40" stroke="#1e2530" strokeWidth="1"/>
                  <line x1="0" y1="80" x2="280" y2="80" stroke="#1e2530" strokeWidth="1"/>
                  <line x1="0" y1="120" x2="280" y2="120" stroke="#1e2530" strokeWidth="1"/>
                  <rect x="20" y="90" width="12" height="30" rx="2" fill="#ef4444" opacity="0.8"/>
                  <rect x="40" y="70" width="12" height="50" rx="2" fill="#22c55e" opacity="0.8"/>
                  <rect x="60" y="85" width="12" height="35" rx="2" fill="#ef4444" opacity="0.8"/>
                  <rect x="80" y="60" width="12" height="60" rx="2" fill="#22c55e" opacity="0.8"/>
                  <rect x="100" y="75" width="12" height="45" rx="2" fill="#ef4444" opacity="0.8"/>
                  <rect x="120" y="55" width="12" height="65" rx="2" fill="#22c55e" opacity="0.8"/>
                  <rect x="140" y="80" width="12" height="40" rx="2" fill="#ef4444" opacity="0.8"/>
                  <rect x="160" y="50" width="12" height="70" rx="2" fill="#22c55e" opacity="0.8"/>
                  <rect x="180" y="65" width="12" height="55" rx="2" fill="#ef4444" opacity="0.8"/>
                  <rect x="200" y="45" width="12" height="75" rx="2" fill="#22c55e" opacity="0.8"/>
                  <rect x="160" y="40" width="60" height="20" rx="3" fill="#a78bfa" opacity="0.2"/>
                  <rect x="160" y="40" width="60" height="20" rx="3" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4 2"/>
                  <text x="190" y="55" fill="#a78bfa" fontSize="8" textAnchor="middle" fontFamily="monospace">LIQUIDITY</text>
                </svg>
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-[0.6rem] font-bold bg-[#a78bfa]/20 text-[#a78bfa] border border-[#a78bfa]/30">FREE</div>
              </div>
              <div className="p-4" style={{ background: '#161b22' }}>
                <h3 className="text-white font-semibold text-[0.88rem] mb-1">EV Liquidity Zones</h3>
                <div className="flex items-center gap-3 text-[0.7rem] text-white/40"><span>👁 52K</span><span>❤ 1.8K</span></div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:z-10">
              <div className="relative h-[160px] overflow-hidden" style={{ background: '#0d1117' }}>
                <svg viewBox="0 0 280 160" className="w-full h-full">
                  <line x1="70" y1="0" x2="70" y2="160" stroke="#1e2530" strokeWidth="1"/>
                  <line x1="140" y1="0" x2="140" y2="160" stroke="#1e2530" strokeWidth="1"/>
                  <line x1="210" y1="0" x2="210" y2="160" stroke="#1e2530" strokeWidth="1"/>
                  <rect x="20" y="100" width="30" height="60" rx="2" fill="#667eea" opacity="0.3"/>
                  <rect x="60" y="80" width="30" height="80" rx="2" fill="#667eea" opacity="0.5"/>
                  <rect x="100" y="50" width="30" height="110" rx="2" fill="#667eea" opacity="0.7"/>
                  <rect x="140" y="30" width="30" height="130" rx="2" fill="#667eea" opacity="0.9"/>
                  <rect x="180" y="60" width="30" height="100" rx="2" fill="#667eea" opacity="0.6"/>
                  <rect x="220" y="90" width="30" height="70" rx="2" fill="#667eea" opacity="0.4"/>
                  <line x1="10" y1="80" x2="270" y2="80" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 3"/>
                  <text x="260" y="76" fill="#22c55e" fontSize="7" fontFamily="monospace">POC</text>
                </svg>
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-[0.6rem] font-bold bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30">FREE</div>
              </div>
              <div className="p-4" style={{ background: '#161b22' }}>
                <h3 className="text-white font-semibold text-[0.88rem] mb-1">EV Volume Profile</h3>
                <div className="flex items-center gap-3 text-[0.7rem] text-white/40"><span>👁 38K</span><span>❤ 1.1K</span></div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:z-10">
              <div className="relative h-[160px] overflow-hidden" style={{ background: '#0d1117' }}>
                <svg viewBox="0 0 280 160" className="w-full h-full">
                  <rect x="20" y="120" width="14" height="30" rx="2" fill="#22c55e" opacity="0.8"/>
                  <rect x="42" y="100" width="14" height="50" rx="2" fill="#22c55e" opacity="0.8"/>
                  <rect x="64" y="90" width="14" height="60" rx="2" fill="#22c55e" opacity="0.8"/>
                  <rect x="86" y="70" width="14" height="80" rx="2" fill="#22c55e" opacity="0.8"/>
                  <rect x="108" y="55" width="14" height="95" rx="2" fill="#22c55e" opacity="0.8"/>
                  <rect x="130" y="50" width="14" height="100" rx="2" fill="#22c55e" opacity="0.8"/>
                  <rect x="152" y="30" width="14" height="120" rx="2" fill="#22c55e" opacity="0.8"/>
                  <line x1="20" y1="130" x2="166" y2="40" stroke="#a78bfa" strokeWidth="2"/>
                  <circle cx="152" cy="30" r="8" fill="none" stroke="#a78bfa" strokeWidth="2"/>
                  <text x="152" y="22" fill="#a78bfa" fontSize="6" textAnchor="middle" fontFamily="monospace">BOS</text>
                </svg>
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-[0.6rem] font-bold bg-[#a78bfa]/20 text-[#a78bfa] border border-[#a78bfa]/30">FREE</div>
              </div>
              <div className="p-4" style={{ background: '#161b22' }}>
                <h3 className="text-white font-semibold text-[0.88rem] mb-1">EV Smart Money</h3>
                <div className="flex items-center gap-3 text-[0.7rem] text-white/40"><span>👁 31K</span><span>❤ 920</span></div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:z-10">
              <div className="relative h-[160px] overflow-hidden" style={{ background: '#0d1117' }}>
                <svg viewBox="0 0 280 160" className="w-full h-full">
                  <rect x="20" y="80" width="14" height="40" rx="2" fill="#ef4444" opacity="0.7"/>
                  <rect x="42" y="90" width="14" height="30" rx="2" fill="#ef4444" opacity="0.7"/>
                  <rect x="64" y="100" width="14" height="20" rx="2" fill="#ef4444" opacity="0.7"/>
                  <rect x="86" y="110" width="14" height="10" rx="2" fill="#ef4444" opacity="0.7"/>
                  <rect x="20" y="70" width="80" height="25" rx="2" fill="#f59e0b" opacity="0.15"/>
                  <rect x="20" y="70" width="80" height="25" rx="2" fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
                  <text x="60" y="87" fill="#f59e0b" fontSize="7" textAnchor="middle" fontFamily="monospace">ORDER BLOCK</text>
                  <path d="M120 40 L120 130" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3"/>
                  <path d="M115 45 L120 35 L125 45" fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
                  <rect x="86" y="50" width="60" height="20" rx="2" fill="#f59e0b" opacity="0.1"/>
                  <text x="116" y="64" fill="#f59e0b" fontSize="6" textAnchor="middle" fontFamily="monospace">MITIGATION</text>
                </svg>
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-[0.6rem] font-bold bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30">FREE</div>
              </div>
              <div className="p-4" style={{ background: '#161b22' }}>
                <h3 className="text-white font-semibold text-[0.88rem] mb-1">EV Order Blocks</h3>
                <div className="flex items-center gap-3 text-[0.7rem] text-white/40"><span>👁 28K</span><span>❤ 780</span></div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:z-10">
              <div className="relative h-[160px] overflow-hidden" style={{ background: '#0d1117' }}>
                <svg viewBox="0 0 280 160" className="w-full h-full">
                  <path d="M10 120 Q40 80 70 100 T130 80 T190 60 T250 40" fill="none" stroke="#667eea" strokeWidth="2.5"/>
                  <path d="M10 130 Q40 90 70 110 T130 90 T190 70 T250 50" fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.5"/>
                  <rect x="20" y="140" width="20" height="8" rx="2" fill="#22c55e"/>
                  <rect x="45" y="140" width="20" height="8" rx="2" fill="#22c55e"/>
                  <rect x="70" y="140" width="20" height="8" rx="2" fill="#eab308"/>
                  <rect x="95" y="140" width="20" height="8" rx="2" fill="#eab308"/>
                  <rect x="120" y="140" width="20" height="8" rx="2" fill="#ef4444"/>
                  <rect x="145" y="140" width="20" height="8" rx="2" fill="#ef4444"/>
                  <text x="200" y="148" fill="#667eea" fontSize="8" fontFamily="monospace">STRENGTH</text>
                </svg>
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-[0.6rem] font-bold bg-[#667eea]/20 text-[#667eea] border border-[#667eea]/30">FREE</div>
              </div>
              <div className="p-4" style={{ background: '#161b22' }}>
                <h3 className="text-white font-semibold text-[0.88rem] mb-1">EV Trend Strength</h3>
                <div className="flex items-center gap-3 text-[0.7rem] text-white/40"><span>👁 25K</span><span>❤ 670</span></div>
              </div>
            </div>

            {/* Card 6 */}
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:z-10">
              <div className="relative h-[160px] overflow-hidden" style={{ background: '#0d1117' }}>
                <svg viewBox="0 0 280 160" className="w-full h-full">
                  <rect x="20" y="100" width="14" height="40" rx="2" fill="#22c55e" opacity="0.7"/>
                  <rect x="42" y="90" width="14" height="50" rx="2" fill="#22c55e" opacity="0.7"/>
                  <rect x="64" y="110" width="14" height="30" rx="2" fill="#ef4444" opacity="0.7"/>
                  <rect x="86" y="120" width="14" height="20" rx="2" fill="#ef4444" opacity="0.7"/>
                  <rect x="108" y="100" width="14" height="40" rx="2" fill="#22c55e" opacity="0.7"/>
                  <rect x="130" y="85" width="14" height="55" rx="2" fill="#22c55e" opacity="0.7"/>
                  <line x1="0" y1="120" x2="200" y2="120" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4"/>
                  <line x1="0" y1="90" x2="200" y2="90" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 4"/>
                  <text x="205" y="124" fill="#ef4444" fontSize="7" fontFamily="monospace">S</text>
                  <text x="205" y="94" fill="#22c55e" fontSize="7" fontFamily="monospace">R</text>
                </svg>
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-[0.6rem] font-bold bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30">FREE</div>
              </div>
              <div className="p-4" style={{ background: '#161b22' }}>
                <h3 className="text-white font-semibold text-[0.88rem] mb-1">EV Support Resistance</h3>
                <div className="flex items-center gap-3 text-[0.7rem] text-white/40"><span>👁 22K</span><span>❤ 610</span></div>
              </div>
            </div>

            {/* Card 7 */}
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:z-10">
              <div className="relative h-[160px] overflow-hidden" style={{ background: '#0d1117' }}>
                <svg viewBox="0 0 280 160" className="w-full h-full">
                  <line x1="40" y1="140" x2="240" y2="40" stroke="#667eea" strokeWidth="2"/>
                  <line x1="40" y1="40" x2="240" y2="40" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3 3" opacity="0.8"/>
                  <line x1="40" y1="65" x2="240" y2="65" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3 3" opacity="0.7"/>
                  <line x1="40" y1="90" x2="240" y2="90" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
                  <line x1="40" y1="115" x2="240" y2="115" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
                  <line x1="40" y1="140" x2="240" y2="140" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3 3" opacity="0.4"/>
                  <text x="245" y="44" fill="#a78bfa" fontSize="6" fontFamily="monospace">0%</text>
                  <text x="245" y="69" fill="#a78bfa" fontSize="6" fontFamily="monospace">23.6%</text>
                  <text x="245" y="94" fill="#a78bfa" fontSize="6" fontFamily="monospace">38.2%</text>
                  <text x="245" y="119" fill="#a78bfa" fontSize="6" fontFamily="monospace">61.8%</text>
                  <text x="245" y="144" fill="#a78bfa" fontSize="6" fontFamily="monospace">100%</text>
                </svg>
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-[0.6rem] font-bold bg-[#a78bfa]/20 text-[#a78bfa] border border-[#a78bfa]/30">FREE</div>
              </div>
              <div className="p-4" style={{ background: '#161b22' }}>
                <h3 className="text-white font-semibold text-[0.88rem] mb-1">EV Fibonacci Auto</h3>
                <div className="flex items-center gap-3 text-[0.7rem] text-white/40"><span>👁 19K</span><span>❤ 540</span></div>
              </div>
            </div>

            {/* Card 8 */}
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:z-10">
              <div className="relative h-[160px] overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)' }}>
                <div className="text-center">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-white/50 text-[0.8rem]">+12 more indicators</p>
                  <p className="text-white/30 text-[0.7rem] mt-1">on TradingView</p>
                </div>
              </div>
              <div className="p-4" style={{ background: '#161b22' }}>
                <h3 className="text-white font-semibold text-[0.88rem] mb-1">View All Indicators</h3>
                <div className="flex items-center gap-3 text-[0.7rem] text-white/40"><span>TradingView →</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <a href="https://es.tradingview.com/u/EVLabs/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#a78bfa] text-[0.85rem] font-semibold hover:underline">
            Ver todos en TradingView →
          </a>
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
