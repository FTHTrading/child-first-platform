import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Transparency | Child First Platform",
  description:
    "Every donation and disbursement on Child First Platform is recorded permanently on Polygon mainnet. Explore on-chain proof, contract addresses, and fund flow.",
};

const CONTRACTS = [
  {
    name: "CampaignFactory",
    address: "0x7868D0D5aD5DB9a462093D06cAE2e8c7D3Cbf386",
    purpose: "Deploys individual campaign contracts. Only the platform owner can create campaigns. Records all campaign addresses on-chain.",
    viewUrl: "https://polygonscan.com/address/0x7868D0D5aD5DB9a462093D06cAE2e8c7D3Cbf386#code",
  },
  {
    name: "DonationReceipt (NFT)",
    address: "0x2Bd17aD3abE1783B2006B47A9d415457178C2422",
    purpose: "Mints a non-transferable (soulbound) ERC-721 NFT to each donor as permanent proof of contribution. Cannot be transferred or burned by the donor.",
    viewUrl: "https://polygonscan.com/address/0x2Bd17aD3abE1783B2006B47A9d415457178C2422#code",
  },
];

const FUND_FLOW = [
  {
    step: "1",
    title: "Donation Received",
    body: "MATIC is sent directly to the campaign contract address by the donor's wallet. No intermediary wallet ever receives the funds.",
    color: "bg-blue-500",
  },
  {
    step: "2",
    title: "Held in Contract Escrow",
    body: "Funds sit in the campaign smart contract. Nobody can withdraw them unilaterally — not the operator, not Child First, not the director.",
    color: "bg-purple-500",
  },
  {
    step: "3",
    title: "Operator Approves Milestone",
    body: "The Campaign Operator submits on-chain approval for a specific milestone, plus off-chain documentation evidence.",
    color: "bg-yellow-500",
  },
  {
    step: "4",
    title: "Director Countersigns",
    body: "The Independent Director reviews the evidence and submits a second on-chain approval. Both signatures must exist simultaneously.",
    color: "bg-orange-500",
  },
  {
    step: "5",
    title: "Funds Released to Recipient",
    body: "The contract automatically transfers exactly the milestone amount directly to the verified recipient wallet address. No human can intercept or redirect this transfer.",
    color: "bg-green-500",
  },
];

const AUDITABILITY = [
  {
    q: "Can anyone see how much was donated?",
    a: "Yes. Every donation transaction is publicly visible on Polygonscan. Search the campaign contract address to see all inbound transactions.",
  },
  {
    q: "Can anyone see when funds are released?",
    a: "Yes. Every disbursement emits a MilestoneDisbursed event on-chain. The exact amount, milestone index, and recipient address are all recorded.",
  },
  {
    q: "Can donor identity be hidden?",
    a: "Wallet addresses are public on-chain but are pseudonymous — not linked to real names unless you choose to disclose them.",
  },
  {
    q: "What if an operator tries to steal funds?",
    a: "They cannot. The contract requires both operator AND director approval. A solo operator signature cannot release any funds. The director acts as an independent check.",
  },
  {
    q: "What if the Child First website goes offline?",
    a: "Your funds are safe. Donations live entirely on-chain. The smart contracts continue to function regardless of our website status. The blockchain is the source of truth.",
  },
  {
    q: "Are the contracts upgradeable?",
    a: "No. The deployed contracts contain no proxy patterns or upgrade mechanisms. The code that governs your donation cannot be changed after deployment.",
  },
  {
    q: "Has the code been audited?",
    a: "All source code is verified and publicly readable on Polygonscan. Independent security review is in progress. Contract code is open source under MIT license.",
  },
];

export default function TransparencyPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
            Radical Transparency
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto leading-relaxed">
            Every transaction. Every approval. Every disbursement. Permanently on Polygon.
            Nothing is hidden — everything is verifiable by anyone, forever.
          </p>
        </div>
      </section>

      {/* Key stats */}
      <section className="bg-gray-50 border-b border-gray-200 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { stat: "100%", label: "Of funds held in smart contracts" },
            { stat: "0%",   label: "Admin fee hard-coded in contracts" },
            { stat: "2-of-2", label: "Approvals required per milestone" },
            { stat: "&#8734;",  label: "Years on-chain records persist" },
          ].map((s) => (
            <div key={s.label}>
              <div
                className="text-3xl font-black text-blue-700 mb-1"
                dangerouslySetInnerHTML={{ __html: s.stat }}
              />
              <div className="text-xs text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contracts */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Deployed Contracts</h2>
        <p className="text-gray-500 text-sm mb-8">
          All contracts are source-verified on Polygonscan. Chain ID 137.
        </p>
        <div className="space-y-4">
          {CONTRACTS.map((c) => (
            <div key={c.name} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{c.name}</h3>
                  <p className="text-gray-500 text-sm mb-3 max-w-xl">{c.purpose}</p>
                  <code className="text-xs bg-gray-100 rounded px-2 py-1 text-gray-700 break-all">
                    {c.address}
                  </code>
                </div>
                <a
                  href={c.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  View on Polygonscan &#8599;
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fund flow */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-10 text-center">
            How Funds Flow — Step by Step
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            {FUND_FLOW.map((step, i) => (
              <div key={step.step} className="flex-1 flex flex-col">
                <div className={`${step.color} rounded-xl text-white p-4 flex-1`}>
                  <div className="text-xs font-bold opacity-75 mb-2 uppercase tracking-wide">
                    Step {step.step}
                  </div>
                  <div className="font-bold mb-2 text-sm">{step.title}</div>
                  <p className="text-xs opacity-90 leading-relaxed">{step.body}</p>
                </div>
                {i < FUND_FLOW.length - 1 && (
                  <div className="text-center text-gray-300 text-2xl hidden sm:block mt-0 -mr-2 self-center">
                    &#8594;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-10 text-center">
          Transparency FAQ
        </h2>
        <div className="space-y-4">
          {AUDITABILITY.map((item) => (
            <div key={item.q} className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-2">{item.q}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Verify yourself */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold mb-4">Don&apos;t Trust — Verify</h2>
          <p className="text-blue-100 mb-8 text-sm leading-relaxed">
            You don&apos;t have to take our word for any of this. Every claim on this page
            is independently verifiable on Polygonscan right now. Click below to explore
            the contracts yourself.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://polygonscan.com/address/0x7868D0D5aD5DB9a462093D06cAE2e8c7D3Cbf386#code"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition shadow-md text-sm"
            >
              View Factory Contract &#8599;
            </a>
            <Link
              href="/campaigns"
              className="border-2 border-white text-white font-bold px-6 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition text-sm"
            >
              Browse Active Campaigns
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
