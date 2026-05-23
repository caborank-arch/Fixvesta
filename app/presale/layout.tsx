import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Presale",
  description: "Buy CBB tokens at the lowest price. Round 1: 0.0001 SOL per CBB. 20% instant delivery, 80% vesting over 40 days. Minimum 0.1 SOL.",
  openGraph: {
    title: "CBB Token Presale — FixVesta",
    description: "Buy CBB at the lowest price. 20% instant, 80% vesting 2%/day. Round 1 live now.",
    url: "https://fixvesta.com/presale",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
