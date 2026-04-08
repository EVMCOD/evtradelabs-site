import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad — EV Trading Labs",
  description: "Cómo recopilamos, usamos y protegemos tus datos personales.",
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

export default function PrivacyPage() {
  return (
    <main className="shell">
      <div className="wrap stack page-gap-lg max-w-[760px]">
        <div>
          <h1 className="h1">Política de Privacidad</h1>
          <p className="p text-white/50">Última actualización: 8 de abril de 2026</p>
        </div>

        <div className="card card-strong space-y-6">
          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">1. Responsable del tratamiento</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              EV Trading Labs · contact@evtradelabs.com
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">2. Datos que recopilamos</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              Recopilamos: nombre, email, datos de pago (procesados por Stripe, nosotros no almacenamos números de tarjeta), dirección IP y comportamiento de uso de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">3. Finalidad</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              Usamos tus datos para: gestión de licencias y cuentas, procesamiento de pagos, comunicación relacionada con productos comprados, soporte técnico y mejora de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">4. Base legal</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              La base legal es el cumplimiento del contrato de compra (licencia de software). Para comunicaciones de marketing, solicitaremos tu consentimiento explícito.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">5. Tus derechos</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              Tienes derecho a: acceso a tus datos, rectificación, supresión, limitación del tratamiento, portabilidad y oposición. Ejércelos escribiendo a{" "}
              <a href="mailto:contact@evtradelabs.com" className="text-[#667eea] hover:underline">
                contact@evtradelabs.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">6. Cookies</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              Utilizamos cookies esenciales para el funcionamiento de la plataforma (autenticación, carrito). No usamos cookies de tracking ni publicidad de terceros.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">7. Retención</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              Conservamos tus datos mientras mantengas una cuenta activa o durante el período necesario para cumplir obligaciones legales (normalmente 5 años para documentos fiscales).
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-bold text-white mb-3">8. Seguridad</h2>
            <p className="text-[0.92rem] text-white/60 leading-relaxed">
              Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos contra accesos no autorizados, pérdida o destrucción.
            </p>
          </section>
        </div>
      </div>
      <SimpleFooter />
    </main>
  );
}
