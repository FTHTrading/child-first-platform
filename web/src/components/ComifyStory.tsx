"use client";

import { useState } from "react";

/**
 * ComifyStory — 6-panel illustrated comic strip showing the journey of a donation
 * from a child in need all the way to verified impact. Uses inline SVG art.
 * "Comify" = tell the platform's story visually, comic-book style.
 */

// ── SVG Scene Primitives ──────────────────────────────────────

function ChildFigure({
  x = 50,
  y = 50,
  color = "white",
  arms = "down" as "up" | "down" | "out",
  size = 1,
}) {
  const s = size;
  const armPaths = {
    up: `M${x} ${y + 12 * s} L${x - 12 * s} ${y + 4 * s} M${x} ${y + 12 * s} L${x + 12 * s} ${y + 4 * s}`,
    out: `M${x} ${y + 14 * s} L${x - 14 * s} ${y + 14 * s} M${x} ${y + 14 * s} L${x + 14 * s} ${y + 14 * s}`,
    down: `M${x} ${y + 14 * s} L${x - 9 * s} ${y + 22 * s} M${x} ${y + 14 * s} L${x + 9 * s} ${y + 22 * s}`,
  };
  return (
    <g>
      <circle cx={x} cy={y} r={8 * s} fill={color} />
      <path
        d={`M${x} ${y + 8 * s} L${x} ${y + 26 * s}`}
        stroke={color}
        strokeWidth={3 * s}
        strokeLinecap="round"
      />
      <path
        d={armPaths[arms]}
        stroke={color}
        strokeWidth={2.5 * s}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${x} ${y + 26 * s} L${x - 8 * s} ${y + 38 * s} M${x} ${y + 26 * s} L${x + 8 * s} ${y + 38 * s}`}
        stroke={color}
        strokeWidth={2.5 * s}
        strokeLinecap="round"
      />
    </g>
  );
}

function SpeechBubble({
  x, y, width = 120, height = 44, text, fontSize = 11,
}: {
  x: number; y: number; width?: number; height?: number; text: string; fontSize?: number;
}) {
  const r = 8;
  return (
    <g>
      <rect x={x - width / 2} y={y - height} width={width} height={height} rx={r} fill="white" stroke="#1e40af" strokeWidth={1.5} />
      <path d={`M${x - 6} ${y} L${x} ${y + 12} L${x + 6} ${y}`} fill="white" stroke="#1e40af" strokeWidth={1.5} strokeLinejoin="round" />
      <text x={x} y={y - height / 2 + fontSize / 2} textAnchor="middle" fontSize={fontSize} fill="#1e293b" fontFamily="sans-serif" fontWeight="600">
        {text}
      </text>
    </g>
  );
}

// ── Panel Components ──────────────────────────────────────────

const PANELS = [
  {
    id: 1,
    title: "The Need",
    caption: "1 in 6 children lacks clean water, food, or education.",
    bg: "#eff6ff",
    accent: "#bfdbfe",
    borderColor: "#3b82f6",
    render: () => (
      <svg viewBox="0 0 200 160" className="w-full h-full">
        {/* Sky gradient */}
        <defs>
          <linearGradient id="sky1" y1="0" y2="1" x1="0" x2="0">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="100%" stopColor="#eff6ff" />
          </linearGradient>
        </defs>
        <rect width="200" height="160" fill="url(#sky1)" />
        {/* Ground */}
        <rect y="120" width="200" height="40" fill="#d1fae5" rx="0" />
        {/* Simple hut */}
        <rect x="20" y="80" width="60" height="40" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
        <path d="M15 82 L50 55 L85 82 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
        {/* Child sitting */}
        <circle cx="140" cy="105" r="10" fill="#92400e" />
        <path d="M140 115 L140 130" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />
        <path d="M140 120 L128 128 M140 120 L152 128" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M140 130 L134 140 M140 130 L146 140" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
        {/* Empty bowl */}
        <ellipse cx="142" cy="143" rx="10" ry="5" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
        <path d="M132 141 Q142 148 152 141" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
        {/* Sad face */}
        <circle cx="136" cy="100" r="1.5" fill="#5b2100" />
        <circle cx="144" cy="100" r="1.5" fill="#5b2100" />
        <path d="M136 107 Q140 104 144 107" fill="none" stroke="#5b2100" strokeWidth="1.5" />
        {/* Question marks */}
        <text x="158" y="95" fontSize="16" fill="#3b82f6" fontFamily="serif">?</text>
        <text x="166" y="80" fontSize="12" fill="#93c5fd" fontFamily="serif">?</text>
      </svg>
    ),
  },
  {
    id: 2,
    title: "The Decision",
    caption: "You connect your wallet and choose to make a difference.",
    bg: "#f0fdf4",
    accent: "#bbf7d0",
    borderColor: "#22c55e",
    render: () => (
      <svg viewBox="0 0 200 160" className="w-full h-full">
        <rect width="200" height="160" fill="#f0fdf4" />
        {/* Person with phone */}
        <ChildFigure x={140} y={60} color="#1e40af" arms="out" size={1.2} />
        {/* Phone/device */}
        <rect x="105" y="60" width="28" height="48" rx="4" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
        <rect x="108" y="65" width="22" height="36" rx="2" fill="#dbeafe" />
        {/* Screen content: wallet */}
        <text x="119" y="80" textAnchor="middle" fontSize="12" fill="#1d4ed8">💳</text>
        <rect x="110" y="84" width="18" height="5" rx="2" fill="#22c55e" />
        <text x="119" y="88.5" textAnchor="middle" fontSize="4" fill="white" fontFamily="sans-serif">DONATE</text>
        {/* Arrow from person to phone */}
        <path d="M128 78 L135 80" stroke="#22c55e" strokeWidth="2" strokeDasharray="3,2" />
        {/* "Send" sparkles */}
        <text x="60" y="55" fontSize="16" fill="#22c55e">✦</text>
        <text x="72" y="75" fontSize="10" fill="#86efac">✦</text>
        <text x="50" y="78" fontSize="8" fill="#bbf7d0">✦</text>
        {/* Heart thought bubble */}
        <circle cx="155" cy="22" r="14" fill="white" stroke="#22c55e" strokeWidth="1.5" />
        <text x="155" y="28" textAnchor="middle" fontSize="16">❤️</text>
        <circle cx="148" cy="38" r="3" fill="white" stroke="#22c55e" strokeWidth="1" />
        <circle cx="154" cy="43" r="2" fill="white" stroke="#22c55e" strokeWidth="1" />
        <text x="100" y="140" textAnchor="middle" fontSize="9" fill="#15803d" fontFamily="sans-serif" fontWeight="bold">
          "10 MATIC  →  Campaign"
        </text>
      </svg>
    ),
  },
  {
    id: 3,
    title: "The Chain",
    caption: "Your transaction is recorded on Polygon — immutable, forever.",
    bg: "#f5f3ff",
    accent: "#ddd6fe",
    borderColor: "#7c3aed",
    render: () => (
      <svg viewBox="0 0 200 160" className="w-full h-full">
        <rect width="200" height="160" fill="#0f0a1e" />
        {/* Chain links */}
        {[20, 52, 84, 116, 148].map((x, i) => (
          <g key={x}>
            <rect x={x} y="65" width="26" height="30" rx="13" fill="none" stroke={i % 2 === 0 ? "#818cf8" : "#6d28d9"} strokeWidth="4" />
            {i < 4 && <line x1={x + 26} y1="80" x2={x + 34} y2="80" stroke="#a78bfa" strokeWidth="3" />}
          </g>
        ))}
        {/* Pulse animation static */}
        <circle cx="100" cy="80" r="22" fill="none" stroke="#818cf8" strokeWidth="1" opacity="0.3" />
        <circle cx="100" cy="80" r="35" fill="none" stroke="#6d28d9" strokeWidth="1" opacity="0.15" />
        {/* Star burst for "confirmed" */}
        <text x="100" y="86" textAnchor="middle" fontSize="22" fill="#fbbf24">⭐</text>
        {/* Block hash hint */}
        <text x="100" y="125" textAnchor="middle" fontSize="7" fill="#818cf8" fontFamily="monospace">
          Block #68,432,117 — 2s ago
        </text>
        <text x="100" y="136" textAnchor="middle" fontSize="6" fill="#6d28d9" fontFamily="monospace">
          0xabcd…ef12  ✓ Confirmed
        </text>
        {/* Data bits floating */}
        {["1","0","1","0","1","1"].map((bit, i) => (
          <text key={i} x={18 + i * 30} y={45} fontSize={9} fill="#a78bfa" fontFamily="monospace" opacity="0.6">{bit}</text>
        ))}
        <text x="100" y="152" textAnchor="middle" fontSize="7.5" fill="#c4b5fd" fontFamily="sans-serif" fontWeight="bold">
          Polygon Mainnet · 2 seconds · ✓
        </text>
      </svg>
    ),
  },
  {
    id: 4,
    title: "Smart Escrow",
    caption: "Funds are locked. No single person can touch them.",
    bg: "#fff7ed",
    accent: "#fed7aa",
    borderColor: "#f97316",
    render: () => (
      <svg viewBox="0 0 200 160" className="w-full h-full">
        <rect width="200" height="160" fill="#fff7ed" />
        {/* Vault/safe */}
        <rect x="60" y="35" width="80" height="85" rx="8" fill="#1e3a8a" stroke="#f97316" strokeWidth="3" />
        <rect x="68" y="43" width="64" height="69" rx="5" fill="#1e40af" />
        {/* Lock dial */}
        <circle cx="100" cy="78" r="22" fill="#0f172a" stroke="#f97316" strokeWidth="2.5" />
        <circle cx="100" cy="78" r="14" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
        <circle cx="100" cy="78" r="4" fill="#f97316" />
        {/* Dial marks */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const r1 = 17, r2 = 20;
          return <line key={i} x1={100 + r1 * Math.sin(rad)} y1={78 - r1 * Math.cos(rad)} x2={100 + r2 * Math.sin(rad)} y2={78 - r2 * Math.cos(rad)} stroke="#60a5fa" strokeWidth="1" />;
        })}
        {/* Lock pointer */}
        <line x1="100" y1="78" x2="100" y2="62" stroke="#f97316" strokeWidth="2" />
        {/* Handle */}
        <rect x="148" y="70" width="14" height="16" rx="7" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" />
        {/* LOCKED label */}
        <text x="100" y="134" textAnchor="middle" fontSize="11" fill="#ea580c" fontFamily="sans-serif" fontWeight="bold">🔒 LOCKED IN ESCROW</text>
        <text x="100" y="148" textAnchor="middle" fontSize="7.5" fill="#7c2d12" fontFamily="monospace">
          10 MATIC — awaiting dual approval
        </text>
      </svg>
    ),
  },
  {
    id: 5,
    title: "Dual Approval",
    caption: "Two independent signers must approve every release.",
    bg: "#f0fdf4",
    accent: "#bbf7d0",
    borderColor: "#16a34a",
    render: () => (
      <svg viewBox="0 0 200 160" className="w-full h-full">
        <rect width="200" height="160" fill="#f0fdf4" />
        {/* Operator */}
        <ChildFigure x={55} y={55} color="#1e40af" arms="down" size={1} />
        <text x="55" y="108" textAnchor="middle" fontSize="8" fill="#1e40af" fontFamily="sans-serif" fontWeight="bold">OPERATOR</text>
        {/* Director */}
        <ChildFigure x={145} y={55} color="#6d28d9" arms="down" size={1} />
        <text x="145" y="108" textAnchor="middle" fontSize="8" fill="#6d28d9" fontFamily="sans-serif" fontWeight="bold">DIRECTOR</text>
        {/* Checkmarks above each */}
        <text x="55" y="25" textAnchor="middle" fontSize="22" fill="#16a34a">✅</text>
        <text x="145" y="25" textAnchor="middle" fontSize="22" fill="#16a34a">✅</text>
        {/* Dividing line down to contract */}
        <line x1="55" y1="110" x2="100" y2="130" stroke="#16a34a" strokeWidth="2" strokeDasharray="4,2" />
        <line x1="145" y1="110" x2="100" y2="130" stroke="#16a34a" strokeWidth="2" strokeDasharray="4,2" />
        {/* Smart contract box */}
        <rect x="72" y="128" width="56" height="24" rx="6" fill="#16a34a" />
        <text x="100" y="143" textAnchor="middle" fontSize="9" fill="white" fontFamily="sans-serif" fontWeight="bold">FUNDS RELEASED</text>
        {/* 2/2 badge */}
        <circle cx="100" cy="118" r="12" fill="white" stroke="#16a34a" strokeWidth="2" />
        <text x="100" y="122.5" textAnchor="middle" fontSize="9" fill="#15803d" fontFamily="sans-serif" fontWeight="bold">2/2</text>
      </svg>
    ),
  },
  {
    id: 6,
    title: "Child Impact",
    caption: "A real child's life improves — verified on-chain forever.",
    bg: "#fefce8",
    accent: "#fef08a",
    borderColor: "#eab308",
    render: () => (
      <svg viewBox="0 0 200 160" className="w-full h-full">
        <defs>
          <radialGradient id="sunGlow" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fefce8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="200" height="160" fill="url(#sunGlow)" />
        <rect width="200" height="160" fill="#fefce8" opacity="0.3" />
        {/* Ground */}
        <rect y="120" width="200" height="40" fill="#bbf7d0" />
        {/* Sun */}
        <circle cx="170" cy="30" r="18" fill="#fbbf24" opacity="0.9" />
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          return <line key={i} x1={170 + 20 * Math.sin(rad)} y1={30 - 20 * Math.cos(rad)} x2={170 + 26 * Math.sin(rad)} y2={30 - 26 * Math.cos(rad)} stroke="#fbbf24" strokeWidth="2" />;
        })}
        {/* Happy child */}
        <ChildFigure x={90} y={78} color="#92400e" arms="up" size={1.3} />
        {/* Big smile */}
        <path d="M83 75 Q90 80 97 75" fill="none" stroke="#78350f" strokeWidth="2" />
        {/* Stars/sparkles around child */}
        {["⭐","✦","✨","⭐","✦"].map((s, i) => (
          <text key={i} x={[45,130,60,125,80][i]} y={[68,62,42,90,42][i]} fontSize={[14,10,18,12,10][i]} fill={["#fbbf24","#34d399","#fbbf24","#818cf8","#fb923c"][i]}>{s}</text>
        ))}
        {/* NFT Certificate badge */}
        <g transform="translate(140,95)">
          <rect x={0} y={0} width={50} height={32} rx={6} fill="white" stroke="#d97706" strokeWidth="1.5" />
          <text x={25} y={10} textAnchor="middle" fontSize={6} fill="#92400e" fontFamily="sans-serif" fontWeight="bold">NFT RECEIPT</text>
          <rect x={4} y={14} width={42} height={4} rx={2} fill="#fde68a" />
          <text x={25} y={28} textAnchor="middle" fontSize={5} fill="#b45309" fontFamily="monospace">Token #0042 ✓</text>
        </g>
        {/* Impact caption */}
        <text x="100" y="152" textAnchor="middle" fontSize="8" fill="#15803d" fontFamily="sans-serif" fontWeight="bold">
          On-chain proof · Your NFT links to THIS moment
        </text>
      </svg>
    ),
  },
];

export function ComifyStory() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-blue-200 text-blue-600 bg-blue-50 mb-4">
            ◉ The Story — Men of God Visual Series
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Every Donation Is a Story
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
            The illustrated journey from a child in need to verified impact — six
            checkpoints, all recorded on the Polygon blockchain.
          </p>
        </div>

        {/* Comic grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0 border-2 border-gray-900 rounded-2xl overflow-hidden shadow-2xl">
          {PANELS.map((panel, i) => (
            <div
              key={panel.id}
              className={`
                relative group cursor-pointer transition-all duration-300 overflow-hidden
                ${i % 3 !== 2 ? "border-r-2 border-gray-900" : ""}
                ${i < 3 ? "border-b-2 border-gray-900" : ""}
                ${active === i ? "ring-4 ring-inset ring-blue-500 z-10" : ""}
              `}
              style={{ background: panel.bg }}
              onClick={() => setActive((v) => (v === i ? null : i))}
            >
              {/* Panel number badge */}
              <div
                className="absolute top-1.5 left-1.5 z-10 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                style={{ background: panel.borderColor }}
              >
                {panel.id}
              </div>

              {/* SVG illustration */}
              <div className="aspect-square w-full group-hover:scale-105 transition-transform duration-300">
                {panel.render()}
              </div>

              {/* Title overlay */}
              <div
                className="absolute bottom-0 left-0 right-0 py-2 px-2 text-center"
                style={{ background: `${panel.borderColor}20`, borderTop: `2px solid ${panel.borderColor}60` }}
              >
                <p
                  className="text-[9px] font-black uppercase tracking-widest"
                  style={{ color: panel.borderColor }}
                >
                  {panel.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Expanded detail */}
        {active !== null && (
          <div
            className="mt-4 rounded-2xl border-2 p-6 flex flex-col sm:flex-row gap-6 items-center transition-all duration-300"
            style={{
              borderColor: PANELS[active].borderColor,
              background: PANELS[active].bg,
            }}
          >
            <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden border-2" style={{ borderColor: PANELS[active].borderColor }}>
              {PANELS[active].render()}
            </div>
            <div>
              <div
                className="text-xs font-black uppercase tracking-widest mb-1"
                style={{ color: PANELS[active].borderColor }}
              >
                Panel {PANELS[active].id} / {PANELS.length} — {PANELS[active].title}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed font-medium">
                {PANELS[active].caption}
              </p>
              <button
                className="mt-3 text-xs font-semibold text-gray-400 hover:text-gray-600"
                onClick={() => setActive(null)}
              >
                Close ✕
              </button>
            </div>
          </div>
        )}

        {/* Bottom label */}
        <p className="text-center text-xs text-gray-400 mt-6">
          A system of Men of God — every panel represents a real, verifiable on-chain event.
          Click any panel to learn more.
        </p>
      </div>
    </section>
  );
}
