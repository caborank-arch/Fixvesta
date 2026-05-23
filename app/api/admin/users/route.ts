import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { verifyJWT, isAdmin } from "../../../lib/auth";

export async function GET(req: Request) {
  const auth = await verifyJWT(req);
  if (!auth || !isAdmin(auth.walletAddress)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = (searchParams.get("search") ?? "").toLowerCase();
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const pageSize = 20;

  const where = search ? { walletAddress: { contains: search } } : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { stakes: true, _count: { select: { stakes: true, claims: true } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ users, total, page, pageSize });
}

export async function PATCH(req: Request) {
  const auth = await verifyJWT(req);
  if (!auth || !isAdmin(auth.walletAddress)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { userId, isBanned, bonusAmount } = await req.json();
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const data: Record<string, unknown> = {};
    if (typeof isBanned === "boolean") data.isBanned = isBanned;
    if (typeof bonusAmount === "number") data.bonusBalance = { increment: bonusAmount };

    const updated = await prisma.user.update({ where: { id: userId }, data });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("[/api/admin/users PATCH]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
