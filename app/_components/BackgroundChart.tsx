"use client";

import { useEffect, useState } from "react";

export default function BackgroundChart() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const translatePrimary = Math.min(scrollY * 0.18, 220);
  const translateSecondary = Math.min(scrollY * 0.12, 160);
  const opacity = Math.min(0.52 + scrollY / 4200, 0.78);

  return (
    <div aria-hidden="true" className="scroll-chart-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0%,rgba(255,255,255,0)_48%)] opacity-50" />

      <svg
        className="absolute left-1/2 top-[1rem] h-[1700px] w-[1800px] -translate-x-1/2"
        viewBox="0 0 1400 1200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity={opacity}>
          <path
            d="M0 248C118 252 181 217 271 206C370 194 420 248 514 244C641 239 688 133 818 124C940 116 1000 208 1113 208C1216 208 1308 155 1400 96"
            stroke="url(#chartLinePrimary)"
            strokeWidth="3.2"
            strokeLinecap="round"
            style={{ transform: `translateY(${translatePrimary}px)` }}
          />
          <path
            d="M0 410C142 400 210 362 326 360C434 358 512 430 624 420C738 409 815 317 924 312C1031 306 1098 368 1199 362C1288 357 1346 320 1400 284"
            stroke="url(#chartLineSecondary)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="7 10"
            style={{ transform: `translateY(${translateSecondary}px)` }}
          />
          <path
            d="M0 248C118 252 181 217 271 206C370 194 420 248 514 244C641 239 688 133 818 124C940 116 1000 208 1113 208C1216 208 1308 155 1400 96V1200H0V248Z"
            fill="url(#chartFill)"
            style={{ transform: `translateY(${translatePrimary}px)` }}
          />

          {[
            { x: 271, y: 206, delay: "0s" },
            { x: 514, y: 244, delay: "0.6s" },
            { x: 818, y: 124, delay: "1.2s" },
            { x: 1113, y: 208, delay: "1.8s" },
            { x: 1308, y: 155, delay: "2.4s" },
          ].map((node) => (
            <g
              key={`${node.x}-${node.y}`}
              style={{ transform: `translateY(${translatePrimary}px)` }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r="7"
                fill="#3b82f6"
                className="chart-node"
                style={{ animationDelay: node.delay }}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r="18"
                fill="url(#chartGlow)"
                opacity="0.42"
              />
            </g>
          ))}
        </g>

        <defs>
          <linearGradient id="chartLinePrimary" x1="0" y1="0" x2="1400" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d8e7ff" stopOpacity="0.22" />
            <stop offset="0.32" stopColor="#8fb5ff" stopOpacity="0.78" />
            <stop offset="0.62" stopColor="#3b82f6" stopOpacity="0.98" />
            <stop offset="1" stopColor="#a78bfa" stopOpacity="0.54" />
          </linearGradient>
          <linearGradient id="chartLineSecondary" x1="0" y1="0" x2="1400" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#efe5d6" stopOpacity="0.16" />
            <stop offset="0.5" stopColor="#5a94ff" stopOpacity="0.56" />
            <stop offset="1" stopColor="#c7b7ff" stopOpacity="0.28" />
          </linearGradient>
          <linearGradient id="chartFill" x1="700" y1="192" x2="700" y2="980" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" stopOpacity="0.18" />
            <stop offset="0.4" stopColor="#3b82f6" stopOpacity="0.08" />
            <stop offset="1" stopColor="#faf7f1" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="chartGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 0) rotate(90) scale(1)">
            <stop stopColor="#80aaff" />
            <stop offset="1" stopColor="#80aaff" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
