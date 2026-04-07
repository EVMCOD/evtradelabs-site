// Enhanced premium effects for EV Trading Labs
'use client'

import { useEffect, useState, useRef } from 'react'

// ============================================
// TESTIMONIAL CARD
// ============================================
interface TestimonialProps {
  name: string
  role: string
  avatar?: string
  quote: string
  platform?: string
  profit?: string
  className?: string
}

export function TestimonialCard({ name, role, avatar, quote, platform, profit, className = '' }: TestimonialProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.unobserve(el)
      }
    }, { threshold: 0.2 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.7s ease-out',
      }}
    >
      <div className="rounded-[24px] border border-white/10 bg-[rgba(17,26,45,0.6)] p-6 backdrop-blur-sm h-full flex flex-col">
        {/* Quote */}
        <div className="text-[#8da0c2] text-[0.95rem] leading-[1.8] mb-6 flex-1">
          "{quote}"
        </div>
        
        {/* Profit highlight */}
        {profit && (
          <div className="mb-4 inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2">
            <span className="text-green-400 font-bold text-[1.1rem]">{profit}</span>
            <span className="text-green-400/70 text-[0.75rem] ml-2">profit verified</span>
          </div>
        )}
        
        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white font-bold text-[0.85rem]">
            {avatar || name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="text-white font-semibold text-[0.9rem]">{name}</div>
            <div className="text-[#8da0c2] text-[0.75rem]">{role}</div>
          </div>
          {platform && (
            <div className="ml-auto text-[#667eea] text-[0.7rem] font-medium px-2 py-1 rounded bg-[#667eea]/10">
              {platform}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// TRUST BADGES
// ============================================
interface TrustBadgeProps {
  icon: React.ReactNode
  title: string
  subtitle: string
}

export function TrustBadge({ icon, title, subtitle }: TrustBadgeProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/8 bg-white/[0.03]">
      <div className="text-[#667eea]">{icon}</div>
      <div>
        <div className="text-white text-[0.8rem] font-medium">{title}</div>
        <div className="text-[#8da0c2] text-[0.65rem]">{subtitle}</div>
      </div>
    </div>
  )
}

// Trust badges data
export function TrustBadgesRow() {
  return (
    <div className="flex flex-wrap justify-center gap-4 my-8">
      <TrustBadge
        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
        title="Secure Payments"
        subtitle="256-bit SSL"
      />
      <TrustBadge
        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
        title="Protected Data"
        subtitle="GDPR Compliant"
      />
      <TrustBadge
        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        title="Verified Systems"
        subtitle="MetaTrader Approved"
      />
      <TrustBadge
        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>}
        title="Cloud Infrastructure"
        subtitle="99.9% Uptime"
      />
    </div>
  )
}

// ============================================
// SOCIAL PROOF COUNTER
// ============================================
interface SocialProofProps {
  number: string
  label: string
}

export function SocialProofItem({ number, label }: SocialProofProps) {
  return (
    <div className="text-center px-6">
      <div className="text-[2.5rem] font-black text-white tracking-tight">{number}</div>
      <div className="text-[#8da0c2] text-[0.8rem] uppercase tracking-wider mt-1">{label}</div>
    </div>
  )
}

// ============================================
// GRADIENT ANIMATED HERO
// ============================================
export function AnimatedHeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, #0d1120 0%, #111827 50%, #0d1120 100%)',
      }} />
      
      {/* Animated gradient orbs */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 50%)',
        animation: 'floatOrb1 15s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        top: '-30%',
        right: '-30%',
        width: '80%',
        height: '80%',
        background: 'radial-gradient(circle, rgba(118, 75, 162, 0.12) 0%, transparent 50%)',
        animation: 'floatOrb2 18s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '20%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
        animation: 'floatOrb3 20s ease-in-out infinite',
      }} />
      
      {/* Grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />
      
      <style>{`
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 30px) scale(1.15); }
        }
        @keyframes floatOrb3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -30px) rotate(10deg); }
        }
      `}</style>
    </div>
  )
}

// ============================================
// PULSE DOT INDICATOR
// ============================================
export function PulseDot({ color = '#10b981' }: { color?: string }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        animation: 'pulseRing 2s ease-out infinite',
      }} />
      <style>{`
        @keyframes pulseRing {
          0% { boxShadow: 0 0 0 0 ${color}60; }
          70% { boxShadow: 0 0 0 10px ${color}00; }
          100% { boxShadow: 0 0 0 0 ${color}00; }
        }
      `}</style>
    </span>
  )
}

// ============================================
// CTA CARD
// ============================================
interface CTACardProps {
  title: string
  description: string
  buttonText: string
  buttonHref: string
  variant?: 'primary' | 'secondary'
  icon?: React.ReactNode
}

export function CTACard({ title, description, buttonText, buttonHref, variant = 'primary', icon }: CTACardProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-[rgba(37,99,235,0.15)] to-transparent p-8 backdrop-blur-sm">
      {icon && <div className="text-[#667eea] mb-4">{icon}</div>}
      <h3 className="text-white text-[1.5rem] font-bold mb-3">{title}</h3>
      <p className="text-[#8da0c2] text-[0.95rem] mb-6">{description}</p>
      <a
        href={buttonHref}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-[0.9rem] transition-all duration-200"
        style={{
          background: variant === 'primary' 
            ? 'linear-gradient(135deg, #2563eb, #4f46e5)' 
            : 'rgba(255,255,255,0.05)',
          color: '#fff',
          border: variant === 'secondary' ? '1px solid rgba(255,255,255,0.2)' : 'none',
          boxShadow: variant === 'primary' ? '0 8px 30px rgba(37, 99, 235, 0.35)' : 'none',
        }}
      >
        {buttonText}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  )
}

// ============================================
// AVATAR GROUP (for social proof)
// ============================================
interface AvatarGroupProps {
  avatars: string[]
  max?: number
}

export function AvatarGroup({ avatars, max = 5 }: AvatarGroupProps) {
  const visible = avatars.slice(0, max)
  const remaining = avatars.length - max
  
  return (
    <div className="flex items-center">
      {visible.map((name, i) => (
        <div
          key={i}
          className="w-8 h-8 rounded-full border-2 border-[#0d1120] flex items-center justify-center text-white text-[0.65rem] font-bold"
          style={{ 
            background: `linear-gradient(135deg, hsl(${(i * 60 + 200)}, 70%, 60%), hsl(${(i * 60 + 250)}, 70%, 50%))`,
            marginLeft: i === 0 ? 0 : '-8px',
            zIndex: visible.length - i,
          }}
          title={name}
        >
          {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className="w-8 h-8 rounded-full border-2 border-[#0d1120] bg-[#1e293b] flex items-center justify-center text-white text-[0.65rem] font-medium"
          style={{ marginLeft: '-8px' }}
        >
          +{remaining}
        </div>
      )}
      <div className="ml-3 text-[#8da0c2] text-[0.8rem]">
        <span className="text-white font-medium">{avatars.length}+ traders</span> usando EVTL
      </div>
    </div>
  )
}

// ============================================
// NOTIFICATION TOAST
// ============================================
export function NotificationToast({ message, type = 'info' }: { message: string; type?: 'success' | 'info' | 'warning' }) {
  const colors = {
    success: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: '#10b981' },
    info: { bg: 'rgba(102, 126, 234, 0.1)', border: 'rgba(102, 126, 234, 0.3)', text: '#667eea' },
    warning: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: '#f59e0b' },
  }
  
  return (
    <div 
      className="fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl border backdrop-blur-sm"
      style={{
        background: colors[type].bg,
        borderColor: colors[type].border,
        animation: 'slideInUp 0.3s ease-out',
      }}
    >
      <div className="flex items-center gap-3">
        <span style={{ color: colors[type].text }}>{message}</span>
      </div>
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ============================================
// COUNTDOWN TIMER
// ============================================
interface CountdownProps {
  targetDate: string
  label: string
}

export function LaunchCountdown({ targetDate, label }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        })
      }
    }
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [targetDate])
  
  return (
    <div className="text-center">
      <div className="text-[#8da0c2] text-[0.8rem] uppercase tracking-wider mb-4">{label}</div>
      <div className="flex justify-center gap-4">
        {[
          { value: timeLeft.days, label: 'Days' },
          { value: timeLeft.hours, label: 'Hours' },
          { value: timeLeft.minutes, label: 'Min' },
          { value: timeLeft.seconds, label: 'Sec' },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <div className="w-16 h-16 rounded-xl bg-[rgba(102,126,234,0.1)] border border-[#667eea]/20 flex items-center justify-center">
              <span className="text-white text-[1.5rem] font-bold">{String(item.value).padStart(2, '0')}</span>
            </div>
            <div className="text-[#8da0c2] text-[0.65rem] uppercase mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// PRODUCT SHOWCASE MOCKUP
// ============================================
export function ProductMockup({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative">
      <div className="rounded-[20px] overflow-hidden border border-white/10 bg-[rgba(15,23,42,0.8)] shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
        {/* Browser header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[rgba(30,41,59,0.8)] border-b border-white/5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <div className="flex-1 mx-4">
            <div className="bg-[rgba(255,255,255,0.05)] rounded px-3 py-1 text-[#8da0c2] text-[0.7rem]">
              evtradelabs.com/dashboard
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="p-6 bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
          <div className="text-center">
            <div className="text-[#667eea] text-[0.8rem] font-medium mb-2">{title}</div>
            <div className="text-white text-[1.2rem] font-bold mb-4">{subtitle}</div>
            {/* Mini chart visualization */}
            <svg width="100%" height="60" viewBox="0 0 200 60" className="text-[#667eea]">
              <defs>
                <linearGradient id="mockupGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0,50 Q20,45 40,35 T80,25 T120,30 T160,15 T200,10 L200,60 L0,60 Z" fill="url(#mockupGrad)"/>
              <path d="M0,50 Q20,45 40,35 T80,25 T120,30 T160,15 T200,10" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </div>
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-[#667eea]/5 rounded-[30px] blur-xl -z-10" />
    </div>
  )
}
