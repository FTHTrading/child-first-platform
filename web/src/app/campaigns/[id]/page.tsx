import { notFound }      from "next/navigation";
import { CampaignDetail } from "@/components/CampaignDetail";
import type { CampaignRecord } from "@/types";

async function getCampaign(id: string): Promise<CampaignRecord | null> {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
    const res  = await fetch(`${base}/api/campaigns/${id}`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.campaign ?? null;
  } catch {
    return null;
  }
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }   = await params;
  const campaign = await getCampaign(id);

  if (!campaign) notFound();

  const address = campaign.contractAddress as `0x${string}` | undefined;

  return <CampaignDetail campaign={campaign} campaignAddress={address} />;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id }   = await params;
  const campaign = await getCampaign(id);
  return {
    title:       campaign ? `${campaign.title} | Child First Platform` : "Campaign Not Found",
    description: campaign?.description?.slice(0, 160),
  };
}
