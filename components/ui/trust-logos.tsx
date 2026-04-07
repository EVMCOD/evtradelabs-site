// Trust logos section - Brokers and platforms
'use client'

import { useEffect, useRef } from 'react'

interface TrustLogosProps {
  title?: string
}

export function TrustLogos({ title = "CON LA CONFIANZA DE" }: TrustLogosProps) {
  const logosRef = useRef<HTMLDivElement>(null)
  
  const platforms = [
    { name: 'MetaTrader 5', abbr: 'MT5', color: '#017300' },
    { name: 'TradingView', abbr: 'TV', color: '#2196F3' },
    { name: 'Interactive Brokers', abbr: 'IBKR', color: '#621B18' },
    { name: 'NinjaTrader', abbr: 'NT', color: '#0578B9' },
    { name: 'Vantage', abbr: 'VAN', color: '#00AEEF' },
    { name: 'VT Markets', abbr: 'VT', color: '#7B2D8E' },
  ]

  return (
    <section className="py-16 bg-transparent">
      <div className="w-full max-w-[1200px] mx-auto px-5">
        {/* Title */}
        <div className="text-center mb-10">
          <span 
            className="text-[#667eea] text-[0.75rem] font-bold tracking-[0.25em] uppercase"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {title}
          </span>
        </div>
        
        {/* Logos grid */}
        <div 
          ref={logosRef}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
        >
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="group cursor-pointer"
              title={platform.name}
            >
              <div 
                className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-white/10 flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:bg-[rgba(255,255,255,0.08)] hover:border-white/20 hover:scale-105"
                style={{
                  boxShadow: `0 0 20px ${platform.color}15`,
                }}
              >
                <span 
                  className="text-white font-black text-[0.9rem] tracking-tight"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {platform.abbr}
                </span>
              </div>
              <span 
                className="block text-center text-[#8da0c2] text-[0.65rem] mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {platform.name}
              </span>
            </div>
          ))}
        </div>
        
        {/* Subtext */}
        <div className="text-center mt-10">
          <p 
            className="text-[#8da0c2] text-[0.85rem]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Plataformas con las que trabajamos para ejecutar tus estrategias
          </p>
        </div>
      </div>
    </section>
  )
}
