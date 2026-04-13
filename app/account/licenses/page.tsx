'use client';

import Navbar from '../../_components/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface License {
  id: string;
  key: string;
  productName: string;
  productSlug: string;
  status: string;
  createdAt: string;
}

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/license/list')
      .then((r) => r.json())
      .then((data) => {
        setLicenses(data.licenses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d1117 100%)' }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-5 pt-32 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/account" className="text-white/40 hover:text-white transition-colors text-sm">← Mi Cuenta</Link>
        </div>
        <h1 className="text-3xl font-black text-white mb-8">Licencias</h1>

        {loading ? (
          <div className="text-white/40 text-sm">Cargando licencias...</div>
        ) : licenses.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-4xl mb-4">🎫</div>
            <p className="text-white/50 mb-6">No tienes licencias activas todavía.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#667eea] text-white font-semibold text-sm hover:bg-[#5a7fd8] transition-colors"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {licenses.map((lic) => (
              <div key={lic.id} className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold text-white mb-1">{lic.productName}</div>
                    <div className="font-mono text-[#a78bfa] text-sm bg-[#a78bfa]/10 px-3 py-1 rounded-lg inline-block">{lic.key}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${lic.status === 'active' ? 'bg-green-500/15 text-green-400' : 'bg-white/10 text-white/40'}`}>
                    {lic.status === 'active' ? 'Activa' : lic.status}
                  </span>
                </div>
                <div className="mt-3 text-white/30 text-xs">
                  Adquirida: {new Date(lic.createdAt).toLocaleDateString('es-ES')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
