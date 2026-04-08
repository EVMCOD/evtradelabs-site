'use client';

import { useState } from 'react';

type AccessTier = 'Core Access' | 'Studio License' | 'Pro / Lifetime';
type EntityStatus = 'Live' | 'Beta' | 'Curated';

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  accessTier: AccessTier;
  status: EntityStatus;
  productType: string;
  createdAt: string;
}

const MOCK_PRODUCTS: ProductRow[] = [
  { id: '1', name: 'Master of Liquidity', slug: 'master-of-liquidity', price: 249, currency: 'EUR', accessTier: 'Pro / Lifetime', status: 'Live', productType: 'EA Bundle', createdAt: '2024-11-15' },
  { id: '2', name: 'EV Quant Lab', slug: 'ev-quant-lab', price: 149, currency: 'EUR', accessTier: 'Studio License', status: 'Live', productType: 'Indicator Suite', createdAt: '2024-10-20' },
  { id: '3', name: 'Risk Manager Pro', slug: 'risk-manager-pro', price: 79, currency: 'EUR', accessTier: 'Core Access', status: 'Live', productType: 'Risk Tool', createdAt: '2024-09-10' },
  { id: '4', name: 'Multi-Signal Engine', slug: 'multi-signal-engine', price: 199, currency: 'EUR', accessTier: 'Pro / Lifetime', status: 'Beta', productType: 'Signal Tool', createdAt: '2025-01-08' },
  { id: '5', name: 'Portfolio Builder', slug: 'portfolio-builder', price: 299, currency: 'EUR', accessTier: 'Pro / Lifetime', status: 'Curated', productType: 'Builder', createdAt: '2025-02-01' },
];

const ACCESS_TIERS: AccessTier[] = ['Core Access', 'Studio License', 'Pro / Lifetime'];
const STATUSES: EntityStatus[] = ['Live', 'Beta', 'Curated'];
const PRODUCT_TYPES = ['EA Bundle', 'Indicator Suite', 'Risk Tool', 'Signal Tool', 'Builder', 'Template'];

function StatusBadge({ status }: { status: EntityStatus }) {
  const colors = {
    Live: 'bg-green-500/20 text-green-400 border-green-500/30',
    Beta: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Curated: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.72rem] font-semibold border ${colors[status]}`}>
      {status}
    </span>
  );
}

function TierBadge({ tier }: { tier: AccessTier }) {
  const colors = {
    'Core Access': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Studio License': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    'Pro / Lifetime': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.72rem] font-semibold border ${colors[tier]}`}>
      {tier}
    </span>
  );
}

function ProductForm({ product, onSave, onCancel }: { product?: ProductRow; onSave: (p: ProductRow) => void; onCancel: () => void }) {
  const [form, setForm] = useState<ProductRow>(product || {
    id: String(Date.now()),
    name: '',
    slug: '',
    price: 0,
    currency: 'EUR',
    accessTier: 'Core Access',
    status: 'Live',
    productType: 'EA Bundle',
    createdAt: new Date().toISOString().split('T')[0],
  });

  const handleSave = () => {
    if (!form.name || !form.slug) return;
    onSave(form);
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[0.8rem] font-semibold text-white/60 mb-1.5">Product Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-[0.95rem] focus:border-[#667eea] focus:outline-none focus:ring-1 focus:ring-[#667eea]/50 transition-all"
            placeholder="e.g. Master of Liquidity"
          />
        </div>
        <div>
          <label className="block text-[0.8rem] font-semibold text-white/60 mb-1.5">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-[0.95rem] font-mono focus:border-[#667eea] focus:outline-none focus:ring-1 focus:ring-[#667eea]/50 transition-all"
            placeholder="master-of-liquidity"
          />
        </div>
        <div>
          <label className="block text-[0.8rem] font-semibold text-white/60 mb-1.5">Price (EUR)</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-[0.95rem] focus:border-[#667eea] focus:outline-none focus:ring-1 focus:ring-[#667eea]/50 transition-all"
          />
        </div>
        <div>
          <label className="block text-[0.8rem] font-semibold text-white/60 mb-1.5">Access Tier</label>
          <select
            value={form.accessTier}
            onChange={(e) => setForm({ ...form, accessTier: e.target.value as AccessTier })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-[0.95rem] focus:border-[#667eea] focus:outline-none focus:ring-1 focus:ring-[#667eea]/50 transition-all"
          >
            {ACCESS_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[0.8rem] font-semibold text-white/60 mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as EntityStatus })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-[0.95rem] focus:border-[#667eea] focus:outline-none focus:ring-1 focus:ring-[#667eea]/50 transition-all"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[0.8rem] font-semibold text-white/60 mb-1.5">Product Type</label>
          <select
            value={form.productType}
            onChange={(e) => setForm({ ...form, productType: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-[0.95rem] focus:border-[#667eea] focus:outline-none focus:ring-1 focus:ring-[#667eea]/50 transition-all"
          >
            {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-[#667eea] text-white font-semibold text-[0.9rem] hover:bg-[#5a7fd8] transition-colors"
        >
          {product ? 'Update Product' : 'Create Product'}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-white/10 text-white/60 font-semibold text-[0.9rem] hover:border-white/20 hover:text-white transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>(MOCK_PRODUCTS);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (product: ProductRow) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.map((p) => (p.id === product.id ? product : p));
      return [...prev, product];
    });
    setShowForm(false);
    setEditing(null);
  };

  return (
    <main className="shell">
      <div className="wrap stack page-gap-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="eyebrow">Admin / Products</span>
            <h1 className="h1">Products</h1>
            <p className="p p-lg text-white/50">Manage your product catalog, pricing, and access tiers.</p>
          </div>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-[#667eea] text-white font-semibold text-[0.9rem] hover:bg-[#5a7fd8] transition-colors flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Product
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-[360px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-[0.9rem] placeholder:text-white/30 focus:border-[#667eea] focus:outline-none focus:ring-1 focus:ring-[#667eea]/50 transition-all"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Form */}
        {showForm && (
          <section className="card card-strong stack">
            <h2 className="text-[1rem] font-bold text-white">{editing ? 'Edit Product' : 'New Product'}</h2>
            <ProductForm product={editing || undefined} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
          </section>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5">
            <div className="text-[1.6rem] font-black text-white">{products.length}</div>
            <div className="text-[0.8rem] text-white/50 mt-1">Total Products</div>
          </div>
          <div className="card p-5">
            <div className="text-[1.6rem] font-black text-green-400">{products.filter(p => p.status === 'Live').length}</div>
            <div className="text-[0.8rem] text-white/50 mt-1">Live</div>
          </div>
          <div className="card p-5">
            <div className="text-[1.6rem] font-black text-yellow-400">{products.filter(p => p.status === 'Beta').length}</div>
            <div className="text-[0.8rem] text-white/50 mt-1">Beta</div>
          </div>
          <div className="card p-5">
            <div className="text-[1.6rem] font-black text-[#667eea]">€{products.reduce((s, p) => s + p.price, 0)}</div>
            <div className="text-[0.8rem] text-white/50 mt-1">Total Value</div>
          </div>
        </div>

        {/* Table */}
        <section className="card card-strong overflow-hidden p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left px-5 py-4 text-[0.75rem] font-semibold text-white/50 uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-4 text-[0.75rem] font-semibold text-white/50 uppercase tracking-wider hidden md:table-cell">Type</th>
                <th className="text-left px-5 py-4 text-[0.75rem] font-semibold text-white/50 uppercase tracking-wider hidden lg:table-cell">Access Tier</th>
                <th className="text-left px-5 py-4 text-[0.75rem] font-semibold text-white/50 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-4 text-[0.75rem] font-semibold text-white/50 uppercase tracking-wider">Price</th>
                <th className="text-right px-5 py-4 text-[0.75rem] font-semibold text-white/50 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white text-[0.95rem]">{product.name}</div>
                    <div className="text-[0.78rem] text-white/40 font-mono mt-0.5">{product.slug}</div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-[0.85rem] text-white/60">{product.productType}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <TierBadge tier={product.accessTier} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-semibold text-white">€{product.price}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditing(product); setShowForm(true); }}
                        className="p-2 rounded-lg hover:bg-white/[0.08] transition-colors text-white/50 hover:text-white"
                        title="Edit"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M9.5 2L12 4.5L5 11.5H2.5V9L9.5 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => setProducts(prev => prev.filter(p => p.id !== product.id))}
                        className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-white/30 hover:text-red-400"
                        title="Delete"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 4h10M5 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M11 4v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-white/30 text-[0.9rem]">
              No products found
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
