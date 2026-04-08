import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mi Cuenta — EV Trading Labs",
  description:
    "Gestiona tus licencias, descargas y productos de EV Trading Labs.",
};

const MOCK_LICENSES = [
  {
    id: "lic_001",
    product: "Master of Liquidity",
    slug: "master-of-liquidity",
    key: "EVTL-MOL-8472-XKQ9-PR0L",
    tier: "Pro / Lifetime",
    status: "ACTIVE",
    activatedAt: "2024-11-15",
    expiresAt: null,
    maxAccounts: 3,
    usedAccounts: 2,
  },
  {
    id: "lic_002",
    product: "EV Quant Lab",
    slug: "ev-quant-lab",
    key: "EVTL-EQL-2931-MNB5-VC8Y",
    tier: "Pro / Lifetime",
    status: "ACTIVE",
    activatedAt: "2024-10-20",
    expiresAt: null,
    maxAccounts: 1,
    usedAccounts: 1,
  },
];

const MOCK_DOWNLOADS = [
  {
    id: "dl_001",
    product: "Master of Liquidity",
    slug: "master-of-liquidity",
    version: "2.4.1",
    updatedAt: "2025-01-10",
    files: [
      { name: "MasterOfLiquidity_v2.4.1.ex5", size: "2.3 MB" },
      { name: "Setup_Guide_v2.pdf", size: "1.1 MB" },
      { name: "Config_Profile.evtl", size: "48 KB" },
    ],
  },
  {
    id: "dl_002",
    product: "EV Quant Lab",
    slug: "ev-quant-lab",
    version: "1.8.0",
    updatedAt: "2025-01-08",
    files: [
      { name: "EVQuantLab_v1.8.0.setup.exe", size: "14.2 MB" },
      { name: "Quick_Start_Guide.pdf", size: "2.4 MB" },
      { name: "Templates_Pack.zip", size: "8.7 MB" },
    ],
  },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ACTIVE: "bg-green-500/20 text-green-400 border-green-500/30",
    EXPIRED: "bg-red-500/20 text-red-400 border-red-500/30",
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.72rem] font-semibold border ${colors[status] || colors.PENDING}`}>
      {status === "ACTIVE" ? "Activa" : status === "EXPIRED" ? "Expirada" : "Pendiente"}
    </span>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    "Core Access": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Studio License": "bg-violet-500/20 text-violet-400 border-violet-500/30",
    "Pro / Lifetime": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.72rem] font-semibold border ${colors[tier] || ""}`}>
      {tier}
    </span>
  );
}

function LicenseCard({ license }: { license: typeof MOCK_LICENSES[0] }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[1.05rem] font-bold text-white">{license.product}</h3>
          <p className="text-[0.8rem] text-white/40 font-mono mt-1">{license.key}</p>
        </div>
        <StatusBadge status={license.status} />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
          <div className="text-[1.1rem] font-black text-white">{license.usedAccounts}</div>
          <div className="text-[0.7rem] text-white/40 mt-0.5">Usadas</div>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
          <div className="text-[1.1rem] font-black text-[#667eea]">{license.maxAccounts}</div>
          <div className="text-[0.7rem] text-white/40 mt-0.5">Máximo</div>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
          <div className="text-[1.1rem] font-black text-white">
            {license.expiresAt ? new Date(license.expiresAt).toLocaleDateString("es-ES", { month: "short", year: "numeric" }) : "∞"}
          </div>
          <div className="text-[0.7rem] text-white/40 mt-0.5">Expira</div>
        </div>
      </div>

      <div className="flex gap-3">
        <TierBadge tier={license.tier} />
        <span className="text-[0.75rem] text-white/30">Activada: {new Date(license.activatedAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}</span>
      </div>
    </div>
  );
}

function DownloadCard({ download }: { download: typeof MOCK_DOWNLOADS[0] }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[1rem] font-bold text-white">{download.product}</h3>
          <p className="text-[0.78rem] text-white/40 mt-1">
            v{download.version} · Actualizado {new Date(download.updatedAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
        </div>
        <Link
          href={`/account/downloads/${download.slug}`}
          className="px-4 py-2 rounded-xl bg-[#667eea]/20 border border-[#667eea]/30 text-[#667eea] font-semibold text-[0.82rem] hover:bg-[#667eea]/30 transition-colors"
        >
          Descargar
        </Link>
      </div>

      <div className="space-y-2">
        {download.files.map((file) => (
          <div key={file.name} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="flex items-center gap-3">
              <span className="text-lg">
                {file.name.endsWith(".ex5") ? "📦" : file.name.endsWith(".pdf") ? "📄" : "📁"}
              </span>
              <span className="text-[0.88rem] text-white/70 font-mono">{file.name}</span>
            </div>
            <span className="text-[0.78rem] text-white/30">{file.size}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <main className="shell">
      <div className="wrap stack page-gap-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="eyebrow">Tu cuenta</span>
            <h1 className="h1">Mis productos</h1>
            <p className="p p-lg text-white/50">
              Licencias activas y descargas disponibles.
            </p>
          </div>
          <Link
            href="/products"
            className="px-4 py-2 rounded-xl border border-white/10 text-white/60 font-semibold text-[0.85rem] hover:border-white/20 hover:text-white transition-all"
          >
            Explorar más productos
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5">
            <div className="text-[1.6rem] font-black text-white">{MOCK_LICENSES.length}</div>
            <div className="text-[0.8rem] text-white/50 mt-1">Productos activos</div>
          </div>
          <div className="card p-5">
            <div className="text-[1.6rem] font-black text-green-400">
              {MOCK_LICENSES.filter((l) => l.status === "ACTIVE").length}
            </div>
            <div className="text-[0.8rem] text-white/50 mt-1">Licencias activas</div>
          </div>
          <div className="card p-5">
            <div className="text-[1.6rem] font-black text-[#667eea]">{MOCK_DOWNLOADS.length}</div>
            <div className="text-[0.8rem] text-white/50 mt-1">Descargas disponibles</div>
          </div>
          <div className="card p-5">
            <div className="text-[1.6rem] font-black text-white">
              {MOCK_LICENSES.reduce((sum, l) => sum + l.maxAccounts, 0)}
            </div>
            <div className="text-[0.8rem] text-white/50 mt-1">Cuentas total</div>
          </div>
        </div>

        {/* Licenses */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[1.1rem] font-bold text-white">Licencias</h2>
            <span className="text-[0.82rem] text-white/40">{MOCK_LICENSES.length} activas</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {MOCK_LICENSES.map((license) => (
              <LicenseCard key={license.id} license={license} />
            ))}
          </div>
        </div>

        {/* Downloads */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[1.1rem] font-bold text-white">Descargas</h2>
            <span className="text-[0.82rem] text-white/40">{MOCK_DOWNLOADS.length} productos</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {MOCK_DOWNLOADS.map((download) => (
              <DownloadCard key={download.id} download={download} />
            ))}
          </div>
        </div>

        {/* Help */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-[1rem] font-bold text-white mb-1">¿Necesitas ayuda?</h3>
              <p className="text-[0.88rem] text-white/50">
                Contacta con soporte para activaciones, renovaciones o problemas con licencias.
              </p>
            </div>
            <Link
              href="mailto:support@evtradelabs.com"
              className="px-5 py-2.5 rounded-xl bg-[#667eea] text-white font-semibold text-[0.88rem] hover:bg-[#5a7fd8] transition-colors whitespace-nowrap"
            >
              Contactar soporte
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
