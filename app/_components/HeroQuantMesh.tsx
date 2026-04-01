export default function HeroQuantMesh() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-[-4%] top-1/2 hidden h-[420px] w-[460px] -translate-y-1/2 xl:block 2xl:right-[1%]"
    >
      <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_58%_42%,rgba(59,130,246,0.16),transparent_48%)] blur-3xl" />

      <svg
        className="relative h-full w-full opacity-95"
        viewBox="0 0 460 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="meshLine" x1="40" y1="60" x2="410" y2="320" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8fb5ff" stopOpacity="0.08" />
            <stop offset="0.45" stopColor="#60a5fa" stopOpacity="0.42" />
            <stop offset="1" stopColor="#a78bfa" stopOpacity="0.12" />
          </linearGradient>
          <radialGradient id="meshNode" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 0) rotate(90) scale(1)">
            <stop stopColor="#93c5fd" />
            <stop offset="1" stopColor="#93c5fd" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="quant-mesh-lines">
          <path d="M58 302C110 266 124 220 168 197C210 175 244 183 284 157C326 129 342 82 394 58" stroke="url(#meshLine)" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 10" />
          <path d="M70 336C118 324 160 286 212 276C265 266 301 230 344 190C375 161 394 129 411 101" stroke="url(#meshLine)" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 12" />
          <path d="M102 110L174 148L232 128L302 182L358 166" stroke="url(#meshLine)" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
          <path d="M126 276L176 234L238 256L286 216L338 236L388 198" stroke="url(#meshLine)" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
        </g>

        {[
          { x: 58, y: 302, type: "edge" },
          { x: 168, y: 197, type: "core" },
          { x: 284, y: 157, type: "core" },
          { x: 394, y: 58, type: "edge" },
          { x: 70, y: 336, type: "edge" },
          { x: 212, y: 276, type: "core" },
          { x: 344, y: 190, type: "core" },
          { x: 411, y: 101, type: "edge" },
          { x: 174, y: 148, type: "minor" },
          { x: 302, y: 182, type: "minor" },
          { x: 238, y: 256, type: "minor" },
          { x: 338, y: 236, type: "minor" },
        ].map((node, i) => (
          <g key={`${node.x}-${node.y}`} className={`quant-node quant-node--${node.type}`} style={{ animationDelay: `${i * 0.22}s` }}>
            <circle cx={node.x} cy={node.y} r={node.type === "core" ? 4.5 : 3.2} fill="#60a5fa" fillOpacity={node.type === "minor" ? 0.55 : 0.9} />
            <circle cx={node.x} cy={node.y} r={node.type === "core" ? 16 : 10} fill="url(#meshNode)" opacity={node.type === "minor" ? 0.22 : 0.42} />
          </g>
        ))}

        <g className="quant-panel-shell" opacity="0.82">
          <rect x="82" y="74" width="282" height="268" rx="28" stroke="rgba(148,163,184,0.12)" fill="rgba(15,23,42,0.18)" />
          <rect x="104" y="98" width="110" height="10" rx="5" fill="rgba(148,163,184,0.12)" />
          <rect x="104" y="122" width="152" height="8" rx="4" fill="rgba(148,163,184,0.08)" />
          <rect x="104" y="160" width="78" height="42" rx="14" fill="rgba(37,99,235,0.16)" stroke="rgba(96,165,250,0.18)" />
          <rect x="196" y="160" width="78" height="42" rx="14" fill="rgba(15,23,42,0.22)" stroke="rgba(148,163,184,0.1)" />
          <rect x="288" y="160" width="52" height="42" rx="14" fill="rgba(15,23,42,0.22)" stroke="rgba(148,163,184,0.1)" />
          <rect x="104" y="286" width="118" height="8" rx="4" fill="rgba(148,163,184,0.08)" />
          <rect x="104" y="306" width="82" height="8" rx="4" fill="rgba(148,163,184,0.06)" />
        </g>
      </svg>
    </div>
  );
}
