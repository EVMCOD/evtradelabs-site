"use client";

import { useState } from "react";
import { Download, Monitor, Globe, Check, ChevronDown, ChevronUp, Github } from "lucide-react";

const DOWNLOAD_BASE = "https://pub-c5ec26eda22903c2898aadecbe94ea98.r2.dev/releases/latest";

const platforms = [
  {
    name: "Windows",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="4" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="18" y="4" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="4" y="18" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="18" y="18" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    color: "#38bdf8",
    versions: [
      { 
        name: "Windows 10/11 (64-bit)", 
        file: "EV-Quant-Lab-windows.exe",
        size: "~180 MB",
        status: "available"
      },
    ],
  },
  {
    name: "macOS",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <path d="M20 26c1.5 1 4-1 5-2.5M16 23c2.5 1 5.5 0 7.5-2M10 9c0-1.5 1.5-3 4-3s4 1.5 4 3c0 2.5-3 4-4 5-1-1-4-2.5-4-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: "#a78bfa",
    versions: [
      { 
        name: "macOS Apple Silicon (M1/M2/M3)", 
        file: "EV-Quant-Lab-mac-arm.dmg",
        size: "~150 MB",
        status: "available"
      },
      { 
        name: "macOS Intel (pre-2020)", 
        file: "EV-Quant-Lab-mac-intel.dmg",
        size: "~150 MB",
        status: "available"
      },
    ],
  },
  {
    name: "Linux",
    icon: (
      <svg width="28" height="28" viewBox=" 0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 5v22M10 9c0 0 2 3 6 3s6-3 6-3M8 21c2-1 4-1 6-1s4 0 6 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: "#34d399",
    versions: [
      { 
        name: "Ubuntu 20.04+ / Debian (x64)", 
        file: "EV-Quant-Lab-linux.AppImage",
        size: "~120 MB",
        status: "available"
      },
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

const tutorials = [
  { 
    title: "Instalación en Windows", 
    desc: "Guía paso a paso para instalar y configurar EV Quant Lab en Windows 10/11",
    duration: "5 min",
    link: "/local-app/tutorial#windows"
  },
  { 
    title: "Instalación en macOS", 
    desc: "Cómo instalar en Mac con Apple Silicon o Intel",
    duration: "5 min",
    link: "/local-app/tutorial#macos"
  },
  { 
    title: "Instalación en Linux", 
    desc: "Configuración en Ubuntu o Debian con AppImage",
    duration: "5 min",
    link: "/local-app/tutorial#linux"
  },
  { 
    title: "Conexión con MetaTrader 5", 
    desc: "Vincular tu cuenta MT5 y empezar a sincronizar datos",
    duration: "8 min",
    link: "/local-app/tutorial#mt5"
  },
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
          <span style={{ color: "#38bdf8", fontSize: "12px", fontWeight: 600 }}>EV QUANT LAB — DESKTOP APP</span>
        </div>

        <h1 style={{
          fontSize: "clamp(32px, 5vw, 56px)",
          fontWeight: 700,
          marginBottom: "20px",
          background: "linear-gradient(135deg, #fff 0%, #94a3b8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Descarga EV Quant Lab
          <br />
          <span style={{ color: "#38bdf8" }}>para tu escritorio</span>
        </h1>

        <p style={{
          fontSize: "18px",
          color: "#94a3b8",
          maxWidth: "600px",
          margin: "0 auto 40px",
          lineHeight: 1.7
        }}>
          Versión de escritorio para traders que quieren backtesting local, 
          datos históricos y ejecución en papel sin depender del navegador.
        </p>
      </section>

      {/* Downloads */}
      <section style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{
          fontSize: "24px",
          fontWeight: 700,
          marginBottom: "24px",
          textAlign: "center"
        }}>
          Selecciona tu sistema operativo
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {platforms.map((platform) => (
            <div key={platform.name} style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              overflow: "hidden"
            }}>
              <button
                onClick={() => toggleAccordion(platform.name)}
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
                  <div style={{ 
                    color: platform.color,
                    padding: "8px",
                    background: `${platform.color}15`,
                    borderRadius: "8px"
                  }}>
                    {platform.icon}
                  </div>
                  <span style={{ fontSize: "18px", fontWeight: 600 }}>{platform.name}</span>
                </div>
                {openAccordion === platform.name ? (
                  <ChevronUp size={20} style={{ color: "#94a3b8" }} />
                ) : (
                  <ChevronDown size={20} style={{ color: "#94a3b8" }} />
                )}
              </button>

              {openAccordion === platform.name && (
                <div style={{
                  padding: "0 24px 20px",
                  borderTop: "1px solid rgba(255,255,255,0.1)"
                }}>
                  {platform.versions.map((version, idx) => (
                    <div key={idx} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 0",
                      borderBottom: idx < platform.versions.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none"
                    }}>
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: "4px" }}>{version.name}</div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>{version.size}</div>
                      </div>
                      <a 
                        href={`${DOWNLOAD_BASE}/${version.file}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "8px 16px",
                          background: `${platform.color}15`,
                          border: `1px solid ${platform.color}40`,
                          borderRadius: "6px",
                          color: platform.color,
                          fontSize: "13px",
                          fontWeight: 600,
                          textDecoration: "none"
                        }}
                      >
                        <Download size={14} />
                        Descargar
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* All Downloads */}
        <div style={{
          marginTop: "32px",
          padding: "20px",
          background: "rgba(56, 189, 248, 0.05)",
          border: "1px solid rgba(56, 189, 248, 0.2)",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "16px" }}>
            ¿No sabes qué versión necesitas?
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`${DOWNLOAD_BASE}/EV-Quant-Lab-windows.exe`} style={{
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
              textDecoration: "none"
            }}>
              <Download size={14} />
              Windows
            </a>
            <a href={`${DOWNLOAD_BASE}/EV-Quant-Lab-mac-arm.dmg`} style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              background: "rgba(167, 139, 250, 0.1)",
              border: "1px solid rgba(167, 139, 250, 0.3)",
              borderRadius: "6px",
              color: "#a78bfa",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none"
            }}>
              <Download size={14} />
              macOS Apple Silicon
            </a>
            <a href={`${DOWNLOAD_BASE}/EV-Quant-Lab-linux.AppImage`} style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              background: "rgba(52, 211, 153, 0.1)",
              border: "1px solid rgba(52, 211, 153, 0.3)",
              borderRadius: "6px",
              color: "#34d399",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none"
            }}>
              <Download size={14} />
              Linux
            </a>
          </div>
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

      {/* Tutorials */}
      <section style={{ 
        padding: "60px 20px", 
        maxWidth: "800px", 
        margin: "0 auto",
        borderTop: "1px solid rgba(255,255,255,0.05)"
      }}>
        <h2 style={{
          fontSize: "24px",
          fontWeight: 700,
          marginBottom: "32px",
          textAlign: "center"
        }}>
          Guías de instalación
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {tutorials.map((tutorial, idx) => (
            <a 
              key={idx}
              href={tutorial.link}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "8px",
                textDecoration: "none",
                color: "inherit",
                transition: "all 0.2s"
              }}
            >
              <div>
                <div style={{ fontWeight: 600, marginBottom: "4px" }}>{tutorial.title}</div>
                <div style={{ fontSize: "13px", color: "#64748b" }}>{tutorial.desc}</div>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#38bdf8"
              }}>
                <span style={{ background: "rgba(56, 189, 248, 0.1)", padding: "4px 8px", borderRadius: "4px" }}>
                  {tutorial.duration}
                </span>
                →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* GitHub */}
      <section style={{
        padding: "40px 20px",
        textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)"
      }}>
        <a 
          href="https://github.com/EVMCOD/evtradelabs-site"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "#94a3b8",
            textDecoration: "none",
            fontSize: "14px"
          }}
        >
          <Github size={18} />
          Ver código fuente en GitHub
        </a>
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