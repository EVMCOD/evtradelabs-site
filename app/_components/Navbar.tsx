"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/products", label: "Productos" },
  { href: "/products#pricing", label: "Precios" },
  { href: "/account", label: "Mi Cuenta" },
];

const accountMenuItems = [
  { href: "/account", label: "Mi Cuenta", icon: "👤" },
  { href: "/account/downloads", label: "Descargas", icon: "📥" },
  { href: "/account/licenses", label: "Licencias", icon: "🎫" },
  { href: "/account/purchases", label: "Compras", icon: "🛒" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(scrolled);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Scroll progress indicator */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'rgba(255,255,255,0.1)',
        zIndex: 9999,
      }}>
        <div style={{
          height: '100%',
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #667eea, #764ba2)',
          transition: 'width 0.1s linear',
          boxShadow: '0 0 10px #667eea',
        }} />
      </div>

      <header className="sticky top-0 z-50 px-4 pt-3">
        <div
          className={`mx-auto flex w-full max-w-[1180px] items-center justify-between gap-6 rounded-[18px] border px-5 transition-all duration-300 ${
            scrolled
              ? "h-[54px] border-white/10 bg-[rgba(16,24,43,0.82)] shadow-[0_10px_28px_rgba(7,12,25,0.16),0_0_40px_rgba(102,126,234,0.1)] backdrop-blur-xl"
              : "h-[58px] border-white/8 bg-[rgba(16,24,43,0.68)] backdrop-blur-lg"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 flex items-center"
            aria-label="EV Trading Labs"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
              <span className="text-white font-black text-sm">EV</span>
            </div>
            <span className="ml-2 font-semibold text-white text-[0.9rem]">EV Trading Labs</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-[0.82rem] text-[#c3d3ec]">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-white transition-colors duration-150 font-medium"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTA with Account Dropdown */}
          <div className="hidden lg:flex items-center gap-3" ref={dropdownRef}>
            {/* User is logged in - show dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-2 text-[0.82rem] font-medium text-[#c3d3ec] hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              >
                <span>👤</span>
                <span>Mi Cuenta</span>
                <span style={{ transform: accountMenuOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
              </button>

              {/* Dropdown menu */}
              {accountMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-[rgba(16,24,43,0.98)] shadow-xl backdrop-blur-xl overflow-hidden"
                  style={{ animation: 'fadeIn 0.2s ease-out' }}
                >
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="text-xs text-[#8da0c2]">Conectado como</div>
                    <div className="text-sm font-medium text-white mt-1">demo@evtl.io</div>
                  </div>
                  <div style={{ padding: '8px' }}>
                    {accountMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#c3d3ec] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                  <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <span>🚪</span>
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/products"
              className="text-[0.82rem] font-semibold px-4 py-2 rounded-full bg-[#667eea] text-white hover:bg-[#5a7fd8] transition-colors duration-200"
            >
              Ver productos
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-white"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            <span className="block w-5 h-px bg-current mb-1.5" />
            <span className="block w-5 h-px bg-current mb-1.5" />
            <span className="block w-3.5 h-px bg-current" />
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden border-t border-white/10 bg-[rgba(15,23,42,0.96)] px-5 py-4 flex flex-col gap-1 rounded-b-[26px]">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-[0.95rem] font-medium text-[#c3d3ec] hover:text-white border-b border-white/8 last:border-0"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="px-3 py-2 text-xs text-[#8da0c2]">Mi Cuenta</div>
              {accountMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 py-2.5 text-[0.95rem] font-medium text-[#c3d3ec] hover:text-white border-b border-white/8 last:border-0"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="mt-3 text-center text-[0.9rem] font-semibold px-4 py-3 rounded-xl bg-[#667eea] text-white"
            >
              Ver productos
            </Link>
          </div>
        )}
      </header>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
