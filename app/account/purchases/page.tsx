'use client';

import Navbar from '../../_components/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Order {
  id: string;
  productName: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  licenseKey: string | null;
}

export default function PurchasesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders || []);
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
        <h1 className="text-3xl font-black text-white mb-8">Compras</h1>

        {loading ? (
          <div className="text-white/40 text-sm">Cargando historial...</div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-4xl mb-4">🛒</div>
            <p className="text-white/50 mb-6">Aún no has realizado ninguna compra.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#667eea] text-white font-semibold text-sm hover:bg-[#5a7fd8] transition-colors"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05] text-[0.7rem] text-white/40 uppercase tracking-wider">
                  <th className="text-left px-6 py-4">Producto</th>
                  <th className="text-right px-6 py-4">Total</th>
                  <th className="text-center px-6 py-4">Estado</th>
                  <th className="text-right px-6 py-4">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-white text-sm font-medium">{order.productName}</td>
                    <td className="px-6 py-4 text-right text-white font-semibold text-sm">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: order.currency.toUpperCase() }).format(order.amount / 100)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.status === 'completed' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                        {order.status === 'completed' ? 'Completado' : order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-white/40 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('es-ES')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
