import { NextResponse } from "next/server";

// Presale distribution is disabled on the public deploy. The fulfilment bot
// runs locally from .internal/presale-bot/ — never expose it through the API.
export async function POST() {
  return NextResponse.json(
    { error: "Presale distribution is not active on this deployment." },
    { status: 503 }
  );
}

export async function GET() {
  return NextResponse.json({ status: "disabled" }, { status: 503 });
}
