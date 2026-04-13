'use client';

import Navbar from '../../_components/Navbar';
import Link from 'next/link';

const DOWNLOADS = [
  {
    name: 'EV Quant Lab — Windows',
    file: 'EV-Quant-Lab-windows.exe',
    size: '~180 MB',
    color: '#38bdf8',
    requires: 'ev-quant-lab',
  },
  {
    name: 'EV Quant Lab — macOS Apple Silicon',
    file: 'EV-Quant-Lab-mac-arm.dmg',
    size: '~150 MB',
    color: '#a78bfa',
    requires: 'ev-quant-lab',
  },
  {
    name: 'EV Quant Lab — macOS Intel',
    file: 'EV-Quant-Lab-mac-intel.dmg',
    size: '~150 MB',
    color: '#a78bfa',
    requires: 'ev-quant-lab',
  },
  {
    name: 'EV Quant Lab — Linux AppImage',
    file: 'EV-Quant-Lab-linux.AppImage',
    size: '~120 MB',
    color: '#34d399',
    requires: 'ev-quant-lab',
  },
];

const DOWNLOAD_BASE = 'https://pub-c5ec26eda22903c2898aadecbe94ea98.r2.dev/releases/latest';

export default function DownloadsPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d1117 100%)' }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-5 pt-32 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/account" className="text-white/40 hover:text-white transition-colors text-sm">← Mi Cuenta</Link>
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Descargas</h1>
        <p className="text-white/40 text-sm mb-8">Archivos disponibles con tu licencia activa.</p>

        <div className="space-y-4">
          {DOWNLOADS.map((dl) => (
            <div key={dl.file} className="flex items-center justify-between gap-4 rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div className="font-semibold text-white text-sm mb-0.5">{dl.name}</div>
                <div className="text-white/30 text-xs">{dl.size}</div>
              </div>
              <a
                href={`${DOWNLOAD_BASE}/${dl.file}`}
                download
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[0.82rem] font-semibold transition-colors"
                style={{ background: `${dl.color}15`, border: `1px solid ${dl.color}40`, color: dl.color }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v8M3 5l4 4 4-4M1 11h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Descargar
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-2xl" style={{ background: 'rgba(102,126,234,0.08)', border: '1px solid rgba(102,126,234,0.2)' }}>
          <p className="text-white/50 text-sm">
            ¿Necesitas ayuda con la instalación?{' '}
            <Link href="/local-app" className="text-[#667eea] hover:underline">Ver guía completa</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
