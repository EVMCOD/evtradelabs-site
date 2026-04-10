"use client";

import { useState } from "react";
import { Download, Monitor, Smartphone, Globe, Check, ChevronDown, ChevronUp } from "lucide-react";

const plans = [
  {
    name: "Windows",
    icon: Monitor,
    versions: [
      { os: "Windows 10 (64-bit)", size: "180 MB", status: "available" },
      { os: "Windows 11 (64-bit)", size: "180 MB", status: "available" },
    ],
  },
  {
    name: "macOS",
    icon: Monitor,
    versions: [
      { os: "macOS 12 (Monterey)+", size: "150 MB", status: "available" },
      { os: "macOS Apple Silicon", size: "150 MB", status: "available" },
    ],
  },
  {
    name: "Linux",
    icon: Globe,
    versions: [
      { os: "Ubuntu 20.04+ (64-bit)", size: "120 MB", status: "available" },
      { os: "Debian/Ubuntu (ARM64)", size: "120 MB", status: "available" },
    ],
  },
];

const features = [
  "Descarga datos de mercado en tiempo real",
  "Sincronización automática con tu cuenta EV Trading Labs",
  "Backtesting local con datos históricos",
  "Ejecución de estrategias en papel (paper trading)",
  "Gestión de múltiples cuentas MT5",
  "Notificaciones de escritorio",
  "Modo offline para análisis",
];

export default function LocalAppPage() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e17", color: "#e2e8f0" }}>
      {/* Hero Section */}
      <section style={{
        padding: "100px 20px 60px",
        textAlign: "center",
        background: "linear-gradient(180deg, #0d1117 0%, #0a0e17 100%)"
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 16px",
          borderRadius: "20px",
          background: "rgba(56, 189, 248, 0.1)",
          border: "1px solid rgba(56, 189, 248, 0.3)",
          marginBottom: "24px"
        }}>
          <Monitor size={16} style={{ color: "#38bdf8" }} />
          <span style={{ color: "#38bdf8", fontSize: "12px", fontWeight: 600 }}>LOCAL APP</span>
        </div>

        <h1 style={{
          fontSize: "clamp(32px, 5vw, 56px)",
          fontWeight: 700,
          marginBottom: "20px",
          background: "linear-gradient(135deg, #fff 0%, #94a3b8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          EV Trading Labs
          <br />
          <span style={{ color: "#38bdf8" }}>Desktop App</span>
        </h1>

        <p style={{
          fontSize: "18px",
          color: "#94a3b8",
          maxWidth: "600px",
          margin: "0 auto 40px",
          lineHeight: 1.7
        }}>
          Descarga la aplicación de escritorio y acceder a herramientas avanzadas de trading desde tu ordenador, 
          con datos en tiempo real y ejecución local.
        </p>

        <div style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <button style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 28px",
            background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
            color: "#0a0e17",
            fontWeight: 700,
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer"
          }}>
            <Download size={18} />
            Descargar para Windows
          </button>
          <button style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 28px",
            background: "transparent",
            color: "#fff",
            fontWeight: 600,
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.2)",
            cursor: "pointer"
          }}>
            Ver todas las versiones
          </button>
        </div>
      </section>

      {/* OS Selection */}
      <section style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{
          fontSize: "24px",
          fontWeight: 700,
          marginBottom: "24px",
          textAlign: "center"
        }}>
          Selecciona tu sistema operativo
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {plans.map((plan) => (
            <div key={plan.name} style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              overflow: "hidden"
            }}>
              <button
                onClick={() => toggleAccordion(plan.name)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px",
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <plan.icon size={24} style={{ color: "#38bdf8" }} />
                  <span style={{ fontSize: "18px", fontWeight: 600 }}>{plan.name}</span>
                </div>
                {openAccordion === plan.name ? (
                  <ChevronUp size={20} style={{ color: "#94a3b8" }} />
                ) : (
                  <ChevronDown size={20} style={{ color: "#94a3b8" }} />
                )}
              </button>

              {openAccordion === plan.name && (
                <div style={{
                  padding: "0 24px 20px",
                  borderTop: "1px solid rgba(255,255,255,0.1)"
                }}>
                  {plan.versions.map((version, idx) => (
                    <div key={idx} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 0",
                      borderBottom: idx < plan.versions.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none"
                    }}>
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: "4px" }}>{version.os}</div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>{version.size}</div>
                      </div>
                      <button style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 16px",
                        background: "rgba(56, 189, 248, 0.1)",
                        border: "1px solid rgba(56, 189, 248, 0.3)",
                        borderRadius: "6px",
                        color: "#38bdf8",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}>
                        <Download size={14} />
                        Descargar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "60px 20px", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{
          fontSize: "24px",
          fontWeight: 700,
          marginBottom: "32px",
          textAlign: "center"
        }}>
          Características de la App
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px"
        }}>
          {features.map((feature, idx) => (
            <div key={idx} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "16px",
              background: "rgba(15, 23, 42, 0.6)",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.05)"
            }}>
              <div style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "rgba(56, 189, 248, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <Check size={14} style={{ color: "#38bdf8" }} />
              </div>
              <span style={{ fontSize: "14px", lineHeight: 1.5 }}>{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "60px 20px",
        textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)"
      }}>
        <h2 style={{
          fontSize: "28px",
          fontWeight: 700,
          marginBottom: "16px"
        }}>
          ¿Listo para empezar?
        </h2>
        <p style={{
          color: "#64748b",
          marginBottom: "32px"
        }}>
          La descarga es gratuita. Requiere cuenta EV Trading Labs.
        </p>
        <button style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "16px 32px",
          background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
          color: "#0a0e17",
          fontWeight: 700,
          fontSize: "16px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer"
        }}>
          <Download size={18} />
          Descargar ahora
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "20px",
        textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)"
      }}>
        <p style={{ fontSize: "12px", color: "#475569" }}>
          © 2026 EV Trading Labs. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}