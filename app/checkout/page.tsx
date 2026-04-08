'use client';

import { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  licenseType: string;
  quantity: number;
}

interface FormData {
  email: string;
  name: string;
  country: string;
  acceptTerms: boolean;
}

const MOCK_CART: CartItem[] = [
  { id: '1', name: 'Master of Liquidity', slug: 'master-of-liquidity', price: 249, currency: 'EUR', licenseType: 'Pro / Lifetime', quantity: 1 },
  { id: '2', name: 'Risk Manager Pro', slug: 'risk-manager-pro', price: 79, currency: 'EUR', licenseType: 'Core Access', quantity: 1 },
];

const COUNTRIES = ['España', 'United Kingdom', 'United States', 'Portugal', 'France', 'Germany', 'Italy', 'Netherlands', 'Other'];

function formatCurrency(amount: number, currency: string = 'EUR') {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(amount);
}

function OrderSummary({ items }: { items: CartItem[] }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.21);
  const total = subtotal + tax;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
      <h3 className="text-[1rem] font-bold text-white mb-5">Tu pedido</h3>
      
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-[0.95rem] truncate">{item.name}</div>
              <div className="text-[0.78rem] text-white/40 mt-0.5">{item.licenseType}</div>
            </div>
            <div className="text-white font-semibold shrink-0">
              {formatCurrency(item.price, item.currency)}
            </div>
          </div>
        ))}
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

      <div className="mt-5 p-3 rounded-xl bg-[#667eea]/10 border border-[#667eea]/20">
        <div className="flex items-center gap-2 text-[#667eea] text-[0.82rem]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1a6 6 0 1 0 0 12A6 6 0 0 0 7 1zm0 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 0 1-1-1h.1a1 1 0 0 1 1-1v2z" fill="currentColor"/>
          </svg>
          <span>Demo mode — no se realizará ningún cargo real</span>
        </div>
      </div>
    </div>
  );
}

function CheckoutForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const [form, setForm] = useState<FormData>({
    email: '',
    name: '',
    country: 'España',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!form.email || !form.email.includes('@')) newErrors.email = 'Email válido requerido';
    if (!form.name || form.name.length < 2) newErrors.name = 'Nombre requerido';
    if (!form.acceptTerms) newErrors.acceptTerms = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <label className="block text-[0.82rem] font-semibold text-white/70 mb-2">Email *</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="tu@email.com"
          className={`w-full px-4 py-3 rounded-xl bg-white/[0.05] border ${errors.email ? 'border-red-500/50' : 'border-white/10'} text-white text-[0.95rem] placeholder:text-white/25 focus:border-[#667eea] focus:outline-none focus:ring-1 focus:ring-[#667eea]/50 transition-all`}
        />
        {errors.email && <p className="text-red-400 text-[0.8rem] mt-1">{errors.email}</p>}
      </div>

      {/* Name */}
      <div>
        <label className="block text-[0.82rem] font-semibold text-white/70 mb-2">Nombre completo *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Carlos Martínez"
          className={`w-full px-4 py-3 rounded-xl bg-white/[0.05] border ${errors.name ? 'border-red-500/50' : 'border-white/10'} text-white text-[0.95rem] placeholder:text-white/25 focus:border-[#667eea] focus:outline-none focus:ring-1 focus:ring-[#667eea]/50 transition-all`}
        />
        {errors.name && <p className="text-red-400 text-[0.8rem] mt-1">{errors.name}</p>}
      </div>

      {/* Country */}
      <div>
        <label className="block text-[0.82rem] font-semibold text-white/70 mb-2">País</label>
        <select
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-[0.95rem] focus:border-[#667eea] focus:outline-none focus:ring-1 focus:ring-[#667eea]/50 transition-all appearance-none cursor-pointer"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%239fb2d4' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
        >
          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Payment */}
      <div>
        <label className="block text-[0.82rem] font-semibold text-white/70 mb-3">Método de pago</label>
        <div className="rounded-xl border-2 border-[#667eea] bg-[#667eea]/5 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded bg-[#635bff] flex items-center justify-center">
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                <rect width="20" height="14" rx="2" fill="white"/>
                <path d="M7 10.5L8.5 3.5H10.5L9 10.5H7ZM6.5 3.5L5 8.5L4.5 3.5H2.5L4 10.5H5.5L6 6.5L6.5 3.5H6.5ZM11.5 3.5L10 10.5H12.5L14.5 3.5H12.5L11.5 8L11.5 3.5ZM16.5 10.5L15 3.5H17.5L18 6L18.5 3.5H20L17.5 10.5H16.5Z" fill="#635bff"/>
              </svg>
            </div>
            <div>
              <div className="text-white font-semibold text-[0.9rem]">Tarjeta de crédito / débito</div>
              <div className="text-white/50 text-[0.78rem]">Visa, Mastercard, American Express</div>
            </div>
            <svg className="ml-auto text-[#667eea]" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M10 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.acceptTerms}
            onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })}
            className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/[0.05] text-[#667eea] focus:ring-[#667eea]/50 cursor-pointer"
          />
          <span className="text-[0.85rem] text-white/60 leading-relaxed">
            Acepto los{' '}
            <a href="/terms" className="text-[#667eea] hover:underline">términos y condiciones</a>
            {' '}y la{' '}
            <a href="/privacy" className="text-[#667eea] hover:underline">política de privacidad</a>
          </span>
        </label>
        {errors.acceptTerms && <p className="text-red-400 text-[0.8rem] mt-1">Debes aceptar los términos</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-4 rounded-xl bg-[#667eea] text-white font-bold text-[1rem] hover:bg-[#5a7fd8] transition-colors flex items-center justify-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12v8H2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M5 4V2.5a2.5 2.5 0 0 1 5 0V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Completar compra
      </button>
    </form>
  );
}

function SuccessScreen({ email, orderId }: { email: string; orderId: string }) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M6 14l5 5L22 8" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2 className="text-[1.4rem] font-black text-white mb-3">¡Compra completada!</h2>
      <p className="text-white/60 text-[0.95rem] mb-6">
        Tu licencia ha sido generada y enviada a <span className="text-white font-semibold">{email}</span>
      </p>
      <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] inline-block">
        <div className="text-[0.78rem] text-white/40 mb-1">Order ID</div>
        <div className="text-white font-mono font-semibold">{orderId}</div>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <a href="/account/downloads" className="px-6 py-3 rounded-xl bg-[#667eea] text-white font-semibold hover:bg-[#5a7fd8] transition-colors">
          Ver descargas
        </a>
        <a href="/" className="px-6 py-3 rounded-xl border border-white/10 text-white/60 font-semibold hover:border-white/20 hover:text-white transition-all">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [cart] = useState<CartItem[]>(MOCK_CART);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [orderId] = useState(() => 'EVTL-' + Math.random().toString(36).substring(2, 10).toUpperCase());
  const [customerEmail] = useState('');

  const handleSubmit = (data: FormData) => {
    console.log('Demo checkout:', { ...data, orderId, items: cart });
    setCustomerEmail(data.email);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <main className="shell">
        <div className="wrap stack page-gap-lg max-w-[560px] mx-auto">
          <div className="card card-strong p-8">
            <SuccessScreen email={customerEmail} orderId={orderId} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="shell">
      <div className="wrap page-gap-lg">
        {/* Header */}
        <div>
          <h1 className="h1">Checkout</h1>
          <p className="p p-lg text-white/50">Completa tu pedido para recibir tu licencia</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Form */}
          <div className="card card-strong p-6">
            <h2 className="text-[1.1rem] font-bold text-white mb-6">Datos de compra</h2>
            <CheckoutForm onSubmit={handleSubmit} />
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8">
            <OrderSummary items={cart} />
          </div>
        </div>
      </div>
    </main>
  );
}
