const rows = [
  { symbol: "XAUUSD", price: "3,024.8", move: "+0.84%", positive: true },
  { symbol: "NQ", price: "19,884.2", move: "+0.31%", positive: true },
  { symbol: "ES", price: "5,284.4", move: "+0.18%", positive: true },
  { symbol: "EURUSD", price: "1.0842", move: "-0.09%", positive: false },
  { symbol: "BTCUSD", price: "86,420", move: "+1.42%", positive: true },
];

export default function HeroWatchlist() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-[-2%] top-1/2 hidden w-[390px] -translate-y-1/2 xl:block 2xl:right-[2%]"
    >
      <div className="hero-watchlist absolute inset-0 translate-x-12 translate-y-7 rounded-[32px] bg-[#2563eb]/12 blur-3xl" />
      <div className="hero-watchlist relative overflow-hidden rounded-[32px] border border-white/7 bg-[linear-gradient(180deg,rgba(15,23,42,0.52),rgba(15,23,42,0.32))] shadow-[0_34px_90px_rgba(0,0,0,0.26)] backdrop-blur-[18px]">
        <div className="flex items-center justify-between border-b border-white/7 px-5 py-4">
          <div>
            <div className="text-[0.68rem] uppercase tracking-[0.2em] text-[#94a3b8] font-semibold">
              Watchlist
            </div>
            <div className="mt-1 text-[0.92rem] font-semibold text-white/82">
              Markets in focus
            </div>
          </div>
          <div className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-[0.72rem] text-white/62">
            live view
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {rows.map((row) => (
            <div key={row.symbol} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4">
              <div>
                <div className="text-[0.84rem] font-semibold tracking-[0.08em] text-white/92">
                  {row.symbol}
                </div>
                <div className="mt-1 text-[0.72rem] uppercase tracking-[0.16em] text-[#7c8ba1]">
                  monitored
                </div>
              </div>
              <div className="text-[0.84rem] text-white/72 tabular-nums">
                {row.price}
              </div>
              <div
                className={`text-[0.8rem] font-semibold tabular-nums ${
                  row.positive ? "text-[#86efac]" : "text-[#fca5a5]"
                }`}
              >
                {row.move}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
