"use client";

import { useState } from "react";
import { useReadContract, useReadContracts, useWriteContract, useAccount } from "wagmi";
import { keccak256, toHex } from "viem";
import { PRAYER_WALL_ADDRESS, PRAYER_WALL_ABI } from "@/lib/contracts";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const CATEGORIES = [
  "Healing", "Provision", "Guidance", "Protection",
  "Salvation", "Praise", "Family", "Missions", "Nation", "Other",
];

const STATUS_LABEL: Record<number, string> = {
  0: "Active",
  1: "Answered",
  2: "Expired",
  3: "Removed",
};

const STATUS_COLOR: Record<number, string> = {
  0: "bg-green-100 text-green-700",
  1: "bg-blue-100 text-blue-700",
  2: "bg-gray-100 text-gray-500",
  3: "bg-red-100 text-red-700",
};

export default function PrayerWallPage() {
  const { address, isConnected } = useAccount();

  // Total prayer count
  const { data: prayerCount } = useReadContract({
    address: PRAYER_WALL_ADDRESS,
    abi: PRAYER_WALL_ABI,
    functionName: "prayerCount",
  });

  // Active prayer IDs (first 20)
  const { data: activeIds, refetch: refetchActive } = useReadContract({
    address: PRAYER_WALL_ADDRESS,
    abi: PRAYER_WALL_ABI,
    functionName: "getActivePrayers",
    args: [BigInt(0), BigInt(20)],
  });

  // Fetch each prayer's data
  const prayerContracts = (activeIds ?? []).map((id: bigint) => ({
    address: PRAYER_WALL_ADDRESS,
    abi: PRAYER_WALL_ABI,
    functionName: "prayers" as const,
    args: [id] as const,
  }));
  const { data: prayerDataRaw, refetch: refetchPrayers } = useReadContracts({
    contracts: prayerContracts,
  });

  const prayers = (prayerDataRaw ?? [])
    .map((r, i) => r.status === "success" ? { id: (activeIds as bigint[])[i], ...(r.result as object) } : null)
    .filter(Boolean) as Array<{ id: bigint; submitter: string; subject: string; category: number; status: number; submittedAt: bigint; expiresAt: bigint; intercessionCount: bigint }>;

  // Submit prayer form
  const [subject, setSubject] = useState("");
  const [privateText, setPrivateText] = useState("");
  const [category, setCategory] = useState(0);
  const [daysOpen, setDaysOpen] = useState(30);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { writeContractAsync } = useWriteContract();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected) return;
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);
    try {
      // Hash the private prayer text off-chain — never sent on-chain
      const contentHash = keccak256(toHex(privateText));
      await writeContractAsync({
        address: PRAYER_WALL_ADDRESS,
        abi: PRAYER_WALL_ABI,
        functionName: "submitPrayer",
        args: [contentHash, subject, category, BigInt(daysOpen)],
      });
      setSubmitSuccess(true);
      setSubject("");
      setPrivateText("");
      setTimeout(() => {
        refetchActive();
        refetchPrayers();
      }, 3000);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleIntercede(prayerId: bigint) {
    if (!isConnected) return;
    try {
      await writeContractAsync({
        address: PRAYER_WALL_ADDRESS,
        abi: PRAYER_WALL_ABI,
        functionName: "intercede",
        args: [prayerId],
      });
      setTimeout(() => refetchPrayers(), 3000);
    } catch (err: unknown) {
      console.error("Intercede failed:", err);
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-purple-800 to-violet-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🙏</div>
          <h1 className="text-4xl font-extrabold mb-3">Prayer Wall</h1>
          <p className="text-purple-200 text-sm max-w-xl mx-auto mb-2">
            Submit prayer requests on-chain. Your prayer text stays private — only a cryptographic
            hash is stored. Anyone can intercede. Community prayer, transparent and eternal.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/10 text-xs font-bold px-3 py-1 rounded-full border border-white/20 mt-2">
            <span className="text-green-300">{prayerCount?.toString() ?? "..."}</span>
            <span className="text-purple-200">total prayers submitted</span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submit form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Submit a Prayer</h2>
            {!isConnected ? (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm mb-4">Connect your wallet to submit a prayer request.</p>
                <ConnectButton />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Subject <span className="text-gray-400">(public — shown on wall)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Healing for my mother"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Prayer Text <span className="text-gray-400">(private — hashed, never stored)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={privateText}
                    onChange={(e) => setPrivateText(e.target.value)}
                    placeholder="Write your prayer here. This text never leaves your browser."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    A keccak256 hash is computed in-browser and submitted on-chain. The text itself is never transmitted.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    {CATEGORIES.map((c, i) => (
                      <option key={c} value={i}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Days Open: {daysOpen}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={180}
                    value={daysOpen}
                    onChange={(e) => setDaysOpen(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                    <span>1 day</span>
                    <span>180 days</span>
                  </div>
                </div>
                {submitError && (
                  <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{submitError}</p>
                )}
                {submitSuccess && (
                  <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
                    Prayer submitted to the chain. ✓
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition text-sm"
                >
                  {submitting ? "Submitting…" : "Submit Prayer"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Prayer list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-gray-900 text-lg">
            Active Prayers ({prayers.length})
          </h2>
          {prayers.length === 0 && (
            <div className="text-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-2xl">
              <p>No active prayers yet.</p>
              <p className="text-xs mt-1">Be the first to submit a prayer request.</p>
            </div>
          )}
          {prayers.map((p) => (
            <div key={p.id.toString()} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[p.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {STATUS_LABEL[p.status] ?? "Unknown"}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {CATEGORIES[p.category] ?? "Other"}
                    </span>
                    <span className="text-xs text-purple-600 font-medium">
                      {Number(p.intercessionCount)} interceding
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{p.subject}</p>
                  <p className="text-xs text-gray-400 mt-1 font-mono truncate">
                    {p.submitter.slice(0, 10)}…{p.submitter.slice(-6)}
                  </p>
                </div>
                <button
                  onClick={() => handleIntercede(p.id)}
                  disabled={!isConnected || p.status !== 0}
                  className="flex-shrink-0 bg-purple-50 hover:bg-purple-100 disabled:opacity-40 text-purple-700 font-semibold text-xs px-4 py-2 rounded-xl transition"
                >
                  🙏 Intercede
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
