// Premium effects for EV Trading Labs
'use client'

import { useEffect, useState, useRef } from 'react'

// ============================================
// ANIMATED COUNTER - Trading focused
// ============================================
interface TradingCounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}

export function TradingCounter({ 
  end, 
  duration = 2500, 
  prefix = '',
  suffix = '',
  decimals = 0,
  className = ''
}: TradingCounterProps) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const startTime = Date.now()
    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4) // ease out quart
      setCount(eased * end)
      if (progress < 1) requestAnimationFrame(step)
      else setCount(end)
    }
    requestAnimationFrame(step)
  }, [started, end, duration])

  const formatted = count.toFixed(decimals).replace('.', ',')

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  )
}

// Stats row for trading metrics
interface TradingStatsProps {
  stats: {
    value: number
    suffix?: string
    prefix?: string
    decimals?: number
    label: string
    color?: string
  }[]
  className?: string
}

export function TradingStats({ stats, className = '' }: TradingStatsProps) {
  return (
    <div className={className} style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {stats.map((stat, i) => (
        <div key={i} style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', 
            fontWeight: 800, 
            color: stat.color || '#667eea',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}>
            <TradingCounter 
              end={stat.value} 
              prefix={stat.prefix || ''} 
              suffix={stat.suffix || ''}
              decimals={stat.decimals || 0}
            />
          </div>
          <div style={{ 
            color: '#8da0c2', 
            marginTop: '8px', 
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// FLOATING PARTICLES - Trading ambient
// ============================================
interface ParticlesProps {
  count?: number
  className?: string
}

export function TradingParticles({ count = 30, className = '' }: ParticlesProps) {
  const [particles, setParticles] = useState<Array<{
    x: number
    y: number
    size: number
    duration: number
    delay: number
    opacity: number
  }>>([])

  useEffect(() => {
    const generated = Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.1,
    }))
    setParticles(generated)
  }, [count])

  return (
    <div className={className} style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #667eea, transparent)',
            opacity: p.opacity,
            animation: `floatParticle ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-30px) translateX(10px); opacity: 0.6; }
          50% { transform: translateY(-15px) translateX(-15px); opacity: 0.4; }
          75% { transform: translateY(-40px) translateX(5px); opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

// ============================================
// LIVE CHART LINE - Animated trading chart
// ============================================
interface LiveChartProps {
  color?: string
  height?: number
  className?: string
}

export function LiveChartLine({ color = '#667eea', height = 200, className = '' }: LiveChartProps) {
  const [points, setPoints] = useState<string>('')
  const [offset, setOffset] = useState(0)
  
  useEffect(() => {
    const generatePath = () => {
      const width = 800
      const heightPx = height
      const segments = 40
      const segmentWidth = width / segments
      
      let path = `M 0 ${heightPx * 0.7}`
      
      for (let i = 1; i <= segments; i++) {
        const x = i * segmentWidth
        const noise = Math.sin(i * 0.3) * 30 + Math.sin(i * 0.7) * 20
        const trend = (segments - i) * 0.3 // slight upward trend
        const y = Math.max(heightPx * 0.2, Math.min(heightPx * 0.8, heightPx * 0.5 + noise + trend))
        path += ` L ${x} ${y}`
      }
      
      return path
    }
    
    setPoints(generatePath())
    
    const interval = setInterval(() => {
      setOffset(o => (o + 1) % 100)
    }, 50)
    
    return () => clearInterval(interval)
  }, [height])

  return (
    <div className={className} style={{ position: 'relative', height, overflow: 'hidden' }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 800 ${height}`} 
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <linearGradient id={`chartGrad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(p => (
          <line 
            key={p} 
            x1="0" 
            y1={height * p} 
            x2="800" 
            y2={height * p} 
            stroke="rgba(255,255,255,0.05)" 
            strokeWidth="1" 
          />
        ))}
        
        {/* Chart line */}
        <path
          d={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          style={{
            filter: `drop-shadow(0 0 8px ${color}60)`,
          }}
        />
        
        {/* Area fill */}
        <path
          d={`${points} L 800 ${height} L 0 ${height} Z`}
          fill={`url(#chartGrad-${color})`}
        />
      </svg>
      
      {/* Glow dot at end */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: '50%',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 20px ${color}`,
        animation: 'pulse 1.5s ease-in-out infinite',
      }} />
    </div>
  )
}

// ============================================
// MAGNETIC BUTTON - Premium trading CTA
// ============================================
interface MagneticButtonProps {
  children: React.ReactNode
  href?: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MagneticButton({ 
  children, 
  href,
  variant = 'primary',
  size = 'md',
  className = ''
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) * 0.2
      const deltaY = (e.clientY - centerY) * 0.2
      el.style.transform = `translate(${deltaX}px, ${deltaY}px)`
    }

    const handleMouseLeave = () => {
      el.style.transform = 'translate(0, 0)'
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const sizeStyles = {
    sm: { padding: '10px 20px', fontSize: '0.85rem' },
    md: { padding: '14px 28px', fontSize: '0.92rem' },
    lg: { padding: '18px 36px', fontSize: '1rem' },
  }

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
      color: '#fff',
      border: 'none',
      boxShadow: '0 8px 30px rgba(37, 99, 235, 0.35)',
    },
    secondary: {
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(10px)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.15)',
    },
    outline: {
      background: 'transparent',
      color: '#667eea',
      border: '2px solid #667eea',
    },
  }

  const button = (
    <div
      ref={ref}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderRadius: '999px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'transform 0.15s ease-out, box-shadow 0.2s ease',
        ...sizeStyles[size],
        ...variantStyles[variant],
      }}
    >
      {children}
    </div>
  )

  if (href) {
    return <a href={href} style={{ textDecoration: 'none' }}>{button}</a>
  }
  return button
}

// ============================================
// CARD 3D HOVER - Premium product cards
// ============================================
interface Card3DHoverProps {
  children: React.ReactNode
  intensity?: number
  className?: string
}

export function Card3DHover({ 
  children, 
  intensity = 8,
  className = ''
}: Card3DHoverProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const percentX = ((e.clientX - centerX) / (rect.width / 2)) * intensity
      const percentY = ((e.clientY - centerY) / (rect.height / 2)) * intensity
      
      el.style.transform = `
        perspective(1000px) 
        rotateY(${percentX}deg) 
        rotateX(${-percentY}deg)
        scale3d(1.02, 1.02, 1.02)
      `
    }

    const handleMouseLeave = () => {
      el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)'
    }

    el.style.transformStyle = 'preserve-3d'
    el.style.transition = 'transform 0.15s ease-out'
    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [intensity])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

// ============================================
// SCROLL ANIMATIONS - Intersection Observer
// ============================================
interface ScrollRevealProps {
  children: React.ReactNode
  animation?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'zoomIn'
  delay?: number
  className?: string
}

export function ScrollReveal({ 
  children, 
  animation = 'fadeInUp',
  delay = 0,
  className = ''
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const animations: Record<string, React.CSSProperties> = {
    fadeInUp: { opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)' },
    fadeInDown: { opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-40px)' },
    fadeInLeft: { opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-40px)' },
    fadeInRight: { opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(40px)' },
    scaleIn: { opacity: visible ? 1 : 0, transform: visible ? 'scale(1)' : 'scale(0.9)' },
    zoomIn: { opacity: visible ? 1 : 0, transform: visible ? 'scale(1)' : 'scale(0.5)' },
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...animations[animation],
        transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ============================================
// PROGRESS BAR - Trading metrics
// ============================================
interface TradingProgressProps {
  value: number
  label?: string
  color?: string
  showValue?: boolean
  decimals?: number
  className?: string
}

export function TradingProgress({ 
  value, 
  label,
  color = '#667eea',
  showValue = true,
  decimals = 0,
  className = ''
}: TradingProgressProps) {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(value), 100)
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  const displayValue = decimals > 0 ? width.toFixed(decimals) : width

  return (
    <div ref={ref} className={className} style={{ width: '100%' }}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
          {label && <span style={{ color: '#8da0c2' }}>{label}</span>}
          {showValue && <span style={{ color: '#fff', fontWeight: 600 }}>{displayValue}%</span>}
        </div>
      )}
      <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${width}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          borderRadius: '3px',
          transition: 'width 1.2s ease-out',
          boxShadow: `0 0 15px ${color}60`,
        }} />
      </div>
    </div>
  )
}

// ============================================
// GLASS CARD - Premium container
// ============================================
interface GlassCardProps {
  children: React.ReactNode
  intensity?: 'light' | 'medium' | 'heavy'
  className?: string
  style?: React.CSSProperties
}

export function GlassCard({ 
  children, 
  intensity = 'medium',
  className = '',
  style = {}
}: GlassCardProps) {
  const blurMap = { light: '12px', medium: '20px', heavy: '40px' }
  const opacityMap = { light: '0.08', medium: '0.12', heavy: '0.2' }

  return (
    <div
      className={className}
      style={{
        background: `rgba(255, 255, 255, ${opacityMap[intensity]})`,
        backdropFilter: `blur(${blurMap[intensity]})`,
        WebkitBackdropFilter: `blur(${blurMap[intensity]})`,
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ============================================
// INFINITE MARQUEE - Trading platforms
// ============================================
interface MarqueeProps {
  items: string[]
  speed?: number
  className?: string
}

export function PlatformMarquee({ items, speed = 40, className = '' }: MarqueeProps) {
  return (
    <div className={className} style={{ overflow: 'hidden', position: 'relative' }}>
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div style={{ 
        display: 'flex', 
        animation: `marqueeScroll ${100 / speed}s linear infinite`,
        width: 'max-content',
      }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            paddingRight: '48px',
            whiteSpace: 'nowrap',
            color: '#8da0c2',
            fontSize: '0.85rem',
          }}>
            <span style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              background: '#667eea',
              marginRight: '12px',
              boxShadow: '0 0 10px #667eea',
            }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
