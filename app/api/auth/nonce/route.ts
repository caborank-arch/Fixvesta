import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "../../../lib/prisma";
import { authMessage } from "../../../lib/auth";

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();
    if (!walletAddress || typeof walletAddress !== "string") {
      return NextResponse.json({ error: "walletAddress required" }, { status: 400 });
    }

    const nonce = crypto.randomBytes(16).toString("hex");

    await prisma.authNonce.create({
      data: { address: walletAddress.toLowerCase(), nonce },
    });

    return NextResponse.json({
      nonce,
      message: authMessage(nonce),
    });
  } catch (e) {
    console.error("[/api/auth/nonce]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
