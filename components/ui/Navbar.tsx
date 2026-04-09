'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <div 
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-[#667eea] to-[#764ba2] z-[100] transition-all"
        style={{ width: `${typeof window !== 'undefined' ? Math.min((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100) : 0}%` }}
      />

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-sm">EV</span>
            </div>
            <span className="font-semibold text-white text-[0.95rem]">EV Trading Labs</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="relative">
              <button 
                onMouseEnter={() => setProductsOpen(true)}
                className="text-white/70 hover:text-white text-[0.88rem] font-medium transition-colors flex items-center gap-1"
              >
                Productos
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${productsOpen ? 'rotate-180' : ''}`}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {productsOpen && (
                <div 
                  className="absolute top-full left-0 pt-2"
                  onMouseLeave={() => setProductsOpen(false)}
                >
                  <div className="bg-[#0f0f18] border border-white/10 rounded-xl p-4 min-w-[200px] backdrop-blur-xl">
                    {[
                      { href: '/products#ev-quant-lab', label: 'EV Quant Lab' },
                      { href: '/products#master-of-liquidity', label: 'Master of Liquidity' },
                      { href: '/products#replicador', label: 'Replicador' },
                      { href: '/products#local-app', label: 'Local App' },
                      { href: '/products', label: 'Todos los productos' },
                    ].map((item) => (
                      <Link 
                        key={item.href} 
                        href={item.href}
                        className="block py-2 px-3 text-[0.88rem] text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/pricing" className="text-white/70 hover:text-white text-[0.88rem] font-medium transition-colors">
              Precios
            </Link>
            <Link href="/dashboard" className="text-white/70 hover:text-white text-[0.88rem] font-medium transition-colors">
              Dashboard
            </Link>
            <Link href="/account" className="text-white/70 hover:text-white text-[0.88rem] font-medium transition-colors">
              Mi Cuenta
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-white/70 hover:text-white text-[0.88rem] font-medium transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/products"
              className="px-5 py-2.5 rounded-xl bg-[#667eea] text-white text-[0.88rem] font-semibold hover:bg-[#5a7fd8] transition-all hover:scale-105"
            >
              Get Access
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white"
          >
            {mobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-lg border-t border-white/5 px-5 py-6 space-y-4">
            <Link href="/products" className="block text-white/70 hover:text-white text-[0.95rem] py-2">Productos</Link>
            <Link href="/pricing" className="block text-white/70 hover:text-white text-[0.95rem] py-2">Precios</Link>
            <Link href="/dashboard" className="block text-white/70 hover:text-white text-[0.95rem] py-2">Dashboard</Link>
            <Link href="/account" className="block text-white/70 hover:text-white text-[0.95rem] py-2">Mi Cuenta</Link>
            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              <Link href="/login" className="block text-center py-3 rounded-xl border border-white/20 text-white/80 font-medium">Iniciar sesión</Link>
              <Link href="/products" className="block text-center py-3 rounded-xl bg-[#667eea] text-white font-semibold">Get Access</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
