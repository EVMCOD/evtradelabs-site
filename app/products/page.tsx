import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Productos — EV Trading Labs",
  description:
    "Sistemas de trading, Asesores Expertos, herramientas de gestión del riesgo y replicación de cuentas para MetaTrader 5.",
};

const PRODUCTS = [
  {
    slug: "ev-quant-lab",
    name: "EV Quant Lab",
    tagline: "Tu estación de trading cuantitativo",
    description:
      "Construye, valida y optimiza estrategias como un profesional. Visual Strategy Builder, Backtest Engine con tick data, Genetic Algorithm, Walk-Forward Analysis, Portfolio Lab, ML Lab y más.",
    priceMonthly: 99.99,
    priceLifetime: 399,
    currency: "EUR",
    tier: "Pro / Lifetime",
    badge: "Herramienta profesional",
    badgeColor: "#10b981",
    icon: "📊",
    features: [
      "Visual Strategy Builder",
      "Backtest Engine con tick data",
      "Genetic Algorithm para discovery",
      "Walk-Forward Analysis",
      "Portfolio Lab",
      "ML Lab",
      "Advanced Execution (TWAP, VWAP...)",
      "Risk Management completo",
      "Live Trading (Oanda, IB, Alpaca, Binance)",
      "100% local en tu máquina",
      "Sin coste de datos",
    ],
  },
  {
    slug: "master-of-liquidity",
    name: "Master of Liquidity",
    tagline: "Sistema multi-estrategia para MT5",
    description:
      "8 estrategias integradas con gestión de riesgo avanzada. Diseñado para traders que valoran la calidad de ejecución, la estructura y la consistencia.",
    priceMonthly: 48.99,
    priceLifetime: 199,
    currency: "EUR",
    tier: "Pro / Lifetime",
    badge: "MT5 EA",
    badgeColor: "#667eea",
    icon: "🎯",
    features: [
      "8 estrategias integradas",
      "Arquitectura multi-estrategia",
      "Gestión de riesgo avanzada",
      "Compatible con MT5",
      "Ejecución estructurada",
      "Reporting de rendimiento",
      "Soporte prioritario",
    ],
  },
  {
    slug: "replicador",
    name: "Replicador",
    tagline: "Replicación de cuentas en tiempo real",
    description:
      "Copia operaciones de una cuenta master a múltiples cuentas follower. Control total de ratios, riesgo y filtros con protección de daily loss.",
    priceMonthly: 18.99,
    priceLifetime: null,
    currency: "EUR",
    tier: "Studio License",
    badge: "Nuevo",
    badgeColor: "#10b981",
    icon: "⚡",
    features: [
      "3 cuentas MT5 (plan básico)",
      "Replicación en tiempo real",
      "Risk profiles por cuenta",
      "Protección daily loss",
      "5 cuentas (plan avanzado)",
    ],
  },
  {
    slug: "local-app",
    name: "Local App",
    tagline: "Tu entorno de trading en local",
    description:
      "Aplicación local para gestionar posiciones, trackear rendimiento y centralizar toda tu operativa. Sin cloud, todos los datos en tu máquina.",
    priceMonthly: null,
    priceLifetime: null,
    currency: "EUR",
    tier: "Core Access",
    badge: null,
    badgeColor: null,
    icon: "💻",
    features: [
      "Gestión de posiciones",
      "Dashboard de rendimiento",
      "Alertas y notificaciones",
      "Sincronización MT5",
      "Datos 100% en local",
    ],
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

      {/* Icon */}
      <div className="mb-6 h-[120px] rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
        <span className="text-6xl">{product.icon}</span>
      </div>

      <div className="mb-4">
        <TierBadge tier={product.tier} />
        <h3 className="mt-3 text-[1.3rem] font-black text-white tracking-tight">
          {product.name}
        </h3>
        <p className="mt-1 text-[0.85rem] text-white/50">{product.tagline}</p>
      </div>

      <p className="flex-1 text-[0.9rem] text-white/60 leading-relaxed mb-6">
        {product.description}
      </p>

      <ul className="space-y-2 mb-6">
        {product.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-[0.85rem] text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shrink-0" style={{ boxShadow: "0 0 8px rgba(16, 185, 129, 0.6)" }} />
            {feature}
          </li>
        ))}
      </ul>

      <div className="pt-5 border-t border-white/[0.08] flex flex-col gap-3">
        {product.priceMonthly && (
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-[1.3rem] font-black text-white">
                €{product.priceMonthly}
                <span className="text-[0.8rem] font-normal text-white/40">/mes</span>
              </div>
              {product.priceLifetime && (
                <div className="text-[0.78rem] text-white/30">
                  o €{product.priceLifetime} lifetime
                </div>
              )}
            </div>
          </div>
        )}
        {!product.priceMonthly && (
          <div className="text-[1.1rem] font-bold text-white/60">Consultar precio</div>
        )}
        <Link
          href={`/checkout?product=${product.slug}`}
          className="px-5 py-2.5 rounded-xl bg-[#667eea] text-white font-semibold text-[0.88rem] hover:bg-[#5a7fd8] transition-colors text-center whitespace-nowrap"
        >
          {product.priceMonthly ? "Suscribirse" : "Contactar"}
        </Link>
      </div>
    </article>
  );
}

export default function ProductsPage() {
  return (
    <main className="relative overflow-hidden">
      <section className="pt-28 pb-16 bg-transparent">
        <div className="w-full max-w-[1200px] mx-auto px-5">
          <div className="text-center max-w-[640px] mx-auto">
            <span className="inline-block text-[0.72rem] font-bold tracking-[0.2em] uppercase text-[#667eea] mb-4">
              Productos
            </span>
            <h1 className="text-[clamp(2.2rem,5vw,3.5rem)] font-black text-white tracking-tight leading-[1.05] mb-5">
              Herramientas para traders serios
            </h1>
            <p className="text-[1rem] text-white/55 leading-relaxed">
              Local App, Replicador, Gestor y Master of Liquidity. Sistemas
              diseñados para ejecutar con estructura y gestionar el riesgo
              correctamente.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-transparent">
        <div className="w-full max-w-[1200px] mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-6">
            {PRODUCTS.map((product, i) => (
              <ProductCard key={product.slug} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-transparent">
        <div className="w-full max-w-[1200px] mx-auto px-5">
          <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-8 md:p-12 text-center">
            <h2 className="text-[1.8rem] font-black text-white mb-4">
              ¿No sabes cuál necesitas?
            </h2>
            <p className="text-white/55 max-w-[480px] mx-auto mb-8">
              Escríbenos y te ayudamos a elegir la herramienta que mejor encaje
              con tu operativa y perfil de riesgo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="mailto:contact@evtradelabs.com"
                className="px-6 py-3.5 rounded-xl bg-[#667eea] text-white font-semibold hover:bg-[#5a7fd8] transition-colors"
              >
                Contactar
              </Link>
              <Link
                href="/#productos"
                className="px-6 py-3.5 rounded-xl border border-white/10 text-white/70 font-semibold hover:border-white/20 hover:text-white transition-all"
              >
                Ver más información
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="pt-12 pb-10 border-t border-white/[0.08] bg-transparent">
        <div className="w-full max-w-[1200px] mx-auto px-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-[0.82rem] text-white/35">
              © {new Date().getFullYear()} EV Trading Labs
            </p>
            <div className="flex gap-6 text-[0.82rem] text-white/35">
              <Link href="/terms" className="hover:text-white transition-colors">Términos</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
              <Link href="/refund" className="hover:text-white transition-colors">Reembolso</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
