import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Governance — Child First Platform",
  description:
    "How the Child First Platform is governed today, the rights and limitations of each role, and the roadmap toward community-ownership via DAO.",
};

export default function GovernancePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-300 font-semibold text-sm uppercase tracking-widest mb-4">
            Platform Governance
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Who Controls What — and Who Doesn&apos;t
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Governance on Child First is deliberately constrained. No single party can move funds
            unilaterally. This page documents how decisions are made today and where we are
            heading.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-20">

        {/* Principle */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Core Governance Principle</h2>
          <div className="bg-indigo-50 border-l-4 border-indigo-600 rounded-r-xl p-6">
            <p className="text-gray-800 text-base leading-relaxed">
              <strong>The smart contracts are the constitution.</strong> They enforce rules that no
              human — including the platform owner — can override. Governance exists only to fill
              the gaps the contracts cannot cover: approving operators, verifying impact claims, and
              evolving the platform over time.
            </p>
          </div>
        </section>

        {/* Role table */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Roles &amp; Permissions</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Can Do</th>
                  <th className="px-6 py-4 text-left">Cannot Do</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {roles.map((r) => (
                  <tr key={r.role} className="hover:bg-gray-50">
                    <td className="px-6 py-5 font-semibold text-gray-900 align-top whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-bold mr-2 ${r.color}`}
                      >
                        {r.badge}
                      </span>
                      {r.role}
                    </td>
                    <td className="px-6 py-5 text-green-800 align-top">
                      <ul className="space-y-1">
                        {r.can.map((c) => (
                          <li key={c} className="before:content-['✓'] before:mr-1 before:text-green-500">
                            {c}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-5 text-red-700 align-top">
                      <ul className="space-y-1">
                        {r.cannot.map((c) => (
                          <li key={c} className="before:content-['✗'] before:mr-1 before:text-red-400">
                            {c}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Disbursement flow */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How a Disbursement is Approved</h2>
          <p className="text-gray-600 mb-6">
            Every time funds move from a campaign contract to a beneficiary, <strong>two independent
            parties</strong> must sign off. This is enforced on-chain.
          </p>
          <div className="space-y-4">
            {disbursementSteps.map((s, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex-1 border border-gray-100">
                  <p className="font-semibold text-gray-900">{s.title}</p>
                  <p className="text-gray-600 text-sm mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Conflict of interest */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Conflict-of-Interest Policy</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {coiPolicies.map((p) => (
              <div key={p.title} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="text-2xl mb-2">{p.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{p.title}</h3>
                <p className="text-gray-600 text-sm">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Operator eligibility */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Becoming an Operator</h2>
          <p className="text-gray-600 mb-6">
            Operators are the on-the-ground administrators of individual campaigns. They submit
            milestone completion evidence and request disbursements. Operator approval is the
            primary human-trust gate on the platform.
          </p>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Eligibility Criteria</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              {operatorCriteria.map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">&#10003;</span>
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Application Process</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Submit organisation registration documents and proof of charitable status.</li>
                <li>Provide three verifiable references from beneficiary communities or co-operating NGOs.</li>
                <li>Agree to the Operator Code of Conduct and on-chain identity attestation.</li>
                <li>
                  Await platform review (&le;10 business days). Approved operators are whitelisted
                  at the CampaignFactory contract level.
                </li>
                <li>Pilot with a capped campaign (&le;500 MATIC) for an initial 60-day probation period.</li>
              </ol>
              <p className="text-xs text-gray-400 mt-4">
                Contact: operators@childfirst.io (launch mailbox — not active until Q3 2026).
              </p>
            </div>
          </div>
        </section>

        {/* Platform owner changes */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How Platform Rules Change</h2>
          <p className="text-gray-600 mb-4">
            Until the community DAO is established, changes to off-chain platform rules follow a
            structured review process:
          </p>
          <div className="space-y-3">
            {changeProcess.map((s, i) => (
              <div key={i} className="flex gap-4 items-center bg-gray-50 rounded-xl p-4 border border-gray-100">
                <span className="text-2xl font-black text-blue-200">{i + 1 < 10 ? `0${i + 1}` : i + 1}</span>
                <p className="text-gray-700 text-sm">{s}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Smart contract parameters (fee rate, milestone rules) require a contract upgrade.
            All upgrades will be announced at least 30 days in advance and the old contract will
            accept no new campaigns while the upgrade is pending.
          </p>
        </section>

        {/* Path to DAO */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Road to Community Governance</h2>
          <p className="text-gray-600 mb-6">
            The current governance model is intentionally simple — it removes attack surface during
            the platform&apos;s early, highest-risk phase. As volume and trust grow, control
            progressively transfers to the community.
          </p>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-8">
              {roadmap.map((phase) => (
                <div key={phase.phase} className="relative flex gap-6">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 ${
                      phase.active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {phase.icon}
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900">{phase.phase}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          phase.active
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {phase.timeframe}
                      </span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {phase.items.map((item) => (
                        <li key={item} className="before:content-['-'] before:mr-2 before:text-gray-300">
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

        {/* Whistleblower */}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Reporting Concerns</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            Any donor, operator, director, or member of the public may report suspected misconduct.
            Reports are treated as confidential. Retaliation against good-faith reporters is a
            permanent ban offence.
          </p>
          <p className="text-sm text-gray-600">
            <strong>Reporting channel:</strong> whistleblower@childfirst.io (encrypted via PGP on request) |{" "}
            <strong>Policy document:</strong>{" "}
            <a
              href="/WHISTLEBLOWER_POLICY.md"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WHISTLEBLOWER_POLICY.md
            </a>
          </p>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Verify Everything On-Chain
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Every rule described here is backed by auditable smart contract code. Don&apos;t take
            our word for it — read the contracts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/transparency"
              className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              View Transparency Report
            </Link>
            <Link
              href="/whitepaper"
              className="bg-gray-100 text-gray-900 font-bold px-8 py-3 rounded-xl hover:bg-gray-200 transition"
            >
              Read the Whitepaper
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ─── Data ──────────────────────────────────────────────────────────── */

const roles = [
  {
    role: "Platform Owner",
    badge: "Owner",
    color: "bg-purple-100 text-purple-700",
    can: [
      "Whitelist / blacklist operator addresses (off-chain review)",
      "Deploy upgraded contract versions",
      "Publish platform-wide policies",
      "Pause a campaign in emergency (on-chain pause function)",
    ],
    cannot: [
      "Move campaign funds directly",
      "Override a milestone outcome unilaterally",
      "Bypass the dual-approval disbursement gate",
      "Access donor wallet keys or personal data",
    ],
  },
  {
    role: "Campaign Operator",
    badge: "Operator",
    color: "bg-blue-100 text-blue-700",
    can: [
      "Deploy a new Campaign contract via the Factory",
      "Submit milestone completion evidence",
      "Request a disbursement (first signature)",
      "Update campaign metadata (title, description, images)",
    ],
    cannot: [
      "Receive funds without Director co-signature",
      "Modify the campaign's beneficiary address post-deploy",
      "Issue or revoke donor NFT receipts",
      "Access other operators' campaigns",
    ],
  },
  {
    role: "Campaign Director",
    badge: "Director",
    color: "bg-green-100 text-green-700",
    can: [
      "Review milestone evidence submitted by the Operator",
      "Approve or reject a disbursement request (second signature)",
      "Flag suspected fraud to the platform owner",
    ],
    cannot: [
      "Initiate a disbursement (must be Operator-first)",
      "Change beneficiary addresses",
      "Access donated funds without the Operator's co-signature",
    ],
  },
  {
    role: "Donor",
    badge: "Donor",
    color: "bg-amber-100 text-amber-700",
    can: [
      "Donate MATIC and receive a soulbound NFT receipt",
      "View all transactions, milestones, and disbursements on-chain",
      "Report campaign concerns to the platform",
      "Request a refund if a campaign closes below its goal (v2 roadmap)",
    ],
    cannot: [
      "Transfer their soulbound NFT receipt (prevents donation recycling)",
      "Control how funds are disbursed — that is the Director's role",
    ],
  },
];

const disbursementSteps = [
  {
    title: "Milestone Completion Claim",
    desc: "The Operator marks a milestone complete on-chain and attaches a hash of the supporting evidence (photos, receipts, reports) stored in decentralised storage.",
  },
  {
    title: "Director Review",
    desc: "The Director — independent of the Operator — reviews the evidence link and either approves or rejects the milestone.",
  },
  {
    title: "Dual-Sign Disbursement",
    desc: "With both signatures present, the campaign contract releases the milestone tranche directly to the pre-configured beneficiary address.",
  },
  {
    title: "On-Chain Record",
    desc: "A Disbursement event is emitted and permanently recorded. The amount, timestamp, beneficiary, and both signatories are visible to anyone on Polygonscan.",
  },
  {
    title: "NFT Metadata Update",
    desc: "Donor NFT receipts are updated to reflect the latest disbursement milestone — donors can always see the current impact state of their contribution.",
  },
];

const coiPolicies = [
  {
    icon: "🚫",
    title: "Operator ≠ Director",
    body: "The Director of a campaign must be independent of the Operator. A single entity cannot hold both roles on the same campaign.",
  },
  {
    icon: "🔒",
    title: "No Operator–Beneficiary Identity",
    body: "The operator organisation may not be the primary beneficiary of the funds they administer. Beneficiary addresses are locked at deploy time.",
  },
  {
    icon: "📣",
    title: "Disclosure Requirement",
    body: "Any financial relationship between an Operator and a Director must be disclosed to the platform owner before campaign launch.",
  },
  {
    icon: "✅",
    title: "Annual Re-attestation",
    body: "All approved operators re-attest conflict-of-interest disclosures annually. Failure to re-attest suspends new campaign creation.",
  },
];

const operatorCriteria = [
  "Registered legal entity (non-profit, NGO, CBO, or equivalent) with a minimum 12-month operating history.",
  "Published financial statements or equivalent third-party audit for the most recent fiscal year.",
  "Designated responsible officer who provides personal identity verification (KYC).",
  "Verifiable track record of direct child welfare programming.",
  "Signed commitment to the Child First Platform Code of Conduct.",
  "Ethereum/Polygon wallet under exclusive organisational control (not a custodial exchange address).",
];

const changeProcess = [
  "Proposed change is documented and published at governance.childfirst.io with a 14-day public comment period.",
  "All active operators are notified by email with a direct link to the proposal.",
  "Substantive objections are reviewed; platform owner responds publicly to each.",
  "Change is finalised or withdrawn. If finalised, a minimum 7-day notice period precedes implementation.",
  "Post-implementation review after 30 days; any negative outcomes trigger an immediate roll-back assessment.",
];

const roadmap = [
  {
    phase: "Phase 1 — Constrained Launch",
    timeframe: "Now → Q2 2026",
    icon: "1",
    active: true,
    items: [
      "Platform owner holds all administrative keys",
      "Operators whitelisted by manual review only",
      "Directors appointed per-campaign by the platform owner",
      "All governance decisions documented publicly",
    ],
  },
  {
    phase: "Phase 2 — Operator Council",
    timeframe: "Q3 2026",
    icon: "2",
    active: false,
    items: [
      "Top 5 operators by verified campaign volume form an advisory council",
      "Council votes on new operator applications (advisory, not binding)",
      "Dispute resolution board introduced for milestone disagreements",
      "Quarterly governance report published on-chain",
    ],
  },
  {
    phase: "Phase 3 — Community DAO",
    timeframe: "Q4 2026 — Q1 2027",
    icon: "3",
    active: false,
    items: [
      "Governance token or NFT-weighted voting introduced",
      "DAO controls platform fee parameters (capped at 0% indefinitely by constitution)",
      "Operator whitelisting passes to DAO vote",
      "Platform owner retains only emergency pause key",
      "Smart contract governance via timelock controller",
    ],
  },
  {
    phase: "Phase 4 — Full Decentralisation",
    timeframe: "2027+",
    icon: "4",
    active: false,
    items: [
      "Emergency pause key transferred to a multi-sig DAO committee",
      "Platform owner has no privileged access",
      "Constitution changes require 67% supermajority DAO vote",
      "All governance activity on-chain, fully auditable",
    ],
  },
];
