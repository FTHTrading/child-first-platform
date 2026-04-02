"use client";

import { useState } from "react";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { parseEther } from "viem";
import { TITHING_VAULT_ADDRESS, TITHING_VAULT_ABI } from "@/lib/contracts";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const CONTRIBUTION_TYPES = [
  { label: "Tithe",          desc: "10% of income — the biblical standard",       icon: "🌾" },
  { label: "Offering",       desc: "A free-will gift above and beyond the tithe",  icon: "🎁" },
  { label: "Missions",       desc: "Designated for evangelism & missions work",    icon: "🌍" },
  { label: "Building Fund",  desc: "Toward physical ministry spaces",              icon: "🏗️" },
  { label: "Other",          desc: "Any other designated contribution",            icon: "💝" },
];

export default function TithingVaultPage() {
  const { address, isConnected } = useAccount();

  const { data: myTotal } = useReadContract({
    address: TITHING_VAULT_ADDRESS,
    abi: TITHING_VAULT_ABI,
    functionName: "totalTithedBy",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const [amount, setAmount] = useState("0.1");
  const [ctype, setCtype] = useState(0);
  const [note, setNote] = useState("");
  const [giving, setGiving] = useState(false);
  const [giveError, setGiveError] = useState("");
  const [giveSuccess, setGiveSuccess] = useState(false);

  const { writeContractAsync } = useWriteContract();

  async function handleGive(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected) return;
    setGiving(true);
    setGiveError("");
    setGiveSuccess(false);
    try {
      await writeContractAsync({
        address: TITHING_VAULT_ADDRESS,
        abi: TITHING_VAULT_ABI,
        functionName: "contribute",
        args: [ctype, note],
        value: parseEther(amount),
      });
      setGiveSuccess(true);
      setNote("");
    } catch (err: unknown) {
      setGiveError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setGiving(false);
    }
  }

  const myTotalMatic = myTotal ? (Number(myTotal) / 1e18).toFixed(4) : "0.0000";
  const mogEarned    = myTotal ? Math.floor(Number(myTotal) / 1e18 * 10) : 0;

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-600 to-orange-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">💰</div>
          <h1 className="text-4xl font-extrabold mb-3">Tithing Vault</h1>
          <p className="text-amber-100 text-sm max-w-xl mx-auto">
            Give tithes and offerings transparently on-chain. Every contribution is permanently
            recorded. All distributions require dual approval. 10 MOG earned per MATIC given.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Give form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-6">Give an Offering</h2>

            {/* Contribution type selector */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
              {CONTRIBUTION_TYPES.map((t, i) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setCtype(i)}
                  className={`rounded-xl border p-3 text-center transition ${
                    ctype === i
                      ? "border-amber-500 bg-amber-50 shadow-sm"
                      : "border-gray-200 hover:border-amber-300"
                  }`}
                >
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <div className="text-xs font-semibold text-gray-800">{t.label}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mb-6 -mt-3">{CONTRIBUTION_TYPES[ctype].desc}</p>

            {!isConnected ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm mb-4">Connect your wallet to give.</p>
                <ConnectButton />
              </div>
            ) : (
              <form onSubmit={handleGive} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Amount (POL / MATIC)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 pr-16"
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-400 font-semibold">POL</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    You&apos;ll earn ~{Math.floor(parseFloat(amount || "0") * 10)} MOG for this contribution.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["0.1", "0.5", "1", "5", "10", "25"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAmount(v)}
                      className={`border rounded-lg py-1.5 text-xs font-semibold transition ${
                        amount === v ? "border-amber-500 bg-amber-50 text-amber-700" : "border-gray-200 text-gray-600 hover:border-amber-300"
                      }`}
                    >
                      {v} POL
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Note <span className="text-gray-400">(optional — stored on-chain)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder='e.g. "First Fruits — April 2026"'
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                {giveError && (
                  <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{giveError}</p>
                )}
                {giveSuccess && (
                  <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
                    Offering received and recorded on-chain. Thank you! ✓
                  </p>
                )}
                <button
                  type="submit"
                  disabled={giving}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition text-sm"
                >
                  {giving ? "Processing…" : `Give ${amount} POL`}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="space-y-4">
          {isConnected && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Your Giving</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Lifetime Total</p>
                  <p className="text-2xl font-black text-amber-700">{myTotalMatic} POL</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">MOG Earned</p>
                  <p className="text-xl font-black text-purple-700">{mogEarned} MOG</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-3">How it works</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              {[
                "Your contribution is sent directly to the TithingVault contract",
                "Every gift is permanently recorded on Polygon",
                "You earn 10 MOG per 1 MATIC contributed",
                "Distributions require both OPERATOR and DIRECTOR approval",
                "All distributions are publicly visible on-chain",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-amber-500 mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-2">Contract</h3>
            <a
              href={`https://polygonscan.com/address/${TITHING_VAULT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-purple-600 hover:underline break-all"
            >
              {TITHING_VAULT_ADDRESS}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
