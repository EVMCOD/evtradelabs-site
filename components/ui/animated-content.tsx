// Advanced animated content components
'use client'

import { useEffect, useState, useRef } from 'react'

// ============================================
// INFINITE MARQUEE
// ============================================
interface MarqueeProps {
  children: React.ReactNode
  speed?: number // pixels per second
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  className?: string
}

export function Marquee({ 
  children, 
  speed = 50, 
  direction = 'left',
  pauseOnHover = true,
  className = ''
}: MarqueeProps) {
  const [isPaused, setIsPaused] = useState(false)
  
  return (
    <div 
      className={className}
      style={{ overflow: 'hidden', position: 'relative' }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <style>{`
        @keyframes marquee-${direction} {
          0% { transform: translateX(${direction === 'left' ? '0' : '0'}); }
          100% { transform: translateX(${direction === 'left' ? '-50%' : '50%'}); }
        }
        .marquee-content {
          display: flex;
          animation: marquee-${direction} ${20 / speed}s linear infinite;
          animation-play-state: ${isPaused ? 'paused' : 'running'};
        }
        .marquee-content:hover {
          animation-play-state: ${isPaused ? 'paused' : 'running'};
        }
      `}</style>
      <div className="marquee-content" style={{ width: 'max-content' }}>
        {/* Duplicate children for seamless loop */}
        <div style={{ display: 'flex' }}>{children}</div>
        <div aria-hidden="true" style={{ display: 'flex' }}>{children}</div>
      </div>
    </div>
  )
}

// Text marquee
export function TextMarquee({ 
  text, 
  speed = 50,
  separator = ' • ',
  className = ''
}: { 
  text: string
  speed?: number
  separator?: string
  className?: string
}) {
  return (
    <Marquee speed={speed} className={className}>
      <span style={{ 
        display: 'flex', 
        alignItems: 'center', 
        paddingRight: separator,
        whiteSpace: 'nowrap'
      }}>
        {text.split(separator).map((item, i) => (
          <span key={i}>{item}{i < text.split(separator).length - 1 && <span style={{ opacity: 0.5 }}>{separator}</span>}</span>
        ))}
      </span>
    </Marquee>
  )
}

// ============================================
// BEFORE/AFTER SLIDER
// ============================================
interface BeforeAfterProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
}

export function BeforeAfterSlider({ 
  beforeImage, 
  afterImage, 
  beforeLabel = 'Before',
  afterLabel = 'After',
  className = ''
}: BeforeAfterProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
      setPosition((x / rect.width) * 100)
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove as any)
      return () => container.removeEventListener('mousemove', handleMouseMove as any)
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        cursor: 'col-resize',
        userSelect: 'none',
        borderRadius: '12px',
      }}
    >
      {/* After image (background) */}
      <img src={afterImage} alt={afterLabel} style={{ width: '100%', display: 'block' }} />
      
      {/* Before image (clipped) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        clipPath: `inset(0 ${100 - position}% 0 0)`,
      }}>
        <img src={beforeImage} alt={beforeLabel} style={{ width: '100%', display: 'block' }} />
      </div>
      
      {/* Slider handle */}
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: `${position}%`,
        transform: 'translateX(-50%)',
        width: '4px',
        background: '#fff',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        cursor: 'col-resize',
        zIndex: 10,
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          fontSize: '18px',
        }}>
          ◀▶
        </div>
      </div>
      
      {/* Labels */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        background: 'rgba(0,0,0,0.7)',
        color: '#fff',
        padding: '4px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 600,
      }}>
        {beforeLabel}
      </div>
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        background: 'rgba(0,0,0,0.7)',
        color: '#fff',
        padding: '4px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 600,
      }}>
        {afterLabel}
      </div>
    </div>
  )
}

// ============================================
// ANIMATED COUNTERS
// ============================================
interface CounterProps {
  end: number
  duration?: number // ms
  separator?: string // thousands separator
  prefix?: string
  suffix?: string
  className?: string
}

export function AnimatedCounter({ 
  end, 
  duration = 2000, 
  separator = ',',
  prefix = '',
  suffix = '',
  className = ''
}: CounterProps) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    const startTime = Date.now()
    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      
      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setCount(end)
      }
    }
    requestAnimationFrame(step)
  }, [hasStarted, end, duration])

  const formatted = count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  )
}

// Multiple counters row
export function StatsCounter({ 
  stats,
  className = ''
}: { 
  stats: { value: number; label: string; prefix?: string; suffix?: string }[]
  className?: string
}) {
  return (
    <div className={className} style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {stats.map((stat, i) => (
        <div key={i} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 700, color: '#667eea' }}>
            <AnimatedCounter end={stat.value} prefix={stat.prefix || ''} suffix={stat.suffix || ''} />
          </div>
          <div style={{ color: '#888', marginTop: '8px', fontSize: '14px' }}>{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// VIDEO BACKGROUND
// ============================================
interface VideoBackgroundProps {
  src: string
  poster?: string
  overlay?: number // 0-1 opacity
  children?: React.ReactNode
  className?: string
}

export function VideoBackground({ 
  src, 
  poster,
  overlay = 0.5,
  children,
  className = ''
}: VideoBackgroundProps) {
  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
      {overlay > 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `rgba(0,0,0,${overlay})`,
          zIndex: 1,
        }} />
      )}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}

// ============================================
// PROGRESS BARS
// ============================================
interface ProgressBarProps {
  value: number // 0-100
  label?: string
  showPercent?: boolean
  height?: string
  color?: string
  bgColor?: string
  animated?: boolean
  className?: string
}

export function ProgressBar({ 
  value, 
  label,
  showPercent = true,
  height = '8px',
  color = '#667eea',
  bgColor = '#1e293b',
  animated = true,
  className = ''
}: ProgressBarProps) {
  const [width, setWidth] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasAnimated])

  useEffect(() => {
    if (!hasAnimated) return
    // Animate to value
    const timeout = setTimeout(() => setWidth(value), 100)
    return () => clearTimeout(timeout)
  }, [hasAnimated, value])

  return (
    <div ref={ref} className={className} style={{ width: '100%' }}>
      {(label || showPercent) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
          {label && <span style={{ color: '#888' }}>{label}</span>}
          {showPercent && <span style={{ color: '#fff', fontWeight: 600 }}>{width}%</span>}
        </div>
      )}
      <div style={{ 
        height, 
        background: bgColor, 
        borderRadius: '4px', 
        overflow: 'hidden' 
      }}>
        <div style={{
          height: '100%',
          width: `${animated ? width : value}%`,
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          borderRadius: '4px',
          transition: animated ? 'width 1s ease-out' : 'none',
          position: 'relative',
        }}>
          {animated && (
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '60px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3))',
              animation: 'progressShine 1.5s ease-in-out infinite',
            }} />
          )}
        </div>
      </div>
      <style>{`
        @keyframes progressShine {
          0% { opacity: 0; transform: translateX(-100%); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}

// Circular progress
interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
  label?: string
  showValue?: boolean
  className?: string
}

export function CircularProgress({ 
  value, 
  size = 120,
  strokeWidth = 8,
  color = '#667eea',
  bgColor = '#1e293b',
  label,
  showValue = true,
  className = ''
}: CircularProgressProps) {
  const [progress, setProgress] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasAnimated])

  useEffect(() => {
    if (!hasAnimated) return
    const timeout = setTimeout(() => setProgress(value), 100)
    return () => clearTimeout(timeout)
  }, [hasAnimated, value])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div ref={ref} className={className} style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {showValue && <span style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>{progress}%</span>}
        {label && <span style={{ fontSize: '12px', color: '#888' }}>{label}</span>}
      </div>
    </div>
  )
}

// Multiple progress bars
interface SkillBarProps {
  skills: { name: string; value: number; color?: string }[]
  className?: string
}

export function SkillBars({ skills, className = '' }: SkillBarProps) {
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {skills.map((skill, i) => (
        <ProgressBar 
          key={i} 
          label={skill.name} 
          value={skill.value} 
          color={skill.color}
        />
      ))}
    </div>
  )
}
