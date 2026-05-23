import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { signJWT, verifyEVMSignature, authMessage } from "../../../lib/auth";

export async function POST(req: Request) {
  try {
    const { walletAddress, walletType, signature, nonce, referralCode } = await req.json();

    if (!walletAddress || !walletType || !signature || !nonce) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const lower = (walletAddress as string).toLowerCase();
    const record = await prisma.authNonce.findUnique({ where: { nonce } });
    if (!record || record.used || record.address !== lower) {
      return NextResponse.json({ error: "Invalid or expired nonce" }, { status: 401 });
    }

    const ageMs = Date.now() - record.createdAt.getTime();
    if (ageMs > 5 * 60 * 1000) {
      return NextResponse.json({ error: "Nonce expired" }, { status: 401 });
    }

    const message = authMessage(nonce);

    // EVM-only verification today. Solana/Tron verification can plug in later.
    if (walletType === "metamask_bsc" || walletType === "tronlink") {
      const ok = verifyEVMSignature(message, signature, walletAddress);
      if (!ok) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
    // For Solana (phantom) you'd verify ed25519; left as a TODO for the Solana wallet adapter wiring.

    await prisma.authNonce.update({ where: { nonce }, data: { used: true } });

    let user = await prisma.user.findUnique({ where: { walletAddress: lower } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: lower,
          walletType,
          referredBy: referralCode ? referralCode.toLowerCase() : null,
        },
      });
    }

    if (user.isBanned) {
      return NextResponse.json({ error: "Account banned" }, { status: 403 });
    }

    const token = signJWT({
      userId: user.id,
      walletAddress: user.walletAddress,
      walletType: user.walletType,
    });

    return NextResponse.json({ token, user });
  } catch (e) {
    console.error("[/api/auth/verify]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
