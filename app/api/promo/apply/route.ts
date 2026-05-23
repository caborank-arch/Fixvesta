import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { verifyJWT } from "../../../lib/auth";

export async function POST(req: Request) {
  const auth = await verifyJWT(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });

    const promo = await prisma.promoCode.findUnique({ where: { code } });
    if (!promo || !promo.isActive) {
      return NextResponse.json({ error: "Invalid promo code" }, { status: 400 });
    }
    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return NextResponse.json({ error: "Promo expired" }, { status: 400 });
    }
    if (promo.usedCount >= promo.usageLimit) {
      return NextResponse.json({ error: "Promo fully used" }, { status: 400 });
    }

    const existing = await prisma.promoUse.findFirst({
      where: { promoId: promo.id, userId: auth.userId },
    });
    if (existing) {
      return NextResponse.json({ error: "Already used" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.promoUse.create({ data: { promoId: promo.id, userId: auth.userId } }),
      prisma.promoCode.update({
        where: { id: promo.id },
        data: { usedCount: { increment: 1 } },
      }),
      prisma.user.update({
        where: { id: auth.userId },
        data: { bonusBalance: { increment: Number(promo.bonusAmount) } },
      }),
    ]);

    return NextResponse.json({ ok: true, bonus: promo.bonusAmount });
  } catch (e) {
    console.error("[/api/promo/apply]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
