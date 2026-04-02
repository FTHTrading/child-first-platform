"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { parseEther, encodeFunctionData } from "viem";
import { CAMPAIGN_ABI } from "@/lib/contracts";
import { CertificateCard } from "@/components/CertificateCard";

interface Props {
  campaignAddress: `0x${string}`;
  campaignTitle:   string;
  campaignId:      string;
  onClose:         () => void;
  onSuccess?:      (txHash: string) => void;
}

const PRESETS = ["1", "5", "10", "25", "50"];

export function DonateModal({ campaignAddress, campaignTitle, campaignId, onClose, onSuccess }: Props) {
  const { address, isConnected } = useAccount();
  const { openConnectModal }     = useConnectModal();

  const { data: balance } = useBalance({ address });

  const [amountStr, setAmountStr]   = useState("5");
  const [inputError, setInputError] = useState("");
  const [submitted, setSubmitted]   = useState(false);
  const [dbRecorded, setDbRecorded] = useState(false);

  const { sendTransaction, isPending, isError: sendError, data: txHash } = useSendTransaction();
  const { isLoading: waiting, isSuccess } =
    useWaitForTransactionReceipt({ hash: txHash });

  /* Record donation to database once the tx is confirmed */
  useEffect(() => {
    if (!isSuccess || !txHash || !address || dbRecorded) return;
    setDbRecorded(true);
    fetch("/api/donations", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaignId,
        txHash,
        donorAddress: address,
        amountMatic:  amountStr,
        receiptTokenId: null,
      }),
    }).catch(() => {
      // Non-blocking: donation is already on-chain; DB record failure is non-fatal
    });
  }, [isSuccess, txHash, address, campaignId, amountStr, dbRecorded]);

  const validate = (v: string) => {
    const n = parseFloat(v);
    if (!v || isNaN(n) || n <= 0) return "Enter an amount greater than 0.";
    if (balance && parseEther(v) > balance.value) return "Insufficient MATIC balance.";
    return "";
  };

  const handleDonate = () => {
    if (!isConnected) { openConnectModal?.(); return; }

    const err = validate(amountStr);
    if (err) { setInputError(err); return; }
    setInputError("");

    const data = encodeFunctionData({ abi: CAMPAIGN_ABI, functionName: "donate" });

    sendTransaction(
      { to: campaignAddress, value: parseEther(amountStr), data },
      {
        onSuccess: (hash) => {
          setSubmitted(true);
          onSuccess?.(hash);
        },
      },
    );
  };

  if (isSuccess || (submitted && txHash)) {
    return (
      /* Wider shell for certificate */
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full relative overflow-y-auto max-h-[90vh]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold z-10"
          >
            &times;
          </button>

          {/* Success banner */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white text-center py-6 px-4">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-xl font-extrabold mb-1">Donation Confirmed!</h2>
            <p className="text-blue-200 text-sm">
              Your <strong>{amountStr} MATIC</strong> is now locked in escrow — and your NFT certificate is minted.
            </p>
          </div>

          {/* Certificate */}
          <div className="p-5">
            <CertificateCard
              donorAddress={address ?? "0xYourWallet"}
              amount={amountStr}
              campaignName={campaignTitle}
              txHash={txHash ?? undefined}
              compact={true}
            />
          </div>

          {/* Journey mini-strip */}
          <div className="px-5 pb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">
              Where Your Donation Goes — Genesis to Child
            </p>
            <div className="flex items-center justify-between gap-1">
              {[
                { emoji: "⭐", label: "Genesis", color: "#818cf8" },
                { emoji: "⛓️", label: "Chain", color: "#60a5fa" },
                { emoji: "🔒", label: "Escrow", color: "#38bdf8" },
                { emoji: "✅", label: "Approved", color: "#34d399" },
                { emoji: "🏥", label: "Partner", color: "#fbbf24" },
                { emoji: "👶", label: "Child", color: "#f87171" },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-base border-2"
                      style={{ borderColor: s.color, background: `${s.color}18` }}
                    >
                      {s.emoji}
                    </div>
                    <span className="text-[8px] font-bold mt-1 text-center" style={{ color: s.color }}>
                      {s.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="h-px w-2 shrink-0" style={{ background: s.color, opacity: 0.4 }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="px-5 pb-6 space-y-2">
            {txHash && (
              <a
                href={`https://polygonscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-blue-600 text-sm font-semibold hover:underline"
              >
                View Transaction on Polygonscan →
              </a>
            )}
            <a
              href="/certificates"
              className="block text-center text-amber-600 text-xs font-semibold hover:underline"
            >
              Learn about certificate tiers →
            </a>
            <button
              onClick={onClose}
              className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-700 transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ModalShell onClose={onClose}>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Donate to Campaign</h2>
      <p className="text-sm text-gray-500 mb-5 line-clamp-1">{campaignTitle}</p>

      {/* Amount presets */}
      <div className="flex gap-2 mb-3">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => { setAmountStr(p); setInputError(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition ${
              amountStr === p
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-400"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <label className="block text-sm text-gray-600 font-medium mb-1">Amount (MATIC)</label>
      <div className="relative mb-1">
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amountStr}
          onChange={(e) => { setAmountStr(e.target.value); setInputError(""); }}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
          placeholder="0.00"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">MATIC</span>
      </div>
      {inputError && <p className="text-red-500 text-xs mb-2">{inputError}</p>}
      {balance && (
        <p className="text-xs text-gray-400 mb-4">
          Balance: {parseFloat(balance.formatted).toFixed(4)} MATIC
        </p>
      )}

      {/* NFT callout */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 flex gap-3 items-start">
        <span className="text-2xl">&#127989;</span>
        <div>
          <p className="text-sm font-bold text-blue-800">You&apos;ll receive an NFT receipt</p>
          <p className="text-xs text-blue-600">
            A soulbound donation receipt NFT is minted to your wallet — permanent, on-chain proof of your contribution.
          </p>
        </div>
      </div>

      {/* Errors */}
      {sendError && (
        <p className="text-red-500 text-sm mb-3">
          Transaction failed. Please try again or check your wallet.
        </p>
      )}

      <button
        onClick={handleDonate}
        disabled={isPending || waiting}
        className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed text-lg"
      >
        {!isConnected
          ? "Connect Wallet to Donate"
          : isPending
          ? "Confirm in Wallet..."
          : waiting
          ? "Processing..."
          : `Donate ${amountStr || "0"} MATIC`}
      </button>

      <p className="text-xs text-gray-400 text-center mt-3">
        Network fees apply. Funds held in audited smart contract.
      </p>
    </ModalShell>
  );
}

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
