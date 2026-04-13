"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthState = "loading" | "authenticated" | "unauthenticated";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/products", label: "Productos" },
  { href: "/metricas", label: "Métricas" },
];

const accountMenuItems = [
  { href: "/account", label: "Mi Cuenta", icon: "👤" },
  { href: "/metricas/dashboard", label: "Mis Métricas", icon: "📈" },
  { href: "/account/connect", label: "Conectar MT5", icon: "📊" },
  { href: "/account/downloads", label: "Descargas", icon: "📥" },
  { href: "/account/licenses", label: "Licencias", icon: "🎫" },
  { href: "/account/purchases", label: "Compras", icon: "🛒" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [authState, setAuthState] = useState<AuthState>("loading");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => setAuthState(r.ok ? "authenticated" : "unauthenticated"))
      .catch(() => setAuthState("unauthenticated"));
  }, []);

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-[rgba(10,10,15,0.92)] backdrop-blur-2xl border-b border-white/[0.06]"
        : "bg-gradient-to-b from-[rgba(10,10,15,0.8)] to-transparent"
    }`}>
      {/* Gradient accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#667eea]" />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4">
            <span className="text-white/80 font-black text-[1.05rem] tracking-wider">EV TRADING LABS</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-all text-[0.88rem] font-medium"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-2" ref={dropdownRef}>
            {authState === "unauthenticated" && (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-all text-[0.88rem] font-medium"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl bg-[#667eea] text-white text-[0.88rem] font-semibold hover:bg-[#5a7fd8] transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}

            {authState === "authenticated" && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-2 text-[0.88rem] font-medium text-white/70 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/[0.06]"
                >
                  <span>Mi Cuenta</span>
                  <span className="text-[0.6rem] text-white/40">▼</span>
                </button>

                {accountMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 rounded-2xl border border-white/[0.08] bg-[rgba(10,10,18,0.98)] shadow-[0_25px_50px_rgba(0,0,0,0.5)] overflow-hidden"
                    style={{ animation: 'dropIn 0.2s ease-out' }}
                  >
                    <div className="p-2">
                      {accountMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="p-2 border-t border-white/[0.06]">
                      <button
                        onClick={async () => {
                          await fetch('/api/auth/logout', { method: 'POST' });
                          setAuthState("unauthenticated");
                          router.push('/');
                          router.refresh();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <span>🚪</span>
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 -mr-2 rounded-lg text-white/70 hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            {open ? (
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
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden border-t border-white/[0.06] bg-[rgba(10,10,15,0.98)] backdrop-blur-xl">
          <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-[0.95rem] font-medium text-white/70 hover:text-white border-b border-white/[0.04] last:border-0"
              >
                {l.label}
              </Link>
            ))}

            {authState === "authenticated" && (
              <div className="mt-3 pt-3 border-t border-white/[0.06]">
                <div className="px-1 py-2 text-[0.7rem] text-white/30 uppercase tracking-wider">Mi Cuenta</div>
                {accountMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-3 text-[0.95rem] font-medium text-white/70 hover:text-white border-b border-white/[0.04] last:border-0"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
                <button
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    setAuthState("unauthenticated");
                    setOpen(false);
                    router.push('/');
                    router.refresh();
                  }}
                  className="flex items-center gap-3 py-3 text-[0.95rem] font-medium text-red-400/80 border-b border-white/[0.04]"
                >
                  <span>🚪</span>
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}

            {authState === "unauthenticated" && (
              <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="text-center text-[0.9rem] font-semibold px-6 py-3 rounded-xl border border-white/10 text-white/70"
                >
                  Iniciar sesión
                </Link>
              </div>
            )}

            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="mt-3 text-center text-[0.9rem] font-semibold px-6 py-3 rounded-xl bg-[#667eea] text-white"
            >
              Ver productos
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </header>
  );
}
