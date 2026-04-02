import type { MilestoneData } from "@/types";

interface Props {
  milestones: MilestoneData[];
}

const STATUS_LABEL = (m: MilestoneData) => {
  if (m.disbursed)        return { label: "Disbursed",         cls: "bg-green-100 text-green-700",  dot: "bg-green-500"  };
  if (m.directorApproved) return { label: "Dual Approved",     cls: "bg-blue-100 text-blue-700",    dot: "bg-blue-500"   };
  if (m.operatorApproved) return { label: "Awaiting Director", cls: "bg-yellow-100 text-yellow-700",dot: "bg-yellow-400" };
  return                         { label: "Pending",           cls: "bg-gray-100 text-gray-500",    dot: "bg-gray-300"   };
};

export function MilestoneTracker({ milestones }: Props) {
  if (milestones.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No milestones added yet. Milestones are proposed by the campaign operator.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((m, i) => {
        const s = STATUS_LABEL(m);
        const maticAmt = (Number(m.targetAmount) / 1e18).toFixed(3);
        return (
          <div
            key={i}
            className={`rounded-xl border p-4 ${m.disbursed ? "border-green-200 bg-green-50" : "border-gray-200 bg-white"}`}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0 ${s.dot}`} />
                <span className="font-semibold text-gray-900 text-sm">
                  Milestone {i + 1}
                </span>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${s.cls}`}>
                {s.label}
              </span>
            </div>

            <p className="text-sm text-gray-700 ml-5 mb-2">{m.description}</p>

            <div className="ml-5 flex flex-wrap gap-4 text-xs text-gray-500">
              <span>Amount: <strong className="text-gray-800">{maticAmt} MATIC</strong></span>
              <span>Operator: <span className="font-semibold">{m.operatorApproved ? "Approved" : "Pending"}</span></span>
              <span>Director: <span className="font-semibold">{m.directorApproved ? "Approved" : "Pending"}</span></span>
            </div>

            {m.disbursed && (
              <div className="ml-5 mt-2 flex items-center gap-1 text-xs text-green-600 font-semibold">
                <span>&#10003;</span> Funds sent on-chain to recipient
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
