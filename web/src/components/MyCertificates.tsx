"use client";

import Link from "next/link";
import { useAccount, useReadContracts } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther } from "viem";
import { CertificateCard } from "@/components/CertificateCard";
import { RECEIPT_ABI, RECEIPT_ADDRESS } from "@/lib/contracts";

interface ReceiptData {
  campaignId: string;
  amount:     bigint;
  timestamp:  bigint;
  donor:      string;
}

export function MyCertificates() {
  const { address, isConnected } = useAccount();

  // Step 1 — get balance (how many NFTs this wallet holds)
  const { data: balanceData, isLoading: balanceLoading } = useReadContracts({
    contracts: address
      ? [{ address: RECEIPT_ADDRESS, abi: RECEIPT_ABI, functionName: "balanceOf", args: [address] }]
      : [],
    query: { enabled: !!address },
  });

  const balance = Number((balanceData?.[0]?.result as bigint | undefined) ?? 0n);

  // Step 2 — enumerate token IDs
  const { data: tokenIdData, isLoading: idLoading } = useReadContracts({
    contracts: address && balance > 0
      ? Array.from({ length: balance }, (_, i) => ({
          address:      RECEIPT_ADDRESS,
          abi:          RECEIPT_ABI,
          functionName: "tokenOfOwnerByIndex" as const,
          args:         [address, BigInt(i)] as [`0x${string}`, bigint],
        }))
      : [],
    query: { enabled: !!address && balance > 0 },
  });

  const tokenIds = (tokenIdData ?? [])
    .map((r) => r.result as bigint | undefined)
    .filter((v): v is bigint => v != null);

  // Step 3 — fetch receipt data for each token
  const { data: receiptData, isLoading: receiptLoading } = useReadContracts({
    contracts: tokenIds.map((tid) => ({
      address:      RECEIPT_ADDRESS,
      abi:          RECEIPT_ABI,
      functionName: "getReceiptData" as const,
      args:         [tid] as [bigint],
    })),
    query: { enabled: tokenIds.length > 0 },
  });

  const isLoading = balanceLoading || idLoading || receiptLoading;

  return (
    <section className="py-16 px-4 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-blue-200 text-blue-600 bg-blue-50 mb-4">
            Your Wallet
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">My Certificates</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Connect your wallet to see the soulbound NFT receipts minted to your address.
          </p>
        </div>

        {!isConnected ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-4">&#127989;</div>
            <p className="text-gray-500 text-sm mb-6">Connect your wallet to view your donation NFTs.</p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-64" />
            ))}
          </div>
        ) : balance === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="text-5xl mb-4">&#128205;</div>
            <p className="text-lg font-bold text-gray-900 mb-2">No certificates yet</p>
            <p className="text-sm text-gray-500 mb-6">
              Make your first donation to earn a soulbound NFT receipt.
            </p>
            <Link
              href="/campaigns"
              className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition"
            >
              Browse Campaigns &#8594;
            </Link>
          </div>
        ) : (
          <>
            <p className="text-center text-sm text-gray-500 mb-8">
              <span className="font-bold text-gray-900">{balance}</span>{" "}
              certificate{balance !== 1 ? "s" : ""} found for{" "}
              <span className="font-mono">{address?.slice(0, 6)}&#8230;{address?.slice(-4)}</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokenIds.map((tokenId, i) => {
                const receipt = receiptData?.[i]?.result as ReceiptData | undefined;
                if (!receipt) return null;
                const maticAmt = parseFloat(formatEther(receipt.amount)).toFixed(3);
                const date = new Date(Number(receipt.timestamp) * 1000).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" },
                );
                return (
                  <div key={tokenId.toString()} className="flex flex-col gap-3">
                    <CertificateCard
                      donorAddress={address ?? ""}
                      amount={maticAmt}
                      campaignName={receipt.campaignId}
                      date={date}
                      tokenId={Number(tokenId)}
                      compact={true}
                    />
                    <div className="flex gap-2 text-xs">
                      <a
                        href={`https://opensea.io/assets/matic/${RECEIPT_ADDRESS}/${tokenId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-1.5 rounded-lg border border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition font-semibold"
                      >
                        OpenSea &#8599;
                      </a>
                      <a
                        href={`https://polygonscan.com/token/${RECEIPT_ADDRESS}?a=${tokenId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition font-semibold"
                      >
                        Polygonscan &#8599;
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
