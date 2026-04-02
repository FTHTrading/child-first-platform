import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tokenomics | Child First Platform",
  description:
    "Child First Platform uses native Polygon (MATIC/POL) for all donations. No speculative token. No ICO. Pure utility — every unit donated goes directly to children.",
};

const TOKEN_MODEL = [
  {
    title: "No Speculative Token",
    body: "Child First Platform deliberately uses no proprietary token, ICO, or fundraising token sale. There is zero speculative value proposition. The only assets involved are MATIC and eventual USDC/stablecoin support.",
    icon: "&#128683;",
    highlight: false,
  },
  {
    title: "MATIC as Donation Currency",
    body: "Donors use MATIC (Polygon's native gas and value token) to fund campaigns. MATIC is widely available, gas-efficient, and trades on every major exchange — making it accessible to a global donor base.",
    icon: "&#128176;",
    highlight: true,
  },
  {
    title: "NFT Receipt — Utility Only",
    body: "The DonationReceipt NFT is soulbound (non-transferable). It has no market value by design. Its sole function is permanent, immutable donor recognition. It cannot be bought, sold, or speculated on.",
    icon: "&#127989;",
    highlight: false,
  },
];

const ECONOMICS = [
  {
    label: "Donation Fee",
    value: "0%",
    description: "The smart contract contains no mechanism to collect platform fees. 100% of donated MATIC enters the campaign escrow.",
  },
  {
    label: "Gas Cost (Polygon)",
    value: "~$0.01",
    description: "Polygon L1 gas costs make donating accessible. A standard donation transaction costs roughly $0.01 in gas at normal network conditions.",
  },
  {
    label: "NFT Mint Included",
    value: "Free",
    description: "A soulbound DonationReceipt NFT is minted as part of every donation — no additional cost. The gas for minting is bundled into the single donate() call.",
  },
  {
    label: "Minimum Donation",
    value: "No minimum",
    description: "The contract accepts any non-zero MATIC amount. Even micro-donations create an NFT record. Suggested minimum of 1 MATIC for gas efficiency.",
  },
  {
    label: "Platform Revenue",
    value: "None (v1)",
    description: "Version 1 of the platform earns zero revenue. It is run as a public good. Future governance may introduce an optional, community-voted fee — capped at 1% max.",
  },
  {
    label: "Treasury",
    value: "None",
    description: "There is no platform treasury holding donated funds. Campaigns live in isolated smart contracts. The platform operator has no access to campaign funds.",
  },
];

const DISTRIBUTION = [
  { label: "Campaign Milestones (Beneficiaries)", pct: 100, color: "bg-blue-600", textColor: "text-blue-700" },
  { label: "Platform Admin Fee",                   pct: 0,   color: "bg-gray-200", textColor: "text-gray-400" },
  { label: "Operator Commission",                  pct: 0,   color: "bg-gray-200", textColor: "text-gray-400" },
  { label: "Director Fee",                         pct: 0,   color: "bg-gray-200", textColor: "text-gray-400" },
];

const FUTURE_ROADMAP = [
  {
    phase: "Phase 1 (Current)",
    items: [
      "MATIC-only donations",
      "Soulbound NFT receipts",
      "Manual campaign creation by platform admin",
      "Dual-approval milestone disbursement",
    ],
  },
  {
    phase: "Phase 2 (Q3 2026 Target)",
    items: [
      "USDC / stablecoin donation support",
      "Self-service operator application portal",
      "Mobile-optimized wallet experience",
      "Public REST API for donation data",
    ],
  },
  {
    phase: "Phase 3 (Q1 2027 Target)",
    items: [
      "DAO governance for platform rules",
      "Community-elected Independent Directors",
      "Cross-chain donation support (Base, Ethereum)",
      "Impact credential system for donors",
    ],
  },
];

export default function TokenomicsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-700 to-purple-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white bg-opacity-20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
            Economic Model
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
            Tokenomics
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            No native token. No ICO. No speculation. Child First uses MATIC — already in your
            wallet — and ensures every unit reaches children.
          </p>
        </div>
      </section>

      {/* Core model */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-10">
          Core Token Model
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOKEN_MODEL.map((t) => (
            <div
              key={t.title}
              className={`rounded-2xl border p-6 ${
                t.highlight
                  ? "border-blue-300 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="text-3xl mb-3" dangerouslySetInnerHTML={{ __html: t.icon }} />
              <h3 className="font-bold text-gray-900 mb-2">{t.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fee breakdown */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-10">
            Where a Donation Goes
          </h2>

          {/* Visual bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm">
            <div className="flex gap-1 h-10 rounded-xl overflow-hidden mb-4">
              {DISTRIBUTION.map((d) => (
                <div
                  key={d.label}
                  className={`${d.color} transition-all`}
                  style={{ width: `${Math.max(d.pct, 1)}%` }}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              {DISTRIBUTION.map((d) => (
                <div key={d.label}>
                  <div className={`font-black text-xl ${d.textColor}`}>{d.pct}%</div>
                  <div className="text-gray-500 text-xs mt-0.5">{d.label}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500">
            This is not a promise — it is enforced in immutable smart contract code.
            The contract has no&nbsp;
            <code className="bg-gray-100 px-1 rounded">withdrawFee()</code> function
            and no admin withdrawal mechanism.
          </p>
        </div>
      </section>

      {/* Economics table */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-8 text-center">
          Key Economic Parameters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ECONOMICS.map((e) => (
            <div key={e.label} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">{e.label}</p>
              <p className="text-2xl font-black text-blue-700 mb-2">{e.value}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{e.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MATIC explainer */}
      <section className="bg-gradient-to-r from-purple-50 to-blue-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8 text-center">
            Why Polygon (MATIC)?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "Low Gas Fees", body: "Polygon transactions cost fractions of a cent — meaning donors can give any amount without fees eating into their contribution." },
              { title: "Widely Accessible", body: "MATIC is listed on Coinbase, Binance, Kraken, and all major exchanges. Any donor globally can acquire it with minimal friction." },
              { title: "EVM Compatible", body: "Standard MetaMask, WalletConnect, and Coinbase Wallet all support Polygon natively. No exotic setup required." },
              { title: "Battle-Tested Security", body: "Polygon mainnet has processed billions of transactions. It is not experimental infrastructure — it is proven, production-grade L1." },
              { title: "Carbon Offset", body: "Polygon is carbon neutral and uses Proof-of-Stake consensus. Donations do not carry a significant environmental footprint." },
              { title: "Stablecoin Ready", body: "USDC, USDT, and DAI all exist on Polygon. Phase 2 will integrate stablecoin donations for donors who prefer to avoid price volatility." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="w-6 h-6 shrink-0 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                  &#10003;
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NFT receipt */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
          The DonationReceipt NFT
        </h2>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white text-center">
            <div className="text-5xl mb-2">&#127989;</div>
            <p className="font-bold text-lg">CHILD FIRST RECEIPT #0001</p>
            <p className="text-blue-200 text-sm">Soulbound &bull; Non-Transferable &bull; Permanent</p>
          </div>
          <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-1">Campaign</p>
              <p className="font-bold text-gray-800">Nairobi Meals</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Amount</p>
              <p className="font-bold text-gray-800">10 MATIC</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Block</p>
              <p className="font-bold text-gray-800">#68,441,221</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Chain</p>
              <p className="font-bold text-gray-800">Polygon 137</p>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-400 text-center">
              Token data is encoded on-chain. The receipt exists as long as Polygon does.
              No server. No database. No expiry.
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {[
            { t: "Soulbound", b: "Cannot be transferred to another wallet address. Your receipt stays with you." },
            { t: "On-Chain Metadata", b: "Campaign ID, amount, timestamp, and donor address stored directly in the contract — no IPFS dependency." },
            { t: "Tax Documentation", b: "As blockchain-verified donation proof, these receipts can serve as supporting evidence for charitable contribution claims." },
          ].map((i) => (
            <div key={i.t} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-1 text-sm">{i.t}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{i.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-10 text-center">
            Platform Roadmap
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FUTURE_ROADMAP.map((phase, i) => (
              <div
                key={phase.phase}
                className={`rounded-2xl border p-6 ${i === 0 ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white"}`}
              >
                <div className={`text-xs font-bold uppercase tracking-wide mb-3 ${i === 0 ? "text-blue-600" : "text-gray-400"}`}>
                  {phase.phase}
                  {i === 0 && " &#10003;"}
                </div>
                <ul className="space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex gap-2 text-xs text-gray-700">
                      <span className={`mt-0.5 shrink-0 ${i === 0 ? "text-blue-500" : "text-gray-300"}`}>&#8226;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
            Questions About the Economic Model?
          </h2>
          <p className="text-gray-500 mb-8 text-sm">
            Read the full technical specification in our whitepaper, or review the contract code directly on Polygonscan.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/whitepaper"
              className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition shadow-md text-sm"
            >
              Read the Whitepaper
            </Link>
            <Link
              href="/transparency"
              className="border-2 border-gray-200 text-gray-700 font-bold px-8 py-3 rounded-xl hover:border-blue-400 transition text-sm"
            >
              Transparency Report
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
