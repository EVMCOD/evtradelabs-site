"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#metatrader", label: "MetaTrader 5" },
  { href: "#productos", label: "Productos" },
  { href: "#comunidad", label: "Comunidad" },
  { href: "#faq", label: "FAQ" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (window.scrollY / scrollHeight) * 100
      setScrollProgress(scrolled)
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          href="#inicio"
          className="shrink-0 flex items-center"
          aria-label="EV Trading Labs"
        >
          <Image
            src="/brand/evtl-logo.png"
            alt="EV Trading Labs"
            width={176}
            height={58}
            className="h-[40px] md:h-[44px] w-auto object-contain"
            priority
          />
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

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="#"
            className="text-[0.82rem] font-medium text-[#c3d3ec] hover:text-white transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="#acceso"
            className="text-[0.82rem] font-semibold px-4 py-2 rounded-full border border-white/12 bg-white/[0.05] text-white hover:bg-white/[0.1] transition-colors duration-200"
          >
            Acceso anticipado
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
          <Link
            href="#acceso"
            onClick={() => setOpen(false)}
            className="mt-3 text-center text-[0.9rem] font-semibold px-4 py-3 rounded-full border border-white/10 bg-white/[0.06] text-white"
          >
            Acceso anticipado
          </Link>
        </div>
      )}
      </header>
    </>
  );
}
