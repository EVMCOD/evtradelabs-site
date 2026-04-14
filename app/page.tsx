import type { Metadata } from "next";
import Link from "next/link";
import { VideoHero } from "./_components/VideoHero";
import FreeToolsSection from "./_components/FreeToolsSection";
import FAQAccordion from "./_components/FAQAccordion";
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
      <section className="py-12 md:py-16 px-5 bg-[#0a0a0f]">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-center text-[0.65rem] md:text-[0.7rem] text-white/25 uppercase tracking-[0.2em] mb-8 md:mb-10">
            Compatible con las principales plataformas
          </p>
          <div className="flex flex-wrap justify-center items-center gap-5 md:gap-10">
            {[
              { name: 'MetaTrader 5', abbr: 'MT5', color: '#4ade80' },
              { name: 'TradingView', abbr: 'TV', color: '#60a5fa' },
              { name: 'Interactive Brokers', abbr: 'IB', color: '#f59e0b' },
              { name: 'NinjaTrader', abbr: 'NT', color: '#a78bfa' },
              { name: 'Vantage', abbr: 'VG', color: '#34d399' },
              { name: 'VT Markets', abbr: 'VT', color: '#f472b6' },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-2.5 group">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[0.6rem] font-black shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${p.color}18`, border: `1px solid ${p.color}35`, color: p.color }}
                >
                  {p.abbr}
                </div>
                <span className="text-white/30 text-[0.78rem] md:text-[0.82rem] font-medium group-hover:text-white/50 transition-colors duration-300">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 md:py-28 px-5 bg-[#0a0a0f]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="inline-block text-[0.65rem] md:text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#667eea] mb-4">
              Qué hacemos
            </span>
            <h2 className="text-[1.75rem] md:text-[2.5rem] font-black tracking-tight">
              Automatiza tu trading
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
                className="group relative rounded-2xl p-5 md:p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${i * 120}ms`, animationFillMode: 'forwards', opacity: 0, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
              >
                {/* Gradient accent */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-[0.05] group-hover:opacity-[0.09] transition-opacity duration-300`} />
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`relative mb-4 md:mb-6 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${item.accent} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                
                {/* Content */}
                <div className="relative">
                  <h3 className="text-[1rem] md:text-[1.15rem] font-bold text-white mb-2 md:mb-3">{item.title}</h3>
                  <p className="text-white/50 text-[0.82rem] md:text-[0.88rem] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="productos" className="py-16 md:py-28 px-5 bg-[#0a0a0f]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="inline-block text-[0.65rem] md:text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#667eea] mb-4">
              Productos
            </span>
            <h2 className="text-[1.75rem] md:text-[2.5rem] font-black tracking-tight">
              Herramientas para traders serios
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                prices: [{ label: "Mensual", price: "€18.99/mes" }],
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
                  <div className="relative mb-4 md:mb-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1 rounded-full text-[0.6rem] md:text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#a78bfa] border border-[#a78bfa]/30 bg-[#a78bfa]/10">
                      {p.tag}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-[1.1rem] md:text-[1.3rem] font-bold text-white mb-2 md:mb-3">{p.name}</h3>
                    <p className="text-white/50 text-[0.82rem] md:text-[0.88rem] mb-4 md:mb-6 leading-relaxed">{p.desc}</p>
                    
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
                    <div className="flex flex-col gap-3">
                      <Link 
                        href={`/products/${p.slug}`}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[#a78bfa] text-[0.85rem] font-semibold border border-[#a78bfa]/30 hover:bg-[#a78bfa]/10 transition-all"
                      >
                        <span>Suscribirse</span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                      {p.slug === "ev-quant-lab" && (
                        <Link 
                          href="/local-app" 
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[#38bdf8] text-[0.85rem] font-semibold border border-[#38bdf8]/30 hover:bg-[#38bdf8]/10 transition-all"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 1v8M3 5l4 4 4-4M1 11h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>Descargar App</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* TradingView Indicators Showcase */}
      <section className="py-16 md:py-24 bg-[#0a0a0f] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-5 mb-10 md:mb-14">
          <div className="text-center">
            <span className="inline-block text-[0.65rem] md:text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#60a5fa] mb-4">
              TradingView · Gratuitos
            </span>
            <h2 className="text-[1.75rem] md:text-[2.5rem] font-black tracking-tight mb-3">
              Indicadores públicos
            </h2>
            <p className="text-white/40 text-[0.88rem] max-w-[480px] mx-auto">
              Scripts gratuitos publicados en TradingView. Añádelos directamente a tu gráfico con un clic.
            </p>
          </div>
        </div>

        {/* Carousel — auto-scroll ticker */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-4 w-16 md:w-28 z-10 pointer-events-none bg-gradient-to-r from-[#0a0a0f] to-transparent" />
          <div className="absolute right-0 top-0 bottom-4 w-16 md:w-28 z-10 pointer-events-none bg-gradient-to-l from-[#0a0a0f] to-transparent" />

          <div className="flex gap-4 pb-4 animate-indicators-ticker" style={{ width: 'max-content' }}>
            {([
              { name: "EV RSI Reversion",               slug: "z7B1Dsk9", img: "https://s3.tradingview.com/z/z7B1Dsk9_mid.png",  desc: "Detecta sobrecompra/sobreventa con señales de reversión visuales basadas en RSI." },
              { name: "EV Fair Value Gaps",              slug: "QLuXENre", img: "https://s3.tradingview.com/q/QLuXENre_mid.png",  desc: "Identifica y visualiza Fair Value Gaps con seguimiento de mitigación." },
              { name: "BOS + CHoCH",                    slug: "H84iLWHh", img: "https://s3.tradingview.com/h/H84iLWHh_mid.png",  desc: "Detecta Break of Structure y Change of Character para análisis Smart Money." },
              { name: "Liquidity Sweeps by EV",         slug: "Up6uhYGN", img: "https://s3.tradingview.com/u/Up6uhYGN_mid.png",  desc: "Identifica barridos de liquidez por encima y por debajo de máximos clave." },
              { name: "Session Levels by EV",           slug: "SHt4Bkun", img: "https://s3.tradingview.com/s/SHt4Bkun_mid.png",  desc: "Niveles de apertura de las sesiones NY, Londres y Asia en el gráfico." },
              { name: "EV FVG Probability Engine",      slug: "DlTOCCzj", img: "https://s3.tradingview.com/d/DlTOCCzj_mid.png",  desc: "Calcula la probabilidad estadística de relleno de cada Fair Value Gap." },
              { name: "EV Levels",                      slug: "tHIFxAs5", img: "https://s3.tradingview.com/t/tHIFxAs5_mid.png",  desc: "Niveles de soporte y resistencia clave calculados automáticamente." },
              { name: "FVG by EV",                      slug: "EjOkmVp9", img: "https://s3.tradingview.com/e/EjOkmVp9_mid.png",  desc: "Zonas de Fair Value Gap con estado activo o mitigado en tiempo real." },
              { name: "ATR BUY / SELL by EV",           slug: "9Ivx5VFg", img: "https://s3.tradingview.com/9/9Ivx5VFg_mid.png",  desc: "Señales largas y cortas basadas en ATR con trailing stop dinámico." },
              { name: "RSI Divergence by EV",           slug: "dPms91Ax", img: "https://s3.tradingview.com/d/dPms91Ax_mid.png",  desc: "Detecta divergencias alcistas y bajistas en el RSI automáticamente." },
              { name: "EV London Sweep Strategy",       slug: "TX2c7nb1", img: "https://s3.tradingview.com/t/TX2c7nb1_mid.png",  desc: "Estrategia de barrido de liquidez en la apertura de la sesión de Londres." },
              { name: "S/R + Trend",                    slug: "PVYlfXia", img: "https://s3.tradingview.com/p/PVYlfXia_mid.png",  desc: "Soporte y resistencia con indicador de dirección de tendencia integrado." },
              { name: "Volume + RVOL",                  slug: "GsWJESGj", img: "https://s3.tradingview.com/g/GsWJESGj_mid.png",  desc: "Volumen relativo (RVOL) para detectar actividad institucional inusual." },
              { name: "MACD by EV",                     slug: "Nep6MbTu", img: "https://s3.tradingview.com/n/Nep6MbTu_mid.png",  desc: "MACD mejorado con histograma de color dinámico y señales visuales." },
              { name: "EMA Trend by EV",                slug: "ugE8Ssov", img: "https://s3.tradingview.com/u/ugE8Ssov_mid.png",  desc: "Dirección de tendencia con múltiples EMAs y zonas de color de fondo." },
              { name: "Bollinger Bands by EV",          slug: "aVorrbba", img: "https://s3.tradingview.com/a/aVorrbba_mid.png",  desc: "Bandas de Bollinger con alertas de compresión y expansión de volatilidad." },
              { name: "Supertrend & ATR Trailing Stop", slug: "ciAnmI0p", img: "https://s3.tradingview.com/c/ciAnmI0p_mid.png",  desc: "Supertrend y ATR Trailing Stop combinados para seguir tendencias." },
              { name: "Stochastic Dynamic Bands",       slug: "hLUmqpmU", img: "https://s3.tradingview.com/h/hLUmqpmU_mid.png",  desc: "Estocástico con bandas dinámicas para zonas de reversión y momentum." },
              /* duplicate set for seamless loop */
              { name: "EV RSI Reversion",               slug: "z7B1Dsk9-2", img: "https://s3.tradingview.com/z/z7B1Dsk9_mid.png",  desc: "Detecta sobrecompra/sobreventa con señales de reversión visuales basadas en RSI." },
              { name: "EV Fair Value Gaps",              slug: "QLuXENre-2", img: "https://s3.tradingview.com/q/QLuXENre_mid.png",  desc: "Identifica y visualiza Fair Value Gaps con seguimiento de mitigación." },
              { name: "BOS + CHoCH",                    slug: "H84iLWHh-2", img: "https://s3.tradingview.com/h/H84iLWHh_mid.png",  desc: "Detecta Break of Structure y Change of Character para análisis Smart Money." },
              { name: "Liquidity Sweeps by EV",         slug: "Up6uhYGN-2", img: "https://s3.tradingview.com/u/Up6uhYGN_mid.png",  desc: "Identifica barridos de liquidez por encima y por debajo de máximos clave." },
              { name: "Session Levels by EV",           slug: "SHt4Bkun-2", img: "https://s3.tradingview.com/s/SHt4Bkun_mid.png",  desc: "Niveles de apertura de las sesiones NY, Londres y Asia en el gráfico." },
              { name: "EV FVG Probability Engine",      slug: "DlTOCCzj-2", img: "https://s3.tradingview.com/d/DlTOCCzj_mid.png",  desc: "Calcula la probabilidad estadística de relleno de cada Fair Value Gap." },
              { name: "EV Levels",                      slug: "tHIFxAs5-2", img: "https://s3.tradingview.com/t/tHIFxAs5_mid.png",  desc: "Niveles de soporte y resistencia clave calculados automáticamente." },
              { name: "FVG by EV",                      slug: "EjOkmVp9-2", img: "https://s3.tradingview.com/e/EjOkmVp9_mid.png",  desc: "Zonas de Fair Value Gap con estado activo o mitigado en tiempo real." },
              { name: "ATR BUY / SELL by EV",           slug: "9Ivx5VFg-2", img: "https://s3.tradingview.com/9/9Ivx5VFg_mid.png",  desc: "Señales largas y cortas basadas en ATR con trailing stop dinámico." },
              { name: "RSI Divergence by EV",           slug: "dPms91Ax-2", img: "https://s3.tradingview.com/d/dPms91Ax_mid.png",  desc: "Detecta divergencias alcistas y bajistas en el RSI automáticamente." },
              { name: "EV London Sweep Strategy",       slug: "TX2c7nb1-2", img: "https://s3.tradingview.com/t/TX2c7nb1_mid.png",  desc: "Estrategia de barrido de liquidez en la apertura de la sesión de Londres." },
              { name: "S/R + Trend",                    slug: "PVYlfXia-2", img: "https://s3.tradingview.com/p/PVYlfXia_mid.png",  desc: "Soporte y resistencia con indicador de dirección de tendencia integrado." },
              { name: "Volume + RVOL",                  slug: "GsWJESGj-2", img: "https://s3.tradingview.com/g/GsWJESGj_mid.png",  desc: "Volumen relativo (RVOL) para detectar actividad institucional inusual." },
              { name: "MACD by EV",                     slug: "Nep6MbTu-2", img: "https://s3.tradingview.com/n/Nep6MbTu_mid.png",  desc: "MACD mejorado con histograma de color dinámico y señales visuales." },
              { name: "EMA Trend by EV",                slug: "ugE8Ssov-2", img: "https://s3.tradingview.com/u/ugE8Ssov_mid.png",  desc: "Dirección de tendencia con múltiples EMAs y zonas de color de fondo." },
              { name: "Bollinger Bands by EV",          slug: "aVorrbba-2", img: "https://s3.tradingview.com/a/aVorrbba_mid.png",  desc: "Bandas de Bollinger con alertas de compresión y expansión de volatilidad." },
              { name: "Supertrend & ATR Trailing Stop", slug: "ciAnmI0p-2", img: "https://s3.tradingview.com/c/ciAnmI0p_mid.png",  desc: "Supertrend y ATR Trailing Stop combinados para seguir tendencias." },
              { name: "Stochastic Dynamic Bands",       slug: "hLUmqpmU-2", img: "https://s3.tradingview.com/h/hLUmqpmU_mid.png",  desc: "Estocástico con bandas dinámicas para zonas de reversión y momentum." },
            ] as { name: string; slug: string; img: string; desc: string }[]).map((ind) => (
              <a
                key={ind.slug}
                href={`https://www.tradingview.com/script/${ind.slug.replace(/-2$/, '')}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex-none w-[220px] md:w-[260px] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                {/* Thumbnail */}
                <div className="relative w-full overflow-hidden bg-[#0d1015]" style={{ aspectRatio: '16/9' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ind.img}
                    alt={ind.name}
                    width={520}
                    height={293}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(96,165,250,0.06)' }} />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-[0.88rem] font-bold text-white mb-1.5 leading-snug">{ind.name}</h3>
                  <p className="text-white/40 text-[0.75rem] leading-relaxed line-clamp-2">{ind.desc}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-[#60a5fa] text-[0.7rem] font-semibold opacity-70 group-hover:opacity-100 group-hover:gap-2 transition-all duration-200">
                    <span>Ver en TradingView</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 5h8M5.5 1.5l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="text-center mt-6 px-5">
          <a
            href="https://www.tradingview.com/u/EVLabs/#published-scripts"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-[0.8rem] transition-colors"
          >
            Ver todos los scripts en TradingView
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-28 px-5 bg-[#0a0a0f]">
        <div className="max-w-[700px] mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="inline-block text-[0.65rem] md:text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#667eea] mb-4">
              FAQ
            </span>
            <h2 className="text-[1.75rem] md:text-[2.5rem] font-black tracking-tight">
              Preguntas frecuentes
            </h2>
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-5 glass mt-20">
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
