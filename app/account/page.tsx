'use client';

import Navbar from '../_components/Navbar';
import Link from 'next/link';

export default function AccountPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d1117 100%)' }}>
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-5 pt-32 pb-16">
        <h1 className="text-3xl font-black text-white mb-8">Mi Cuenta</h1>
        
        <div className="grid md:grid-cols-2 gap-5">
          <Link href="/account/connect" className="group">
            <div className="rounded-2xl p-6 transition-all" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-3xl mb-3">📊</div>
              <h2 className="text-white font-bold text-lg mb-1 group-hover:text-[#a78bfa] transition-colors">Conectar MT5</h2>
              <p className="text-white/40 text-sm">Vincula tu cuenta de MetaTrader 5 para ver estadísticas en tu dashboard</p>
            </div>
          </Link>
          
          <Link href="/account/licenses" className="group">
            <div className="rounded-2xl p-6 transition-all" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-3xl mb-3">🎫</div>
              <h2 className="text-white font-bold text-lg mb-1 group-hover:text-[#a78bfa] transition-colors">Licencias</h2>
              <p className="text-white/40 text-sm">Gestiona tus licencias de productos</p>
            </div>
          </Link>
          
          <Link href="/account/downloads" className="group">
            <div className="rounded-2xl p-6 transition-all" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-3xl mb-3">📥</div>
              <h2 className="text-white font-bold text-lg mb-1 group-hover:text-[#a78bfa] transition-colors">Descargas</h2>
              <p className="text-white/40 text-sm">Descarga tus productos y archivos</p>
            </div>
          </Link>
          
          <Link href="/account/purchases" className="group">
            <div className="rounded-2xl p-6 transition-all" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-3xl mb-3">🛒</div>
              <h2 className="text-white font-bold text-lg mb-1 group-hover:text-[#a78bfa] transition-colors">Compras</h2>
              <p className="text-white/40 text-sm">Historial de tus compras</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
