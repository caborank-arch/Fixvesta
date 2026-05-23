import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { verifyJWT, isAdmin } from "../../../lib/auth";

export async function GET() {
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {},
  });
  return NextResponse.json(settings);
}

export async function PATCH(req: Request) {
  const auth = await verifyJWT(req);
  if (!auth || !isAdmin(auth.walletAddress)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const allowed: Record<string, unknown> = {};
    if (typeof body.dailyRate === "number") allowed.dailyRate = body.dailyRate;
    if (typeof body.stakeDays === "number") allowed.stakeDays = body.stakeDays;
    if (typeof body.refPercent === "number") allowed.refPercent = body.refPercent;
    if (typeof body.minStake === "number") allowed.minStake = body.minStake;
    if (typeof body.maintenance === "boolean") allowed.maintenance = body.maintenance;

    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: allowed,
      create: { ...allowed },
    });
    return NextResponse.json(settings);
  } catch (e) {
    console.error("[/api/admin/settings PATCH]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
