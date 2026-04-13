"use client";

import { useState } from "react";

const faqs = [
  {
    q: "¿Necesito experiencia previa?",
    a: "No. Cada producto incluye documentación detallada y soporte para empezar desde cero.",
  },
  {
    q: "¿Funciona con MT5?",
    a: "Sí. Todos nuestros sistemas son para MetaTrader 5, la plataforma más usada por traders profesionales.",
  },
  {
    q: "¿Puedo probar antes de comprar?",
    a: "Sí. Dispones de versiones demo para evaluar cada producto sin compromiso.",
  },
  {
    q: "¿Cómo recibo mi licencia?",
    a: "Automáticamente por email tras el pago. Recibirás tus credenciales al instante.",
  },
  {
    q: "¿Ofrecéis soporte?",
    a: "Sí. Soporte por email y comunidad privada para todos los usuarios.",
  },
];

export default function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-0">
      {faqs.map((item, i) => {
        const isOpen = openIdx === i;
        return (
          <div
            key={i}
            className="border-b border-[#a78bfa]/20 last:border-0"
          >
            <button
              className="w-full flex items-center justify-between gap-4 py-5 text-left group"
              onClick={() => setOpenIdx(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className={`font-bold text-[0.95rem] transition-colors duration-200 ${isOpen ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                {item.q}
              </span>
              <span
                className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isOpen
                    ? 'bg-[#a78bfa]/20 border border-[#a78bfa]/50 text-[#a78bfa] rotate-45'
                    : 'border border-white/10 text-white/40 group-hover:border-[#a78bfa]/40 group-hover:text-[#a78bfa]'
                }`}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 pb-5' : 'max-h-0'}`}
            >
              <p className="text-white/50 text-[0.88rem] leading-relaxed">
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
