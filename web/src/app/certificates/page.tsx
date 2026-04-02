import type { Metadata } from "next";
import Link from "next/link";
import { CertificateCard } from "@/components/CertificateCard";
import { MyCertificates } from "@/components/MyCertificates";

export const metadata: Metadata = {
  title: "Certificates & NFTs | Child First Platform",
  description:
    "Every donation on Child First Platform generates a soulbound NFT certificate — permanent, on-chain proof of your contribution. Learn about Genesis Certificates, premium tiers, and how your certificate links your wallet to a child's better life.",
};

const TIERS = [
  {
    name: "Genesis Certificate",
    icon: "⭐",
    minMatic: 1,
    color: "#6366f1",
    bg: "#eef2ff",
    border: "#c7d2fe",
    features: [
      "Soulbound ERC-721 NFT",
      "Your wallet address embedded",
      "Campaign & amount on-chain",
      "Permanent Polygon record",
      "Viewable on OpenSea",
    ],
    cta: "Auto-minted on any donation",
    ctaHref: "/campaigns",
  },
  {
    name: "Patron Certificate",
    icon: "🥇",
    minMatic: 10,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fcd34d",
    features: [
      "Everything in Genesis",
      "Gold-bordered certificate art",
      "\"Patron\" designation on-chain",
      "Featured in impact gallery",
      "Downloadable high-res PDF",
    ],
    cta: "Donate 10+ MATIC",
    ctaHref: "/campaigns",
  },
  {
    name: "Guardian Certificate",
    icon: "💎",
    minMatic: 50,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    features: [
      "Everything in Patron",
      "Diamond-tier certificate artwork",
      "\"Guardian\" NFT designation",
      "Real-time impact tracking link",
      "Physical certificate (printed)",
      "Mention in annual report",
    ],
    cta: "Donate 50+ MATIC",
    ctaHref: "/campaigns",
  },
  {
    name: "Pillar Certificate",
    icon: "🏛️",
    minMatic: 100,
    color: "#0f172a",
    bg: "#f1f5f9",
    border: "#94a3b8",
    features: [
      "Everything in Guardian",
      "Custom campaign name in NFT",
      "\"Pillar\" lifetime designation",
      "Named in smart contract events",
      "Children's report card (PDF)",
      "Video impact story delivery",
      "Men of God governance voice",
    ],
    cta: "Donate 100+ MATIC",
    ctaHref: "/campaigns",
  },
];

const HOW_IT_WORKS = [
  {
    icon: "💰",
    step: "1",
    title: "Make a Donation",
    body: "Connect your wallet and donate MATIC to any active campaign. Any amount — no minimum.",
  },
  {
    icon: "⛓️",
    step: "2",
    title: "Blockchain Confirms",
    body: "Your transaction is confirmed on Polygon in ~2 seconds. Permanent. Unalterable.",
  },
  {
    icon: "🎨",
    step: "3",
    title: "NFT Certificate Minted",
    body: "The smart contract automatically mints a soulbound ERC-721 NFT to your wallet — instant proof.",
  },
  {
    icon: "🔍",
    step: "4",
    title: "Verify Anywhere",
    body: "Your certificate is visible on OpenSea, Polygonscan, and your wallet — forever linked to your address.",
  },
];

const FAQS = [
  {
    q: "What is a soulbound NFT?",
    a: "A soulbound NFT is a non-transferable token. It stays permanently in the wallet that made the donation — it cannot be sold, traded, or moved. It is permanent on-chain proof of your contribution.",
  },
  {
    q: "How do I view my certificate?",
    a: "Connect your wallet on this site. Your certificates appear automatically. You can also search your wallet address on Polygonscan or OpenSea and filter for the Child First Receipt contract.",
  },
  {
    q: "Can I download a printable certificate?",
    a: "Yes — Patron tier and above receive a downloadable high-resolution PDF certificate, branded by Men of God and stamped with your on-chain transaction data.",
  },
  {
    q: "Are certificates linked to specific children?",
    a: "At Guardian and Pillar tiers, your certificate is paired with an impact report linking your specific donation bloc to a verified beneficiary milestone — a real, documented link between your wallet and a child's improved life.",
  },
  {
    q: "How does the platform generate revenue?",
    a: "Child First Platform charges 0% fees on donations. Revenue is generated through premium certificate printings, campaign featured placements, and the Men of God Governance Fund — a separate sustaining vessel supported by optional contributions from the community.",
  },
];

export default function CertificatesPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-gray-950 to-gray-800 text-white py-24 px-4 relative overflow-hidden">
        {/* Background gold shimmer */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(251,191,36,0.07) 0%, transparent 70%)",
        }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-amber-500/30 text-amber-400 bg-amber-500/10 mb-5">
            NFT Certificates — A System of Men of God
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-5 leading-tight">
            Every Donation,{" "}
            <span className="text-amber-400">Certified</span>{" "}
            Forever
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            When you donate through Child First Platform, a soulbound NFT certificate is automatically
            minted to your wallet — permanent, on-chain, undeniable proof that your generosity linked
            your address to a child&apos;s better life.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/campaigns"
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold py-3 px-6 rounded-xl transition-all hover:scale-105"
            >
              Donate &amp; Earn a Certificate →
            </Link>
            <a
              href="https://opensea.io/collection/child-first-receipt"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-600 hover:border-amber-500 text-white font-bold py-3 px-6 rounded-xl transition-all hover:text-amber-400"
            >
              View Collection on OpenSea ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── My Certificates (live wallet) ── */}
      <MyCertificates />

      {/* ── How It Works ── */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
            How Certificates Work
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-0.5 rounded-full mb-3">
                  STEP {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample Certificate ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Sample Certificate
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              This is what your NFT certificate looks like. Yours will contain your real wallet address,
              donation amount, campaign name, and Polygon transaction hash.
            </p>
          </div>
          <CertificateCard
            donorAddress="0xDon0r5AbC1234…5678"
            amount="25"
            campaignName="Clean Water for Lagos Children"
            tokenId="#0042"
            blockNumber="68,432,117"
            preview={true}
          />
          <p className="text-center text-xs text-gray-400 mt-4">
            Sample only — your real certificate is minted automatically when you donate.
          </p>
        </div>
      </section>

      {/* ── Certificate Tiers ── */}
      <section className="bg-gray-950 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-amber-500/30 text-amber-400 bg-amber-500/10 mb-4">
              Genesis Collection
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Certificate Tiers
            </h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm">
              Every donation earns a certificate. Larger contributions unlock richer tiers
              with more features, including printable PDFs and real-world impact reports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl p-6 border-2 flex flex-col"
                style={{ borderColor: tier.border, background: tier.bg }}
              >
                <div className="text-4xl mb-3">{tier.icon}</div>
                <h3 className="font-extrabold text-xl mb-1" style={{ color: tier.color }}>
                  {tier.name}
                </h3>
                <p className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">
                  {tier.minMatic}+ MATIC
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <span style={{ color: tier.color }} className="mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.ctaHref}
                  className="rounded-xl py-2.5 px-4 text-center text-sm font-bold transition-all hover:opacity-90 hover:scale-105"
                  style={{ background: tier.color, color: "white" }}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NFT Marketplace / OpenSea ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">🌊</div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            View the Collection on OpenSea
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-lg mx-auto">
            All Child First Platform donation receipts are published as soulbound NFTs on Polygon.
            You can search for any wallet address to see its certificates, verify authenticity,
            and explore the full collection history on OpenSea.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://opensea.io/collection/child-first-receipt"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-105"
            >
              Browse on OpenSea ↗
            </a>
            <a
              href="https://polygonscan.com/address/0x2Bd17aD3abE1783B2006B47A9d415457178C2422"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-indigo-300 text-indigo-700 font-bold py-3 px-6 rounded-xl hover:bg-indigo-50 transition-all"
            >
              Verify Contract on Polygonscan ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── Support the Platform ── */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
            Support the Men of God Platform
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xl mx-auto">
            Child First Platform charges 0% fees on charitable donations. Operational costs are
            supported through the Men of God Governance Fund — an optional contribution vessel
            for those who want to sustain the infrastructure itself.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
            {[
              { label: "Sustainer", amount: "5 MATIC/mo", icon: "🌱" },
              { label: "Builder", amount: "20 MATIC/mo", icon: "🏗️" },
              { label: "Pillar", amount: "100 MATIC/mo", icon: "🏛️" },
            ].map((tier) => (
              <div key={tier.label} className="border border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 transition-colors">
                <div className="text-3xl mb-2">{tier.icon}</div>
                <p className="font-bold text-gray-900 text-sm">{tier.label}</p>
                <p className="text-xs text-gray-500 mt-1">{tier.amount}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            Governance Fund support is entirely optional. 100% of campaign donations always go to children.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-14 px-4 bg-gradient-to-br from-blue-900 to-blue-700 text-white text-center">
        <div className="max-w-xl mx-auto">
          <div className="text-5xl mb-4">🌟</div>
          <h2 className="text-2xl font-extrabold mb-3">Your Wallet. A Child&apos;s Story.</h2>
          <p className="text-blue-200 text-sm mb-6 leading-relaxed">
            Every donation you make through Child First Platform is permanently recorded.
            Your NFT certificate is the immutable link between your address and a life you helped change.
            That is what it means to be a system of Men of God.
          </p>
          <Link
            href="/campaigns"
            className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-extrabold py-3 px-8 rounded-xl transition-all hover:scale-105 inline-block"
          >
            Browse Campaigns &amp; Earn Your Certificate →
          </Link>
        </div>
      </section>
    </div>
  );
}
