"use client";

import { useState, useEffect } from "react";

const STEPS = [
  {
    id: "genesis",
    emoji: "⭐",
    color: "#818cf8",
    glow: "#818cf840",
    label: "Genesis",
    sub: "Donation initiated",
    desc: "Your generosity creates a genesis event on Polygon. The blockchain permanently records this moment — the exact second a child's story begins to change.",
    stat: "Block time: ~2s",
  },
  {
    id: "chain",
    emoji: "⛓️",
    color: "#60a5fa",
    glow: "#60a5fa40",
    label: "On-Chain",
    sub: "Block confirmed",
    desc: "Within seconds your transaction is confirmed across thousands of nodes worldwide. Immutable, transparent, verifiable by anyone — forever. No one can alter this record.",
    stat: "Finality: ~64 blocks",
  },
  {
    id: "escrow",
    emoji: "🔒",
    color: "#38bdf8",
    glow: "#38bdf840",
    label: "Smart Escrow",
    sub: "Funds secured",
    desc: "The smart contract locks your donation in tamper-proof escrow. No admin, no single individual — only cryptographically signed milestone approvals unlock these funds.",
    stat: "Contract: 0x7868…cbf386",
  },
  {
    id: "approval",
    emoji: "✅",
    color: "#34d399",
    glow: "#34d39940",
    label: "Dual Approval",
    sub: "2-of-2 signed",
    desc: "An independent Operator AND a vetted Director both sign on-chain before a single MATIC moves. Checks and balances built in code — not in promises.",
    stat: "Signers required: 2 / 2",
  },
  {
    id: "partner",
    emoji: "🏥",
    color: "#fbbf24",
    glow: "#fbbf2440",
    label: "Verified Partner",
    sub: "Org receives funds",
    desc: "Funds flow to a KYC-verified charitable organization with a published, publicly auditable wallet address. Every transfer is live on the block explorer right now.",
    stat: "KYC verified on-chain",
  },
  {
    id: "impact",
    emoji: "👶",
    color: "#f87171",
    glow: "#f8717140",
    label: "Child Impact",
    sub: "Help delivered",
    desc: "A real child receives verifiable, direct support — reported back on-chain as immutable proof of impact. Your NFT certificate permanently links YOUR wallet to THIS moment.",
    stat: "Receipt NFT: soulbound",
  },
] as const;

type Step = (typeof STEPS)[number];

function NodeRow({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <div className="relative flex items-start justify-between px-4">
      {/* Background rail */}
      <div className="absolute top-7 left-8 right-8 h-px bg-gray-800" />
      {/* Animated progress rail */}
      <div
        className="absolute top-7 left-8 h-px transition-all duration-700 ease-in-out"
        style={{
          width: `calc(${(active / (STEPS.length - 1)) * 100}% - 0px)`,
          background: `linear-gradient(90deg, ${STEPS[0].color}, ${STEPS[active].color})`,
          boxShadow: `0 0 8px ${STEPS[active].glow}`,
        }}
      />

      {STEPS.map((s, i) => {
        const passed = i <= active;
        const current = i === active;
        return (
          <button
            key={s.id}
            className="relative z-10 flex flex-col items-center flex-1 gap-2"
            onClick={() => onSelect(i)}
            aria-label={`Step ${i + 1}: ${s.label}`}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 transition-all duration-500 select-none"
              style={{
                borderColor: passed ? s.color : "#374151",
                background: passed ? `${s.color}18` : "#111827",
                boxShadow: current ? `0 0 0 4px ${s.glow}, 0 0 24px ${s.glow}` : "none",
                transform: current ? "scale(1.18)" : "scale(1)",
              }}
            >
              {s.emoji}
            </div>
            <span
              className="text-xs font-bold text-center leading-tight transition-colors duration-300"
              style={{ color: passed ? s.color : "#6b7280" }}
            >
              {s.label}
            </span>
            <span className="text-[10px] text-gray-600 text-center leading-tight hidden xl:block">{s.sub}</span>
          </button>
        );
      })}
    </div>
  );
}

function StepCard({ step, index }: { step: Step; index: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-8 text-center transition-all duration-500"
      style={{
        borderColor: `${step.color}35`,
        background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${step.color}12, #0f172a 65%)`,
      }}
    >
      {/* Decorative grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10">
        {/* Pulsing icon */}
        <div
          className="text-6xl mb-5 select-none inline-block"
          style={{ filter: `drop-shadow(0 0 12px ${step.color}80)` }}
        >
          {step.emoji}
        </div>

        {/* Step badge */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span
            className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full border"
            style={{ color: step.color, borderColor: `${step.color}40`, background: `${step.color}12` }}
          >
            Checkpoint {index + 1} / {STEPS.length}
          </span>
        </div>

        <h3 className="text-2xl font-extrabold text-white mb-1">{step.label}</h3>
        <p className="text-xs font-mono mb-4" style={{ color: step.color }}>
          {step.stat}
        </p>
        <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">{step.desc}</p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-400"
              style={{
                width: i === index ? "28px" : "8px",
                height: "8px",
                background: i === index ? step.color : "#1f2937",
                boxShadow: i === index ? `0 0 6px ${step.color}80` : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function GenesisJourney() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % STEPS.length), 3200);
    return () => clearInterval(t);
  }, []);

  const step = STEPS[active];

  return (
    <section className="bg-gray-950 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border mb-5"
            style={{ color: "#818cf8", borderColor: "#818cf830", background: "#818cf810" }}
          >
            ◎ Live Journey Tracker — Men of God
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
            From{" "}
            <span style={{ color: "#818cf8" }}>Genesis</span>
            {" "}to{" "}
            <span style={{ color: "#34d399" }}>Child</span>
          </h2>
          <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
            Every donation passes through 6 on-chain checkpoints — no trust required, just math.
            Click any node to explore its role in the journey.
          </p>
        </div>

        {/* Desktop: node chain */}
        <div className="hidden lg:block mb-10">
          <NodeRow active={active} onSelect={setActive} />
        </div>

        {/* Mobile: pill selector */}
        <div className="flex lg:hidden justify-center flex-wrap gap-2 mb-8">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className="text-sm font-bold px-3 py-1.5 rounded-full border transition-all"
              style={{
                borderColor: i === active ? s.color : "#374151",
                background: i === active ? `${s.color}18` : "transparent",
                color: i === active ? s.color : "#9ca3af",
              }}
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>

        {/* Detail card */}
        <StepCard step={step} index={active} />

        {/* IoT data stream visual */}
        <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900/50 p-4 font-mono text-xs overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-500">IOT DATA STREAM — Polygon Mainnet</span>
          </div>
          <div className="space-y-1 text-gray-600">
            {STEPS.slice(0, active + 1).map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <span style={{ color: s.color }}>●</span>
                <span className="text-gray-400">{`[step_${i + 1}]`}</span>
                <span style={{ color: s.color }}>{s.label.toLowerCase().replace(" ", "_")}</span>
                <span className="text-gray-600">→</span>
                <span className="text-gray-500">{s.sub}</span>
                {i === active && (
                  <span className="text-green-500 animate-pulse">▌</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
