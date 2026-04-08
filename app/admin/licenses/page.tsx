'use client';

import { useState } from 'react';

type LicenseStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'PENDING';

interface License {
  id: string;
  key: string;
  customerEmail: string;
  customerName: string;
  productName: string;
  productSlug: string;
  accessTier: string;
  status: LicenseStatus;
  expiresAt: string | null;
  createdAt: string;
  maxAccounts: number;
  activatedAccounts: number;
}

const MOCK_LICENSES: License[] = [
  { id: '1', key: 'EVTL-MOL-8472-XKQ9-PR0L', customerEmail: 'carlos.trader@example.com', customerName: 'Carlos M.', productName: 'Master of Liquidity', productSlug: 'master-of-liquidity', accessTier: 'Pro / Lifetime', status: 'ACTIVE', expiresAt: null, createdAt: '2024-11-15', maxAccounts: 3, activatedAccounts: 2 },
  { id: '2', key: 'EVTL-EQL-2931-MNB5-VC8Y', customerEmail: 'maria.funded@example.com', customerName: 'María G.', productName: 'EV Quant Lab', productSlug: 'ev-quant-lab', accessTier: 'Studio License', status: 'ACTIVE', expiresAt: null, createdAt: '2024-10-20', maxAccounts: 2, activatedAccounts: 1 },
  { id: '3', key: 'EVTL-RMP-5512-JKL7-GH3W', customerEmail: 'antonio.algo@example.com', customerName: 'Antonio R.', productName: 'Risk Manager Pro', productSlug: 'risk-manager-pro', accessTier: 'Core Access', status: 'EXPIRED', expiresAt: '2025-01-01', createdAt: '2024-09-10', maxAccounts: 1, activatedAccounts: 1 },
  { id: '4', key: 'EVTL-MSE-9923-PQR4-NM8T', customerEmail: 'sofia.swing@example.com', customerName: 'Sofia L.', productName: 'Multi-Signal Engine', productSlug: 'multi-signal-engine', accessTier: 'Pro / Lifetime', status: 'ACTIVE', expiresAt: null, createdAt: '2025-01-08', maxAccounts: 3, activatedAccounts: 0 },
  { id: '5', key: 'EVTL-PBL-7734-STU6-LP2Q', customerEmail: 'david.k@example.com', customerName: 'David K.', productName: 'Portfolio Builder', productSlug: 'portfolio-builder', accessTier: 'Pro / Lifetime', status: 'PENDING', expiresAt: null, createdAt: '2025-02-01', maxAccounts: 2, activatedAccounts: 0 },
  { id: '6', key: 'EVTL-RMP-2281-WXY9-AK5L', customerEmail: 'juan.quant@example.com', customerName: 'Juan P.', productName: 'Risk Manager Pro', productSlug: 'risk-manager-pro', accessTier: 'Core Access', status: 'REVOKED', expiresAt: null, createdAt: '2024-08-15', maxAccounts: 1, activatedAccounts: 0 },
];

function StatusBadge({ status }: { status: LicenseStatus }) {
  const colors = {
    ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
    EXPIRED: 'bg-red-500/20 text-red-400 border-red-500/30',
    REVOKED: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    PENDING: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.72rem] font-semibold border ${colors[status]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    'Core Access': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Studio License': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    'Pro / Lifetime': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.72rem] font-semibold border ${colors[tier] || 'bg-white/10 text-white/60 border-white/20'}`}>
      {tier}
    </span>
  );
}

function LicenseModal({ license, onClose, onRevoke, onRenew }: { license: License; onClose: () => void; onRevoke: (id: string) => void; onRenew: (id: string) => void }) {
  const [showKey, setShowKey] = useState(false);
  const maskedKey = license.key.slice(0, 4) + '•'.repeat(20) + license.key.slice(-4);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#1e293b] rounded-2xl p-6 w-full max-w-[520px]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-[1.1rem] font-bold text-white">License Detail</h2>
            <p className="text-[0.82rem] text-white/40 mt-1 font-mono">{license.key}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Status + Tier */}
        <div className="flex gap-3 mb-6">
          <StatusBadge status={license.status} />
          <TierBadge tier={license.accessTier} />
        </div>

        {/* Customer */}
        <div className="mb-5 p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <div className="text-[0.75rem] text-white/40 uppercase tracking-wider mb-2">Customer</div>
          <div className="text-white font-semibold">{license.customerName || 'N/A'}</div>
          <div className="text-white/60 text-[0.9rem]">{license.customerEmail}</div>
        </div>

        {/* Product */}
        <div className="mb-5 p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <div className="text-[0.75rem] text-white/40 uppercase tracking-wider mb-2">Product</div>
          <div className="text-white font-semibold">{license.productName}</div>
          <div className="text-white/60 text-[0.85rem] font-mono">/{license.productSlug}</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-center">
            <div className="text-[1.1rem] font-black text-white">{license.maxAccounts}</div>
            <div className="text-[0.72rem] text-white/40 mt-0.5">Max Accounts</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-center">
            <div className="text-[1.1rem] font-black text-[#667eea]">{license.activatedAccounts}</div>
            <div className="text-[0.72rem] text-white/40 mt-0.5">Activated</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-center">
            <div className="text-[1.1rem] font-black text-green-400">{license.maxAccounts - license.activatedAccounts}</div>
            <div className="text-[0.72rem] text-white/40 mt-0.5">Available</div>
          </div>
        </div>

        {/* License Key */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[0.75rem] text-white/40 uppercase tracking-wider">License Key</div>
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-[0.78rem] text-[#667eea] hover:text-white transition-colors"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="p-3 rounded-xl bg-black/30 border border-white/[0.08] font-mono text-[0.88rem] text-white/70 select-all break-all">
            {showKey ? license.key : maskedKey}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-[0.82rem]">
          <div>
            <div className="text-white/40 mb-1">Created</div>
            <div className="text-white/70">{new Date(license.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          </div>
          <div>
            <div className="text-white/40 mb-1">Expires</div>
            <div className="text-white/70">{license.expiresAt ? new Date(license.expiresAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Never'}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {license.status === 'ACTIVE' && (
            <button
              onClick={() => onRevoke(license.id)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-semibold text-[0.88rem] hover:bg-red-500/30 transition-colors"
            >
              Revoke License
            </button>
          )}
          {(license.status === 'EXPIRED' || license.status === 'REVOKED') && (
            <button
              onClick={() => onRenew(license.id)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#667eea] text-white font-semibold text-[0.88rem] hover:bg-[#5a7fd8] transition-colors"
            >
              Renew License
            </button>
          )}
          {license.status === 'PENDING' && (
            <button
              onClick={() => onRenew(license.id)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#667eea] text-white font-semibold text-[0.88rem] hover:bg-[#5a7fd8] transition-colors"
            >
              Activate License
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-white/60 font-semibold text-[0.88rem] hover:border-white/20 hover:text-white transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLicensesPage() {
  const [licenses, setLicenses] = useState<License[]>(MOCK_LICENSES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LicenseStatus | 'ALL'>('ALL');
  const [selected, setSelected] = useState<License | null>(null);

  const filtered = licenses.filter((l) => {
    const matchSearch = l.key.toLowerCase().includes(search.toLowerCase()) ||
      l.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      l.customerName.toLowerCase().includes(search.toLowerCase()) ||
      l.productName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleRevoke = (id: string) => {
    setLicenses((prev) => prev.map((l) => l.id === id ? { ...l, status: 'REVOKED' } : l));
    setSelected(null);
  };

  const handleRenew = (id: string) => {
    setLicenses((prev) => prev.map((l) => l.id === id ? { ...l, status: 'ACTIVE', expiresAt: null } : l));
    setSelected(null);
  };

  const stats = {
    total: licenses.length,
    active: licenses.filter(l => l.status === 'ACTIVE').length,
    expired: licenses.filter(l => l.status === 'EXPIRED').length,
    revoked: licenses.filter(l => l.status === 'REVOKED').length,
  };

  return (
    <main className="shell">
      <div className="wrap stack page-gap-lg">
        {/* Header */}
        <div>
          <span className="eyebrow">Admin / Licenses</span>
          <h1 className="h1">Licenses</h1>
          <p className="p p-lg text-white/50">Manage license keys, status, and entitlements.</p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-[360px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by key, email, name, product..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-[0.9rem] placeholder:text-white/30 focus:border-[#667eea] focus:outline-none focus:ring-1 focus:ring-[#667eea]/50 transition-all"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['ALL', 'ACTIVE', 'EXPIRED', 'REVOKED', 'PENDING'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-lg text-[0.82rem] font-semibold transition-all ${
                  statusFilter === s
                    ? 'bg-[#667eea] text-white'
                    : 'bg-white/[0.05] border border-white/10 text-white/60 hover:border-white/20 hover:text-white'
                }`}
              >
                {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5">
            <div className="text-[1.6rem] font-black text-white">{stats.total}</div>
            <div className="text-[0.8rem] text-white/50 mt-1">Total Licenses</div>
          </div>
          <div className="card p-5">
            <div className="text-[1.6rem] font-black text-green-400">{stats.active}</div>
            <div className="text-[0.8rem] text-white/50 mt-1">Active</div>
          </div>
          <div className="card p-5">
            <div className="text-[1.6rem] font-black text-red-400">{stats.expired}</div>
            <div className="text-[0.8rem] text-white/50 mt-1">Expired</div>
          </div>
          <div className="card p-5">
            <div className="text-[1.6rem] font-black text-yellow-400">{stats.revoked}</div>
            <div className="text-[0.8rem] text-white/50 mt-1">Revoked</div>
          </div>
        </div>

        {/* Table */}
        <section className="card card-strong overflow-hidden p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left px-5 py-4 text-[0.75rem] font-semibold text-white/50 uppercase tracking-wider">License Key</th>
                <th className="text-left px-5 py-4 text-[0.75rem] font-semibold text-white/50 uppercase tracking-wider hidden md:table-cell">Customer</th>
                <th className="text-left px-5 py-4 text-[0.75rem] font-semibold text-white/50 uppercase tracking-wider hidden lg:table-cell">Product</th>
                <th className="text-left px-5 py-4 text-[0.75rem] font-semibold text-white/50 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-4 text-[0.75rem] font-semibold text-white/50 uppercase tracking-wider hidden lg:table-cell">Tier</th>
                <th className="text-right px-5 py-4 text-[0.75rem] font-semibold text-white/50 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((license) => (
                <tr key={license.id} className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-mono text-[0.82rem] text-white/80">{license.key}</div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="font-semibold text-white text-[0.9rem]">{license.customerName || 'N/A'}</div>
                    <div className="text-[0.78rem] text-white/40">{license.customerEmail}</div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="font-semibold text-white text-[0.9rem]">{license.productName}</div>
                    <div className="text-[0.78rem] text-white/40">{license.activatedAccounts}/{license.maxAccounts} accounts</div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={license.status} />
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <TierBadge tier={license.accessTier} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelected(license)}
                      className="px-3 py-1.5 rounded-lg bg-[#667eea]/20 text-[#667eea] border border-[#667eea]/30 font-semibold text-[0.82rem] hover:bg-[#667eea]/30 transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-white/30 text-[0.9rem]">
              No licenses found
            </div>
          )}
        </section>
      </div>

      {/* Modal */}
      {selected && (
        <LicenseModal
          license={selected}
          onClose={() => setSelected(null)}
          onRevoke={handleRevoke}
          onRenew={handleRenew}
        />
      )}
    </main>
  );
}
