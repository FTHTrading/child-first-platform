import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const campaign = await prisma.campaign.findUnique({
      where:   { campaignId: id },
      include: {
        milestones: { orderBy: { milestoneIndex: "asc" } },
        donations:  { orderBy: { createdAt: "desc" }, take: 10 },
        _count:     { select: { donations: true } },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({
      campaign: {
        campaignId:       campaign.campaignId,
        title:            campaign.title,
        description:      campaign.description,
        imageUrl:         campaign.imageUrl,
        location:         campaign.location,
        organizationName: campaign.organizationName,
        contractAddress:  campaign.contractAddress,
        goalAmount:       campaign.goalAmount.toString(),
        deadline:         campaign.deadline.toISOString(),
        status:           campaign.status,
        donationCount:    campaign._count.donations,
        createdAt:        campaign.createdAt.toISOString(),
      },
      milestones: campaign.milestones.map((m) => ({
        index:        m.milestoneIndex,
        description:  m.description,
        targetAmount: m.targetAmount.toString(),
        recipient:    m.recipient,
        evidenceUrl:  m.evidenceUrl,
        status:       m.status,
      })),
      recentDonations: campaign.donations.map((d) => ({
        donorAddress: d.donorAddress.slice(0, 6) + "..." + d.donorAddress.slice(-4),
        amountMatic:  d.amountMatic.toString(),
        txHash:       d.txHash,
        createdAt:    d.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("[GET /api/campaigns/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
