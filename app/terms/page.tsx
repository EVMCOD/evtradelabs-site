import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones — EV Trading Labs",
  description: "Términos y condiciones de uso de EV Trading Labs.",
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

export default function TermsPage() {
  return (
    <main className="shell">
      <div className="wrap stack page-gap-lg max-w-[760px]">
        <div>
          <h1 className="h1">Términos y Condiciones</h1>
          <p className="p text-white/50">Última actualización: 8 de abril de 2026</p>
        </div>

        <div className="card card-strong space-y-6">
          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">1. Aceptación</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              Al acceder y utilizar EV Trading Labs ("la Plataforma"), aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo, no utilices la Plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">2. Productos y licencias</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              Los productos adquiridos son Asesores Expertos ("EAs") y software complementario para MetaTrader 5. Las licencias son de uso personal e intransferible. No está permitida la reventa, redistribución o cesión a terceros.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">3. Uso bajo responsabilidad del usuario</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              El trading automatizado conlleva riesgos significativos, incluyendo pérdidas financieras. Los EAs son herramientas de apoyo. EV Trading Labs no garantiza beneficios ni resultados específicos. El usuario es responsable de sus propias decisiones de trading.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">4. Riesgo y limitaciones</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              El rendimiento pasado no garantiza resultados futuros. Condiciones de mercado, slippage, fallos de conexión y otros factores pueden afectar la ejecución. EV Trading Labs no se hace responsable de pérdidas derivadas del uso de sus productos.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">5. Propiedad intelectual</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              Todo el contenido, código, diseños y materiales de EV Trading Labs están protegidos por propiedad intelectual. Queda prohibida la ingeniería inversa, descompilación o extracción del código fuente.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">6. Pago y cancelaciones</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              Los pagos se procesan a través de proveedores externos (Stripe). Las cancelaciones deben solicitarse por email en los 14 días siguientes a la compra según la política de reembolso.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">7. Contacto</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              Para cualquier cuestión relacionada con estos términos:{" "}
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
