import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Reembolso — EV Trading Labs",
  description: "Política de devolución y reembolso de productos digitales.",
};

function SimpleFooter() {
  return (
    <footer className="pt-12 pb-10 border-t border-white/[0.08] mt-20">
      <div className="w-full max-w-[1200px] mx-auto px-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-[0.82rem] text-white/35">© {new Date().getFullYear()} EV Trading Labs</p>
          <div className="flex gap-6 text-[0.82rem] text-white/35">
            <Link href="/terms" className="hover:text-white transition-colors">Términos</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
            <Link href="/refund" className="hover:text-white transition-colors">Reembolso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RefundPage() {
  return (
    <main className="shell">
      <div className="wrap stack page-gap-lg max-w-[760px]">
        <div>
          <h1 className="h1">Política de Reembolso</h1>
          <p className="p text-white/50">Última actualización: 8 de abril de 2026</p>
        </div>

        <div className="card card-strong space-y-6">
          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">1. Productos digitales</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              Los productos de software digital (EAs, indicadores, licencias) no son reembolsables una vez descargados o activados, tal y como permite la normativa europea para productos digitales personalizados.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">2. Período de evaluación</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              Recomendamos usar las versiones de demostración disponibles antes de comprar. La versión de demostración de Master of Liquidity está disponible gratuitamente para evaluación.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">3. Solicitudes caso por caso</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              En casos excepcionales (fallo técnico demostrable, problemas de compatibilidad), evaluaremos solicitudes de reembolso de manera individual. Contacta con soporte con tu número de pedido.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">4. Cómo solicitar un reembolso</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              Escribe a{" "}
              <a href="mailto:support@evtradelabs.com" className="text-[#667eea] hover:underline">
                support@evtradelabs.com
              </a>{" "}
              con: tu email de compra, número de pedido y motivo de la solicitud. Responderemos en un máximo de 5 días hábiles.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">5. Excepciones</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              No se realizan reembolsos en los siguientes casos: cambio de opinión tras la compra, desconocimiento del producto antes de comprar (existen versiones demo), o intentos de uso fraudulento.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">6. Contacto</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              Para cualquier duda sobre esta política:{" "}
              <a href="mailto:contact@evtradelabs.com" className="text-[#667eea] hover:underline">
                contact@evtradelabs.com
              </a>
            </p>
          </section>
        </div>
      </div>
      <SimpleFooter />
    </main>
  );
}
