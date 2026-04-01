import Link from "next/link";

export default function AffiliateCard() {
  return (
    <article className="reveal-card p-8 rounded-3xl flex flex-col border border-white/10 bg-[linear-gradient(145deg,rgba(17,26,45,0.78),rgba(23,38,66,0.68))] text-[#f3f6fd] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(17,24,39,0.22)]">
      <span className="inline-block text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#7b9ed9] mb-3">
        Affiliate program
      </span>
      <h2 className="m-0 mb-4 text-[clamp(1.75rem,3.5vw,2.5rem)] font-black leading-[1.03] tracking-[-0.05em] text-white text-balance">
        Grow with us as a partner, creator or community.
      </h2>
      <p className="text-[0.96rem] leading-[1.8] text-[#8da0c2] mb-8 flex-1">
        Estamos preparando una capa comercial para afiliados y partners que quieran distribuir packs, herramientas y acceso al ecosistema EV Trading Labs.
      </p>
      <div>
        <Link href="#contacto" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/12 bg-white/[0.03] text-white font-semibold text-[0.9rem] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200">
          Solicitar información
        </Link>
      </div>
    </article>
  );
}
