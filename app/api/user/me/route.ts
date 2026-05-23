import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { verifyJWT } from "../../../lib/auth";

export async function GET(req: Request) {
  const auth = await verifyJWT(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: {
      stakes: { orderBy: { startDate: "desc" } },
      claims: { orderBy: { claimedAt: "desc" }, take: 20 },
      referralsEarned: { orderBy: { paidAt: "desc" }, take: 20 },
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}
