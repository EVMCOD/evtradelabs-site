"use client";

import { useState, useEffect } from "react";

export default function PartnerDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (partnerCode: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/partners/stats?code=${partnerCode}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Error cargando stats");
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    fetchStats(code.trim());
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-5">
        <div className="max-w-[400px] w-full">
          <h1 className="text-[1.8rem] font-black mb-6 text-center">
            Partner Dashboard
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[0.85rem] text-white/50 mb-2">
                Tu código de partner
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toLowerCase())}
                placeholder="mi_codigo"
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
              className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90 transition-opacity"
            >
              Ver Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const { partner, stats: s } = stats;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-5 py-6">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-[1.3rem] font-bold">Partner Dashboard</h1>
            <p className="text-white/50 text-[0.85rem]">
              Code: <span className="text-[#667eea]">{partner.code}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-[0.75rem]">Tu link de afiliado</p>
            <code className="text-[#38bdf8] text-[0.85rem]">
              evtradelabs.com?ref={partner.code}
            </code>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="px-5 py-12">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-white/40 text-[0.75rem] uppercase tracking-wider mb-2">
                Total Ventas
              </p>
              <p className="text-[2rem] font-black text-[#667eea]">
                €{s.totalSales.toFixed(2)}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-white/40 text-[0.75rem] uppercase tracking-wider mb-2">
                Comisión Total
              </p>
              <p className="text-[2rem] font-black text-green-400">
                €{s.totalCommission.toFixed(2)}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-white/40 text-[0.75rem] uppercase tracking-wider mb-2">
                Referrals Totales
              </p>
              <p className="text-[2rem] font-black text-white">
                {s.totalReferrals}
              </p>
            </div>
          </div>

          {/* Recent Referrals */}
          <h2 className="text-[1.2rem] font-bold mb-6">Referrals Recientes</h2>
          
          {s.recentReferrals.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-white/50">Aún no hay referrals</p>
              <p className="text-white/30 text-[0.85rem] mt-2">
                Comparte tu link para empezar: evtradelabs.com?ref={partner.code}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left py-3 text-[0.75rem] text-white/40 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="text-left py-3 text-[0.75rem] text-white/40 uppercase tracking-wider">
                      Venta
                    </th>
                    <th className="text-left py-3 text-[0.75rem] text-white/40 uppercase tracking-wider">
                      Comisión
                    </th>
                    <th className="text-left py-3 text-[0.75rem] text-white/40 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="text-left py-3 text-[0.75rem] text-white/40 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {s.recentReferrals.map((r: any, i: number) => (
                    <tr key={i} className="border-b border-white/[0.04]">
                      <td className="py-4 text-[0.9rem]">{r.productSlug}</td>
                      <td className="py-4 text-[0.9rem]">€{r.saleAmount?.toFixed(2)}</td>
                      <td className="py-4 text-[0.9rem] text-green-400">
                        €{r.commission?.toFixed(2)}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-[0.7rem] font-medium ${
                            r.status === "paid"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-4 text-white/40 text-[0.85rem]">
                        {new Date(r.createdAt).toLocaleDateString("es-ES")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-12 border-t border-white/[0.06]">
        <div className="max-w-[1100px] mx-auto text-center">
          <h2 className="text-[1.2rem] font-bold mb-4">
            ¿No tienes código de partner?
          </h2>
          <a
            href="/partners"
            className="inline-flex px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90 transition-opacity"
          >
            Registrarme como partner
          </a>
        </div>
      </section>
    </div>
  );
}