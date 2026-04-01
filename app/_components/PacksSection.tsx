import Link from "next/link";

type Pack = {
  name: string;
  subtitle: string;
  delivery: string;
  bestFor: string;
  bullets: string[];
  accentLabel: string;
  accent: {
    border: string;
    glow: string;
    panel: string;
    badge: string;
    dot: string;
    toggle: string;
    cta: string;
    ctaHover: string;
  };
};

const packs: Pack[] = [
  {
    name: "MT5 Pack",
    subtitle: "Expert Advisors and execution tools for serious MT5 traders.",
    delivery: ".ex5 + EVTL licensing logic",
    bestFor: "Best for: traders who want automation with structure",
    bullets: [
      "Access to MT5 systems included",
      "Expert Advisors and execution tools",
      "Structured delivery from EV Trading Labs",
      "Updates while the license is active",
    ],
    accentLabel: "MT5 core",
    accent: {
      border: "border-[#4fb79a]/22 hover:border-[#4fb79a]/34",
      glow: "shadow-[0_28px_80px_rgba(32,178,140,0.14)]",
      panel: "bg-[linear-gradient(145deg,rgba(12,40,44,0.92),rgba(15,30,46,0.9))]",
      badge: "text-[#93dfca] bg-[rgba(79,183,154,0.12)] border-[#4fb79a]/18",
      dot: "bg-[#5fe0bf] shadow-[0_0_10px_rgba(95,224,191,0.65)]",
      toggle: "bg-[#0f8f74] shadow-[0_6px_18px_rgba(15,143,116,0.24)]",
      cta: "bg-[#0f8f74] shadow-[0_12px_30px_rgba(15,143,116,0.24)]",
      ctaHover: "hover:bg-[#0c765f]",
    },
  },
  {
    name: "TradingView Pack",
    subtitle: "Indicators, strategies and TradingView tools for traders who want cleaner structure and better workflow.",
    delivery: "User-based access inside the platform",
    bestFor: "Best for: analysis, workflow and signal structure",
    bullets: [
      "Access to TradingView tools included",
      "Indicators, strategies and signal structure",
      "Cleaner workflow for decision-making",
      "Updates while the license is active",
    ],
    accentLabel: "TradingView",
    accent: {
      border: "border-[#71a7ff]/20 hover:border-[#71a7ff]/32",
      glow: "shadow-[0_28px_80px_rgba(59,130,246,0.14)]",
      panel: "bg-[linear-gradient(145deg,rgba(15,34,66,0.92),rgba(19,30,52,0.88))]",
      badge: "text-[#b9d4ff] bg-[rgba(113,167,255,0.11)] border-[#71a7ff]/16",
      dot: "bg-[#71a7ff] shadow-[0_0_10px_rgba(113,167,255,0.62)]",
      toggle: "bg-[#2563eb] shadow-[0_6px_18px_rgba(37,99,235,0.24)]",
      cta: "bg-[#2563eb] shadow-[0_12px_30px_rgba(37,99,235,0.26)]",
      ctaHover: "hover:bg-[#1d4ed8]",
    },
  },
  {
    name: "Connector Pack",
    subtitle: "Tools built to connect platforms, accounts and execution layers with less friction.",
    delivery: "Connector / bridge / API-based delivery",
    bestFor: "Best for: platform integration and operational tooling",
    bullets: [
      "Tools to connect platforms and accounts",
      "Bridge and API-based workflows",
      "Operational tooling for execution layers",
      "Access while the license is active",
    ],
    accentLabel: "Connectors",
    accent: {
      border: "border-[#8f7bff]/20 hover:border-[#8f7bff]/32",
      glow: "shadow-[0_28px_80px_rgba(124,92,255,0.14)]",
      panel: "bg-[linear-gradient(145deg,rgba(29,24,54,0.92),rgba(19,28,50,0.9))]",
      badge: "text-[#c8bfff] bg-[rgba(143,123,255,0.11)] border-[#8f7bff]/16",
      dot: "bg-[#9d8bff] shadow-[0_0_10px_rgba(157,139,255,0.64)]",
      toggle: "bg-[#6d5df6] shadow-[0_6px_18px_rgba(109,93,246,0.24)]",
      cta: "bg-[#6d5df6] shadow-[0_12px_30px_rgba(109,93,246,0.24)]",
      ctaHover: "hover:bg-[#5b4be8]",
    },
  },
  {
    name: "Platform Access",
    subtitle: "Access to the core EV Trading Labs platform layer as the ecosystem expands.",
    delivery: "Platform-layer access",
    bestFor: "Best for: users close to the EVTL core stack",
    bullets: [
      "Access to the EVTL core platform layer",
      "Builder and platform-layer tooling",
      "Core tools from the EVTL stack",
      "Ecosystem-centered access logic",
    ],
    accentLabel: "Core layer",
    accent: {
      border: "border-[#8eb5c7]/18 hover:border-[#8eb5c7]/28",
      glow: "shadow-[0_28px_80px_rgba(96,165,250,0.08)]",
      panel: "bg-[linear-gradient(145deg,rgba(22,28,42,0.9),rgba(19,30,52,0.82))]",
      badge: "text-[#c6d8e2] bg-[rgba(142,181,199,0.09)] border-[#8eb5c7]/14",
      dot: "bg-[#8ed6e5] shadow-[0_0_10px_rgba(142,214,229,0.48)]",
      toggle: "bg-[#35586b] shadow-[0_6px_18px_rgba(53,88,107,0.2)]",
      cta: "bg-[#35586b] shadow-[0_12px_30px_rgba(53,88,107,0.2)]",
      ctaHover: "hover:bg-[#2d4b5b]",
    },
  },
];

function AccessToggle({ activeClass }: { activeClass: string }) {
  return (
    <div className="inline-flex h-[38px] min-w-[168px] items-center justify-between rounded-full border border-white/10 bg-white/[0.04] p-1 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#9fb2d4]">
      <span className={`inline-flex min-w-[78px] items-center justify-center rounded-full px-3 py-1.5 text-white ${activeClass}`}>
        Monthly
      </span>
      <span className="inline-flex min-w-[78px] items-center justify-center px-3 py-1.5">Lifetime</span>
    </div>
  );
}

export default function PacksSection() {
  return (
    <section className="section-shell py-24 bg-transparent">
      <div className="w-full max-w-[1400px] mx-auto px-5">
        <div className="mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-[760px]">
            <span className="inline-block text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#7b9ed9] mb-3">Access packs</span>
            <h2 className="m-0 text-[clamp(2rem,4.8vw,3.1rem)] font-black leading-[1.02] tracking-[-0.055em] text-white text-balance">
              Access the ecosystem through product families, not generic pricing tiers.
            </h2>
          </div>
          <p className="max-w-[430px] text-[0.95rem] leading-[1.85] text-[#97a8c6] m-0">
            Cada pack representa una familia de producto, cómo se entrega, qué incluye y para qué tipo de operativa encaja mejor dentro del ecosistema EV Trading Labs.
          </p>
        </div>

        <div className="grid xl:grid-cols-4 gap-4 items-stretch">
          {packs.map((pack) => (
            <article
              key={pack.name}
              className={`reveal-card flex min-h-[680px] h-full flex-col rounded-[28px] border p-6 md:p-7 transition-all duration-500 hover:-translate-y-1 ${pack.accent.border} ${pack.accent.panel} ${pack.accent.glow}`}
            >
              <div className="flex min-h-[42px] items-start justify-between gap-3">
                <div className={`inline-flex h-[34px] items-center rounded-full border px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${pack.accent.badge}`}>
                  {pack.accentLabel}
                </div>
                <AccessToggle activeClass={pack.accent.toggle} />
              </div>

              <div className="mt-5 min-h-[128px]">
                <h3 className="m-0 text-[1.22rem] font-bold tracking-[-0.03em] text-white">{pack.name}</h3>
                <p className="mt-3 mb-0 text-[0.93rem] leading-[1.75] text-[#9fb2d4] line-clamp-4">
                  {pack.subtitle}
                </p>
              </div>

              <ul className="mt-6 min-h-[170px] space-y-3 text-[0.88rem] text-[#c7d5eb]">
                {pack.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${pack.accent.dot}`} />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 min-h-[118px] rounded-[20px] border border-white/8 bg-white/[0.035] p-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#7b9ed9]">Delivery</div>
                <div className="mt-2 text-[0.88rem] font-medium text-white/92">{pack.delivery}</div>
                <div className="mt-3 text-[0.82rem] leading-[1.7] text-[#8da0c2]">{pack.bestFor}</div>
              </div>

              <div className="mt-auto pt-6">
                <Link href="#contacto" className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-[0.9rem] font-semibold text-white transition-all duration-200 ${pack.accent.cta} ${pack.accent.ctaHover}`}>
                  Explorar pack
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
