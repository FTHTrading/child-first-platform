import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok:      true,
    service: "child-first-platform-web",
    ts:      new Date().toISOString(),
  });
}
