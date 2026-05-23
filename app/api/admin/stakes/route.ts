import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { verifyJWT, isAdmin } from "../../../lib/auth";

export async function GET(req: Request) {
  const auth = await verifyJWT(req);
  if (!auth || !isAdmin(auth.walletAddress)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const currency = searchParams.get("currency");
  const status = searchParams.get("status");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const pageSize = 25;

  const where: Record<string, unknown> = {};
  if (currency) where.currency = currency;
  if (status) where.status = status;

  const [stakes, total, byCurrency] = await Promise.all([
    prisma.stake.findMany({
      where,
      include: { user: { select: { walletAddress: true } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { startDate: "desc" },
    }),
    prisma.stake.count({ where }),
    prisma.stake.groupBy({
      by: ["currency"],
      _sum: { amount: true },
      where: { isActive: true },
    }),
  ]);

  return NextResponse.json({ stakes, total, page, pageSize, tvl: byCurrency });
}
