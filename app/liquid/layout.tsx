import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liquidity",
  description: "Add liquidity to SOL/CBB or USDT/CBB pools on Meteora. Earn trading fees from every swap. ~28.5% APR across both pools.",
  openGraph: {
    title: "Liquidity Pools — FixVesta",
    description: "Provide liquidity to SOL/CBB and USDT/CBB pools. Earn up to 32% APR in trading fees on Meteora.",
    url: "https://fixvesta.com/liquid",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
