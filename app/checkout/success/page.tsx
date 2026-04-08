import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pago completado — EV Trading Labs",
};

export default function CheckoutSuccessPage() {
  return (
    <main className="shell">
      <div className="wrap stack page-gap-lg max-w-[560px] mx-auto">
        <div className="card card-strong p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M6 14l5 5L22 8" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="text-[1.8rem] font-black text-white mb-4">¡Pago completado!</h1>

          <p className="text-white/60 text-[1rem] mb-6 leading-relaxed">
            Tu licencia está siendo generada. Recibirás un email de{" "}
            <strong className="text-white">contacto@evtradelabs.com</strong>{" "}
            con los datos de acceso en breve.
          </p>

          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] inline-block mb-8">
            <div className="text-[0.78rem] text-white/40 mb-1">Estado</div>
            <div className="text-green-400 font-semibold">Pago confirmado ✓</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/account"
              className="px-6 py-3 rounded-xl bg-[#667eea] text-white font-semibold hover:bg-[#5a7fd8] transition-colors"
            >
              Ver mi cuenta
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl border border-white/10 text-white/60 font-semibold hover:border-white/20 hover:text-white transition-all"
            >
              Volver al inicio
            </Link>
          </div>

          <div className="mt-10 pt-6 border-t border-white/[0.08]">
            <p className="text-[0.82rem] text-white/30">
              ¿No recibes el email? Revisa tu carpeta de spam o contacta con{" "}
              <a href="mailto:support@evtradelabs.com" className="text-[#667eea] hover:underline">
                support@evtradelabs.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
