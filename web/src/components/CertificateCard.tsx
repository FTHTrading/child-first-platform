"use client";

import Image from "next/image";

export interface CertificateProps {
  donorAddress?: string;
  amount?: string;
  campaignName?: string;
  date?: string;
  tokenId?: string | number;
  txHash?: string;
  blockNumber?: string | number;
  compact?: boolean;
  preview?: boolean;
}

/**
 * CertificateCard — renders a printable-quality charitable contribution certificate.
 * Used on the /certificates page, in the DonateModal success screen, and in PDFs.
 * Branded: "Child First Platform — A System of Men of God"
 */
export function CertificateCard({
  donorAddress = "0xDon0r…Address",
  amount = "10",
  campaignName = "Clean Water for Lagos",
  date,
  tokenId = "#0001",
  txHash,
  blockNumber,
  compact = false,
  preview = false,
}: CertificateProps) {
  const displayDate =
    date ??
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const shortAddr =
    donorAddress.length > 18
      ? `${donorAddress.slice(0, 10)}…${donorAddress.slice(-6)}`
      : donorAddress;

  const tokenDisplay =
    typeof tokenId === "number" ? `#${tokenId.toString().padStart(4, "0")}` : tokenId;

  return (
    <div
      className={`
        relative select-none overflow-hidden font-serif
        bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100
        ${compact ? "rounded-xl p-5" : "rounded-2xl p-8 sm:p-10"}
        ${preview ? "shadow-2xl" : "shadow-xl"}
      `}
      style={{
        border: "4px double #b45309",
        boxShadow: preview
          ? "0 0 0 1px #fcd34d40, 0 32px 64px -16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.9)"
          : undefined,
      }}
    >
      {/* Watermark diagonal text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.025]"
        style={{ transform: "rotate(-30deg)" }}
      >
        <span className="text-6xl font-black text-amber-800 tracking-widest uppercase whitespace-nowrap">
          Men of God
        </span>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #92400e 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Inner decorative border */}
      <div
        className="absolute inset-4 rounded-xl pointer-events-none"
        style={{ border: "1px solid #d97706", opacity: 0.3 }}
      />

      <div className={`relative z-10 ${compact ? "space-y-4" : "space-y-6"}`}>
        {/* ── Header row ── */}
        <div className="flex items-center justify-between">
          {/* Men of God seal */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={`${compact ? "w-12 h-12" : "w-16 h-16"} rounded-full flex items-center justify-center border-2`}
              style={{
                background: "linear-gradient(135deg, #1e3a8a, #1d4ed8)",
                borderColor: "#d97706",
                boxShadow: "0 0 12px rgba(217,119,6,0.3)",
              }}
            >
              <Image
                src="/logo.svg"
                alt="Child First"
                width={compact ? 32 : 44}
                height={compact ? 32 : 44}
              />
            </div>
            <span className="text-[9px] font-sans font-bold text-amber-800 tracking-widest uppercase">
              Men of God
            </span>
          </div>

          {/* Centre title block */}
          <div className="text-center flex-1 px-4">
            <p className="text-xs font-sans font-bold tracking-widest uppercase text-amber-700">
              Child First Platform
            </p>
            <p
              className="text-[10px] font-sans tracking-widest"
              style={{ color: "#78350f" }}
            >
              A System of Men of God
            </p>
          </div>

          {/* Polygon badge */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={`${compact ? "w-12 h-12" : "w-16 h-16"} rounded-full flex items-center justify-center border-2`}
              style={{
                background: "linear-gradient(135deg, #6d28d9, #7c3aed)",
                borderColor: "#d97706",
                boxShadow: "0 0 12px rgba(217,119,6,0.3)",
              }}
            >
              <span className={`${compact ? "text-lg" : "text-2xl"}`}>⬡</span>
            </div>
            <span className="text-[9px] font-sans font-bold text-amber-800 tracking-widest uppercase">
              Polygon
            </span>
          </div>
        </div>

        {/* ── Certificate title ── */}
        <div className="text-center">
          <div
            className="w-20 h-px mx-auto mb-4"
            style={{ background: "linear-gradient(90deg, transparent, #d97706, transparent)" }}
          />
          <p
            className={`${compact ? "text-lg" : "text-xl sm:text-2xl"} font-serif font-bold text-gray-700 tracking-wide uppercase`}
          >
            Certificate of
          </p>
          <p
            className={`${compact ? "text-2xl" : "text-3xl sm:text-4xl"} font-serif font-extrabold tracking-wider uppercase`}
            style={{ color: "#1e3a8a" }}
          >
            Charitable Contribution
          </p>
          <div
            className="w-20 h-px mx-auto mt-4"
            style={{ background: "linear-gradient(90deg, transparent, #d97706, transparent)" }}
          />
        </div>

        {/* ── Body ── */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-500 font-sans italic">This certifies that</p>

          <div
            className="inline-block font-mono font-bold text-blue-900 px-4 py-2 rounded-lg border"
            style={{
              background: "rgba(219,234,254,0.5)",
              borderColor: "#93c5fd",
              fontSize: compact ? "0.75rem" : "0.875rem",
            }}
          >
            {shortAddr}
          </div>

          <p className="text-sm text-gray-500 font-sans italic">
            has made a verified, on-chain charitable contribution of
          </p>

          <div>
            <span
              className={`${compact ? "text-4xl" : "text-5xl sm:text-6xl"} font-extrabold font-sans`}
              style={{ color: "#d97706" }}
            >
              {amount}
            </span>
            <span
              className={`${compact ? "text-xl" : "text-2xl"} font-bold font-sans ml-2`}
              style={{ color: "#92400e" }}
            >
              MATIC
            </span>
          </div>

          <p className="text-sm text-gray-600 font-sans">
            to campaign{" "}
            <span className="font-bold text-gray-800">&ldquo;{campaignName}&rdquo;</span>
          </p>
          <p className="text-xs text-gray-400 font-sans uppercase tracking-widest">
            {displayDate}
          </p>
        </div>

        {/* ── Footer verification strip ── */}
        <div
          className="border-t pt-4 flex flex-wrap justify-between items-end gap-4"
          style={{ borderColor: "#d97706", borderTopWidth: "1px" }}
        >
          {/* Left: on-chain data */}
          <div className="space-y-0.5">
            <p className="text-xs font-sans font-bold" style={{ color: "#b45309" }}>
              NFT Token {tokenDisplay}
            </p>
            {blockNumber && (
              <p className="text-[10px] font-mono text-gray-500">Block #{blockNumber}</p>
            )}
            <p className="text-[10px] font-sans text-gray-500">Polygon Mainnet · Chain ID 137</p>
            <p className="text-[10px] font-mono text-gray-400 break-all leading-tight">
              Contract: 0x2Bd17aD3…C2422
            </p>
            {txHash && (
              <a
                href={`https://polygonscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-sans text-blue-600 hover:underline"
              >
                View on Polygonscan →
              </a>
            )}
          </div>

          {/* Right: QR-style decorative block */}
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-14 h-14 rounded border-2 p-1.5"
              style={{ borderColor: "#d97706", background: "rgba(255,251,235,0.8)" }}
            >
              {/* Stylised QR pattern using small coloured squares */}
              <div className="grid grid-cols-5 gap-px h-full w-full">
                {[
                  1,0,1,0,1,
                  0,1,1,1,0,
                  1,1,0,0,1,
                  0,0,1,1,0,
                  1,0,0,0,1,
                ].map((on, i) => (
                  <div
                    key={i}
                    className="rounded-sm"
                    style={{ background: on ? "#92400e" : "transparent", opacity: on ? 0.8 : 0 }}
                  />
                ))}
              </div>
            </div>
            <span className="text-[9px] font-sans text-gray-400 uppercase tracking-widest">
              Verified
            </span>
          </div>
        </div>

        {/* ── Bottom legend ── */}
        <div className="text-center pt-1">
          <p className="text-[9px] font-sans text-gray-400 tracking-widest uppercase">
            Soulbound NFT — Non-Transferable · Minted by Smart Contract
          </p>
          <p
            className="text-[10px] font-sans font-bold mt-1 tracking-widest"
            style={{ color: "#b45309" }}
          >
            "A System of Men of God" · childfirst.mensofgod.com
          </p>
        </div>
      </div>
    </div>
  );
}
