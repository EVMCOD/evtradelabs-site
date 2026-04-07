// High-end video hero section for EV Trading Labs
'use client'

import { useEffect, useRef, useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'

// Animated particles background
function AnimatedParticles() {
  const particles = useRef<Array<{
    x: number
    y: number
    size: number
    duration: number
    delay: number
    opacity: number
  }>>([])

  useEffect(() => {
    particles.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.5 + 0.2,
    }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.current.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: i % 3 === 0 
              ? 'radial-gradient(circle, #667eea, transparent)'
              : i % 3 === 1 
              ? 'radial-gradient(circle, #764ba2, transparent)'
              : 'radial-gradient(circle, #10b981, transparent)',
            opacity: p.opacity,
            animation: `floatParticle${i % 3} ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes floatParticle0 {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
          25% { transform: translateY(-40px) translateX(15px) scale(1.2); opacity: 0.7; }
          50% { transform: translateY(-20px) translateX(-20px) scale(0.9); opacity: 0.5; }
          75% { transform: translateY(-50px) translateX(10px) scale(1.1); opacity: 0.6; }
        }
        @keyframes floatParticle1 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          33% { transform: translateY(-30px) translateX(-25px); opacity: 0.6; }
          66% { transform: translateY(-45px) translateX(20px); opacity: 0.5; }
        }
        @keyframes floatParticle2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(30px, -35px) scale(1.3); opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

// Video Hero Props
interface VideoHeroProps {
  onCtaClick?: () => void
}

export function VideoHero({ onCtaClick }: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Try native HLS first
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8'
    }
  }, [])

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden">
      {/* Animated Background Gradient (always visible, replaces video) */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(102, 126, 234, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(118, 75, 162, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 40%),
            linear-gradient(135deg, #070b14 0%, #0d1a1a 50%, #070b14 100%)
          `,
          animation: 'gradientShift 10s ease-in-out infinite',
        }}
      >
        <style>{`
          @keyframes gradientShift {
            0%, 100% { 
              background-position: 0% 50%;
              filter: hue-rotate(0deg);
            }
            50% { 
              background-position: 100% 50%;
              filter: hue-rotate(15deg);
            }
          }
        `}</style>
      </div>

      {/* Animated Particles */}
      <AnimatedParticles />

      {/* Video Background (hidden, keeps structure for future) */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0 }}
      />

      {/* Left gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, #070b14 0%, transparent 60%)',
        }}
      />

      {/* Bottom gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, #070b14 0%, transparent 40%)',
        }}
      />

      {/* Grid lines with animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Vertical grid lines at 25%, 50%, 75% */}
        <div className="absolute top-0 bottom-0 w-px" style={{ left: '25%', background: 'rgba(255,255,255,0.05)' }} />
        <div className="absolute top-0 bottom-0 w-px" style={{ left: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div className="absolute top-0 bottom-0 w-px" style={{ left: '75%', background: 'rgba(255,255,255,0.05)' }} />
        {/* Horizontal grid lines */}
        <div className="absolute left-0 right-0 h-px" style={{ top: '33%', background: 'rgba(255,255,255,0.03)' }} />
        <div className="absolute left-0 right-0 h-px" style={{ top: '66%', background: 'rgba(255,255,255,0.03)' }} />
      </div>

      {/* Central glow - mouse reactive */}
      <div 
        className="absolute pointer-events-none transition-transform duration-1000 ease-out"
        style={{
          top: '-10%',
          left: '50%',
          transform: `translateX(calc(-50% + ${mousePos.x}px)) translateY(${mousePos.y}px)`,
          width: '80%',
          height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.15) 50%, transparent 70%)',
          filter: 'blur(30px)',
          animation: 'glowPulse 4s ease-in-out infinite',
        }}
      >
        <style>{`
          @keyframes glowPulse {
            0%, 100% { opacity: 0.8; transform: translateX(calc(-50% + var(--mouse-x, 0px))) scale(1); }
            50% { opacity: 1; transform: translateX(calc(-50% + var(--mouse-x, 0px))) scale(1.1); }
          }
        `}</style>
      </div>

      {/* Secondary floating glow */}
      <div 
        className="absolute pointer-events-none"
        style={{
          top: '20%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'floatGlow 8s ease-in-out infinite',
        }}
      >
        <style>{`
          @keyframes floatGlow {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
            50% { transform: translate(-30px, -20px) scale(1.2); opacity: 0.9; }
          }
        `}</style>
      </div>

      {/* Navigation */}
      <header className="absolute top-0 left-0 right-0 z-50 px-6 py-5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
              <span className="text-white font-black text-[0.9rem]">EV</span>
            </div>
            <span className="text-white font-bold text-[1rem] tracking-tight">EV Trading Labs</span>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {['PRODUCTS', 'SYSTEMS', 'COMMUNITY', 'DOCS'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-white/70 hover:text-[#667eea] text-[0.85rem] font-medium tracking-wide transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#acceso"
              className="px-5 py-2.5 rounded-full bg-[#667eea] text-white text-[0.8rem] font-semibold hover:bg-[#5a6fd6] transition-colors"
            >
              Get Access
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#070b14]/95 flex flex-col items-center justify-center gap-8 md:hidden">
          {['PRODUCTS', 'SYSTEMS', 'COMMUNITY', 'DOCS'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setIsMenuOpen(false)}
              className="text-white text-[1.5rem] font-medium tracking-wide"
            >
              {item}
            </a>
          ))}
          <a
            href="#acceso"
            className="px-8 py-4 rounded-full bg-[#667eea] text-white text-[1rem] font-semibold mt-4"
          >
            Get Access
          </a>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 pt-20">
        
        {/* Liquid Glass Card */}
        <div 
          className="relative w-[200px] h-[200px] mb-8"
          style={{ 
            transform: `translateY(-50px) translateX(${mousePos.x * 0.5}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <div 
            className="absolute inset-0 rounded-3xl"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              backgroundBlendMode: 'luminosity',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
              animation: 'cardFloat 6s ease-in-out infinite',
            }}
          >
            {/* Border effect via pseudo-element */}
            <div 
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                padding: '1.4px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(102,126,234,0.2) 50%, rgba(255,255,255,0.1) 100%)',
                backgroundSize: '200% 200%',
                animation: 'borderShine 3s linear infinite',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                borderRadius: 'inherit',
              }}
            />
          </div>
          
          {/* Card Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 rounded-3xl">
            <div 
              className="text-[#667eea] text-[0.8rem] font-bold tracking-widest mb-3"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              [ EV PATTERNS ]
            </div>
            <div 
              className="text-white text-[1rem] leading-tight font-medium mb-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Built by Traders,
              <br />
              for Traders
            </div>
            <div 
              className="text-white/50 text-[0.7rem]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Quantitative systems
              <br />
              & proven edge
            </div>
          </div>
          
          <style>{`
            @keyframes cardFloat {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
            @keyframes borderShine {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>
        </div>

        {/* Eyebrow */}
        <div 
          className="text-[#667eea] text-[0.75rem] font-bold tracking-[0.2em] uppercase mb-4"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Quantitative Trading Systems
        </div>

        {/* Main Headline */}
        <h1 
          className="text-white text-center tracking-tight leading-[1.1] mb-6 max-w-[900px]"
          style={{ 
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          }}
        >
          LAUNCH YOUR
          <br />
          TRADING EDGE<span className="text-[#667eea]">.</span>
        </h1>

        {/* Description */}
        <p 
          className="text-white/60 text-center max-w-[500px] mb-8 leading-relaxed"
          style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
          }}
        >
          Master quantitative trading strategies, risk management frameworks, 
          and algorithmic systems used by professional traders worldwide.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onCtaClick}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#667eea] text-white font-bold text-[0.85rem] uppercase tracking-wider hover:bg-[#5a6fd6] transition-all duration-200 shadow-[0_8px_30px_rgba(102,126,234,0.35)]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Explore Systems
            <ArrowRight size={18} />
          </button>
          <a
            href="#comunidad"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white/80 font-medium text-[0.85rem] uppercase tracking-wider hover:border-[#667eea]/50 hover:text-white transition-all"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Join Community
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/30 text-[0.65rem] tracking-widest uppercase" style={{ animation: 'fadeInOut 2s ease-in-out infinite' }}>Scroll</span>
          <div 
            className="w-px h-8 relative overflow-hidden"
          >
            <div 
              className="absolute inset-x-0 top-0 h-4"
              style={{
                background: 'linear-gradient(to bottom, rgba(102,126,234,0.9), transparent)',
                animation: 'scrollLine 1.5s ease-in-out infinite',
              }}
            />
          </div>
          <style>{`
            @keyframes fadeInOut {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.7; }
            }
            @keyframes scrollLine {
              0% { transform: translateY(-100%); }
              100% { transform: translateY(400%); }
            }
          `}</style>
        </div>
      </div>
    </section>
  )
}
