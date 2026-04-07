// Smooth scroll and interactive effects
'use client'

import { useEffect, useRef } from 'react'

// Smooth scroll provider
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'auto'
    
    // Custom smooth scroll function
    const smoothScrollTo = (target: string | number | HTMLElement) => {
      const element = typeof target === 'string' ? document.querySelector(target) : 
                      typeof target === 'number' ? document.documentElement :
                      target
      
      if (!element) return

      const targetPosition = typeof target === 'number' ? target :
                            element.getBoundingClientRect().top + window.scrollY
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
    }

    // Add to window
    (window as any).smoothScrollTo = smoothScrollTo

    return () => {
      delete (window as any).smoothScrollTo
    }
  }, [])

  return <>{children}</>
}

// Scroll progress indicator
export function ScrollProgress({ 
  height = '3px',
  color = '#3b82f6',
  position = 'top' // 'top' | 'bottom'
}: { 
  height?: string
  color?: string
  position?: 'top' | 'bottom'
}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (window.scrollY / scrollHeight) * 100
      setProgress(scrolled)
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      [position]: 0,
      left: 0,
      right: 0,
      height,
      backgroundColor: 'rgba(255,255,255,0.1)',
      zIndex: 9999,
    }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        backgroundColor: color,
        transition: 'width 0.1s linear',
      }} />
    </div>
  )
}

// Magnetic button effect
export function useMagneticEffect(strength = 0.3) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current as HTMLElement
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength
      
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
  }, [strength])

  return ref
}

// Magnetic Button component
export function MagneticButton({ 
  children, 
  strength = 0.3,
  className = '',
  ...props 
}: { 
  children: React.ReactNode
  strength?: number
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useMagneticEffect(strength)

  return (
    <button
      ref={ref as any}
      className={className}
      style={{ transition: 'transform 0.15s ease-out' }}
      {...props}
    >
      {children}
    </button>
  )
}

// 3D hover transform effect
export function use3DHover(intensity = 10) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current as HTMLElement
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

  return ref
}

// 3D Card component
export function Card3D({ 
  children, 
  intensity = 8,
  className = '',
}: { 
  children: React.ReactNode
  intensity?: number
  className?: string
}) {
  const ref = use3DHover(intensity)

  return (
    <div ref={ref as any} className={className}>
      {children}
    </div>
  )
}

// Ken Burns effect (slow zoom/pan on images)
export function KenBurnsImage({ 
  src, 
  alt, 
  duration = '20s',
  zoomDirection = 'in', // 'in' | 'out'
  panDirection = 'right', // 'left' | 'right' | 'alternate'
  className = ''
}: { 
  src: string
  alt: string
  duration?: string
  zoomDirection?: 'in' | 'out'
  panDirection?: 'left' | 'right' | 'alternate'
  className?: string
}) {
  const zoomStart = zoomDirection === 'in' ? 'scale(1)' : 'scale(1.15)'
  const zoomEnd = zoomDirection === 'in' ? 'scale(1.15)' : 'scale(1)'
  const panStart = panDirection === 'left' ? '0% 0%' : panDirection === 'right' ? '10% 0%' : '0% 0%'
  const panEnd = panDirection === 'left' ? '10% 0%' : panDirection === 'right' ? '0% 0%' : '5% 5%'

  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          animation: `kenBurns ${duration} ease-in-out infinite alternate`,
          transformOrigin: 'center center',
        }}
      />
      <style>{`
        @keyframes kenBurns {
          0% {
            transform: ${zoomStart} translate(${panStart});
          }
          100% {
            transform: ${zoomEnd} translate(${panEnd});
          }
        }
      `}</style>
    </div>
  )
}
