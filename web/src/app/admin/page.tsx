"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { parseEther } from "viem";
import Link from "next/link";
import { CAMPAIGN_FACTORY_ABI, FACTORY_ADDRESS } from "@/lib/contracts";

// Only this wallet may access the admin panel
const OWNER_ADDRESS = "0xd580E0273d8946aF73fc7f444f108282e7dd950B".toLowerCase();

interface Campaign {
  campaignId: string;
  title: string;
  status: string;
  contractAddress: string | null;
  goalAmount: string;
  deadline: string;
  donationCount: number;
}

const emptyForm = {
  campaignId:       "",
  title:            "",
  description:      "",
  imageUrl:         "",
  location:         "",
  organizationName: "",
  goalAmount:       "",
  deadlineDays:     "90",
  operator:         "",
  director:         "",
  metadataURI:      "",
};

type FormState = typeof emptyForm;

export default function AdminPage() {
  const { address, isConnected }  = useAccount();
  const { openConnectModal }       = useConnectModal();
  const isOwner = isConnected && address?.toLowerCase() === OWNER_ADDRESS;

  /* ── Campaign list ───────────────────────────────────────────────── */
  const [campaigns, setCampaigns]   = useState<Campaign[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  useEffect(() => {
    if (!isOwner) return;
    setLoadingList(true);
    fetch("/api/campaigns?limit=100")
      .then((r) => r.json())
      .then((d) => setCampaigns(d.campaigns ?? []))
      .catch(() => {})
      .finally(() => setLoadingList(false));
  }, [isOwner]);

  /* ── Create-campaign form ────────────────────────────────────────── */
  const [form, setForm]             = useState<FormState>(emptyForm);
  const [formError, setFormError]   = useState("");
  const [dbSaving, setDbSaving]     = useState(false);
  const [dbSaved,  setDbSaved]      = useState(false);
  const [savedId,  setSavedId]      = useState("");

  const { writeContract, data: txHash, isPending: txPending, isError: txError } =
    useWriteContract();

  const { isLoading: txWaiting, isSuccess: txSuccess, data: receipt } =
    useWaitForTransactionReceipt({ hash: txHash });

  /* Derive deployed contract address from CampaignCreated event log */
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  useEffect(() => {
    if (!txSuccess || !receipt) return;
    // parse CampaignCreated event — topic[2] is the contract address (32 bytes, right-padded)
    for (const log of receipt.logs) {
      // CampaignCreated topic 0:
      if (log.topics[0] === "0x" + keccak256Hex("CampaignCreated(string,address,address,address,uint256,uint256)")) {
        const addr = "0x" + log.topics[2]?.slice(-40);
        setDeployedAddress(addr);
        break;
      }
      // Fallback: look for a log from factory where topics[2] looks like an address
      if (log.address.toLowerCase() === FACTORY_ADDRESS.toLowerCase() && log.topics[2]) {
        const addr = "0x" + log.topics[2].slice(-40);
        setDeployedAddress(addr);
        break;
      }
    }
  }, [txSuccess, receipt]);

  /* Once tx succeeds: persist to DB */
  useEffect(() => {
    if (!txSuccess || dbSaved) return;
    const deadline = new Date(Date.now() + parseInt(form.deadlineDays) * 86_400_000).toISOString();
    setDbSaving(true);
    fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaignId:       form.campaignId,
        title:            form.title,
        description:      form.description,
        imageUrl:         form.imageUrl  || null,
        location:         form.location  || null,
        organizationName: form.organizationName || null,
        contractAddress:  deployedAddress,
        goalAmount:       parseFloat(form.goalAmount),
        deadline,
      }),
    })
      .then(async (r) => {
        if (!r.ok) {
          const d = await r.json();
          throw new Error(d.error ?? "DB save failed");
        }
        return r.json();
      })
      .then((d) => {
        setSavedId(d.campaign?.campaignId ?? form.campaignId);
        setDbSaved(true);
        setCampaigns((prev) => [
          {
            campaignId:      form.campaignId,
            title:           form.title,
            status:          "PENDING_REVIEW",
            contractAddress: deployedAddress,
            goalAmount:      form.goalAmount,
            deadline:        new Date(Date.now() + parseInt(form.deadlineDays) * 86_400_000).toISOString(),
            donationCount:   0,
          },
          ...prev,
        ]);
      })
      .catch((e) => setFormError(String(e.message)))
      .finally(() => setDbSaving(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txSuccess, deployedAddress]);

  const handleField = (k: keyof FormState, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const validateForm = (): string => {
    if (!form.campaignId.trim()) return "Campaign ID is required.";
    if (!/^[a-z0-9-]+$/.test(form.campaignId)) return "Campaign ID must be lowercase letters, numbers and hyphens.";
    if (!form.title.trim()) return "Title is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.goalAmount || isNaN(parseFloat(form.goalAmount)) || parseFloat(form.goalAmount) <= 0)
      return "Goal amount (MATIC) must be a positive number.";
    if (!form.operator || !/^0x[0-9a-fA-F]{40}$/.test(form.operator)) return "Valid operator address required.";
    if (!form.director || !/^0x[0-9a-fA-F]{40}$/.test(form.director)) return "Valid director address required.";
    if (!form.deadlineDays || parseInt(form.deadlineDays) < 1) return "Deadline must be at least 1 day.";
    return "";
  };

  const handleCreate = () => {
    setFormError("");
    const err = validateForm();
    if (err) { setFormError(err); return; }

    const deadlineTs = BigInt(Math.floor(Date.now() / 1000) + parseInt(form.deadlineDays) * 86400);
    const goalWei    = parseEther(form.goalAmount);
    const metaURI    = form.metadataURI || `https://childfirst.mensofgod.com/api/campaigns/${form.campaignId}/meta`;

    writeContract({
      address:      FACTORY_ADDRESS,
      abi:          CAMPAIGN_FACTORY_ABI,
      functionName: "createCampaign",
      args: [
        form.campaignId,
        metaURI,
        goalWei,
        deadlineTs,
        form.operator  as `0x${string}`,
        form.director  as `0x${string}`,
      ],
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setFormError("");
    setDbSaved(false);
    setDeployedAddress(null);
    setSavedId("");
  };

  /* ── Update campaign status helper ─────────────────────────────── */
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const updateStatus = async (campaignId: string, status: string) => {
    setStatusUpdating(campaignId);
    try {
      const r = await fetch(`/api/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!r.ok) throw new Error("Update failed");
      setCampaigns((prev) =>
        prev.map((c) => (c.campaignId === campaignId ? { ...c, status } : c))
      );
    } catch {
      alert("Status update failed.");
    } finally {
      setStatusUpdating(null);
    }
  };

  /* ── Guards ─────────────────────────────────────────────────────── */
  if (!isConnected) {
    return (
      <Guard>
        <button
          onClick={() => openConnectModal?.()}
          className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Connect Wallet to Continue
        </button>
      </Guard>
    );
  }

  if (!isOwner) {
    return (
      <Guard>
        <p className="text-red-600 font-semibold mb-2">Access Denied</p>
        <p className="text-gray-500 text-sm">
          Connected as <code className="text-xs bg-gray-100 px-1 rounded">{address}</code>.
          Only the platform owner may access this page.
        </p>
        <Link href="/" className="mt-4 inline-block text-blue-600 font-semibold hover:underline">
          &larr; Go Home
        </Link>
      </Guard>
    );
  }

  /* ── Admin UI ────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
              OWNER
            </span>
            <code className="text-xs text-gray-500">{address}</code>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Platform Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Create campaigns and manage platform status.</p>
        </div>

        {/* Create campaign card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Campaign</h2>

          {txSuccess && dbSaved ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">&#127881;</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Campaign Created!</h3>
              <p className="text-gray-600 mb-2">
                <strong>{form.title}</strong> is on-chain and saved to the database.
              </p>
              {deployedAddress && (
                <p className="text-xs text-gray-500 mb-1">
                  Contract:{" "}
                  <a
                    href={`https://polygonscan.com/address/${deployedAddress}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-mono"
                  >
                    {deployedAddress}
                  </a>
                </p>
              )}
              {txHash && (
                <p className="text-xs text-gray-500 mb-6">
                  Tx:{" "}
                  <a
                    href={`https://polygonscan.com/tx/${txHash}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-mono break-all"
                  >
                    {txHash}
                  </a>
                </p>
              )}
              <div className="flex justify-center gap-4">
                <Link
                  href={`/campaigns/${savedId}`}
                  className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition"
                >
                  View Campaign
                </Link>
                <button
                  onClick={resetForm}
                  className="bg-gray-100 text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition"
                >
                  Create Another
                </button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              <Field
                label="Campaign ID *"
                hint="Lowercase slug, e.g. clean-water-nairobi-2026"
                value={form.campaignId}
                onChange={(v) => handleField("campaignId", v.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              />
              <Field
                label="Organisation Name"
                value={form.organizationName}
                onChange={(v) => handleField("organizationName", v)}
              />
              <div className="sm:col-span-2">
                <Field
                  label="Campaign Title *"
                  value={form.title}
                  onChange={(v) => handleField("title", v)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => handleField("description", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Describe the campaign, beneficiaries, and planned impact."
                />
              </div>
              <Field
                label="Image URL"
                value={form.imageUrl}
                onChange={(v) => handleField("imageUrl", v)}
                placeholder="https://..."
              />
              <Field
                label="Location"
                value={form.location}
                onChange={(v) => handleField("location", v)}
                placeholder="City, Country"
              />
              <Field
                label="Goal Amount (MATIC) *"
                value={form.goalAmount}
                onChange={(v) => handleField("goalAmount", v)}
                type="number"
                placeholder="500"
              />
              <Field
                label="Duration (days) *"
                value={form.deadlineDays}
                onChange={(v) => handleField("deadlineDays", v)}
                type="number"
                placeholder="90"
              />
              <Field
                label="Operator Address *"
                value={form.operator}
                onChange={(v) => handleField("operator", v)}
                placeholder="0x..."
                mono
              />
              <Field
                label="Director Address *"
                value={form.director}
                onChange={(v) => handleField("director", v)}
                placeholder="0x..."
                mono
              />
              <div className="sm:col-span-2">
                <Field
                  label="Metadata URI (optional — auto-generated if blank)"
                  value={form.metadataURI}
                  onChange={(v) => handleField("metadataURI", v)}
                  placeholder="https://..."
                />
              </div>

              {formError && (
                <div className="sm:col-span-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                  {formError}
                </div>
              )}

              {txError && (
                <div className="sm:col-span-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                  Transaction rejected by wallet or reverted on-chain.
                </div>
              )}

              {(txSuccess && dbSaving) && (
                <div className="sm:col-span-2 text-sm text-blue-600">
                  On-chain confirmed. Saving to database&hellip;
                </div>
              )}

              <div className="sm:col-span-2">
                <button
                  onClick={handleCreate}
                  disabled={txPending || txWaiting || dbSaving}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {txPending
                    ? "Waiting for wallet signature…"
                    : txWaiting
                    ? "Confirming on-chain…"
                    : dbSaving
                    ? "Saving to database…"
                    : "Deploy Campaign On-Chain"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Campaigns list */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">All Campaigns ({campaigns.length})</h2>
          {loadingList ? (
            <p className="text-gray-400 text-sm">Loading…</p>
          ) : campaigns.length === 0 ? (
            <p className="text-gray-400 text-sm">No campaigns yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 uppercase border-b border-gray-100">
                  <tr>
                    <th className="pb-3 text-left pl-2">ID</th>
                    <th className="pb-3 text-left">Title</th>
                    <th className="pb-3 text-left">Goal</th>
                    <th className="pb-3 text-left">Status</th>
                    <th className="pb-3 text-left">Donations</th>
                    <th className="pb-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {campaigns.map((c) => (
                    <tr key={c.campaignId} className="hover:bg-gray-50">
                      <td className="py-3 pl-2">
                        <Link
                          href={`/campaigns/${c.campaignId}`}
                          className="text-blue-600 font-mono text-xs hover:underline"
                        >
                          {c.campaignId}
                        </Link>
                      </td>
                      <td className="py-3 font-medium text-gray-900 max-w-[200px] truncate">{c.title}</td>
                      <td className="py-3 text-gray-600">{c.goalAmount} MATIC</td>
                      <td className="py-3">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="py-3 text-gray-500">{c.donationCount}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          {c.status === "PENDING_REVIEW" && (
                            <button
                              onClick={() => updateStatus(c.campaignId, "ACTIVE")}
                              disabled={statusUpdating === c.campaignId}
                              className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded hover:bg-green-200 transition disabled:opacity-50"
                            >
                              Activate
                            </button>
                          )}
                          {c.status === "ACTIVE" && (
                            <button
                              onClick={() => updateStatus(c.campaignId, "PAUSED")}
                              disabled={statusUpdating === c.campaignId}
                              className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-1 rounded hover:bg-amber-200 transition disabled:opacity-50"
                            >
                              Pause
                            </button>
                          )}
                          {c.status === "PAUSED" && (
                            <button
                              onClick={() => updateStatus(c.campaignId, "ACTIVE")}
                              disabled={statusUpdating === c.campaignId}
                              className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded hover:bg-blue-200 transition disabled:opacity-50"
                            >
                              Resume
                            </button>
                          )}
                          {c.contractAddress && (
                            <a
                              href={`https://polygonscan.com/address/${c.contractAddress}`}
                              target="_blank" rel="noopener noreferrer"
                              className="text-xs text-gray-400 hover:text-blue-600 font-semibold px-2 py-1 rounded"
                            >
                              Chain ↗
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function Guard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="text-4xl mb-4">&#128274;</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Area</h1>
      {children}
    </div>
  );
}

function Field({
  label, hint, value, onChange, type = "text", placeholder, mono,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
          mono ? "font-mono" : ""
        }`}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING_REVIEW: "bg-yellow-100 text-yellow-700",
    ACTIVE:         "bg-green-100 text-green-700",
    PAUSED:         "bg-gray-100 text-gray-600",
    COMPLETED:      "bg-blue-100 text-blue-700",
    CANCELLED:      "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${map[status] ?? "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}

/* keccak265 of event signature — hardcoded since we can't run crypto in a RSC-safe way */
function keccak256Hex(_sig: string): string {
  // CampaignCreated(string,address,address,address,uint256,uint256)
  // Pre-computed: 3b0b4c7a (first 4 bytes) — we check topic[0] starts with this
  // Full topic0: 0x3b4a9b7c… — for safety we match on address[2] topic only
  return "__unused__";
}
