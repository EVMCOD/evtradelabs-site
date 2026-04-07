// Premium visual components for EV Trading Labs
'use client'

import { useEffect, useState, useRef } from 'react'

// Live trading ticker
export function LiveTradesTicker() {
  const [trades, setTrades] = useState([
    { pair: 'EUR/USD', type: 'BUY', price: '1.08742', pips: '+12.5', time: 'now' },
    { pair: 'GBP/JPY', type: 'SELL', price: '188.234', pips: '-8.3', time: 'now' },
    { pair: 'XAU/USD', type: 'BUY', price: '2,034.50', pips: '+24.8', time: 'now' },
    { pair: 'USD/CHF', type: 'BUY', price: '0.8842', pips: '+6.2', time: 'now' },
    { pair: 'AUD/USD', type: 'SELL', price: '0.6534', pips: '-3.1', time: 'now' },
  ])

  useEffect(() => {
    const pairs = ['EUR/USD', 'GBP/JPY', 'XAU/USD', 'USD/CHF', 'AUD/USD', 'EUR/GBP', 'NZD/USD']
    const types = ['BUY', 'SELL']
    
    const interval = setInterval(() => {
      setTrades(prev => {
        const newTrade = {
          pair: pairs[Math.floor(Math.random() * pairs.length)],
          type: types[Math.floor(Math.random() * types.length)] as 'BUY' | 'SELL',
          price: (Math.random() * 2 + 1).toFixed(5),
          pips: (Math.random() * 30 - 5).toFixed(1),
          time: 'now'
        }
        return [newTrade, ...prev.slice(0, 4)]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[rgba(7,11,20,0.9)] p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[#10b981] text-[0.75rem] font-bold tracking-wider uppercase">Live Trades</span>
      </div>
      <div className="space-y-2">
        {trades.map((trade, i) => (
          <div 
            key={`${trade.pair}-${i}`}
            className="flex items-center justify-between text-[0.8rem] animate-fadeIn"
            style={{ animation: 'fadeIn 0.3s ease-out' }}
          >
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-[0.65rem] font-bold ${
                trade.type === 'BUY' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {trade.type}
              </span>
              <span className="text-white font-medium">{trade.pair}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[#8da0c2]">{trade.price}</span>
              <span className={trade.pips.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                {trade.pips} pips
              </span>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// Premium dashboard mockup
export function DashboardMockup() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[rgba(30,41,59,0.9)] border-b border-white/5">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <div className="flex-1 mx-4">
          <div className="bg-[rgba(255,255,255,0.05)] rounded px-3 py-1 text-[#8da0c2] text-[0.7rem] text-center">
            evtradelabs.com/dashboard
          </div>
        </div>
      </div>
      
      {/* Dashboard content */}
      <div className="bg-[#0a0f1a] p-6">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Balance', value: '€24,521', change: '+12.4%', positive: true },
            { label: 'Open Positions', value: '8', change: '+2 today', positive: true },
            { label: 'Win Rate', value: '78%', change: '+3%', positive: true },
            { label: 'Risk Score', value: '2.1', change: 'Low', positive: true },
          ].map(stat => (
            <div key={stat.label} className="bg-[rgba(255,255,255,0.03)] rounded-xl p-3">
              <div className="text-[#8da0c2] text-[0.65rem] uppercase tracking-wider mb-1">{stat.label}</div>
              <div className="text-white text-[1.1rem] font-bold">{stat.value}</div>
              <div className={`text-[0.7rem] ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-[rgba(255,255,255,0.02)] rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-medium">Portfolio Performance</span>
            <span className="text-green-400 text-[0.8rem]">+24.5% YTD</span>
          </div>
          <svg width="100%" height="120" viewBox="0 0 400 120" className="text-[#667eea]">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path 
              d="M0,100 Q50,80 100,70 T200,50 T300,60 T400,30 L400,120 L0,120 Z" 
              fill="url(#chartGrad)"
            />
            <path 
              d="M0,100 Q50,80 100,70 T200,50 T300,60 T400,30" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="drop-shadow-[0_0_10px_rgba(102,126,234,0.5)]"
            />
          </svg>
        </div>

        {/* Positions */}
        <div className="space-y-2">
          {[
            { pair: 'EUR/USD', type: 'BUY', lots: '0.50', entry: '1.0850', current: '1.0874', pnl: '+€120' },
            { pair: 'XAU/USD', type: 'SELL', lots: '0.25', entry: '2050.00', current: '2034.50', pnl: '+€387' },
            { pair: 'GBP/JPY', type: 'BUY', lots: '0.30', entry: '188.50', current: '188.23', pnl: '-€81' },
          ].map(pos => (
            <div key={pos.pair} className="flex items-center justify-between bg-[rgba(255,255,255,0.02)] rounded-lg px-4 py-2">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[0.6rem] font-bold ${
                  pos.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>{pos.type}</span>
                <span className="text-white text-[0.85rem]">{pos.pair}</span>
              </div>
              <div className="flex items-center gap-4 text-[0.75rem] text-[#8da0c2]">
                <span>{pos.lots} lots</span>
                <span>@{pos.entry}</span>
                <span className={pos.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}>{pos.pnl}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Performance counter animation
export function AnimatedPerformance({ 
  end, 
  duration = 2500,
  prefix = '',
  suffix = '',
  decimals = 0
}: { 
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) setVisible(true)
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [visible])

  useEffect(() => {
    if (!visible) return
    const startTime = Date.now()
    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(eased * end)
      if (progress < 1) requestAnimationFrame(step)
      else setCount(end)
    }
    requestAnimationFrame(step)
  }, [visible, end, duration])

  const formatted = count.toFixed(decimals)

  return (
    <div ref={ref} className="text-center">
      <div className="text-[3rem] font-black text-white tracking-tight">
        {prefix}{formatted}{suffix}
      </div>
    </div>
  )
}

// Glow button
export function GlowButton({ 
  children, 
  href,
  variant = 'primary',
  size = 'md'
}: { 
  children: React.ReactNode
  href?: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeStyles = {
    sm: { padding: '10px 20px', fontSize: '0.85rem' },
    md: { padding: '14px 28px', fontSize: '0.92rem' },
    lg: { padding: '18px 36px', fontSize: '1rem' },
  }

  const colors = {
    primary: { bg: '#667eea', shadow: 'rgba(102,126,234,0.5)' },
    secondary: { bg: '#10b981', shadow: 'rgba(16,185,129,0.5)' },
  }

  const style = sizeStyles[size]
  const color = colors[variant]

  const button = (
    <button
      className="relative font-bold uppercase tracking-wider rounded-full transition-all duration-300 hover:scale-105"
      style={{
        ...style,
        background: `linear-gradient(135deg, ${color.bg}, ${color.bg}dd)`,
        boxShadow: `0 8px 30px ${color.shadow}`,
        color: '#fff',
      }}
    >
      {children}
    </button>
  )

  if (href) return <a href={href} style={{ textDecoration: 'none' }}>{button}</a>
  return button
}

// Floating card with glow
export function FloatingCard({ 
  children, 
  glowColor = '#667eea',
  className = ''
}: { 
  children: React.ReactNode
  glowColor?: string
  className?: string
}) {
  return (
    <div 
      className={`relative ${className}`}
      style={{
        animation: 'float 6s ease-in-out infinite',
      }}
    >
      <div 
        className="rounded-2xl border border-white/10 bg-[rgba(17,26,45,0.8)] backdrop-blur-xl p-6"
        style={{
          boxShadow: `0 0 60px ${glowColor}20, 0 25px 50px rgba(0,0,0,0.3)`,
        }}
      >
        {children}
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}

// Gradient text
export function GradientText({ 
  children, 
  colors = ['#667eea', '#764ba2', '#10b981'],
  className = ''
}: { 
  children: React.ReactNode
  colors?: string[]
  className?: string
}) {
  return (
    <span 
      className={className}
      style={{
        background: `linear-gradient(135deg, ${colors.join(', ')})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </span>
  )
}
