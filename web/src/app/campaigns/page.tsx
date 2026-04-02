import { CampaignCard } from "@/components/CampaignCard";
import type { CampaignRecord } from "@/types";

async function getCampaigns(status?: string): Promise<CampaignRecord[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
    const qs   = status ? `?status=${status}` : "";
    const res  = await fetch(`${base}/api/campaigns${qs}`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.campaigns ?? [];
  } catch {
    return [];
  }
}

const FILTER_OPTIONS = [
  { label: "All",       value: ""          },
  { label: "Active",    value: "ACTIVE"    },
  { label: "Completed", value: "COMPLETED" },
];

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const campaigns   = await getCampaigns(status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Campaigns</h1>
        <p className="text-gray-500">Every campaign is backed by a verified operator and on-chain smart contract.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {FILTER_OPTIONS.map((f) => (
          <a
            key={f.value}
            href={f.value ? `/campaigns?status=${f.value}` : "/campaigns"}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
              (status ?? "") === f.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <CampaignCard key={c.campaignId} campaign={c} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-4">&#128270;</p>
          <p className="text-lg font-medium">No campaigns found.</p>
          <p className="text-sm mt-2">Try a different filter.</p>
        </div>
      )}
    </div>
  );
}
