import Image from "next/image";

type Platform = {
  id: string;
  label: string;
  src: string;
  width: number;
  real?: boolean;
};

const platforms: Platform[] = [
  { id: "mt5", label: "MetaTrader 5", src: "/platform-logos/mt5-wordmark.svg", width: 160 },
  { id: "ninjatrader", label: "NinjaTrader", src: "/platform-logos/ninjatrader-wordmark.svg", width: 170 },
  { id: "ibkr", label: "IBKR", src: "/platform-logos/ibkr-wordmark.svg", width: 130 },
  { id: "tradovate", label: "Tradovate", src: "/platform-logos/tradovate-wordmark.svg", width: 160 },
  { id: "tradingview", label: "TradingView", src: "/platform-logos/tradingview.svg", width: 132, real: true },
];

const ticker = [...platforms, ...platforms, ...platforms];

function PlatformWordmark({ platform }: { platform: Platform }) {
  return (
    <div
      className="group inline-flex items-center rounded-full border border-white/9 bg-white/[0.035] px-4 py-3 text-white/86 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm"
      aria-label={platform.label}
      title={platform.label}
    >
      <Image
        src={platform.src}
        alt={platform.label}
        width={platform.width}
        height={40}
        className={`h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300 ${platform.real ? "invert brightness-0" : ""}`}
      />
    </div>
  );
}

export default function PlatformTicker() {
  return (
    <section className="relative overflow-hidden border-y border-white/8 bg-transparent py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#10182b] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#13213a] to-transparent" />

      <div className="platform-ticker flex min-w-max items-center gap-4 whitespace-nowrap px-4">
        {ticker.map((platform, index) => (
          <PlatformWordmark key={`${platform.id}-${index}`} platform={platform} />
        ))}
      </div>
    </section>
  );
}
