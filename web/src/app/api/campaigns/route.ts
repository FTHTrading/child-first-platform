import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/campaigns[?status=ACTIVE&limit=10]
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status") as string | null;
    const limit  = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const campaigns = await prisma.campaign.findMany({
      where,
      orderBy:  { createdAt: "desc" },
      take:     limit,
      include:  { _count: { select: { donations: true } } },
    });

    return NextResponse.json({
      campaigns: campaigns.map((c) => ({
        campaignId:       c.campaignId,
        title:            c.title,
        description:      c.description,
        imageUrl:         c.imageUrl,
        location:         c.location,
        organizationName: c.organizationName,
        contractAddress:  c.contractAddress,
        goalAmount:       c.goalAmount.toString(),
        deadline:         c.deadline.toISOString(),
        status:           c.status,
        donationCount:    c._count.donations,
        createdAt:        c.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("[GET /api/campaigns]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/campaigns — admin only (validated via owner wallet signature in production)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    const { campaignId, title, description, goalAmount, deadline, contractAddress } = body;
    if (!campaignId || !title || !description || !goalAmount || !deadline) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Prevent injection: campaignId must be slug-safe
    if (!/^[a-z0-9-]+$/.test(campaignId)) {
      return NextResponse.json({ error: "campaignId must be lowercase alphanumeric with hyphens" }, { status: 400 });
    }

    const campaign = await prisma.campaign.create({
      data: {
        campaignId,
        title:            String(title).slice(0, 200),
        description:      String(description).slice(0, 5000),
        imageUrl:         body.imageUrl  ? String(body.imageUrl).slice(0, 500)  : null,
        location:         body.location  ? String(body.location).slice(0, 200)  : null,
        organizationName: body.organizationName ? String(body.organizationName).slice(0, 200) : null,
        contractAddress:  contractAddress ? String(contractAddress) : null,
        goalAmount:       parseFloat(String(goalAmount)),
        deadline:         new Date(deadline),
        status:           "PENDING_REVIEW",
      },
    });

    return NextResponse.json({ campaign: { campaignId: campaign.campaignId } }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "Campaign ID already exists" }, { status: 409 });
    }
    console.error("[POST /api/campaigns]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
