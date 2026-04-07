// Skeleton loading screens
import { useEffect, useState } from 'react'

interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ width = '100%', height = '20px', borderRadius = '8px', className = '', style = {} }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
        ...style,
      }}
    >
      <style>{`
        @keyframes skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '24px' }}>
      <Skeleton height="200px" borderRadius="12px" />
      <div style={{ marginTop: '16px' }}>
        <Skeleton height="24px" width="70%" />
        <Skeleton height="16px" width="100%" style={{ marginTop: '8px' }} />
        <Skeleton height="16px" width="80%" style={{ marginTop: '8px' }} />
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Skeleton width="80px" height="40px" borderRadius="8px" />
        <Skeleton width="80px" height="40px" borderRadius="8px" />
      </div>
    </div>
  )
}

// Product grid skeleton
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '24px'
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

// Text skeleton
export function TextSkeleton({ lines = 3, lastLineWidth = '60%' }: { lines?: number; lastLineWidth?: string }) {
  return (
    <div>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="16px"
          width={i === lines - 1 ? lastLineWidth : '100%'}
          style={{ marginBottom: '8px' }}
        />
      ))}
    </div>
  )
}

// Avatar skeleton
export function AvatarSkeleton({ size = '48px' }: { size?: string }) {
  return <Skeleton width={size} height={size} borderRadius="50%" />
}

// Button skeleton
export function ButtonSkeleton() {
  return <Skeleton width="120px" height="44px" borderRadius="10px" />
}

// Full page skeleton
export function PageSkeleton() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
        <Skeleton width="50%" height="400px" borderRadius="20px" />
        <div style={{ flex: 1 }}>
          <Skeleton height="48px" width="80%" />
          <TextSkeleton lines={4} style={{ marginTop: '24px' }} />
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <ButtonSkeleton />
            <ButtonSkeleton />
          </div>
        </div>
      </div>
      <ProductGridSkeleton count={3} />
    </div>
  )
}

// Blur-up image loader
export function BlurImage({ 
  src, 
  alt, 
  className = '',
  blurIntensity = 20 
}: { 
  src: string
  alt: string
  className?: string
  blurIntensity?: number 
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Low-res placeholder */}
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: error ? 'none' : `blur(${blurIntensity}px)`,
          transform: error ? 'none' : 'scale(1.1)', // Prevent blur edges
          transition: 'filter 0.3s ease-out, transform 0.3s ease-out',
        }}
        onLoad={() => {
          // Small delay to ensure smooth transition
          setTimeout(() => setLoaded(true), 50)
        }}
        onError={() => setError(true)}
      />
      {/* High-res version (loads on top) */}
      {!error && (
        <img
          src={src}
          alt={alt}
          className={className}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease-out',
          }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  )
}
