import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { verifyJWT } from "../../../lib/auth";

export async function POST(req: Request) {
  const auth = await verifyJWT(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { stakeId } = await req.json();
    if (!stakeId) return NextResponse.json({ error: "stakeId required" }, { status: 400 });

    const stake = await prisma.stake.findFirst({
      where: { id: stakeId, userId: auth.userId, isActive: true },
    });
    if (!stake) return NextResponse.json({ error: "Stake not found" }, { status: 404 });

    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: {},
      create: {},
    });

    const now = new Date();
    const lastClaim = stake.lastClaim ?? stake.startDate;
    const msSince = now.getTime() - lastClaim.getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    if (msSince < oneDay) {
      return NextResponse.json(
        { error: "Already claimed today. Try again in 24h." },
        { status: 400 }
      );
    }

    const daysAvailable = Math.floor(msSince / oneDay);
    const claimAmount = Number(stake.amount) * settings.dailyRate * daysAvailable;

    const claim = await prisma.claim.create({
      data: { userId: auth.userId, stakeId, amount: claimAmount },
    });

    await prisma.stake.update({
      where: { id: stakeId },
      data: { lastClaim: now },
    });

    // TODO: trigger on-chain payout from the staking contract for `claimAmount`.
    return NextResponse.json({ claim, amount: claimAmount, days: daysAvailable });
  } catch (e) {
    console.error("[/api/stake/claim]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
