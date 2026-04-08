import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Productos — EV Trading Labs",
  description:
    "Sistemas de trading, Asesores Expertos, indicadores y herramientas de gestión del riesgo para MetaTrader 5.",
};

const PRODUCTS = [
  {
    slug: "master-of-liquidity",
    name: "Master of Liquidity",
    tagline: "Arquitectura multi-estrategia premium",
    description:
      "8 estrategias dentro de una sola arquitectura. Diseñado para traders que valoran la calidad de ejecución, la estructura y la consistencia sobre el ruido.",
    price: 249,
    currency: "EUR",
    tier: "Pro / Lifetime",
    badge: "Destacado",
    badgeColor: "#667eea",
    features: [
      "8 estrategias activas",
      "Gestión de riesgo avanzada",
      "Dashboard de control",
      "Actualizaciones de por vida",
      "Soporte prioritario",
    ],
    image: "/products/mol-hero.png",
  },
  {
    slug: "ev-quant-lab",
    name: "EV Quant Lab",
    tagline: "Suite de indicadores cuantitativos",
    description:
      "Conjunto de indicadores diseñados para análisis cuantitativo, detección de patrones y toma de decisiones basada en datos.",
    price: 149,
    currency: "EUR",
    tier: "Studio License",
    badge: null,
    badgeColor: null,
    features: [
      "15+ indicadores",
      "Alertas en tiempo real",
      "Plantillas para TradingView",
      "Backtesting integrado",
    ],
    image: "/products/quant-lab.png",
  },
  {
    slug: "risk-manager-pro",
    name: "Risk Manager Pro",
    tagline: "Protección de capital automatizada",
    description:
      "Stop loss dinámicos, take profit inteligente y límites de exposición personalizables. Protege tu capital automáticamente.",
    price: 79,
    currency: "EUR",
    tier: "Core Access",
    badge: null,
    badgeColor: null,
    features: [
      "Stop loss dinámico",
      "Límites de exposición",
      "Alertas de riesgo",
      "Panel de control",
    ],
    image: "/products/risk-pro.png",
  },
  {
    slug: "multi-signal-engine",
    name: "Multi-Signal Engine",
    tagline: "Señales multi-timeframe",
    description:
      "Agrega señales de múltiples timeframe y fuentes en un solo dashboard. Decisiones más informadas, menos ruido.",
    price: 199,
    currency: "EUR",
    tier: "Pro / Lifetime",
    badge: "Nuevo",
    badgeColor: "#10b981",
    features: [
      "Multi-timeframe signals",
      "Dashboard agregado",
      "Filtros personalizables",
      "Integración MT5",
    ],
    image: "/products/signal-engine.png",
  },
  {
    slug: "portfolio-builder",
    name: "Portfolio Builder",
    tagline: "Construye tu portafolio de sistemas",
    description:
      "Herramienta para organizar, comparar y gestionar múltiples estrategias y configuraciones dentro del ecosistema EVTL.",
    price: 299,
    currency: "EUR",
    tier: "Pro / Lifetime",
    badge: "Premium",
    badgeColor: "#f59e0b",
    features: [
      "Gestión multi-sistema",
      "Backtesting comparativo",
      "Informes de rendimiento",
      "Exportación de datos",
    ],
    image: "/products/portfolio.png",
  },
  {
    slug: "ev-patterns-suite",
    name: "EV Patterns Suite",
    tagline: "Reconocimiento de patrones avanzado",
    description:
      "Suite de patrones de precio para TradingView. Identifica setups de alta probabilidad con precisión algorítmica.",
    price: 129,
    currency: "EUR",
    tier: "Studio License",
    badge: null,
    badgeColor: null,
    features: [
      "20+ patrones",
      "Alertas configurables",
      "Histórico de señales",
      "Filtros de confirmación",
    ],
    image: "/products/patterns.png",
  },
];

function formatPrice(amount: number, currency: string = "EUR") {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    "Core Access": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Studio License": "bg-violet-500/20 text-violet-400 border-violet-500/30",
    "Pro / Lifetime": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[0.72rem] font-semibold border ${colors[tier]}`}>
      {tier}
    </span>
  );
}

function ProductCard({ product, index }: { product: typeof PRODUCTS[0]; index: number }) {
  return (
    <article
      className="reveal-card rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-6 md:p-8 backdrop-blur-sm flex flex-col transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(7,12,25,0.18)] hover:border-white/[0.14]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Badge */}
      {product.badge && (
        <div className="mb-4">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-[0.72rem] font-bold text-white"
            style={{ backgroundColor: product.badgeColor + "30", border: `1px solid ${product.badgeColor}50` }}
          >
            {product.badge}
          </span>
        </div>
      )}

      {/* Product image placeholder */}
      <div className="mb-6 h-[160px] rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="text-4xl mb-2">
            {product.slug === "master-of-liquidity"
              ? "🎯"
              : product.slug === "ev-quant-lab"
              ? "📊"
              : product.slug === "risk-manager-pro"
              ? "🛡️"
              : product.slug === "multi-signal-engine"
              ? "⚡"
              : product.slug === "portfolio-builder"
              ? "📈"
              : "🔍"}
          </div>
          <div className="text-[0.75rem] text-white/20">{product.name}</div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-4">
        <TierBadge tier={product.tier} />
        <h3 className="mt-3 text-[1.3rem] font-black text-white tracking-tight">
          {product.name}
        </h3>
        <p className="mt-1 text-[0.85rem] text-white/50">{product.tagline}</p>
      </div>

      {/* Description */}
      <p className="flex-1 text-[0.9rem] text-white/60 leading-relaxed mb-6">
        {product.description}
      </p>

      {/* Features */}
      <ul className="space-y-2 mb-6">
        {product.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-[0.85rem] text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shrink-0" style={{ boxShadow: "0 0 8px rgba(16, 185, 129, 0.6)" }} />
            {feature}
          </li>
        ))}
      </ul>

      {/* Price + CTA */}
      <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between gap-4">
        <div>
          <div className="text-[1.5rem] font-black text-white">{formatPrice(product.price, product.currency)}</div>
          <div className="text-[0.75rem] text-white/30">IVA incluido</div>
        </div>
        <Link
          href={`/checkout?product=${product.slug}`}
          className="px-5 py-2.5 rounded-xl bg-[#667eea] text-white font-semibold text-[0.88rem] hover:bg-[#5a7fd8] transition-colors whitespace-nowrap"
        >
          Comprar ahora
        </Link>
      </div>
    </article>
  );
}

export default function ProductsPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Header */}
      <section className="pt-28 pb-16 bg-transparent">
        <div className="w-full max-w-[1200px] mx-auto px-5">
          <div className="text-center max-w-[640px] mx-auto">
            <span className="inline-block text-[0.72rem] font-bold tracking-[0.2em] uppercase text-[#667eea] mb-4">
              Productos
            </span>
            <h1 className="text-[clamp(2.2rem,5vw,3.5rem)] font-black text-white tracking-tight leading-[1.05] mb-5">
              Sistemas, herramientas e infraestructura
            </h1>
            <p className="text-[1rem] text-white/55 leading-relaxed">
              Asesores Expertos, indicadores y herramientas pensadas para traders
              que operan con estructura, gestión del riesgo y disciplina.
            </p>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-8 bg-transparent">
        <div className="w-full max-w-[1200px] mx-auto px-5">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {PRODUCTS.map((product, i) => (
              <ProductCard key={product.slug} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-transparent">
        <div className="w-full max-w-[1200px] mx-auto px-5">
          <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-8 md:p-12 text-center">
            <h2 className="text-[1.8rem] font-black text-white mb-4">
              ¿No sabes por dónde empezar?
            </h2>
            <p className="text-white/55 max-w-[480px] mx-auto mb-8">
              Escríbenos y te ayudamos a elegir el sistema que mejor encaje con tu
              perfil de trading y objetivos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="mailto:contact@evtradelabs.com"
                className="px-6 py-3.5 rounded-xl bg-[#667eea] text-white font-semibold hover:bg-[#5a7fd8] transition-colors"
              >
                Contactar
              </Link>
              <Link
                href="/pricing"
                className="px-6 py-3.5 rounded-xl border border-white/10 text-white/70 font-semibold hover:border-white/20 hover:text-white transition-all"
              >
                Ver precios
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}

function Footer() {
  return (
    <footer className="pt-12 pb-10 border-t border-white/[0.08] bg-transparent">
      <div className="w-full max-w-[1200px] mx-auto px-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-[0.82rem] text-white/35">
            © {new Date().getFullYear()} EV Trading Labs
          </p>
          <div className="flex gap-6 text-[0.82rem] text-white/35">
            <Link href="/terms" className="hover:text-white transition-colors">
              Términos
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacidad
            </Link>
            <Link href="/refund" className="hover:text-white transition-colors">
              Reembolso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
