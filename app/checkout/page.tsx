'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface FormData {
  email: string;
  name: string;
  country: string;
  acceptTerms: boolean;
}

const COUNTRIES = ['España', 'United Kingdom', 'United States', 'Portugal', 'France', 'Germany', 'Italy', 'Netherlands', 'Other'];

const PRODUCT_PRICES: Record<string, { monthly: number; name: string }> = {
  "ev-quant-lab": { monthly: 9999, name: "EV Quant Lab" },
  "master-of-liquidity": { monthly: 4899, name: "Master of Liquidity" },
  "replicador": { monthly: 1899, name: "Replicador" },
  "local-app": { monthly: 7900, name: "Local App" },
};

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

function OrderSummary({ slug, quantity = 1 }: { slug: string; quantity?: number }) {
  const product = PRODUCT_PRICES[slug];
  if (!product) return null;
  const subtotal = product.monthly * quantity;
  const tax = Math.round(subtotal * 0.21);
  const total = subtotal + tax;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
      <h3 className="text-[1rem] font-bold text-white mb-5">Tu pedido</h3>
      <div className="space-y-4 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white text-[0.95rem]">{product.name}</div>
            <div className="text-[0.78rem] text-white/40 mt-0.5">Suscripción mensual</div>
          </div>
          <div className="text-white font-semibold shrink-0">
            {formatCurrency(product.monthly)}
          </div>
        </div>
      </div>
      <div className="border-t border-white/[0.08] pt-4 space-y-2">
        <div className="flex justify-between text-[0.9rem]">
          <span className="text-white/60">Subtotal</span>
          <span className="text-white">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[0.9rem]">
          <span className="text-white/60">IVA (21%)</span>
          <span className="text-white">{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between text-[1.05rem] font-bold pt-2 border-t border-white/[0.08]">
          <span className="text-white">Total</span>
          <span className="text-[#667eea]">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [productSlug] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('product') || 'master-of-liquidity';
    }
    return 'master-of-liquidity';
  });
  const [form, setForm] = useState<FormData>({
    email: '',
    name: '',
    country: 'España',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [orderId] = useState(() => 'EVTL-' + Math.random().toString(36).substring(2, 10).toUpperCase());

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!form.email || !form.email.includes('@')) newErrors.email = 'Email válido requerido';
    if (!form.name || form.name.length < 2) newErrors.name = 'Nombre requerido';
    if (!form.acceptTerms) newErrors.acceptTerms = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug,
          email: form.email,
          name: form.name,
          country: form.country,
        }),
      });
      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setStep('payment');
      } else {
        setErrors({ email: data.error || 'Error al procesar' });
      }
    } catch (err) {
      setErrors({ email: 'Error de conexión' });
    }
    setLoading(false);
  };

  const handlePayment = async () => {
    setLoading(true);
    const stripe = await stripePromise;
    if (!stripe || !clientSecret) {
      setErrors({ email: 'Stripe no disponible' });
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        billing_details: { name: form.name, email: form.email },
      },
    });

    if (error) {
      setErrors({ email: error.message || 'Error en el pago' });
    } else if (paymentIntent?.status === 'succeeded') {
      setStep('success');
    }
    setLoading(false);
  };

  if (step === 'success') {
    return (
      <main className="shell">
        <div className="wrap stack page-gap-lg max-w-[560px] mx-auto">
          <div className="card card-strong p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M6 14l5 5L22 8" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-[1.4rem] font-black text-white mb-3">¡Pago completado!</h2>
            <p className="text-white/60 text-[0.95rem] mb-6">
              Tu licencia ha sido generada y enviada a <span className="text-white font-semibold">{form.email}</span>
            </p>
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] inline-block mb-8">
              <div className="text-[0.78rem] text-white/40 mb-1">Order ID</div>
              <div className="text-white font-mono font-semibold">{orderId}</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/account/downloads" className="px-6 py-3 rounded-xl bg-[#667eea] text-white font-semibold hover:bg-[#5a7fd8] transition-colors">
                Ver descargas
              </Link>
              <Link href="/" className="px-6 py-3 rounded-xl border border-white/10 text-white/60 font-semibold hover:border-white/20 hover:text-white transition-all">
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="shell">
      <div className="wrap page-gap-lg">
        <div>
          <h1 className="h1">Checkout</h1>
          <p className="p p-lg text-white/50">Completa tu pedido para recibir tu licencia</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Form */}
          <div className="card card-strong p-6">
            {step === 'form' ? (
              <form onSubmit={handleContinue} className="space-y-6">
                <div>
                  <label className="block text-[0.82rem] font-semibold text-white/70 mb-2">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@email.com"
                    className={`w-full px-4 py-3 rounded-xl bg-white/[0.05] border ${errors.email ? 'border-red-500/50' : 'border-white/10'} text-white text-[0.95rem] placeholder:text-white/25 focus:border-[#667eea] focus:outline-none focus:ring-1 focus:ring-[#667eea]/50 transition-all`}
                  />
                  {errors.email && <p className="text-red-400 text-[0.8rem] mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-[0.82rem] font-semibold text-white/70 mb-2">Nombre completo *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Carlos Martínez"
                    className={`w-full px-4 py-3 rounded-xl bg-white/[0.05] border ${errors.name ? 'border-red-500/50' : 'border-white/10'} text-white text-[0.95rem] placeholder:text-white/25 focus:border-[#667eea] focus:outline-none focus:ring-1 focus:ring-[#667eea]/50 transition-all`}
                  />
                  {errors.name && <p className="text-red-400 text-[0.8rem] mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-[0.82rem] font-semibold text-white/70 mb-2">País</label>
                  <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-[0.95rem] focus:border-[#667eea] focus:outline-none focus:ring-1 focus:ring-[#667eea]/50 transition-all appearance-none cursor-pointer">
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.acceptTerms} onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/[0.05] text-[#667eea] cursor-pointer" />
                    <span className="text-[0.85rem] text-white/60 leading-relaxed">
                      Acepto los{' '}<Link href="/terms" className="text-[#667eea] hover:underline">términos y condiciones</Link>{' '}y la{' '}<Link href="/privacy" className="text-[#667eea] hover:underline">política de privacidad</Link>
                    </span>
                  </label>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl bg-[#667eea] text-white font-bold text-[1rem] hover:bg-[#5a7fd8] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? 'Procesando...' : 'Continuar al pago'}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <button onClick={() => setStep('form')} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <span className="text-[0.88rem] text-white/50">Volver</span>
                </div>

                <div className="p-4 rounded-xl bg-[#667eea]/10 border border-[#667eea]/20 text-[#667eea] text-[0.88rem]">
                  Pago seguro con Stripe · Tus datos de tarjeta nunca tocan nuestro servidor
                </div>

                {errors.email && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[0.88rem]">
                    {errors.email}
                  </div>
                )}

                <button onClick={handlePayment} disabled={loading}
                  className="w-full py-4 rounded-xl bg-[#667eea] text-white font-bold text-[1rem] hover:bg-[#5a7fd8] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? 'Procesando pago...' : 'Pagar ahora'}
                </button>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 text-[0.82rem] text-white/40">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M1 6h14" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                    <span>Pago 100% seguro</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8">
            <OrderSummary slug={productSlug} />
          </div>
        </div>
      </div>
    </main>
  );
}
