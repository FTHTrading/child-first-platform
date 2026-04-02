"use client";

import { useState } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { CAMPAIGN_ABI, RECEIPT_ABI } from "@/lib/contracts";
import { MilestoneTracker } from "@/components/MilestoneTracker";
import { DonateModal }      from "@/components/DonateModal";
import type { CampaignRecord, MilestoneData } from "@/types";

interface Props {
  campaign:       CampaignRecord;
  campaignAddress?: `0x${string}`;
}

export function CampaignDetail({ campaign, campaignAddress }: Props) {
  const [donateOpen, setDonateOpen] = useState(false);

  // ── Live on-chain reads ─────────────────────────────────────────────
  const hasAddress = !!campaignAddress;

  const { data: onChain } = useReadContracts({
    contracts: hasAddress
      ? [
          { address: campaignAddress!, abi: CAMPAIGN_ABI, functionName: "totalRaised"   },
          { address: campaignAddress!, abi: CAMPAIGN_ABI, functionName: "totalDisbursed" },
          { address: campaignAddress!, abi: CAMPAIGN_ABI, functionName: "closed"         },
          { address: campaignAddress!, abi: CAMPAIGN_ABI, functionName: "getMilestoneCount" },
        ]
      : [],
    query: { refetchInterval: 15_000 },
  });

  const totalRaised    = (onChain?.[0]?.result as bigint | undefined) ?? 0n;
  const totalDisbursed = (onChain?.[1]?.result as bigint | undefined) ?? 0n;
  const closed         = (onChain?.[2]?.result as boolean | undefined) ?? false;
  const milestoneCount = Number((onChain?.[3]?.result as bigint | undefined) ?? 0n);

  // ── Fetch all milestones ─────────────────────────────────────────────
  const milestoneContracts = hasAddress
    ? Array.from({ length: milestoneCount }, (_, i) => ({
        address:      campaignAddress!,
        abi:          CAMPAIGN_ABI,
        functionName: "getMilestone" as const,
        args:         [BigInt(i)],
      }))
    : [];

  const { data: milestoneResults } = useReadContracts({
    contracts: milestoneContracts,
    query: { enabled: milestoneCount > 0 },
  });

  const milestones: MilestoneData[] = (milestoneResults ?? [])
    .map((r) => r.result as MilestoneData | undefined)
    .filter(Boolean) as MilestoneData[];

  // ── Display helpers ──────────────────────────────────────────────────
  const goalMatic   = parseFloat(campaign.goalAmount);
  const raisedMatic = Number(totalRaised) / 1e18;
  const pct         = goalMatic > 0 ? Math.min((raisedMatic / goalMatic) * 100, 100) : 0;
  const deadline    = new Date(campaign.deadline);
  const daysLeft    = Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / 86_400_000));

  const canDonate = !closed && daysLeft > 0 && hasAddress;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Main content ────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Image */}
          {campaign.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-full rounded-2xl object-cover max-h-72"
            />
          ) : (
            <div className="w-full rounded-2xl h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-6xl">
              &#128140;
            </div>
          )}

          {/* Title / org */}
          <div>
            {campaign.organizationName && (
              <p className="text-sm text-blue-600 font-semibold mb-1">{campaign.organizationName}</p>
            )}
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{campaign.title}</h1>
            {campaign.location && (
              <p className="text-sm text-gray-500">&#128205; {campaign.location}</p>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-3">About this Campaign</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{campaign.description}</p>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Disbursement Milestones</h2>
            <p className="text-xs text-gray-400 mb-4">
              Funds are only released when both the Campaign Operator and an Independent Director approve each milestone.
            </p>
            <MilestoneTracker milestones={milestones} />
          </div>
        </div>

        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Progress card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold text-gray-900 text-xl">{raisedMatic.toFixed(2)} MATIC</span>
                <span className="text-gray-400">of {goalMatic.toFixed(1)}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-right text-xs text-gray-400 mt-1">{pct.toFixed(0)}% funded</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <Stat label="Disbursed"  value={`${(Number(totalDisbursed) / 1e18).toFixed(2)} MATIC`} />
              <Stat label="Days Left"  value={daysLeft > 0 ? `${daysLeft}d` : "Ended"} />
              <Stat label="Milestones" value={String(milestoneCount)} />
              <Stat label="Status"     value={closed ? "Closed" : campaign.status} />
            </div>

            {canDonate ? (
              <button
                onClick={() => setDonateOpen(true)}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition text-lg"
              >
                Donate with Wallet
              </button>
            ) : (
              <div className="text-center text-gray-400 text-sm py-3 bg-gray-50 rounded-xl">
                {closed ? "Campaign closed" : daysLeft === 0 ? "Campaign ended" : "Contract not yet deployed"}
              </div>
            )}
          </div>

          {/* On-chain proof */}
          {campaignAddress && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 text-sm">
              <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">On-chain Contract</p>
              <a
                href={`https://polygonscan.com/address/${campaignAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 break-all hover:underline text-xs"
              >
                {campaignAddress}
              </a>
            </div>
          )}
        </div>
      </div>

      {donateOpen && campaignAddress && (
        <DonateModal
          campaignAddress={campaignAddress}
          campaignTitle={campaign.title}
          campaignId={campaign.campaignId}
          onClose={() => setDonateOpen(false)}
        />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-2.5 text-center">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="font-bold text-gray-800 text-sm">{value}</p>
    </div>
  );
}
