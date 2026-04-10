'use client';

export default function FreeToolsSection() {
  const tools = [
    { name: "EV Liquidity Zones", color: "#a78bfa", views: "52K", likes: "1.8K" },
    { name: "EV Volume Profile", color: "#22c55e", views: "38K", likes: "1.1K" },
    { name: "EV Smart Money", color: "#a78bfa", views: "31K", likes: "920" },
    { name: "EV Order Blocks", color: "#f59e0b", views: "28K", likes: "780" },
    { name: "EV Trend Strength", color: "#667eea", views: "25K", likes: "670" },
    { name: "EV Support Resistance", color: "#22c55e", views: "22K", likes: "610" },
    { name: "EV Fibonacci Auto", color: "#a78bfa", views: "19K", likes: "540" },
    { name: "EV Momentum Divergence", color: "#22c55e", views: "17K", likes: "480" },
    { name: "EV Volume Spike", color: "#f59e0b", views: "15K", likes: "420" },
    { name: "EV VWAP Indicator", color: "#a78bfa", views: "12K", likes: "350" },
  ];

  return (
    <section 
      className="py-20 px-0 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d1117 50%, #0a0a0f 100%)' }}
    >
      <div className="max-w-[1200px] mx-auto mb-10 px-5">
        <div className="text-center">
          <span className="inline-block text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#a78bfa] mb-4">
            GRATIS
          </span>
          <h2 className="text-[2.5rem] font-black tracking-tight text-white">
            Free Trading Tools
          </h2>
          <p className="text-white/40 mt-3 text-[0.9rem]">Indicadores públicos gratuitos en TradingView</p>
        </div>
      </div>

      {/* Horizontal scroll — 4 visible, 10 total, duplicados para loop */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 animate-slow-ticker">
          {[...Array(2)].map((_, loop) =>
            tools.map((tool, i) => (
              <div
                key={`${loop}-${tool.name}`}
                className="flex-shrink-0 w-[280px] rounded-2xl overflow-hidden cursor-pointer group"
              >
                <div className="relative h-[140px] overflow-hidden" style={{ background: '#0d1117' }}>
                  {/* Mini chart visualization */}
                  <svg viewBox="0 0 280 140" className="w-full h-full">
                    {/* Grid lines */}
                    <line x1="0" y1="35" x2="280" y2="35" stroke="#1e2530" strokeWidth="1"/>
                    <line x1="0" y1="70" x2="280" y2="70" stroke="#1e2530" strokeWidth="1"/>
                    <line x1="0" y1="105" x2="280" y2="105" stroke="#1e2530" strokeWidth="1"/>
                    {/* Dynamic bars */}
                    {[20,38,56,74,92,110,128,146,164,182,200,218,236].map((x, bi) => {
                      const h = 20 + (bi * 7 + i * 5) % 60;
                      const y = 120 - h;
                      const isBull = bi % 3 !== 0;
                      return (
                        <rect
                          key={bi}
                          x={x}
                          y={y}
                          width="10"
                          height={h}
                          rx="2"
                          fill={isBull ? "#22c55e" : "#ef4444"}
                          opacity={0.4 + (bi / 13) * 0.5}
                        />
                      );
                    })}
                    {/* Trend line */}
                    <polyline
                      points={loop === 0
                        ? "20,100 60,85 100,90 140,65 180,72 220,50"
                        : "20,90 60,75 100,80 140,58 180,65 220,45"
                      }
                      fill="none"
                      stroke={tool.color}
                      strokeWidth="2.5"
                    />
                  </svg>
                  
                  {/* Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[0.55rem] font-bold bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/25">
                    FREE
                  </div>
                </div>
                
                <div className="p-4" style={{ background: '#161b22' }}>
                  <h3 className="text-white font-semibold text-[0.85rem] mb-1 group-hover:text-[#a78bfa] transition-colors">
                    {tool.name}
                  </h3>
                  <div className="flex items-center gap-3 text-[0.65rem] text-white/40">
                    <span>👁 {tool.views}</span>
                    <span>❤ {tool.likes}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="text-center mt-10">
        <a
          href="https://es.tradingview.com/u/EVLabs/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white/40 hover:text-[#a78bfa] text-[0.85rem] transition-colors"
        >
          Ver todos los indicadores en TradingView →
        </a>
      </div>
    </section>
  );
}
