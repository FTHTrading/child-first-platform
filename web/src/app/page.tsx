import { Hero }         from "@/components/Hero";
import { CampaignCard } from "@/components/CampaignCard";
import type { CampaignRecord } from "@/types";
import Link from "next/link";

async function getFeaturedCampaigns(): Promise<CampaignRecord[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
    const res  = await fetch(`${base}/api/campaigns?status=ACTIVE&limit=3`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.campaigns ?? [];
  } catch {
    return [];
  }
}

const HOW_IT_WORKS = [
  {
    step: "1",
    icon: "&#128176;",
    title: "Connect & Donate",
    body:  "Connect your crypto wallet and donate MATIC to any campaign. No account needed.",
  },
  {
    step: "2",
    icon: "&#127989;",
    title: "Receive NFT Receipt",
    body:  "A soulbound NFT is instantly minted to your wallet — immutable proof of your contribution.",
  },
  {
    step: "3",
    icon: "&#9989;",
    title: "Dual-Approved Disburse",
    body:  "Funds only move when both an independent Operator AND Director approve each milestone.",
  },
];

export default async function HomePage() {
  const campaigns = await getFeaturedCampaigns();

  return (
    <>
      <Hero />

      {/* How it works */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl mb-4" dangerouslySetInnerHTML={{ __html: item.icon }} />
                <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-0.5 rounded-full mb-3">
                  STEP {item.step}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured campaigns */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Active Campaigns</h2>
            <Link href="/campaigns" className="text-blue-600 font-semibold hover:underline text-sm">
              View all &rarr;
            </Link>
          </div>

          {campaigns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((c) => (
                <CampaignCard key={c.campaignId} campaign={c} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">No active campaigns yet.</p>
              <p className="text-sm mt-2">Check back soon — campaigns are being reviewed.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
