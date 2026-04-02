import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Whitepaper | Child First Platform",
  description:
    "The Child First Platform whitepaper — technical architecture, governance model, smart contract specification, security analysis, and due diligence documentation.",
};

const SECTIONS = [
  { id: "abstract",     title: "Abstract"                        },
  { id: "problem",      title: "1. Problem Statement"            },
  { id: "solution",     title: "2. Solution Architecture"        },
  { id: "contracts",    title: "3. Smart Contract Specification" },
  { id: "governance",   title: "4. Governance Model"             },
  { id: "security",     title: "5. Security Analysis"            },
  { id: "tokenomics",   title: "6. Economic Model"               },
  { id: "legal",        title: "7. Legal & Compliance"           },
  { id: "risk",         title: "8. Risk Factors"                 },
  { id: "roadmap",      title: "9. Roadmap"                      },
];

export default function WhitepaperPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-gray-400 text-xs uppercase tracking-widest mb-4">Technical Whitepaper — v1.0 — April 2026</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Child First Platform
          </h1>
          <p className="text-xl text-gray-300 mb-2 font-medium">
            Transparent, Accountable, Dual-Approved Charitable Fundraising on Polygon
          </p>
          <p className="text-gray-400 text-sm">
            Contract: Polygon Mainnet (Chain ID 137) &bull;
            Factory: 0x7868D0D5aD5DB9a462093D06cAE2e8c7D3Cbf386 &bull;
            License: MIT
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 flex gap-12">
        {/* Table of contents — sticky sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contents</p>
            <nav className="space-y-1.5">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <article className="flex-1 prose prose-gray prose-sm max-w-none space-y-16">

          {/* Abstract */}
          <section id="abstract">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Abstract</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-gray-700 leading-relaxed">
              Child First Platform is a decentralised charitable fundraising protocol deployed
              on the Polygon mainnet. The system enables verified non-profit operators to
              raise MATIC donations from global donors, with all funds held in immutable
              smart contract escrow and released exclusively through a 2-of-2 multi-party
              approval mechanism ("dual approval"). Donors receive a permanent, non-transferable
              ERC-721 NFT receipt as on-chain proof of contribution. No platform fee is
              charged. No speculative token is issued. The system is architected to survive
              the failure of the platform operator — meaning charity infrastructure cannot
              be captured, censored, or misappropriated by any single party.
            </div>
          </section>

          {/* Problem */}
          <section id="problem">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">1. Problem Statement</h2>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">1.1 Charitable Sector Trust Deficit</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Global charitable giving exceeds $600 billion annually, yet donor confidence is
              persistently undermined by high overhead rates, opaque fund flows, and recurring
              fraud scandals. A 2023 Giving Insights survey found that 67% of donors abandon
              large charitable gifts due to inability to verify fund usage. Traditional charity
              auditing is annual, retrospective, and inaccessible to most donors.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">1.2 Children &amp; Humanitarian Campaigns Specifically</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Child welfare campaigns face additional scrutiny due to the vulnerability of
              beneficiaries. High-profile fraud in this sector (fake orphanage networks,
              inflated meal counts, diverted food aid) has created justified donor scepticism.
              Field operators face the inverse problem: legitimate campaigns struggle to raise
              funds because they cannot credibly prove integrity to potential donors.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">1.3 Existing Blockchain Solutions Are Insufficient</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Existing blockchain charity platforms typically provide &quot;transparency&quot; only at the
              donation receipt layer, while fund disbursement remains centralised and opaque.
              A platform that publishes donation hashes but disburses via a multisig controlled
              entirely by the platform provides no meaningful accountability improvement over
              traditional charities.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-gray-700">
              <strong className="text-red-700">The Core Problem:</strong> Donors need cryptographic, real-time, verifiable
              proof that their specific donation was used for its stated purpose — not 12 months
              later in an auditor&apos;s report.
            </div>
          </section>

          {/* Solution */}
          <section id="solution">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">2. Solution Architecture</h2>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">2.1 System Overview</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Child First Platform is composed of three layers:
            </p>
            <div className="space-y-3">
              {[
                { name: "On-Chain Layer", desc: "Immutable Solidity contracts on Polygon mainnet. Holds funds, enforces dual-approval rules, mints NFT receipts. Cannot be modified or censored." },
                { name: "Off-Chain Index Layer", desc: "PostgreSQL + Prisma database mirrors campaign metadata, donation records, and milestone evidence for fast reads and search. No funds are ever held here." },
                { name: "Application Layer", desc: "Next.js 14 frontend deployed on Netlify. Reads from both on-chain state and the index layer. Communicates with wallets via wagmi v2 + RainbowKit." },
              ].map((l) => (
                <div key={l.name} className="flex gap-3 bg-gray-50 rounded-xl p-4 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900">{l.name}: </span>
                    <span className="text-gray-600">{l.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">2.2 Trust Model</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              The system is designed so that a donor does not need to trust Child First Platform,
              the campaign operator, or the Independent Director individually. The smart contract
              enforces that both parties must agree — and neither can act alone. The platform
              can be taken offline without affecting a single pending donation.
            </p>
          </section>

          {/* Contracts */}
          <section id="contracts">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">3. Smart Contract Specification</h2>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">3.1 CampaignFactory</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Deployed at: <code className="bg-gray-100 px-1 rounded text-xs">0x7868D0D5aD5DB9a462093D06cAE2e8c7D3Cbf386</code>
            </p>
            <div className="space-y-2 text-sm">
              {[
                { fn: "createCampaign(campaignId, metadataURI, goalAmount, deadline, operator, director)", desc: "Owner-only. Deploys a new Campaign contract, records it in the registry. Emits CampaignCreated." },
                { fn: "getCampaignCount()", desc: "Returns total number of campaigns ever created." },
                { fn: "getCampaignSummaries()", desc: "Returns parallel arrays of addresses, IDs, goals, raised totals, deadlines, and closed states." },
                { fn: "campaignById(campaignId)", desc: "Returns the contract address for a given string campaign ID." },
                { fn: "isCampaign(addr)", desc: "Returns true if addr was deployed by this factory." },
              ].map((f) => (
                <div key={f.fn} className="bg-gray-50 rounded-xl p-3">
                  <code className="text-xs text-blue-700 block mb-1 break-all">{f.fn}</code>
                  <p className="text-gray-500 text-xs">{f.desc}</p>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-bold text-gray-800 mt-8 mb-2">3.2 Campaign (per-campaign instance)</h3>
            <div className="space-y-2 text-sm">
              {[
                { fn: "donate() payable", desc: "Accepts any MATIC amount. Increments totalRaised. Calls DonationReceipt.mint(). Emits DonationReceived." },
                { fn: "approveMilestone(index) — operator only", desc: "Sets milestone.operatorApproved = true. Emits MilestoneOperatorApproved." },
                { fn: "approveMilestone(index) — director only", desc: "Sets milestone.directorApproved = true. If both flags true, immediately transfers targetAmount to milestone.recipient. Emits MilestoneDisbursed." },
                { fn: "getMilestone(index)", desc: "Returns full milestone tuple: description, targetAmount, recipient, operatorApproved, directorApproved, disbursed." },
                { fn: "getMilestoneCount()", desc: "Returns total milestone count." },
                { fn: "totalRaised / totalDisbursed / availableFunds", desc: "View functions returning current fund state in wei." },
              ].map((f) => (
                <div key={f.fn} className="bg-gray-50 rounded-xl p-3">
                  <code className="text-xs text-blue-700 block mb-1 break-all">{f.fn}</code>
                  <p className="text-gray-500 text-xs">{f.desc}</p>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-bold text-gray-800 mt-8 mb-2">3.3 DonationReceipt (ERC-721 Soulbound)</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Deployed at: <code className="bg-gray-100 px-1 rounded text-xs">0x2Bd17aD3abE1783B2006B47A9d415457178C2422</code>
            </p>
            <div className="space-y-2 text-sm">
              {[
                { fn: "mint(to, campaignId, amount) — campaign contract only", desc: "Mints a token to the donor address. Only authorised Campaign contracts can call this." },
                { fn: "transferFrom / safeTransferFrom", desc: "Overridden to revert. Tokens are permanently soulbound to the original recipient." },
                { fn: "getReceiptData(tokenId)", desc: "Returns campaignId, amount (wei), timestamp, donor address." },
                { fn: "tokenURI(tokenId)", desc: "Returns on-chain base64 JSON metadata with receipt attributes." },
              ].map((f) => (
                <div key={f.fn} className="bg-gray-50 rounded-xl p-3">
                  <code className="text-xs text-blue-700 block mb-1 break-all">{f.fn}</code>
                  <p className="text-gray-500 text-xs">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Governance */}
          <section id="governance">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">4. Governance Model</h2>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">4.1 Current Model (v1)</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              In version 1, the platform is governed by a founding multi-signature arrangement:
            </p>
            <div className="space-y-3">
              {[
                { role: "Platform Owner", rights: "Deploys new campaigns via CampaignFactory. Cannot touch campaign funds. Cannot override milestone approvals." },
                { role: "Campaign Operator", rights: "Submits first milestone approval. Provides evidence documentation. Cannot unilaterally release funds." },
                { role: "Independent Director", rights: "Countersigns milestone disbursements. Acts as fiduciary check. Has no relationship with the operator." },
              ].map((g) => (
                <div key={g.role} className="flex gap-3 text-sm">
                  <div className="w-28 shrink-0 font-bold text-gray-900 text-xs pt-0.5">{g.role}</div>
                  <div className="text-gray-600 text-xs bg-gray-50 rounded-xl p-3 flex-1">{g.rights}</div>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">4.2 Path to Decentralisation</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Phase 3 roadmap introduces DAO governance where MATIC-weighted votes determine
              Independent Director elections, fee structure changes (capped at 1% maximum),
              and campaign approval criteria. The founding multi-sig retains veto rights during
              a 2-year transition period to prevent hostile governance capture.
            </p>
          </section>

          {/* Security */}
          <section id="security">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">5. Security Analysis</h2>

            <div className="space-y-4">
              {[
                {
                  threat: "Reentrancy Attack",
                  mitigation: "Milestone disbursement follows checks-effects-interactions pattern. State is updated before external call. OpenZeppelin ReentrancyGuard applied.",
                  severity: "HIGH",
                  status: "MITIGATED",
                },
                {
                  threat: "Operator Unilateral Fund Drain",
                  mitigation: "Operator approval alone is never sufficient. Director countersignature required. Operator has no withdraw() function.",
                  severity: "CRITICAL",
                  status: "MITIGATED",
                },
                {
                  threat: "Platform Admin Fund Capture",
                  mitigation: "Platform owner can only deploy new campaigns. No admin function exists to access campaign escrow funds.",
                  severity: "CRITICAL",
                  status: "MITIGATED",
                },
                {
                  threat: "Integer Overflow on Amounts",
                  mitigation: "Solidity 0.8.x provides built-in overflow/underflow protection. No unsafe math libraries used.",
                  severity: "HIGH",
                  status: "MITIGATED",
                },
                {
                  threat: "NFT Transfer / Market Speculation",
                  mitigation: "DonationReceipt overrides all ERC-721 transfer functions to revert. Tokens cannot leave the minted wallet under any circumstances.",
                  severity: "MEDIUM",
                  status: "MITIGATED",
                },
                {
                  threat: "Deadline Timestamp Manipulation",
                  mitigation: "Block timestamps on Polygon are reliable to within ~15 seconds. Campaign deadlines use a ±1 hour grace window for edge cases.",
                  severity: "LOW",
                  status: "ACCEPTABLE",
                },
              ].map((t) => (
                <div key={t.threat} className="bg-white rounded-xl border border-gray-200 p-4 text-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      t.severity === "CRITICAL" ? "bg-red-100 text-red-700" :
                      t.severity === "HIGH" ? "bg-orange-100 text-orange-700" :
                      t.severity === "MEDIUM" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>{t.severity}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      t.status === "MITIGATED" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}>{t.status}</span>
                    <span className="font-bold text-gray-900">{t.threat}</span>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed">{t.mitigation}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tokenomics */}
          <section id="tokenomics">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">6. Economic Model</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Child First Platform issues no proprietary token. There is no ICO, no token
              sale, no pre-mine, and no speculative value proposition. The platform uses
              MATIC exclusively as the donation currency.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center my-6">
              {[
                { v: "0%",    l: "Platform fee" },
                { v: "100%",  l: "To beneficiaries" },
                { v: "~$0.01",l: "Gas cost per tx" },
              ].map((s) => (
                <div key={s.l} className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl font-black text-blue-700">{s.v}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Future platform sustainability may be funded via an optional, community-voted
              protocol fee capped at 1% of disbursements — not donations. This means donors
              always see 100% of their donation enter the campaign escrow.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              See the full <Link href="/tokenomics" className="text-blue-600 hover:underline">Tokenomics page</Link> for detailed economic parameters.
            </p>
          </section>

          {/* Legal */}
          <section id="legal">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">7. Legal &amp; Compliance</h2>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">7.1 Platform Status</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Child First Platform is a technology infrastructure provider. It is not itself
              a registered charity, non-profit, or financial institution. Individual campaigns
              are operated by verified third-party organisations who bear responsibility for
              their own legal and tax compliance.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">7.2 Operator Requirements</h3>
            <div className="space-y-2 text-sm text-gray-600">
              {[
                "Government-issued identity documentation for all key persons",
                "Proof of registered non-profit, NGO, or charitable status in country of operation",
                "Verified beneficiary documentation (no personally identifying information for minors)",
                "Bank account or wallet ownership proof in organisation name",
                "Signed platform terms including anti-fraud attestation",
              ].map((r) => (
                <div key={r} className="flex gap-2 text-xs">
                  <span className="text-blue-500 shrink-0 mt-0.5">&#8226;</span>
                  {r}
                </div>
              ))}
            </div>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">7.3 Donor Protections</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              Donors retain the following protections enforced in code:
            </p>
            <div className="space-y-2">
              {[
                "Funds can only reach verified milestone recipient wallets — not the operator&apos;s personal wallet",
                "If a campaign expires without meeting milestones, remaining funds can be administratively returned to original donor addresses via refund mechanism",
                "NFT receipt provides permanent donation proof independent of platform infrastructure",
              ].map((p) => (
                <div key={p} className="text-xs text-gray-600 flex gap-2">
                  <span className="text-green-500 shrink-0 mt-0.5">&#10003;</span>
                  <span dangerouslySetInnerHTML={{ __html: p }} />
                </div>
              ))}
            </div>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">7.4 AML / KYC Policy</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Operators are fully KYC-verified prior to campaign listing. Donor wallets are
              pseudonymous but all on-chain activity is permanently public. The platform
              reserves the right to freeze or terminate campaigns where credible fraud evidence
              emerges, in which case director approval for any further disbursement will be
              withheld.
            </p>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-gray-700">
              <strong className="text-yellow-700">Legal Disclaimer:</strong> Donations to campaigns on
              Child First Platform may or may not qualify for charitable tax deductions in your
              jurisdiction. Consult a qualified tax advisor. Child First Platform does not provide
              tax, legal, or financial advice.
            </div>
          </section>

          {/* Risk */}
          <section id="risk">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">8. Risk Factors</h2>
            <div className="space-y-3 text-sm">
              {[
                { r: "Smart Contract Risk", d: "Despite security measures, undiscovered vulnerabilities may exist. Only donate amounts you are comfortable with. Independent audit is in progress." },
                { r: "MATIC Price Volatility", d: "The MATIC price may decrease between donation and disbursement, reducing the real-world value reaching beneficiaries." },
                { r: "Operator Misconduct", d: "Campaign operators may provide false evidence for milestone signing. The Independent Director process, AML policy, and legal recourse are the primary defences." },
                { r: "Regulatory Change", d: "Cryptocurrency regulations may change in ways that affect platform operation or donor tax treatment." },
                { r: "Polygon Network Risk", d: "If Polygon mainnet experiences extended downtime or a consensus failure, fund access may be temporarily impaired." },
                { r: "Platform Infrastructure Failure", d: "If Child First&apos;s website and database become inaccessible, campaign management is impaired but funds remain safely on-chain and accessible via direct contract interaction." },
              ].map((r) => (
                <div key={r.r} className="bg-white rounded-xl border border-gray-200 p-4">
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{r.r}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: r.d }} />
                </div>
              ))}
            </div>
          </section>

          {/* Roadmap */}
          <section id="roadmap">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">9. Roadmap</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-6">
                {[
                  { q: "Q1–Q2 2026", label: "Current", items: ["Polygon mainnet deployment", "CampaignFactory + DonationReceipt live + verified", "First 3 pilot campaigns", "Public web application live"] },
                  { q: "Q3 2026",    label: "Next",    items: ["USDC stablecoin donation support", "Self-service operator portal", "Mobile wallet UX improvements", "Independent security audit (external auditor)"] },
                  { q: "Q4 2026",    label: "Planned", items: ["Impact credential system for repeat donors", "Cross-chain support (Base, Arbitrum)", "API access for third-party integrations", "Annual transparency report publication"] },
                  { q: "Q1 2027+",   label: "Future",  items: ["DAO governance launch", "Community-elected Independent Directors", "Layer 2 micro-donation support", "Mobile app (iOS / Android)"] },
                ].map((phase, i) => (
                  <div key={phase.q} className="flex gap-5 pl-10 relative">
                    <div className={`absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 ${i === 0 ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-gray-900 text-sm">{phase.q}</span>
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${i === 0 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>{phase.label}</span>
                      </div>
                      <ul className="space-y-1">
                        {phase.items.map((item) => (
                          <li key={item} className="text-xs text-gray-600 flex gap-2">
                            <span className="text-gray-300 mt-0.5">&#8226;</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-8 text-xs text-gray-400 space-y-1">
            <p>Child First Platform — Technical Whitepaper v1.0 — April 2026</p>
            <p>Smart contracts: MIT License. Deployed on Polygon mainnet (chain 137).</p>
            <p>
              Source verified:{" "}
              <a href="https://polygonscan.com/address/0x7868D0D5aD5DB9a462093D06cAE2e8c7D3Cbf386#code" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                CampaignFactory &#8599;
              </a>{" "}
              &bull;{" "}
              <a href="https://polygonscan.com/address/0x2Bd17aD3abE1783B2006B47A9d415457178C2422#code" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                DonationReceipt &#8599;
              </a>
            </p>
          </div>

        </article>
      </div>
    </div>
  );
}
