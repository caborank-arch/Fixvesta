import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "FixVesta is a Solana-based staking protocol funded by algorithmic trading bots. Learn about our mission, security approach, and team.",
  openGraph: {
    title: "About FixVesta",
    description: "Bot-funded staking on Solana. Transparent, community-driven, real yields.",
    url: "https://fixvesta.com/about",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
