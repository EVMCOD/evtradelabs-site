"use client";

import { useState } from "react";

export default function PartnerPage() {
  const [formData, setFormData] = useState({ code: "", name: "", email: "" });
  const [partnerLink, setPartnerLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al crear partner");
      }

      setPartnerLink(`https://evtradelabs.com?ref=${formData.code}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      title: "20% Commission",
      desc: "Recibe el 20% de cada venta que generes, recurrencialmente.",
      icon: "💰",
    },
    {
      title: "Dashboard Propio",
      desc: "Ve tus métricas, referrals y comisiones en tiempo real.",
      icon: "📊",
    },
    {
      title: "Links Únicos",
      desc: "Cada partner tiene su código único para tracking.",
      icon: "🔗",
    },
    {
      title: "Pagos Mensuales",
      desc: "Comisiones pagadas mensualmente vía PayPal o transferencia.",
      icon: "📅",
    },
  ];

  const communities = [
    "Grupos de Trading en Telegram/Discord",
    "Canales de YouTube/TikTok de inversión",
    "Creadores de contenido financiero",
    "Mentores y cursos de trading",
    "Blogs y webs de finanzas",
    "Foros y comunidades de traders",
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Hero */}
      <section className="py-24 px-5 bg-gradient-to-b from-[#0d1117] to-[#0a0a0f]">
        <div className="max-w-[900px] mx-auto text-center">
          <span className="inline-block text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#667eea] mb-4">
            PARTNER PROGRAM
          </span>
          <h1 className="text-[2.5rem] md:text-[3.5rem] font-black mb-6">
            Gana dinero recomendando
            <br />
            <span className="text-[#667eea]">EV Trading Labs</span>
          </h1>
          <p className="text-white/50 text-[1rem] md:text-[1.1rem] max-w-[600px] mx-auto mb-8">
            Únete a nuestro programa de afiliados y gana comisiones recurring
            por cada cliente que traigas. Herramientas profesionales,
            20% de comisión.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-5 bg-[#0a0a0f]">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-[1.5rem] font-bold text-center mb-12">
            ¿Por qué unirte?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
              >
                <div className="text-3xl mb-4">{b.icon}</div>
                <h3 className="text-[1.1rem] font-bold mb-2">{b.title}</h3>
                <p className="text-white/50 text-[0.9rem]">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 px-5 bg-[#0a0a0f]">
        <div className="max-w-[500px] mx-auto">
          <h2 className="text-[1.5rem] font-bold text-center mb-8">
            Regístrate como partner
          </h2>

          {!partnerLink ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[0.85rem] text-white/50 mb-2">
                  Código de partner *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })
                  }
                  placeholder="mi_canal"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#667eea] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[0.85rem] text-white/50 mb-2">
                  Nombre o marca *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Trading Academy"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#667eea] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[0.85rem] text-white/50 mb-2">
                  Email de contacto *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#667eea] focus:outline-none"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-[0.85rem]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-[0.95rem] bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Creando..." : "Crear cuenta de partner"}
              </button>
            </form>
          ) : (
            <div className="text-center p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-[1.2rem] font-bold mb-4">
                ¡Partner creado!
              </h3>
              <p className="text-white/50 text-[0.9rem] mb-6">
                Comparte este link para empezar a ganar comisiones:
              </p>
              <div className="p-4 rounded-xl bg-white/5 border border-[#667eea]/30 mb-4">
                <code className="text-[#38bdf8] text-[0.9rem] break-all">
                  {partnerLink}
                </code>
              </div>
              <p className="text-white/40 text-[0.8rem]">
                Usa este link en tu contenido. Cuando alguien compre,
                recibirás 20% de comisión.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Who can join */}
      <section className="py-16 px-5 bg-[#0a0a0f]">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-[1.5rem] font-bold text-center mb-8">
            ¿A quién buscamos?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {communities.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <span className="text-[#667eea]">✓</span>
                <span className="text-white/70">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-5 bg-[#0a0a0f]">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-[1.5rem] font-bold text-center mb-8">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "¿Cuánto gano?",
                a: "Recibes el 20% de cada venta. Si alguien compra EV Quant Lab (€399), ganas €79. Si renueva mensualmente, tú sigues ganando.",
              },
              {
                q: "¿Cómo recibo el dinero?",
                a: "PayPal o transferencia bancaria. Pagamos mensualmente cuando llegas a €50 mínimos.",
              },
              {
                q: "¿Necesito ser cliente?",
                a: "No, puedes ser partner sin haber comprado nuestros productos.",
              },
              {
                q: "¿Puedo usar enlaces en redes sociales?",
                a: "Sí, cualquier plataforma: YouTube, TikTok, Twitter, Telegram, Discord, etc.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <h3 className="font-semibold text-[0.95rem] mb-2">{faq.q}</h3>
                <p className="text-white/50 text-[0.88rem]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 bg-gradient-to-t from-[#0d1117] to-[#0a0a0f] text-center">
        <h2 className="text-[1.8rem] font-black mb-4">
          ¿Listo para empezar?
        </h2>
        <p className="text-white/50 mb-8">
          Únete gratis y comienza a earner hoy.
        </p>
        <a
          href="#register"
          className="inline-flex px-8 py-4 rounded-xl font-bold text-[1rem] bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90 transition-opacity"
        >
          Registrarse como partner
        </a>
      </section>

      {/* Footer */}
      <footer className="py-8 px-5 border-t border-white/[0.06] text-center">
        <p className="text-white/30 text-[0.8rem]">
          © 2026 EV Trading Labs. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}