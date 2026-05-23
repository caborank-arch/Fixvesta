import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Live performance metrics for FixVesta trading bots. PnL charts, win rates, bot stats, and real treasury wallet transactions on Solana.",
  openGraph: {
    title: "Bot Analytics — FixVesta",
    description: "Live PnL, win rates, and treasury transactions for FixVesta's 3 Solana trading bots.",
    url: "https://fixvesta.com/analytics",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
