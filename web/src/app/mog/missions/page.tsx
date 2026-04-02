import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Missions | Men of God Platform",
  description:
    "Ministry missions on the Men of God platform — each mission gets its own transparent on-chain vault with milestone-based disbursement.",
};

export default function MissionsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-green-700 to-emerald-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🌍</div>
          <h1 className="text-4xl font-extrabold mb-3">Missions</h1>
          <p className="text-green-100 text-sm max-w-xl mx-auto">
            Ministry missions deployed on Polygon. Each mission is its own smart contract —
            transparent funding, milestone-based disbursement, dual-approval governance.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* How it works */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Missions Work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Register & Create",
                body: "Registered MOG members can deploy a new Mission contract via MissionFactory. Each mission has its own Polygon address.",
                icon: "📋",
              },
              {
                step: "2",
                title: "Community Funds",
                body: "Anyone can donate MATIC/POL to any mission. Funds are held in the mission's isolated vault — not pooled, not commingled.",
                icon: "💸",
              },
              {
                step: "3",
                title: "Milestone Disbursement",
                body: "Funds release only when both the Operator and Director approve a milestone. Every disbursement is permanent on-chain.",
                icon: "✅",
              },
            ].map((s) => (
              <div key={s.step} className="text-center bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                  STEP {s.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Mission Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: "🍞", label: "Food Ministry" },
              { icon: "🏠", label: "Shelter" },
              { icon: "📚", label: "Education" },
              { icon: "💊", label: "Healthcare" },
              { icon: "🌱", label: "Agriculture" },
              { icon: "⛪", label: "Church Plant" },
              { icon: "✝️", label: "Evangelism" },
              { icon: "🤝", label: "Other" },
            ].map((c) => (
              <div key={c.label} className="text-center bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <div className="text-3xl mb-2">{c.icon}</div>
                <p className="text-sm font-semibold text-gray-700">{c.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Active missions placeholder */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Missions</h2>
          <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl text-gray-400">
            <div className="text-4xl mb-4">🌍</div>
            <p className="font-semibold text-gray-500">No missions deployed yet</p>
            <p className="text-sm mt-2 mb-6">
              Be the first to launch a ministry mission on the Men of God platform.
            </p>
            <Link
              href="/mog/members"
              className="inline-block bg-green-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-green-700 transition text-sm"
            >
              Register to Create a Mission
            </Link>
          </div>
        </section>

        {/* Contract info */}
        <section className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">MissionFactory Contract</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Contract Address (Polygon Mainnet)</p>
              <a
                href="https://polygonscan.com/address/0x617C11FaBe683D2047Ade9E7CbD2150dD176867E"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-purple-600 hover:underline"
              >
                0x617C11FaBe683D2047Ade9E7CbD2150dD176867E
              </a>
            </div>
            <a
              href="https://polygonscan.com/address/0x617C11FaBe683D2047Ade9E7CbD2150dD176867E"
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap bg-white border border-gray-200 text-gray-700 font-semibold text-sm px-4 py-2 rounded-xl hover:border-purple-400 hover:text-purple-600 transition"
            >
              View on Polygonscan →
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Source-verified. Creators must be registered in MOGRegistry. Each deployed mission gets a
            BUILDER FaithBadge on completion.
          </p>
        </section>
      </div>
    </div>
  );
}
