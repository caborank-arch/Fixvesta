import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bot Market",
  description: "Buy a private instance of FixVesta's Solana trading bots. Airdrop BOT, Sniper BOT, and Arbitrage BOT available. Runs 24/7 exclusively for your wallet.",
  openGraph: {
    title: "Bot Marketplace — FixVesta",
    description: "Get your own private Solana trading bot. Airdrop, Sniper, and Arbitrage bots starting from 50,000 CBB.",
    url: "https://fixvesta.com/market",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
