import Link from "next/link";
import type { CampaignRecord } from "@/types";

interface Props {
  campaign: CampaignRecord;
  raised?:  bigint;   // live on-chain value (optional — fetched separately)
}

export function CampaignCard({ campaign, raised }: Props) {
  const goalMatic  = parseFloat(campaign.goalAmount);
  const raisedMatic = raised ? Number(raised) / 1e18 : 0;
  const pct        = goalMatic > 0 ? Math.min((raisedMatic / goalMatic) * 100, 100) : 0;
  const daysLeft   = Math.max(0, Math.ceil(
    (new Date(campaign.deadline).getTime() - Date.now()) / 86_400_000,
  ));

  const statusColor: Record<string, string> = {
    ACTIVE:         "bg-green-100 text-green-700",
    PENDING_REVIEW: "bg-yellow-100 text-yellow-700",
    PAUSED:         "bg-gray-100 text-gray-600",
    COMPLETED:      "bg-blue-100 text-blue-700",
    CLOSED:         "bg-red-100 text-red-600",
  };

  return (
    <Link href={`/campaigns/${campaign.campaignId}`} className="block group">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">

        {/* Image */}
        {campaign.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            className="w-full h-44 object-cover group-hover:opacity-95 transition"
          />
        ) : (
          <div className="w-full h-44 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <span className="text-5xl">&#128140;</span>
          </div>
        )}

        <div className="p-5">
          {/* Status + org */}
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[campaign.status] ?? statusColor.PENDING_REVIEW}`}>
              {campaign.status.replace("_", " ")}
            </span>
            {campaign.organizationName && (
              <span className="text-xs text-gray-500 truncate max-w-[140px]">
                {campaign.organizationName}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
            {campaign.title}
          </h3>
          {campaign.location && (
            <p className="text-xs text-gray-500 mb-3">{campaign.location}</p>
          )}

          {/* Progress */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span><strong className="text-gray-800">{raisedMatic.toFixed(2)} MATIC</strong> raised</span>
              <span>goal: {goalMatic.toFixed(1)} MATIC</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 text-right">{pct.toFixed(0)}% funded</p>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
            </span>
            <span className="text-xs font-semibold text-blue-600 group-hover:underline">
              Donate &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
