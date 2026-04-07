// Trust logos section - Brokers and platforms
'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

interface TrustLogosProps {
  title?: string
}

export function TrustLogos({ title = "CON LA CONFIANZA DE" }: TrustLogosProps) {
  const logosRef = useRef<HTMLDivElement>(null)
  
  const platforms = [
    { name: 'MetaTrader 5', src: '/platform-logos/mt5-wordmark.svg', color: '#017300' },
    { name: 'TradingView', src: '/platform-logos/tradingview.svg', color: '#2196F3' },
    { name: 'Interactive Brokers', src: '/platform-logos/ibkr-wordmark.svg', color: '#621B18' },
    { name: 'NinjaTrader', src: '/platform-logos/ninjatrader-wordmark.svg', color: '#0578B9' },
    { name: 'Vantage', src: '/platform-logos/vantage.svg', color: '#00AEEF' },
    { name: 'VT Markets', src: '/platform-logos/vtmarkets.svg', color: '#7B2D8E' },
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
              className="group cursor-pointer flex flex-col items-center"
              title={platform.name}
            >
              <div 
                className="w-32 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105"
                style={{
                  boxShadow: `0 0 30px ${platform.color}10`,
                }}
              >
                <Image 
                  src={platform.src}
                  alt={platform.name}
                  width={100}
                  height={32}
                  className="w-auto h-auto max-w-full max-h-full object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
              <span 
                className="text-[#8da0c2] text-[0.7rem] mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-center"
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
            Brokers y plataformas con las que trabajamos para ejecutar tus estrategias
          </p>
        </div>
      </div>
    </section>
  )
}
