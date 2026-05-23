import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stake CBB",
  description: "Stake CBB tokens and earn ~25% APY funded by Solana trading bot profits. No lock-up. Claim rewards anytime.",
  openGraph: {
    title: "Stake CBB — 25% APY | FixVesta",
    description: "Earn 25% APY from real bot trading profits. Stake CBB on Solana with no lock-up.",
    url: "https://fixvesta.com/stake",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
