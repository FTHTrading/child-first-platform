"use client";

import { useState } from "react";
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { parseEther, encodeFunctionData } from "viem";
import { CAMPAIGN_ABI } from "@/lib/contracts";

interface Props {
  campaignAddress: `0x${string}`;
  campaignTitle:   string;
  onClose:         () => void;
  onSuccess?:      (txHash: string) => void;
}

const PRESETS = ["1", "5", "10", "25", "50"];

export function DonateModal({ campaignAddress, campaignTitle, onClose, onSuccess }: Props) {
  const { address, isConnected } = useAccount();
  const { openConnectModal }     = useConnectModal();

  const { data: balance } = useBalance({ address });

  const [amountStr, setAmountStr]   = useState("5");
  const [inputError, setInputError] = useState("");
  const [submitted, setSubmitted]   = useState(false);

  const { sendTransaction, isPending, isError: sendError, data: txHash } = useSendTransaction();
  const { isLoading: waiting, isSuccess } =
    useWaitForTransactionReceipt({ hash: txHash });

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
      <ModalShell onClose={onClose}>
        <div className="text-center py-6">
          <div className="text-5xl mb-4">&#127881;</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-4">
            Your donation of <strong>{amountStr} MATIC</strong> was confirmed on-chain.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            A soulbound NFT receipt has been minted to your wallet as permanent proof of your contribution.
          </p>
          {txHash && (
            <a
              href={`https://polygonscan.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm font-semibold hover:underline"
            >
              View on Polygonscan &rarr;
            </a>
          )}
          <button
            onClick={onClose}
            className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Done
          </button>
        </div>
      </ModalShell>
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
