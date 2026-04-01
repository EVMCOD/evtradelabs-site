"use client";

import { useState } from "react";

const faqs = [
  {
    q: "¿Qué es EV Trading Labs?",
    a: "Un ecosistema de EAs, paneles, herramientas de gestión del riesgo y soluciones pensadas para traders que quieren trabajar con una lógica más seria, medible y repetible en los mercados.",
  },
  {
    q: "¿Los sistemas funcionan con MetaTrader 5?",
    a: "Sí. El núcleo del ecosistema está construido sobre MetaTrader 5. Todos nuestros Asesores Expertos, portafolios y el EV Trade Panel están diseñados específicamente para MT5.",
  },
  {
    q: "¿Puedo usar los EAs para cuentas de fondeo?",
    a: "Sí. Ofrecemos configuraciones y EAs específicamente diseñados para evaluaciones y cuentas financiadas, con énfasis en respetar reglas de drawdown, reducir errores operativos y proteger el capital.",
  },
  {
    q: "¿Cómo funciona el modelo de suscripción?",
    a: "La intención es ofrecer acceso continuo al ecosistema completo — EAs, actualizaciones, el EV Trade Panel y soporte — dentro de una estructura de suscripción que permite conectar y gestionar múltiples sistemas con una sola membresía.",
  },
  {
    q: "¿Hay una oferta especial activa?",
    a: "Sí. Actualmente, con cualquier suscripción anual a un EA desbloqueas EV Trade Panel gratis de por vida. Esta oferta es por tiempo limitado.",
  },
  {
    q: "¿Dónde puedo obtener soporte?",
    a: "La comunidad principal vive en Discord. Allí encontrarás soporte directo, actualizaciones en tiempo real, recursos compartidos y acceso al equipo detrás de EV Trading Labs.",
  },
];

export default function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[#e5ddd4] border border-[#e5ddd4] rounded-2xl overflow-hidden bg-[#fffdfa]">
      {faqs.map((item, i) => (
        <div key={i}>
          <button
            className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            aria-expanded={openIdx === i}
          >
            <span className="font-semibold text-[0.97rem] text-[#131313]">
              {item.q}
            </span>
            <span
              className={`shrink-0 w-6 h-6 rounded-full border border-[#e5ddd4] flex items-center justify-center text-[#5f5a54] transition-transform duration-200 ${
                openIdx === i ? "rotate-45" : ""
              }`}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M5 1v8M1 5h8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </button>
          {openIdx === i && (
            <div className="px-6 pb-5">
              <p className="text-[0.93rem] text-[#5f5a54] leading-relaxed m-0">
                {item.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
