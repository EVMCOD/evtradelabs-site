import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EV Replicador — Replica tus operaciones MT5 | EV Trading Labs",
  description: "Gestiona todas tus cuentas de trading desde una sola. Opera en tu cuenta master y replica automáticamente en todas tus cuentas follower.",
};

export default function ReplicadorPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="max-w-3xl mx-auto px-6 py-20 flex flex-col gap-16">
        {/* Hero */}
        <section className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 text-xs text-white/40 border border-white/[0.08] rounded-full px-3 py-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            MT5 → MT5
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            EV Replicador
          </h1>
          <p className="text-lg text-white/50 leading-relaxed">
            Opera en una cuenta y réplica automáticamente en todas las demás.
            Gestiona todas tus cuentas desde un solo terminal MT5.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/replicador/dashboard"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-sm font-medium transition-colors"
            >
              Ir al dashboard →
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="flex flex-col gap-6">
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Cómo funciona</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Opera en master",
                desc: "Abre o cierra una posición en tu cuenta master. El EA detecta el evento al instante.",
              },
              {
                step: "2",
                title: "Señal al servidor",
                desc: "El EA master envía la señal al servidor con símbolo, tipo, lotes y precio. Expira en 30 segundos.",
              },
              {
                step: "3",
                title: "Followers ejecutan",
                desc: "Cada cuenta follower descarga la señal, calcula sus lotes y ejecuta la misma operación automáticamente.",
              },
            ].map(item => (
              <div key={item.step} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col gap-3">
                <span className="text-2xl font-bold text-white/20">{item.step}</span>
                <h3 className="text-sm font-semibold text-white/80">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="flex flex-col gap-6">
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Características</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm text-white/60">
            {[
              "Hasta 10 cuentas follower por grupo",
              "Modes: proporcional, ratio, lotes fijos",
              "Copia SL y TP opcionalmente",
              "Sufijo de símbolo configurable (.ecn, etc.)",
              "Slippage máximo configurable",
              "Seguimiento de ejecuciones en tiempo real",
              "Reconexión automática tras reinicio del EA",
              "Señales con TTL de 30s — sin ejecuciones tardías",
            ].map(feat => (
              <li key={feat} className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                {feat}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-white/80">¿Listo para empezar?</p>
            <p className="text-sm text-white/40 mt-1">Crea tu grupo y conecta tus cuentas en 5 minutos.</p>
          </div>
          <Link
            href="/replicador/dashboard"
            className="flex-none px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-sm font-medium transition-colors whitespace-nowrap"
          >
            Empezar →
          </Link>
        </section>
      </div>
    </div>
  );
}
