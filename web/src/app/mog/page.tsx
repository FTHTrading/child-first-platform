import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Men of God | Child First Platform",
  description:
    "The Men of God (MOG) ecosystem — on-chain ministry, prayer wall, tithing vault, missions, and DAO governance on Polygon.",
};

const CONTRACT_LINKS = [
  {
    label: "MOGToken",
    address: "0x1Bb149A1e5d858081dc2EAb714069194521Ef0C5",
    description: "Governance & reward token (21M cap)",
  },
  {
    label: "FaithBadge",
    address: "0xeE4dFE543f948bb4fa316c361cfa5B5433215BdF",
    description: "Soulbound achievement NFTs",
  },
  {
    label: "PrayerWall",
    address: "0x79110B6cC743c3000829457a0201077aAca82d08",
    description: "On-chain prayer commitment network",
  },
  {
    label: "TithingVault",
    address: "0xD4A6382cFA89b8Aa82D5c23eC3280FA6082f64EF",
    description: "Transparent tithe & offering ledger",
  },
  {
    label: "MOGRegistry",
    address: "0xD8544885f6dbA51834dE5F8D93935a1e6Aa30A4F",
    description: "On-chain member registry",
  },
  {
    label: "MOGGovernor",
    address: "0xca9E53610B50509D44923C78cf51AE3caC844D92",
    description: "DAO governance (token-weighted voting)",
  },
  {
    label: "MOGTimelock",
    address: "0xA937444bD799Ab6a16BFF9c3e9048473BB31959B",
    description: "48-hour timelock controller",
  },
  {
    label: "MissionFactory",
    address: "0x617C11FaBe683D2047Ade9E7CbD2150dD176867E",
    description: "Per-ministry mission deployer",
  },
];

const FEATURES = [
  {
    href: "/mog/prayer-wall",
    icon: "🙏",
    title: "Prayer Wall",
    body: "Submit and intercede for prayer requests on-chain. Text stays private — only a cryptographic commitment is published.",
    cta: "View Prayers",
    color: "from-purple-600 to-violet-700",
    badge: "Live",
  },
  {
    href: "/mog/members",
    icon: "✝️",
    title: "Member Registry",
    body: "Register your ministry on-chain. Earn MOG tokens and FaithBadge NFTs as you grow from Member to Elder to Prophet to Apostle.",
    cta: "Join Registry",
    color: "from-blue-600 to-indigo-700",
    badge: "Live",
  },
  {
    href: "/mog/tithe",
    icon: "💰",
    title: "Tithing Vault",
    body: "Give tithes and offerings on-chain. Every contribution is permanently recorded and earns MOG rewards. Distributions require dual approval.",
    cta: "Give Now",
    color: "from-amber-500 to-orange-600",
    badge: "Live",
  },
  {
    href: "/mog/missions",
    icon: "🌍",
    title: "Missions",
    body: "Deploy and fund ministry missions on Polygon. Each mission gets its own transparent vault with milestone-based disbursement.",
    cta: "See Missions",
    color: "from-green-600 to-emerald-700",
    badge: "Live",
  },
  {
    href: "/governance",
    icon: "🏛️",
    title: "DAO Governance",
    body: "MOG token holders vote on platform decisions. Proposals pass through a 48-hour timelock before execution — admin key renounced.",
    cta: "View Governance",
    color: "from-gray-700 to-slate-800",
    badge: "Active",
  },
];

export default function MOGPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase border border-white/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live on Polygon Mainnet
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight">
            Men of God
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed mb-8">
            A fully on-chain ministry ecosystem. Prayer, tithing, missions, and DAO governance —
            all transparent, immutable, and governed by the community.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/mog/members"
              className="bg-white text-slate-900 font-bold px-8 py-3.5 rounded-xl hover:bg-purple-50 transition shadow-lg text-sm"
            >
              Join the Registry →
            </Link>
            <Link
              href="/mog/prayer-wall"
              className="border border-white/30 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition text-sm"
            >
              Prayer Wall
            </Link>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          The MOG Ecosystem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="group relative rounded-2xl border border-gray-200 bg-white hover:shadow-xl transition-all duration-200 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${f.color}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{f.icon}</span>
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    {f.badge}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-purple-700 transition-colors">
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{f.body}</p>
                <span className="text-sm font-semibold text-purple-600 group-hover:underline">
                  {f.cta} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MOG Token section */}
      <section className="bg-gradient-to-r from-purple-50 to-indigo-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">MOG Token</h2>
          <p className="text-gray-500 text-center text-sm mb-10 max-w-xl mx-auto">
            Earned through ministry activity. Used for DAO governance. Capped at 21,000,000 — a
            number of completion, like Scripture.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Max Supply",      value: "21,000,000",  sub: "MOG (hard cap)"       },
              { label: "Registration",    value: "100 MOG",     sub: "per member"            },
              { label: "Tithing Reward",  value: "10 MOG",      sub: "per MATIC contributed" },
              { label: "Apostle Reward",  value: "2,500 MOG",   sub: "highest tier"          },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-purple-100 p-4 text-center shadow-sm">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">{s.label}</p>
                <p className="text-xl font-black text-purple-700">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deployed contracts */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-8 text-center">
          Deployed Contracts — Polygon Mainnet
        </h2>
        <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">Contract</th>
                <th className="px-5 py-3 text-left hidden sm:table-cell">Description</th>
                <th className="px-5 py-3 text-left">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {CONTRACT_LINKS.map((c) => (
                <tr key={c.label} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">{c.label}</td>
                  <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">{c.description}</td>
                  <td className="px-5 py-4">
                    <a
                      href={`https://polygonscan.com/address/${c.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-purple-600 hover:underline"
                    >
                      {c.address.slice(0, 8)}…{c.address.slice(-6)}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          All 8 contracts source-verified on Polygonscan. Admin key renounced — governed by DAO.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4">Ready to Join?</h2>
          <p className="text-slate-300 mb-8 text-sm max-w-xl mx-auto">
            Connect your wallet, register your ministry, and start earning MOG tokens through
            prayer, tithing, and mission work.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/mog/members"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-lg text-sm"
            >
              Register Your Ministry
            </Link>
            <Link
              href="/mog/prayer-wall"
              className="border border-slate-600 text-slate-200 font-bold px-8 py-3.5 rounded-xl hover:bg-slate-800 transition text-sm"
            >
              Go to Prayer Wall
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
