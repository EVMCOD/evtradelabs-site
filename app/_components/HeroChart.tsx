function Candle({
  x,
  high,
  low,
  open,
  close,
  bullish = true,
}: {
  x: number;
  high: number;
  low: number;
  open: number;
  close: number;
  bullish?: boolean;
}) {
  const bodyTop = Math.min(open, close);
  const bodyHeight = Math.max(Math.abs(close - open), 10);

  return (
    <g className="hero-candle" style={{ transformOrigin: `${x}px ${bodyTop + bodyHeight / 2}px` }}>
      <line
        x1={x}
        y1={high}
        x2={x}
        y2={low}
        stroke={bullish ? "#9dd6ff" : "#f7a5a5"}
        strokeOpacity={bullish ? 0.85 : 0.4}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x={x - 7}
        y={bodyTop}
        width="14"
        height={bodyHeight}
        rx="4"
        fill={bullish ? "rgba(37,99,235,0.42)" : "rgba(239,68,68,0.14)"}
        stroke={bullish ? "#60a5fa" : "#fca5a5"}
        strokeOpacity={bullish ? 1 : 0.45}
        strokeWidth="1.2"
      />
    </g>
  );
}

export default function HeroChart() {
  return (
    <div className="relative w-full max-w-[520px] ml-auto">
      <div className="absolute -inset-8 rounded-[36px] bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.22),transparent_45%)] blur-3xl" />
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,19,33,0.96),rgba(11,16,28,0.92))] shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_52px,52px_100%] opacity-35" />
        <div className="relative border-b border-white/8 px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-[0.72rem] uppercase tracking-[0.2em] text-[#6f86ab] font-semibold">Market structure</div>
            <div className="text-white text-[0.95rem] font-semibold mt-1">Multi-platform execution · XAUUSD</div>
          </div>
          <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[0.72rem] font-semibold text-emerald-300">
            Live logic
          </div>
        </div>

        <div className="relative h-[360px] px-4 pt-4">
          <svg
            className="h-full w-full"
            viewBox="0 0 520 360"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="heroGuideLine" x1="0" y1="0" x2="520" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7aa2ff" stopOpacity="0.08" />
                <stop offset="0.6" stopColor="#60a5fa" stopOpacity="0.2" />
                <stop offset="1" stopColor="#a78bfa" stopOpacity="0.12" />
              </linearGradient>
              <linearGradient id="heroAreaGlow" x1="260" y1="92" x2="260" y2="340" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563eb" stopOpacity="0.14" />
                <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path
              d="M20 284C62 280 86 258 122 242C156 226 180 244 214 228C252 210 282 154 320 144C360 133 386 172 426 160C458 150 484 124 500 106"
              stroke="url(#heroGuideLine)"
              strokeWidth="2"
              strokeDasharray="6 10"
            />
            <path
              d="M20 284C62 280 86 258 122 242C156 226 180 244 214 228C252 210 282 154 320 144C360 133 386 172 426 160C458 150 484 124 500 106V340H20V284Z"
              fill="url(#heroAreaGlow)"
            />

            <Candle x={68} high={292} low={234} open={278} close={246} bullish={false} />
            <Candle x={108} high={272} low={222} open={260} close={234} bullish={false} />
            <Candle x={148} high={258} low={214} open={244} close={224} bullish={false} />
            <Candle x={188} high={246} low={206} open={230} close={214} bullish={false} />
            <Candle x={228} high={236} low={196} open={222} close={206} bullish={false} />
            <Candle x={268} high={222} low={170} open={182} close={214} bullish />
            <Candle x={308} high={210} low={158} open={170} close={204} bullish />
            <Candle x={348} high={198} low={150} open={162} close={192} bullish />
            <Candle x={388} high={186} low={144} open={154} close={182} bullish />
            <Candle x={428} high={174} low={134} open={148} close={170} bullish />
            <Candle x={468} high={160} low={118} open={136} close={154} bullish />

            <g className="hero-candle-highlight">
              <circle cx="468" cy="118" r="24" fill="rgba(96,165,250,0.14)" />
              <circle cx="468" cy="118" r="9" fill="rgba(96,165,250,0.26)" />
            </g>
          </svg>

          <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3">
            {[
              ["Trend", "Bullish"],
              ["Risk", "Managed"],
              ["Execution", "Platform Ready"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/8 bg-white/5 px-3 py-3 backdrop-blur-sm">
                <div className="text-[0.68rem] uppercase tracking-[0.16em] text-[#6f86ab]">{label}</div>
                <div className="mt-1 text-[0.86rem] font-semibold text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
