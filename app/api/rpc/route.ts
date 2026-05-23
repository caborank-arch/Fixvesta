import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIP } from "../../lib/rateLimit";

export async function POST(req: NextRequest) {
  // Rate limit: 120 requests per IP per minute
  const ip = getIP(req);
  const limit = rateLimit(ip, "rpc", 120, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  try {
    const body = await req.text();

    // Block requests larger than 10KB
    if (body.length > 10_000) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    const rpcUrl = process.env.SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com";
    const res = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
