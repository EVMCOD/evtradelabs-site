import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="shell">
      <div className="wrap stack page-gap-lg text-center max-w-[480px] mx-auto py-20">
        <div className="text-[6rem] font-black text-white/10 leading-none select-none">
          404
        </div>
        <div>
          <h1 className="text-[1.8rem] font-black text-white mb-3">
            Página no encontrada
          </h1>
          <p className="text-white/50 text-[0.95rem]">
            La página que buscas no existe o ha sido movida.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-[#667eea] text-white font-semibold text-[0.88rem] hover:bg-[#5a7fd8] transition-colors"
          >
            Volver al inicio
          </Link>
          <Link
            href="/products"
            className="px-5 py-2.5 rounded-xl border border-white/10 text-white/60 font-semibold text-[0.88rem] hover:border-white/20 hover:text-white transition-all"
          >
            Ver productos
          </Link>
        </div>
      </div>
    </main>
  );
}
