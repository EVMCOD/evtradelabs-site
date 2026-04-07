'use client'

import { useState } from 'react'
import { Card3DHover, ScrollReveal, MagneticButton } from "@/components/ui/premium-effects"

type Currency = 'EUR' | 'USD' | 'GBP'

const exchangeRates: Record<Currency, number> = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.85,
}

const currencySymbols: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
}

const products = [
  {
    name: "EV Quant Lab",
    description: "Tu estación de trading cuantitativo. Construye, valida y optimiza estrategias como un profesional.",
    monthlyBase: 99.99,
    lifetimeBase: 4999.99,
    features: [
      "Visual Strategy Builder",
      "Backtest Engine con tick data",
      "Genetic Algorithm para discovery",
      "Walk-Forward Analysis",
      "Portfolio Lab",
      "ML Lab",
      "Advanced Execution (TWAP, VWAP...)",
      "Risk Management completo",
      "Live Trading (Oanda, IB, Alpaca, Binance)",
      "100% local en tu máquina",
      "Sin coste de datos",
    ],
    badge: "Herramienta profesional",
    color: "#10b981",
    highlighted: true,
  },
  {
    name: "Master of Liquidity",
    description: "Sistema multi-estrategia para MT5. 8 estrategias integradas con gestión de riesgo avanzada.",
    monthlyBase: 48.99,
    lifetimeBase: 1199.99,
    features: [
      "8 estrategias integradas",
      "Arquitectura multi-estrategia",
      "Gestión de riesgo avanzada",
      "Compatible con MT5",
      "Ejecución estructurada",
      "Reporting de rendimiento",
      "Soporte prioritario",
    ],
    badge: "MT5 EA",
    color: "#667eea",
    highlighted: false,
  },
]

const replicationTiers = [
  {
    name: "3 Accounts",
    priceBase: 18.99,
    description: "Perfecto para empezar con réplica básica.",
    features: ["3 cuentas MT5", "Replicación en tiempo real", "Risk profiles por cuenta", "Protección daily loss"],
  },
  {
    name: "5 Accounts",
    priceBase: 29.99,
    description: "Para traders con múltiples cuentas.",
    features: ["5 cuentas MT5", "Replicación en tiempo real", "Risk profiles por cuenta", "Protección daily loss", "Soporte prioritario"],
  },
]

function formatPrice(amount: number, currency: Currency): string {
  const symbol = currencySymbols[currency]
  const converted = amount * exchangeRates[currency]
  return `${symbol}${converted.toFixed(2)}`
}

export default function PricingSection() {
  const [currency, setCurrency] = useState<Currency>('EUR')

  return (
    <section id="precios" className="section-shell py-24 bg-transparent">
      <div className="w-full max-w-[1200px] mx-auto px-5">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#667eea] mb-4">
              Precios transparentes
            </span>
            <h2 className="m-0 text-[clamp(2rem,4.5vw,3.2rem)] font-black leading-[1.02] tracking-[-0.05em] text-white text-balance max-w-[700px] mx-auto">
              Elige tu plan y empieza a operar con estructura
            </h2>
            <p className="mt-6 text-[1rem] leading-[1.85] text-[#9fb2d4] max-w-[580px] mx-auto">
              Sin sorpresas. Sin fees ocultos. Cancela cuando quieras.
            </p>
            
            {/* Currency Selector */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <span className="text-sm text-[#8da0c2]">Moneda:</span>
              <div className="inline-flex rounded-lg bg-white/5 border border-white/10 p-1">
                {(['EUR', 'USD', 'GBP'] as Currency[]).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      currency === curr
                        ? 'bg-[#667eea] text-white shadow-lg'
                        : 'text-[#8da0c2] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {curr === 'EUR' ? '🇪🇺 EUR' : curr === 'USD' ? '🇺🇸 USD' : '🇬🇧 GBP'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Products */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {products.map((product, i) => (
            <ScrollReveal key={product.name} animation="fadeInUp" delay={i * 100}>
              <Card3DHover intensity={8}>
                <div 
                  className={`relative p-8 rounded-3xl border transition-all duration-500 ${
                    product.highlighted 
                      ? 'border-[#10b981]/40 bg-gradient-to-br from-[#10b981]/10 to-transparent' 
                      : 'border-white/10 bg-[rgba(17,26,45,0.5)]'
                  }`}
                  style={{
                    boxShadow: product.highlighted ? '0 30px 80px rgba(16, 185, 129, 0.15)' : undefined
                  }}
                >
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span 
                      className="text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full"
                      style={{ 
                        color: product.color, 
                        backgroundColor: `${product.color}15`,
                        border: `1px solid ${product.color}30`
                      }}
                    >
                      {product.badge}
                    </span>
                    {product.highlighted && (
                      <span className="text-xs font-semibold text-[#10b981] px-3 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20">
                        Más popular
                      </span>
                    )}
                  </div>

                  {/* Product Name */}
                  <h3 className="text-2xl font-black text-white mb-2">{product.name}</h3>
                  <p className="text-[0.9rem] text-[#8da0c2] mb-6">{product.description}</p>

                  {/* Pricing */}
                  <div className="flex items-end gap-6 mb-8">
                    <div>
                      <div className="text-4xl font-black" style={{ color: product.color }}>
                        {formatPrice(product.monthlyBase, currency)}
                        <span className="text-base font-normal text-[#8da0c2]">/mes</span>
                      </div>
                    </div>
                    <div className="pb-1">
                      <div className="text-lg font-bold text-white">
                        {formatPrice(product.lifetimeBase, currency)}
                      </div>
                      <div className="text-xs text-[#8da0c2]">pago único (lifetime)</div>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-[#c7d5eb]">
                        <svg 
                          className="w-5 h-5 shrink-0 mt-0.5" 
                          style={{ color: product.color }}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <MagneticButton 
                      href="#contacto" 
                      variant={product.highlighted ? "primary" : "secondary"} 
                      size="md"
                    >
                      Empezar ahora
                    </MagneticButton>
                    <MagneticButton href="#faq" variant="secondary" size="md">
                      Saber más
                    </MagneticButton>
                  </div>
                </div>
              </Card3DHover>
            </ScrollReveal>
          ))}
        </div>

        {/* Replication Add-on */}
        <ScrollReveal animation="fadeInUp">
          <div className="rounded-3xl border border-[#3b82f6]/20 bg-gradient-to-br from-[#3b82f6]/5 to-transparent p-8 md:p-12">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-semibold tracking-wider uppercase text-[#3b82f6] mb-3 px-3 py-1.5 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20">
                Add-on
              </span>
              <h3 className="text-2xl font-black text-white mb-2">Replication</h3>
              <p className="text-[#9fb2d4] text-sm max-w-[500px] mx-auto">
                Réplica automática de posiciones entre cuentas MT5. Configura el ratio, el risk profile y deja que el sistema replique por ti.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
              {replicationTiers.map((tier) => (
                <div 
                  key={tier.name}
                  className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,26,45,0.6)] hover:border-[#3b82f6]/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-white">{tier.name}</h4>
                    <div className="text-2xl font-black text-[#3b82f6]">
                      {formatPrice(tier.priceBase, currency)}<span className="text-sm font-normal text-[#8da0c2]">/mes</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#8da0c2] mb-4">{tier.description}</p>
                  <ul className="space-y-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-[#c7d5eb]">
                        <svg className="w-4 h-4 shrink-0 mt-0.5 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <MagneticButton href="#contacto" variant="secondary" size="sm">
                      Seleccionar
                    </MagneticButton>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-xs text-[#8da0c2]">
                ¿Necesitas más cuentas? <span className="text-[#3b82f6]">Contacta</span> para pricing personalizado.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* FAQ Mini */}
        <ScrollReveal animation="fadeInUp">
          <div className="mt-12 text-center">
            <p className="text-[#8da0c2] mb-4">¿Preguntas sobre precios?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton href="#faq" variant="secondary" size="md">
                Ver FAQ
              </MagneticButton>
              <MagneticButton href="#contacto" variant="secondary" size="md">
                Hablar con nosotros
              </MagneticButton>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
