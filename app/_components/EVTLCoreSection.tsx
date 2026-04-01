import Link from "next/link";

export default function EVTLCoreSection() {
  return (
    <section className="section-shell py-24 bg-transparent">
      <div className="w-full max-w-[1320px] mx-auto px-5">
        <div className="evtl-core-shell reveal-card relative overflow-hidden rounded-[34px] border border-[#8fb5ff]/14 bg-[linear-gradient(145deg,rgba(18,30,52,0.94),rgba(11,18,32,0.96))] p-8 md:p-10 xl:p-12 shadow-[0_34px_90px_rgba(7,12,25,0.22)]">
          <div className="evtl-core-aurora evtl-core-aurora--right absolute inset-y-0 right-0 w-[38%] bg-[radial-gradient(circle_at_70%_35%,rgba(59,130,246,0.18),transparent_42%)] pointer-events-none" />
          <div className="evtl-core-aurora evtl-core-aurora--left absolute left-[-8%] top-[8%] h-[220px] w-[220px] rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.16),transparent_68%)] pointer-events-none" />
          <div className="absolute left-0 top-0 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(143,181,255,0.45),transparent)]" />

          <div className="relative grid xl:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
            <div className="max-w-[760px]">
              <span className="inline-flex items-center rounded-full border border-[#8fb5ff]/18 bg-[rgba(59,130,246,0.1)] px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#b9d4ff]">
                Core platform
              </span>
              <h2 className="mt-5 text-[clamp(2.2rem,4.8vw,3.6rem)] font-black tracking-[-0.06em] leading-[0.98] text-white m-0 text-balance">
                EVTL Core
              </h2>
              <p className="mt-4 text-[1.08rem] leading-[1.85] text-[#d7e6ff] max-w-[54ch]">
                La plataforma central para crear, optimizar y acceder al ecosistema MT5 de EV Trading Labs.
              </p>
              <p className="mt-5 text-[0.97rem] leading-[1.9] text-[#9fb2d4] max-w-[62ch]">
                EVTL Core reúne en un solo entorno el acceso al ecosistema completo de EAs para MT5, creación de estrategias sin necesidad de programar y procesos avanzados de optimización para traders que buscan más estructura, más control y mejores herramientas.
              </p>

              <div className="mt-7 flex flex-wrap gap-3 text-[0.82rem] text-[#c7d5eb]">
                {[
                  "Ecosistema completo de EAs para MT5",
                  "Creación de estrategias sin código",
                  "Optimización avanzada",
                  "Plataforma central de EV Trading Labs",
                ].map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="evtl-core-panel rounded-[28px] border border-white/10 bg-[rgba(15,23,42,0.42)] p-6 backdrop-blur-sm">
                <div className="inline-flex items-center rounded-full border border-[#8fb5ff]/18 bg-[rgba(59,130,246,0.08)] px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#b9d4ff]">
                  Lifetime access only
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.035] p-4">
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#7b9ed9]">Positioning</div>
                    <div className="mt-2 text-[0.92rem] font-medium text-white/92">Premium central product</div>
                  </div>
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.035] p-4">
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#7b9ed9]">Role in the stack</div>
                    <div className="mt-2 text-[0.92rem] font-medium text-white/92">Core EVTL platform layer</div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Link href="#contacto" className="inline-flex items-center justify-center rounded-full bg-[#2563eb] px-6 py-3.5 text-[0.92rem] font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.28)] hover:bg-[#1d4ed8] transition-colors duration-200">
                    Explorar EVTL Core
                  </Link>
                  <Link href="https://discord.gg/rUBRF875j" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 py-3.5 text-[0.92rem] font-semibold text-[#c7d5eb] hover:border-white/20 hover:bg-white/[0.06] hover:text-white transition-all duration-200">
                    Unirse al Discord
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
