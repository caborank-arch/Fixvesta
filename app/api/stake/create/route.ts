import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { verifyJWT } from "../../../lib/auth";

export async function POST(req: Request) {
  const auth = await verifyJWT(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { currency, amount, txHash } = await req.json();

    if (!currency || !amount || !txHash) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (!["USDT_BEP20", "USDT_TRX", "USDC_SOL"].includes(currency)) {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    }

    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: {},
      create: {},
    });

    if (settings.maintenance) {
      return NextResponse.json({ error: "Maintenance mode" }, { status: 503 });
    }
    if (Number(amount) < settings.minStake) {
      return NextResponse.json({ error: `Minimum stake is ${settings.minStake}` }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: auth.userId } });
    if (!dbUser || dbUser.isBanned) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const endDate = new Date(Date.now() + settings.stakeDays * 24 * 60 * 60 * 1000);

    const stake = await prisma.stake.create({
      data: {
        userId: auth.userId,
        currency,
        amount,
        txHash,
        endDate,
      },
    });

    if (dbUser.referredBy) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: dbUser.referredBy },
      });
      if (referrer && referrer.id !== dbUser.id) {
        const refAmount = Number(amount) * settings.refPercent;
        await prisma.referralEarning.create({
          data: {
            referrerId: referrer.id,
            refereeId: dbUser.id,
            stakeId: stake.id,
            amount: refAmount,
          },
        });
        await prisma.user.update({
          where: { id: referrer.id },
          data: { bonusBalance: { increment: refAmount } },
        });
      }
    }

    return NextResponse.json({ stake });
  } catch (e) {
    console.error("[/api/stake/create]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
