import Link from "next/link";

const faqs = [
  {
    q: "¿Qué es EV Trading Labs?",
    a: "EV Trading Labs es un ecosistema de herramientas, sistemas y conectores para traders que quieren una operativa más seria, medible y escalable.",
  },
  {
    q: "¿Trabajáis solo con MetaTrader 5?",
    a: "No. La dirección del producto es multi-plataforma: MetaTrader 5, NinjaTrader, IBKR, Tradovate y TradingView, además de builder app, conectores e infraestructura de riesgo.",
  },
  {
    q: "¿Cómo se entregan los productos?",
    a: "La web comercial y la plataforma/productos están separadas. La entrega puede hacerse de forma similar a herramientas tipo StrategyQuant: acceso, onboarding y entrega del producto fuera de la web comercial.",
  },
  {
    q: "¿Habrá suscripciones por plataforma?",
    a: "Sí, la idea comercial contempla paquetes por stack o plataforma, por ejemplo MT5, TradingView o NinjaTrader/Tradovate, además de posibles bundles o acceso ampliado.",
  },
  {
    q: "¿Tenéis programa de afiliados?",
    a: "Sí, está previsto como parte de la capa comercial: pensado para creadores, comunidades y partners que quieran distribuir o recomendar el ecosistema EV Trading Labs.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#0d1120] text-white">
      <div className="mx-auto max-w-[1100px] px-5 pt-28 pb-24">
        <div className="max-w-[760px] mb-14">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#9fb2d4]">
            FAQ
          </span>
          <h1 className="mt-5 text-[clamp(2.5rem,6vw,4.4rem)] font-black tracking-[-0.06em] leading-[0.92] text-balance">
            Preguntas frecuentes
          </h1>
          <p className="mt-5 max-w-[58ch] text-[1.02rem] leading-[1.9] text-[#9fb2d4]">
            Todo lo esencial sobre producto, plataformas, entrega y dirección comercial de EV Trading Labs.
          </p>
        </div>

        <div className="grid gap-4">
          {faqs.map((item) => (
            <article key={item.q} className="rounded-[24px] border border-white/10 bg-[rgba(17,26,45,0.58)] p-6 md:p-7 backdrop-blur-sm">
              <h2 className="m-0 text-[1.08rem] font-semibold tracking-[-0.02em] text-white">{item.q}</h2>
              <p className="mt-3 mb-0 text-[0.98rem] leading-[1.85] text-[#9fb2d4]">{item.a}</p>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <Link href="/#contacto" className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-[0.9rem] font-semibold text-white transition-all duration-200 hover:bg-white/[0.08]">
            Contactar con EV Trading Labs
          </Link>
        </div>
      </div>
    </main>
  );
}
