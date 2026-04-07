import Image from "next/image";
import Link from "next/link";
import Navbar from "./_components/Navbar";
import WaitlistForm from "./_components/WaitlistForm";
import PlatformTicker from "./_components/PlatformTicker";
import AffiliateCard from "./_components/AffiliateCard";
import PacksSection from "./_components/PacksSection";
import EVTLCoreSection from "./_components/EVTLCoreSection";
import { 
  TradingCounter, 
  TradingStats, 
  TradingParticles, 
  LiveChartLine,
  MagneticButton,
  Card3DHover,
  ScrollReveal,
  TradingProgress,
  GlassCard,
  PlatformMarquee
} from "@/components/ui/premium-effects";
import {
  TestimonialCard,
  TrustBadgesRow,
  AnimatedHeroBackground,
  CTACard,
  AvatarGroup,
  SocialProofItem,
  ProductMockup,
} from "@/components/ui/enhanced-effects";
import { VideoHero } from "@/components/ui/video-hero";

/* ─── Utility ─────────────────────────────────────────────── */
function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#7b9ed9] mb-3">
      {children}
    </span>
  );
}

/* ─── HERO ─────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-[#0d1120] pt-20 pb-0"
    >
      {/* Enhanced animated background */}
      <AnimatedHeroBackground />
      
      {/* Premium particles */}
      <TradingParticles count={50} />
      
      {/* Radial glows */}
      <div className="hero-ambient-glow absolute top-[-160px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#1f6fff]/12 blur-[120px] pointer-events-none" />
      <div className="hero-ambient-glow absolute right-[-120px] top-[80px] w-[420px] h-[420px] rounded-full bg-[#3b82f6]/10 blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5">
        <div className="pb-14 flex justify-center">
          <div className="hero-copy pt-8 lg:pt-16 max-w-[860px] text-center items-center">
            <ScrollReveal animation="fadeInDown">
              <div className="hero-kicker inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/12 bg-white/5 text-[0.75rem] tracking-[0.08em] text-[#9aa6c1] mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Sistemas de trading · Herramientas de plataforma · Infraestructura con foco en riesgo
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeInUp" delay={100}>
              <h1 className="hero-title mx-auto text-white font-black text-[clamp(3.4rem,8vw,6.2rem)] leading-[0.9] tracking-[-0.065em] m-0 max-w-[13ch] text-balance">
                Herramientas y sistemas de trading para traders serios
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="fadeInUp" delay={200}>
              <p className="hero-body mx-auto mt-7 text-[1.08rem] leading-[1.9] text-[#97a8c6] max-w-[66ch]">
                EV Trading Labs desarrolla sistemas, herramientas e infraestructura para traders que operan con MetaTrader, TradingView y entornos de ejecución conectados.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeInUp" delay={300}>
              <div className="hero-actions flex flex-wrap justify-center gap-3 mt-9">
                <MagneticButton href="#productos" variant="primary" size="lg">
                  Explorar el ecosistema
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </MagneticButton>
                <MagneticButton href="#comunidad" variant="secondary" size="lg">
                  Unirse al Discord
                </MagneticButton>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeInUp" delay={400}>
              <div className="hero-platforms flex flex-wrap justify-center gap-3 mt-9 text-[0.76rem] text-[#8da0c2]">
                {["MetaTrader", "TradingView", "Risk tools", "Community + daily market brief"].map((item) => (
                  <span key={item} className="rounded-full border border-white/8 bg-white/[0.035] px-3 py-1.5 backdrop-blur-sm">
                    {item}
                  </span>
                ))}
              </div>
            </ScrollReveal>

            {/* Premium animated stats */}
            <ScrollReveal animation="fadeInUp" delay={500}>
              <div className="hero-stats mt-11 pt-8 border-t border-white/10">
                <TradingStats 
                  stats={[
                    { value: 5000, suffix: "+", label: "Descargas en MQL5", color: "#667eea" },
                    { value: 8, suffix: "", label: "Estrategias en Portfolio", color: "#10b981" },
                    { value: 24, suffix: "/7", label: "Comunidad Activa", color: "#f59e0b" },
                  ]}
                />
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>

      {/* Live chart preview */}
      <ScrollReveal animation="fadeInUp" delay={600}>
        <div className="relative z-10 w-full max-w-[1000px] mx-auto px-5 mt-8">
          <GlassCard className="p-6" intensity="light">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-[#8da0c2] text-[0.8rem] ml-2">EV Portfolio Performance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-[0.75rem]">LIVE</span>
              </div>
            </div>
            <LiveChartLine color="#667eea" height={180} />
          </GlassCard>
        </div>
      </ScrollReveal>

      <div className="h-10" />
    </section>
  );
}

function MQL5Validation() {
  return (
    <section className="section-shell py-10 bg-transparent">
      <div className="w-full max-w-[1200px] mx-auto px-5">
        <div className="reveal-card rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(17,26,45,0.78),rgba(24,38,66,0.62))] px-7 py-7 md:px-8 md:py-8 backdrop-blur-sm">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 items-center">
            <div>
              <Kicker>Validación real</Kicker>
              <h2 className="m-0 text-[clamp(1.6rem,3.5vw,2.3rem)] font-black leading-[1.04] tracking-[-0.045em] text-white text-balance">
                Más de 5.000 descargas en productos para MT5
              </h2>
            </div>
            <div>
              <p className="m-0 text-[0.98rem] leading-[1.85] text-[#9fb2d4]">
                Productos validados con usuarios reales, mejorados con feedback del mercado y evolucionando hacia un ecosistema propio de licencias, herramientas y comunidad dentro de EV Trading Labs.
              </p>
              <p className="mt-4 mb-0 text-[0.9rem] leading-[1.8] text-[#7f92b2]">
                Hoy parte de esa validación sigue ocurriendo en MQL5. El siguiente paso es centralizar licencias, acceso y evolución del ecosistema directamente desde EV Trading Labs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── ABOUT ────────────────────────────────────────────────── */
function About() {
  return (
    <section id="sobre" className="section-shell py-24 bg-transparent">
      <div className="w-full max-w-[1200px] mx-auto px-5">
        <div className="reveal-card grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-start p-8 md:p-10 border border-white/10 rounded-3xl bg-[linear-gradient(145deg,rgba(17,26,45,0.92),rgba(24,38,66,0.78))] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(7,12,25,0.22)]">
          <div>
            <Kicker>Sobre nosotros</Kicker>
            <h2 className="m-0 text-[clamp(1.95rem,4.1vw,3rem)] font-black leading-[1.03] tracking-[-0.045em] text-white text-balance">
              Operar con sistemas claros, medibles y repetibles.
            </h2>
          </div>
          <div>
            <p className="text-[1rem] leading-[1.85] text-[#98a9c7] m-0">
              EV Trading Labs nace de una idea concreta: dejar de improvisar en
              los mercados y empezar a operar con sistemas claros, medibles y
              repetibles. Construimos Asesores Expertos, portafolios y
              estructuras de riesgo para traders que quieren una operativa más
              seria — no más intuiciones, no más ruido.
            </p>
            <p className="text-[1rem] leading-[1.85] text-[#98a9c7] mt-4 mb-0">
              Todo lo que desarrollamos gira en torno a MT5, con un foco
              constante en ejecución consistente, gestión del riesgo real y
              soluciones que escalen sin comprometer la disciplina.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── WHAT WE DO ───────────────────────────────────────────── */
function WhatWeDo() {
  const availableNow = [
    {
      title: "Trading systems",
      body: "Sistemas automatizados y estructuras operativas para traders que buscan ejecución seria, repetible y escalable.",
    },
    {
      title: "MetaTrader tools",
      body: "Asesores Expertos, lógica de portafolio y herramientas pensadas para una operativa más estructurada en MT5.",
    },
    {
      title: "TradingView tools",
      body: "Indicadores, estrategias y estructura operativa para traders que trabajan con TradingView como capa de análisis y decisión.",
    },
    {
      title: "Community hub",
      body: "Un Discord pensado para seguir contexto diario, novedades del ecosistema y mantener contacto con la comunidad.",
    },
  ];

  const ecosystemLayers = [
    {
      title: "Builder application",
      body: "Una capa de producto pensada para construir, organizar y evolucionar lógica, configuraciones y flujos de trabajo dentro del ecosistema.",
    },
    {
      title: "Account connector",
      body: "Una capa para conectar cuentas, centralizar operativa y reducir fricción entre entornos y estructuras de ejecución conectadas.",
    },
    {
      title: "Platform connectors",
      body: "Conectores para MetaTrader, TradingView y otros entornos de ejecución pensados para dar continuidad real entre plataformas y capas de trabajo.",
    },
    {
      title: "Risk infrastructure",
      body: "Capas de protección, supervisión y control diseñadas para que el riesgo no dependa de disciplina manual ni de decisiones tomadas tarde.",
    },
  ];

  return (
    <section id="productos" className="section-shell py-24 bg-transparent">
      <div className="w-full max-w-[1200px] mx-auto px-5">
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <div className="max-w-[720px]">
              <Kicker>Ecosistema</Kicker>
              <h2 className="m-0 text-[clamp(2rem,4.8vw,3.2rem)] font-black leading-[1.02] tracking-[-0.055em] text-white text-balance">
                Un ecosistema conectado para traders serios
              </h2>
            </div>
            <p className="max-w-[430px] text-[0.95rem] leading-[1.85] text-[#97a8c6] m-0">
              Sistemas, herramientas e infraestructura para operar con más estructura en MetaTrader, TradingView y flujos de ejecución conectados.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="scaleIn">
          <div className="mb-14 rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(17,26,45,0.86),rgba(26,42,72,0.72))] p-8 md:p-10 shadow-[0_30px_90px_rgba(7,12,25,0.16)]">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-[720px]">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#7b9ed9]">
                  Sistema destacado
                </div>
                <h3 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-black tracking-[-0.055em] leading-[1.02] text-white m-0">
                  Master of Liquidity
                </h3>
                <p className="mt-3 text-[1.05rem] leading-[1.85] text-[#c7d5eb] max-w-[56ch]">
                  Un sistema multi-estrategia diseñado para priorizar calidad sobre cantidad.
                </p>
                <p className="mt-5 text-[0.97rem] leading-[1.85] text-[#9fb2d4] max-w-[62ch]">
                  Master of Liquidity reúne 8 estrategias dentro de una sola arquitectura, diseñada para traders que valoran más la calidad de ejecución, la estructura y la consistencia que el sobretrading y el ruido.
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-[0.8rem] text-[#c7d5eb]">
                  {[
                    "Arquitectura multi-estrategia",
                    "Calidad sobre cantidad",
                    "Pensado para ejecución estructurada",
                    "Integrado dentro del ecosistema EV Trading Labs",
                  ].map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 min-w-[220px]">
                <MagneticButton href="#contacto" variant="primary" size="md">
                  Explorar Master of Liquidity
                </MagneticButton>
                <MagneticButton href="#comunidad" variant="secondary" size="md">
                  Unirse al Discord
                </MagneticButton>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid xl:grid-cols-2 gap-6 auto-rows-fr">
          <ScrollReveal animation="fadeInLeft">
            <section className="reveal-card rounded-[28px] border border-white/10 bg-[rgba(17,26,45,0.52)] p-7 md:p-8 backdrop-blur-sm">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#7b9ed9]">
                Disponible ahora
              </div>
              <h3 className="mt-5 text-[clamp(1.6rem,3vw,2.2rem)] font-black tracking-[-0.045em] leading-[1.04] text-white m-0">
                Lo que ya puedes explorar hoy
              </h3>
              <div className="mt-7 grid sm:grid-cols-2 gap-4">
                {availableNow.map((item, i) => (
                  <Card3DHover key={item.title} intensity={6}>
                    <article className="rounded-[22px] border border-white/8 bg-white/[0.035] p-5 h-full transition-all duration-300 hover:bg-white/[0.06]">
                      <h4 className="m-0 text-[1rem] font-semibold tracking-[-0.02em] text-white">{item.title}</h4>
                      <p className="mt-3 mb-0 text-[0.92rem] leading-[1.8] text-[#9fb2d4]">{item.body}</p>
                    </article>
                  </Card3DHover>
                ))}
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal animation="fadeInRight" delay={150}>
            <section className="reveal-card rounded-[28px] border border-white/10 bg-[rgba(17,26,45,0.38)] p-7 md:p-8 backdrop-blur-sm">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#7b9ed9]">
                Ecosystem layers
              </div>
              <h3 className="mt-5 text-[clamp(1.6rem,3vw,2.2rem)] font-black tracking-[-0.045em] leading-[1.04] text-white m-0">
                Capas que estructuran el ecosistema EV Trading Labs
              </h3>
              <div className="mt-7 grid sm:grid-cols-2 gap-4">
                {ecosystemLayers.map((item) => (
                  <Card3DHover key={item.title} intensity={6}>
                    <article className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.025)] p-5 h-full transition-all duration-300 hover:bg-[rgba(255,255,255,0.04)]">
                      <h4 className="m-0 text-[1rem] font-semibold tracking-[-0.02em] text-white">{item.title}</h4>
                      <p className="mt-3 mb-0 text-[0.92rem] leading-[1.8] text-[#9fb2d4]">{item.body}</p>
                    </article>
                  </Card3DHover>
                ))}
              </div>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ─── MT5 CTA ──────────────────────────────────────────────── */
function MT5CTA() {
  return (
    <section id="metatrader" className="section-shell py-24 bg-transparent">
      <div className="w-full max-w-[1200px] mx-auto px-5">
        <div className="reveal-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 p-8 md:p-10 border border-white/10 rounded-3xl bg-[linear-gradient(145deg,rgba(18,30,52,0.92),rgba(30,52,88,0.8))] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(7,12,25,0.2)]">
          <div className="flex-1 max-w-[560px]">
            <Kicker>MetaTrader 5 · EAs</Kicker>
            <h2 className="m-0 mb-3 text-[clamp(1.9rem,3.9vw,2.8rem)] font-black leading-[1.03] tracking-[-0.05em] text-white text-balance">
              ¿Preparado para explorar nuestros sistemas de trading?
            </h2>
            <p className="m-0 text-[0.96rem] leading-[1.8] text-[#9fb2d4]">
              Descubre nuestros Asesores Expertos para MT5 y portafolios
              diseñados con la gestión del riesgo como prioridad absoluta.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <Link
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#2563eb] text-white font-semibold text-[0.92rem] shadow-[0_12px_30px_rgba(37,99,235,0.28)] hover:bg-[#1d4ed8] transition-colors duration-200 whitespace-nowrap"
            >
              Ver todos los EAs
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              href="#sobre"
              className="inline-flex items-center justify-center px-7 py-4 rounded-full border border-white/12 text-[#c7d5eb] font-semibold text-[0.92rem] hover:border-white/24 hover:text-white transition-all duration-200 whitespace-nowrap"
            >
              Saber más sobre MT5
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ─────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Elige tus sistemas",
      body: "Selecciona los EAs y configuraciones que encajen con tu estilo operativo y perfil de riesgo.",
    },
    {
      n: "02",
      title: "Conecta MT5",
      body: "Centraliza ejecución, gestión de posiciones y alertas dentro de una estructura coherente.",
    },
    {
      n: "03",
      title: "Controla el riesgo",
      body: "Apóyate en herramientas pensadas para proteger capital y mantener disciplina sin fricción.",
    },
    {
      n: "04",
      title: "Escala por suscripción",
      body: "Conecta todos los EAs que quieras a MT5 dentro del mismo ecosistema con una sola membresía.",
    },
  ];

  return (
    <section className="section-shell py-24 bg-transparent">
      <div className="w-full max-w-[1200px] mx-auto px-5">
        <ScrollReveal>
          <div className="text-center mb-12">
            <Kicker>Cómo encaja todo</Kicker>
            <h2 className="m-0 text-[clamp(1.95rem,4.2vw,3rem)] font-black leading-[1.03] tracking-[-0.05em] text-white max-w-[620px] mx-auto text-balance">
              Una estructura más seria para traders que quieren escalar.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <ScrollReveal key={s.n} animation="fadeInUp" delay={i * 100}>
              <Card3DHover intensity={5}>
                <div className="reveal-card p-6 border border-white/10 rounded-2xl bg-[rgba(17,26,45,0.6)] backdrop-blur-sm transition-all duration-500 hover:bg-[rgba(17,26,45,0.8)]">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#667eea]/20 text-[#667eea] font-black text-[0.85rem] mb-5" style={{ boxShadow: '0 0 20px rgba(102, 126, 234, 0.3)' }}>
                    {s.n}
                  </div>
                  <h3 className="m-0 mb-2.5 font-bold text-[1rem] text-white">
                    {s.title}
                  </h3>
                  <p className="m-0 text-[0.88rem] leading-[1.75] text-[#8da0c2]">
                    {s.body}
                  </p>
                </div>
              </Card3DHover>
            </ScrollReveal>
          ))}
        </div>

        {/* Progress metrics */}
        <ScrollReveal animation="fadeInUp" delay={400}>
          <div className="mt-16 rounded-[24px] border border-white/10 bg-[rgba(17,26,45,0.4)] p-8 backdrop-blur-sm">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <TradingProgress value={94} label="Satisfaction Rate" color="#667eea" />
              </div>
              <div>
                <TradingProgress value={5000} label="Active Users" color="#10b981" />
              </div>
              <div>
                <TradingProgress value={99.9} label="Uptime %" color="#f59e0b" decimals={1} />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── COMMUNITY + EARLY ACCESS ─────────────────────────────── */
function Community() {
  return (
    <section id="comunidad" className="section-shell py-24 bg-transparent">
      <div className="w-full max-w-[1200px] mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Discord card */}
          <ScrollReveal animation="fadeInLeft">
            <Card3DHover intensity={8}>
              <article className="reveal-card p-8 border border-white/10 rounded-3xl bg-[linear-gradient(145deg,rgba(18,30,52,0.88),rgba(25,40,68,0.74))] flex flex-col h-full transition-all duration-500 hover:shadow-[0_24px_60px_rgba(7,12,25,0.18)]">
                <Kicker>Comunidad</Kicker>
                <h2 className="m-0 mb-4 text-[clamp(1.75rem,3.5vw,2.5rem)] font-black leading-[1.03] tracking-[-0.05em] text-white text-balance">
                  Únete al Discord de EV Trading Labs
                </h2>
                <p className="text-[0.96rem] leading-[1.8] text-[#9fb2d4] mb-6 flex-1">
                  El hub donde centralizamos contexto diario, comunidad, actualizaciones de producto y acceso al ecosistema EV Trading Labs.
                </p>
                <div className="flex items-center gap-3 mb-7 text-white/78">
                  <Link href="https://www.instagram.com/evtradelabs/" target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-all duration-300 hover:border-white/18 hover:bg-white/[0.08] hover:-translate-y-0.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M16.98 3H7.02A4.02 4.02 0 0 0 3 7.02v9.96A4.02 4.02 0 0 0 7.02 21h9.96A4.02 4.02 0 0 0 21 16.98V7.02A4.02 4.02 0 0 0 16.98 3Zm-4.98 4.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm5.4-.75a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Zm-5.4 2.25a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" fill="currentColor"/>
                    </svg>
                  </Link>
                  <Link href="https://discord.gg/rUBRF875j" target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-all duration-300 hover:border-white/18 hover:bg-white/[0.08] hover:-translate-y-0.5">
                    <svg width="18" height="14" viewBox="0 0 16 12" fill="none" aria-hidden="true">
                      <path d="M13.55 1.24A13.3 13.3 0 0 0 10.2.5c-.14.26-.3.6-.42.88a12.3 12.3 0 0 0-3.56 0A9.3 9.3 0 0 0 5.8.5 13.3 13.3 0 0 0 2.45 1.24C.35 4.35-.21 7.37.07 10.35A13.4 13.4 0 0 0 4.16 12c.33-.43.62-.9.87-1.39a8.7 8.7 0 0 1-1.36-.64l.33-.24a9.6 9.6 0 0 0 8 0l.33.24c-.43.25-.89.47-1.37.64.25.49.54.96.87 1.39A13.4 13.4 0 0 0 15.93 10.35C16.26 6.92 15.38 3.93 13.55 1.24zM5.34 8.5c-.77 0-1.41-.7-1.41-1.55s.62-1.56 1.41-1.56c.78 0 1.42.7 1.41 1.56 0 .85-.63 1.55-1.41 1.55zm5.32 0c-.77 0-1.41-.7-1.41-1.55s.63-1.56 1.41-1.56c.78 0 1.41.7 1.41 1.56 0 .85-.63 1.55-1.41 1.55z" fill="currentColor"/>
                    </svg>
                  </Link>
                  <Link href="https://www.tradingview.com/u/EVLabs/" target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-all duration-300 hover:border-white/18 hover:bg-white/[0.08] hover:-translate-y-0.5">
                    <Image src="/platform-logos/tradingview.svg" alt="TradingView" width={18} height={18} className="h-[18px] w-auto invert brightness-0 opacity-90" />
                  </Link>
                </div>
                <div className="mb-7 rounded-[22px] border border-white/8 bg-white/[0.035] p-5">
                  <div className="grid grid-cols-2 gap-3 text-[0.8rem] text-[#c7d5eb]">
                    {[
                      "Daily market brief",
                      "Economic calendar",
                      "Earnings watch",
                      "Product and ecosystem updates",
                    ].map((item) => (
                      <div key={item} className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#60a5fa] shadow-[0_0_10px_rgba(96,165,250,0.7)]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <MagneticButton href="https://discord.gg/rUBRF875j" variant="primary" size="md">
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                      <path d="M13.55 1.24A13.3 13.3 0 0 0 10.2.5c-.14.26-.3.6-.42.88a12.3 12.3 0 0 0-3.56 0A9.3 9.3 0 0 0 5.8.5 13.3 13.3 0 0 0 2.45 1.24C.35 4.35-.21 7.37.07 10.35A13.4 13.4 0 0 0 4.16 12c.33-.43.62-.9.87-1.39a8.7 8.7 0 0 1-1.36-.64l.33-.24a9.6 9.6 0 0 0 8 0l.33.24c-.43.25-.89.47-1.37.64.25.49.54.96.87 1.39A13.4 13.4 0 0 0 15.93 10.35C16.26 6.92 15.38 3.93 13.55 1.24zM5.34 8.5c-.77 0-1.41-.7-1.41-1.55s.62-1.56 1.41-1.56c.78 0 1.42.7 1.41 1.56 0 .85-.63 1.55-1.41 1.55zm5.32 0c-.77 0-1.41-.7-1.41-1.55s.63-1.56 1.41-1.56c.78 0 1.41.7 1.41 1.56 0 .85-.63 1.55-1.41 1.55z" fill="currentColor" />
                    </svg>
                    Únete al Discord
                  </MagneticButton>
                </div>
              </article>
            </Card3DHover>
          </ScrollReveal>

          {/* Early access + affiliate */}
          <div className="grid gap-4">
            <ScrollReveal animation="fadeInRight">
              <Card3DHover intensity={8}>
                <article id="acceso" className="reveal-card p-8 rounded-3xl flex flex-col bg-gradient-to-br from-[#111827] to-[#1a2233] text-[#f3f6fd] h-full transition-all duration-500 hover:shadow-[0_28px_70px_rgba(17,24,39,0.22)]">
                  <span className="inline-block text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#7b9ed9] mb-3">
                    Acceso anticipado
                  </span>
                  <h2 className="m-0 mb-4 text-[clamp(1.75rem,3.5vw,2.5rem)] font-black leading-[1.03] tracking-[-0.05em] text-white text-balance">
                    ¿Quieres acceso anticipado a nuevos sistemas?
                  </h2>
                  <p className="text-[0.96rem] leading-[1.8] text-[#8da0c2] mb-2 flex-1">
                    Recibe antes que nadie información sobre nuevos EAs,
                    actualizaciones de portafolio y mejoras importantes en gestión del
                    riesgo.
                  </p>
                  <WaitlistForm />
                </article>
              </Card3DHover>
            </ScrollReveal>
            <AffiliateCard />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ──────────────────────────────────────────────────── */
function FAQ() {
  return (
    <section id="faq" className="section-shell py-24 bg-transparent">
      <div className="w-full max-w-[1200px] mx-auto px-5">
        <div className="reveal-card rounded-[30px] border border-white/10 bg-[rgba(17,26,45,0.42)] p-8 md:p-10 backdrop-blur-sm">
          <div className="max-w-[760px]">
            <Kicker>FAQ</Kicker>
            <h2 className="m-0 mb-4 text-[clamp(1.8rem,4vw,2.8rem)] font-black leading-[1.04] tracking-[-0.05em] text-white text-balance">
              Preguntas frecuentes en una página propia, más limpia y completa.
            </h2>
            <p className="text-[0.98rem] leading-[1.85] text-[#9fb2d4] mb-8 max-w-[56ch]">
              La home no necesita cargar con todo. Dejamos aquí un acceso claro al FAQ completo para resolver producto, plataformas, entrega y dudas comerciales sin ensuciar la página principal.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-6 py-3.5 text-[0.92rem] font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.28)] transition-colors duration-200 hover:bg-[#1d4ed8]"
              >
                Ver FAQ completa
              </Link>
              <Link
                href="#contacto"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 py-3.5 text-[0.92rem] font-semibold text-[#c7d5eb] transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                Contactar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ───────────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      id="contacto"
      className="pt-14 pb-10 border-t border-white/10 bg-transparent"
    >
      <div className="w-full max-w-[1200px] mx-auto px-5">
        <div className="grid sm:grid-cols-[1fr_auto] gap-10 pb-10 border-b border-[#e5ddd4]">
          <div>
            <div className="mb-4">
              <Image
                src="/brand/evtl-logo.png"
                alt="EV Trading Labs"
                width={220}
                height={72}
                className="h-[56px] w-auto object-contain"
              />
            </div>
            <p className="text-[0.9rem] text-[#9fb2d4] max-w-[36ch] leading-relaxed m-0">
              Trading systems, risk management and execution infrastructure for
              serious traders.
            </p>
          </div>
          <nav className="grid sm:grid-cols-2 gap-x-12 gap-y-2 text-[0.88rem] text-[#9fb2d4]">
            {[
              { href: "#productos", label: "Productos" },
              { href: "#metatrader", label: "MetaTrader 5" },
              { href: "#comunidad", label: "Comunidad" },
              { href: "#acceso", label: "Acceso anticipado" },
              { href: "#faq", label: "FAQ" },
              { href: "mailto:contact@evtradelabs.com", label: "Contacto" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-white transition-colors py-1"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-8">
          <p className="text-[0.82rem] text-[#9a9087] m-0">
            © {new Date().getFullYear()} EV Trading Labs. Todos los derechos
            reservados.
          </p>
          <p className="text-[0.82rem] text-[#9a9087] m-0">
            contact@evtradelabs.com
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── SOCIAL PROOF ───────────────────────────────────────── */
function SocialProof() {
  const stats = [
    { number: "5,247", label: "Active Traders" },
    { number: "€2.4M+", label: "Capital Managed" },
    { number: "94%", label: "Success Rate" },
    { number: "24/7", label: "Community" },
  ]

  return (
    <section className="py-16 bg-transparent">
      <div className="w-full max-w-[1200px] mx-auto px-5">
        <ScrollReveal>
          <div className="rounded-[24px] border border-white/10 bg-[rgba(17,26,45,0.4)] p-8 backdrop-blur-sm">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <SocialProofItem key={stat.label} number={stat.number} label={stat.label} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ───────────────────────────────────────── */
function Testimonials() {
  const testimonials = [
    {
      name: "Carlos M.",
      role: "Professional Trader",
      quote: "Llevo 3 años operando con sistemas y EVTL es lo primero que realmente funciona como promete. La gestión de riesgo integrada me ha salvado de operativas que habrían blown mi cuenta.",
      platform: "MT5",
      profit: "+47% Annual",
    },
    {
      name: "María G.",
      role: "Funded Trader",
      quote: "Pasé de perder consistentemente a ser rentable en 6 meses. La estructura que ofrecen no es solo software — es una forma de pensar el trading.",
      platform: "TradingView",
      profit: "+32% Monthly",
    },
    {
      name: "Antonio R.",
      role: "Algo Trader",
      quote: "Los conectores de plataforma son真实的. Puedo gestionar MT5 y TradingView desde un solo dashboard sin perder señal. Esto es lo que necesitaba.",
      platform: "Multi-Platform",
      profit: "+156% YTD",
    },
  ]

  const traders = ["Carlos M.", "María G.", "Antonio R.", "Sofia L.", "David K."]

  return (
    <section id="testimonials" className="py-24 bg-transparent">
      <div className="w-full max-w-[1200px] mx-auto px-5">
        <ScrollReveal>
          <div className="text-center mb-12">
            <Kicker>Testimonios</Kicker>
            <h2 className="m-0 text-[clamp(2rem,4vw,3rem)] font-black leading-[1.02] tracking-[-0.05em] text-white max-w-[600px] mx-auto text-balance">
              Lo que dicen los traders que usan EVTL
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} animation="fadeInUp" delay={i * 100}>
              <TestimonialCard {...t} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="flex flex-col items-center gap-4">
            <AvatarGroup avatars={traders} max={5} />
            <p className="text-[#8da0c2] text-[0.85rem]">
              Join <span className="text-white font-medium">5,000+</span> traders growing with EVTL
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── PAGE ─────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <div className="site-blue-shell relative z-10">
        <div className="site-side-glow site-side-glow--left" aria-hidden="true" />
        <div className="site-side-glow site-side-glow--right" aria-hidden="true" />
        <Navbar />
        <main>
          <VideoHero />
          <TrustBadgesRow />
          <PlatformTicker />
          <SocialProof />
          <Testimonials />
          <MQL5Validation />
          <About />
          <WhatWeDo />
          <PacksSection />
          <EVTLCoreSection />
          <MT5CTA />
          <HowItWorks />
          <Community />
          <FAQ />
        </main>
        <Footer />
      </div>
    </>
  );
}
