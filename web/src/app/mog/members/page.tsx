"use client";

import { useState } from "react";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { MOG_REGISTRY_ADDRESS, MOG_REGISTRY_ABI } from "@/lib/contracts";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const TIER_LABEL = ["Member", "Elder", "Prophet", "Apostle"];
const TIER_COLOR = [
  "bg-blue-100 text-blue-700",
  "bg-indigo-100 text-indigo-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-800",
];
const TIER_REWARD = ["100 MOG", "500 MOG", "1,000 MOG", "2,500 MOG"];

const DENOMINATIONS = [
  "Baptist", "Pentecostal", "Catholic", "Methodist", "Non-denominational",
  "Anglican", "Presbyterian", "Lutheran", "Charismatic", "Other",
];

const REGIONS = [
  "Southeast US", "Northeast US", "Midwest US", "Southwest US", "West US",
  "West Africa", "East Africa", "Southern Africa",
  "Latin America", "Europe", "Asia Pacific", "Other",
];

const MINISTRY_TYPES = [
  "Evangelism", "Youth Ministry", "Food Ministry", "Prayer",
  "Worship", "Teaching/Preaching", "Missions", "Counseling",
  "Community Outreach", "Music Ministry", "Other",
];

export default function MOGMembersPage() {
  const { address, isConnected } = useAccount();

  // Check if current wallet is already a member
  const { data: alreadyMember, refetch: refetchMember } = useReadContract({
    address: MOG_REGISTRY_ADDRESS,
    abi: MOG_REGISTRY_ABI,
    functionName: "isMember",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Get member data if registered
  const { data: memberData } = useReadContract({
    address: MOG_REGISTRY_ADDRESS,
    abi: MOG_REGISTRY_ABI,
    functionName: "members",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!alreadyMember },
  }) as { data: { name: string; denomination: string; region: string; ministryType: string; tier: number; registeredAt: bigint; active: boolean } | undefined };

  // Total member count
  const { data: memberCount } = useReadContract({
    address: MOG_REGISTRY_ADDRESS,
    abi: MOG_REGISTRY_ABI,
    functionName: "memberCount",
  });

  const [name, setName] = useState("");
  const [denomination, setDenomination] = useState(DENOMINATIONS[0]);
  const [region, setRegion] = useState(REGIONS[0]);
  const [ministryType, setMinistryType] = useState(MINISTRY_TYPES[0]);
  const [registering, setRegistering] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  const { writeContractAsync } = useWriteContract();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected) return;
    setRegistering(true);
    setRegError("");
    setRegSuccess(false);
    try {
      await writeContractAsync({
        address: MOG_REGISTRY_ADDRESS,
        abi: MOG_REGISTRY_ABI,
        functionName: "register",
        args: [name, denomination, region, ministryType],
      });
      setRegSuccess(true);
      setTimeout(() => refetchMember(), 4000);
    } catch (err: unknown) {
      setRegError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setRegistering(false);
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-800 to-indigo-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">✝️</div>
          <h1 className="text-4xl font-extrabold mb-3">Member Registry</h1>
          <p className="text-blue-200 text-sm max-w-xl mx-auto mb-2">
            Register your ministry on-chain. Earn 100 MOG tokens on registration and grow through
            the tiers — Member, Elder, Prophet, Apostle.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/10 text-xs font-bold px-3 py-1 rounded-full border border-white/20 mt-2">
            <span className="text-green-300">{memberCount?.toString() ?? "..."}</span>
            <span className="text-blue-200">registered members</span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Tier system */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Ministry Tiers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TIER_LABEL.map((tier, i) => (
              <div key={tier} className="text-center bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 ${TIER_COLOR[i]}`}>
                  {tier}
                </div>
                <p className="text-lg font-black text-purple-700">{TIER_REWARD[i]}</p>
                <p className="text-xs text-gray-400 mt-0.5">on promotion</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current member status */}
          <div>
            {isConnected && alreadyMember && memberData ? (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {memberData.name?.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{memberData.name}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TIER_COLOR[memberData.tier] ?? TIER_COLOR[0]}`}>
                      {TIER_LABEL[memberData.tier] ?? "Member"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Denomination</span>
                    <span className="font-medium text-gray-900">{memberData.denomination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Region</span>
                    <span className="font-medium text-gray-900">{memberData.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ministry</span>
                    <span className="font-medium text-gray-900">{memberData.ministryType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className={`font-semibold ${memberData.active ? "text-green-600" : "text-red-500"}`}>
                      {memberData.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Registered</span>
                    <span className="font-medium text-gray-900">
                      {new Date(Number(memberData.registeredAt) * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <p className="text-xs text-purple-600 font-semibold">
                    ✓ You are registered on the Men of God Registry
                  </p>
                  <a
                    href={`https://polygonscan.com/address/${MOG_REGISTRY_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-400 hover:text-purple-600 underline mt-1 block"
                  >
                    View contract on Polygonscan →
                  </a>
                </div>
              </div>
            ) : isConnected ? (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 text-center">
                <p className="text-amber-700 font-semibold text-sm mb-1">Not yet registered</p>
                <p className="text-amber-600 text-xs">
                  Complete the form to join the Men of God Registry and earn 100 MOG.
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center">
                <p className="text-gray-600 font-semibold text-sm mb-3">Connect your wallet to register</p>
                <ConnectButton />
              </div>
            )}

            {/* What you get */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">What you receive on registration</h3>
              <ul className="space-y-2 text-sm">
                {[
                  "100 MOG tokens — governance & reward currency",
                  "MEMBER FaithBadge NFT — soulbound achievement",
                  "On-chain ministry profile — permanent record",
                  "Voting rights in DAO governance",
                ].map((item) => (
                  <li key={item} className="flex gap-2 text-gray-700">
                    <span className="text-purple-500 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Registration form */}
          <div>
            {!alreadyMember ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4">Register Your Ministry</h2>
                {!isConnected ? (
                  <div className="text-center py-8">
                    <ConnectButton />
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Name / Ministry Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Life Church Atlanta"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Denomination</label>
                      <select
                        value={denomination}
                        onChange={(e) => setDenomination(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        {DENOMINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Region</label>
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Ministry Type</label>
                      <select
                        value={ministryType}
                        onChange={(e) => setMinistryType(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        {MINISTRY_TYPES.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    {regError && (
                      <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{regError}</p>
                    )}
                    {regSuccess && (
                      <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
                        Registration submitted! 100 MOG + MEMBER FaithBadge incoming. ✓
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={registering}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition text-sm"
                    >
                      {registering ? "Registering…" : "Register — Earn 100 MOG"}
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      One registration per wallet. Information is public on-chain.
                    </p>
                  </form>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="font-bold text-gray-900 mb-2">You&apos;re registered!</h3>
                <p className="text-gray-500 text-sm mb-4">
                  You&apos;re part of the Men of God Registry. Continue your ministry journey to earn
                  more MOG and progress to Elder, Prophet, and Apostle tiers.
                </p>
                <a
                  href="/mog/prayer-wall"
                  className="inline-block bg-purple-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-purple-700 transition text-sm"
                >
                  Go to Prayer Wall →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
