import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/donations — called after a successful on-chain tx to record off-chain metadata
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { campaignId, txHash, donorAddress, amountMatic, receiptTokenId } = body;

    if (!campaignId || !txHash || !donorAddress || !amountMatic) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Basic address format validation (hex, 42 chars)
    if (!/^0x[0-9a-fA-F]{40}$/.test(donorAddress)) {
      return NextResponse.json({ error: "Invalid donor address" }, { status: 400 });
    }
    if (!/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
      return NextResponse.json({ error: "Invalid transaction hash" }, { status: 400 });
    }

    const donation = await prisma.donation.create({
      data: {
        campaignId:    String(campaignId),
        txHash:        String(txHash),
        donorAddress:  String(donorAddress).toLowerCase(),
        amountMatic:   parseFloat(String(amountMatic)),
        receiptTokenId: receiptTokenId != null ? parseInt(String(receiptTokenId)) : null,
      },
    });

    return NextResponse.json({ ok: true, id: donation.id }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "Donation already recorded" }, { status: 409 });
    }
    console.error("[POST /api/donations]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
