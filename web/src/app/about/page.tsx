import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works | Child First Platform",
  description:
    "Child First Platform uses blockchain technology to make every charitable donation fully transparent, traceable, and dual-approved before funds reach any child.",
};

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Campaign Operator Applies",
    body: "A verified non-profit, NGO, or field operator submits a campaign with a funding goal, deadline, recipient wallet addresses, and milestone-based disbursement schedule. Every operator is KYC-verified before listing.",
    icon: "&#128196;",
  },
  {
    step: "02",
    title: "Independent Review & On-Chain Deploy",
    body: "Our independent review board validates the campaign documentation, beneficiary evidence, and operator credentials. Once approved, a smart contract is deployed to Polygon mainnet — locking all rules permanently on-chain.",
    icon: "&#9989;",
  },
  {
    step: "03",
    title: "You Donate with Your Wallet",
    body: "Connect any EVM-compatible wallet (MetaMask, Coinbase, WalletConnect). Send MATIC directly to the campaign smart contract. No intermediary ever touches your funds — the contract holds 100% in escrow.",
    icon: "&#128176;",
  },
  {
    step: "04",
    title: "Soulbound NFT Receipt Minted",
    body: "Instantly, the DonationReceipt contract mints a non-transferable (soulbound) NFT to your wallet. It contains your wallet address, donation amount, campaign ID, and block timestamp — permanent, unalterable proof of your contribution.",
    icon: "&#127989;",
  },
  {
    step: "05",
    title: "Dual-Approval Milestone Disburse",
    body: "Funds are NEVER released in bulk. Each milestone requires BOTH the Campaign Operator AND an Independent Director to submit on-chain approvals. Only after both signatures are recorded does the contract release that tranche — directly to the verified recipient wallet.",
    icon: "&#128275;",
  },
  {
    step: "06",
    title: "Immutable On-Chain Proof",
    body: "Every donation, every approval, and every disbursement is recorded in Polygon blocks forever. Anyone can verify the entire history on Polygonscan. No campaign can retroactively alter records.",
    icon: "&#128200;",
  },
];

const GUARANTEES = [
  {
    title: "0% Admin Fees",
    body: "Smart contracts enforce that 100% of donated funds go to campaign milestones. The platform cannot collect or divert funds — there is no admin fee mechanism in the contracts.",
  },
  {
    title: "Non-Custodial",
    body: "Neither Child First Platform nor any operator holds your funds. The smart contract is the custodian. Even if our website goes offline, your funds are safe and disburseable on-chain.",
  },
  {
    title: "Dual Approval Required",
    body: "A single actor cannot release funds. Both the Campaign Operator AND an Independent Director must independently sign each milestone release. This dual-key mechanism prevents unilateral misuse.",
  },
  {
    title: "Soulbound NFT Receipts",
    body: "Your receipt NFT is non-transferable and permanent. It cannot be deleted or modified by anyone — not the platform, not the operator, not even the blockchain developers.",
  },
  {
    title: "Open Source Contracts",
    body: "All smart contract source code is verified and publicly readable on Polygonscan. There are no hidden functions, no owner backdoors, and no upgrade mechanisms that could change the rules.",
  },
  {
    title: "Milestone-Locked Disbursement",
    body: "Operators must submit documented evidence (photos, receipts, reports) as proof before a milestone approval can proceed. The Independent Director reviews this evidence before countersigning.",
  },
];

const ROLES = [
  {
    role: "Donor",
    description: "Anyone with an EVM wallet. Donates MATIC, receives an NFT receipt, monitors fund usage.",
    color: "bg-blue-50 border-blue-200",
  },
  {
    role: "Campaign Operator",
    description: "KYC-verified NGO or field worker managing a campaign. Proposes milestones, submits evidence, signs first approval for disbursement.",
    color: "bg-green-50 border-green-200",
  },
  {
    role: "Independent Director",
    description: "An independent board member with no financial relationship to the campaign. Countersigns disbursements after reviewing submitted evidence. Cannot act alone.",
    color: "bg-purple-50 border-purple-200",
  },
  {
    role: "Smart Contract",
    description: "Immutable code on Polygon mainnet. Holds all donated funds in escrow, enforces dual-approval rules, mints NFT receipts, and records all events permanently.",
    color: "bg-orange-50 border-orange-200",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
            How Child First Works
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            A fully on-chain charitable platform where every dollar is traceable, every
            disbursement requires dual approval, and every donor receives permanent proof.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-14">
          The Complete Process
        </h2>
        <div className="space-y-8">
          {HOW_IT_WORKS.map((item) => (
            <div
              key={item.step}
              className="flex gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-100"
            >
              <div className="shrink-0 w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-lg">
                {item.step}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl" dangerouslySetInnerHTML={{ __html: item.icon }} />
                  <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Who Does What
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ROLES.map((r) => (
              <div
                key={r.role}
                className={`rounded-2xl border p-6 ${r.color}`}
              >
                <h3 className="font-bold text-gray-900 text-lg mb-2">{r.role}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          Platform Guarantees
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUARANTEES.map((g) => (
            <div key={g.title} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="w-8 h-8 bg-blue-600 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white text-lg">&#10003;</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{g.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{g.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4">Ready to Make a Difference?</h2>
          <p className="text-blue-100 mb-8">
            Every donation creates a permanent record of your impact — on-chain, forever.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/campaigns"
              className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition shadow-lg"
            >
              Browse Campaigns
            </Link>
            <Link
              href="/whitepaper"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-blue-700 transition"
            >
              Read the Whitepaper
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
