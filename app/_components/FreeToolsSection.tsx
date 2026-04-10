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

        {/* Cards grid — BigBeluga style */}
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 — Liquidity Zones */}
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
                  <line x1="86" y1="40" x2="86" y2="60" stroke="#22c55e" strokeWidth="1" opacity="0.5"/>
                  <line x1="166" y1="40" x2="166" y2="50" stroke="#22c55e" strokeWidth="1" opacity="0.5"/>
                </svg>
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-[0.6rem] font-bold bg-[#a78bfa]/20 text-[#a78bfa] border border-[#a78bfa]/30">FREE</div>
              </div>
              <div className="p-4" style={{ background: '#161b22' }}>
                <h3 className="text-white font-semibold text-[0.88rem] mb-1">EV Liquidity Zones</h3>
                <div className="flex items-center gap-3 text-[0.7rem] text-white/40"><span>👁 52K</span><span>❤ 1.8K</span></div>
              </div>
            </div>

            {/* Card 2 — Volume Profile */}
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

            {/* Card 3 — Smart Money */}
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

            {/* Card 4 — Order Blocks */}
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

            {/* Card 5 — Trend Strength */}
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

            {/* Card 6 — Support Resistance */}
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

            {/* Card 7 — Fibonacci Auto */}
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

            {/* Card 8 — View All */}
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
