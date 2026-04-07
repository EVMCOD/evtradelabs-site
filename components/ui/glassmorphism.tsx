// Glassmorphism and modern UI effects
import { ReactNode } from 'react'

interface GlassProps {
  children?: ReactNode
  className?: string
  style?: React.CSSProperties
  intensity?: 'light' | 'medium' | 'heavy'
  borderRadius?: string
  padding?: string
}

// Glass card component
export function GlassCard({ 
  children, 
  className = '',
  style = {},
  intensity = 'medium',
  borderRadius = '16px',
  padding = '24px'
}: GlassProps) {
  const blurMap = {
    light: '10px',
    medium: '20px',
    heavy: '40px'
  }
  const opacityMap = {
    light: '0.1',
    medium: '0.15',
    heavy: '0.25'
  }

  return (
    <div
      className={className}
      style={{
        background: `rgba(255, 255, 255, ${opacityMap[intensity]})`,
        backdropFilter: `blur(${blurMap[intensity]})`,
        WebkitBackdropFilter: `blur(${blurMap[intensity]})`,
        borderRadius,
        padding,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// Glass nav bar
export function GlassNav({ 
  children, 
  className = '',
  height = '60px'
}: { 
  children: ReactNode
  className?: string
  height?: string
}) {
  return (
    <nav
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
      }}
    >
      {children}
    </nav>
  )
}

// Gradient text
export function GradientText({ 
  children, 
  colors = ['#667eea', '#764ba2', '#f093fb'],
  direction = '135deg',
  className = ''
}: { 
  children: ReactNode
  colors?: string[]
  direction?: string
  className?: string
}) {
  return (
    <span
      className={className}
      style={{
        background: `linear-gradient(${direction}, ${colors.join(', ')})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </span>
  )
}

// Gradient border
export function GradientBorder({ 
  children, 
  colors = ['#667eea', '#764ba2', '#f093fb'],
  radius = '16px',
  thickness = '2px',
  className = ''
}: { 
  children: ReactNode
  colors?: string[]
  radius?: string
  thickness?: string
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        borderRadius: radius,
        padding: thickness,
        background: `linear-gradient(${colors.join(', ')})`,
      }}
    >
      <div style={{ 
        background: '#0f172a', 
        borderRadius: `calc(${radius} - ${thickness})`,
        padding: '24px',
      }}>
        {children}
      </div>
    </div>
  )
}

// Animated gradient border
export function AnimatedBorder({ 
  children, 
  colors = ['#667eea', '#764ba2', '#f093fb'],
  speed = '3s',
  radius = '16px',
  thickness = '2px',
  className = ''
}: { 
  children: ReactNode
  colors?: string[]
  speed?: string
  radius?: string
  thickness?: string
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        borderRadius: radius,
        padding: thickness,
        background: `linear-gradient(${colors.join(', ')})`,
        backgroundSize: '300% 300%',
        animation: `gradientShift ${speed} ease infinite`,
      }}
    >
      <div style={{ 
        background: '#0f172a', 
        borderRadius: `calc(${radius} - ${thickness})`,
        padding: '24px',
      }}>
        {children}
      </div>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}

// Neon glow effect
export function NeonGlow({ 
  children, 
  color = '#3b82f6',
  intensity = 'medium',
  radius = '16px',
  className = ''
}: { 
  children: ReactNode
  color?: string
  intensity?: 'low' | 'medium' | 'high'
  radius?: string
  className?: string
}) {
  const glowMap = {
    low: '0 0 5px',
    medium: '0 0 20px',
    high: '0 0 40px'
  }

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        borderRadius: radius,
        padding: '24px',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: radius,
        boxShadow: `${glowMap[intensity]} ${color}, inset 0 0 20px ${color}20`,
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  )
}

// Blur overlay
export function BlurOverlay({ 
  children,
  blur = '20px',
  overlayColor = 'rgba(0,0,0,0.5)',
  show = false
}: {
  children: ReactNode
  blur?: string
  overlayColor?: string
  show?: boolean
}) {
  return (
    <div style={{ position: 'relative' }}>
      {children}
      {show && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: `blur(${blur})`,
          WebkitBackdropFilter: `blur(${blur})`,
          background: overlayColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

// Floating badge
export function FloatingBadge({ 
  children,
  color = '#3b82f6',
  position = 'top-right', // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  offset = '0px'
}: {
  children: ReactNode
  color?: string
  position?: string
  offset?: string
}) {
  const positionMap = {
    'top-right': { top: offset, right: offset },
    'top-left': { top: offset, left: offset },
    'bottom-right': { bottom: offset, right: offset },
    'bottom-left': { bottom: offset, left: offset },
  }

  return (
    <div style={{
      position: 'absolute',
      ...positionMap[position as keyof typeof positionMap],
      zIndex: 10,
    }}>
      <div style={{
        backgroundColor: color,
        color: '#fff',
        borderRadius: '999px',
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: 600,
        boxShadow: `0 4px 12px ${color}40`,
      }}>
        {children}
      </div>
    </div>
  )
}

// Noise texture overlay
export function NoiseOverlay({ 
  opacity = 0.03,
  className = ''
}: {
  opacity?: number
  className?: string
}) {
  return (
    <div 
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='${opacity}'/%3E%3C/svg%3E")`,
        opacity,
      }}
    />
  )
}

// Modern button styles
export function ModernButton({ 
  children,
  variant = 'primary', // 'primary' | 'glass' | 'outline' | 'neon'
  size = 'medium', // 'small' | 'medium' | 'large'
  className = '',
  ...props
}: {
  children: ReactNode
  variant?: 'primary' | 'glass' | 'outline' | 'neon'
  size?: 'small' | 'medium' | 'large'
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const sizeMap = {
    small: { padding: '8px 16px', fontSize: '13px' },
    medium: { padding: '12px 24px', fontSize: '15px' },
    large: { padding: '16px 32px', fontSize: '17px' },
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      color: '#fff',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    outline: {
      background: 'transparent',
      color: '#667eea',
      border: '2px solid #667eea',
    },
    neon: {
      background: 'transparent',
      color: '#667eea',
      border: 'none',
      boxShadow: '0 0 20px #667eea40, inset 0 0 20px #667eea10',
    },
  }

  return (
    <button
      className={className}
      style={{
        ...sizeMap[size],
        ...variantStyles[variant],
        borderRadius: '10px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ...props,
      }}
      {...props}
    >
      {children}
    </button>
  )
}
