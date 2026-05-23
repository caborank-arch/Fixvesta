import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your FixVesta dashboard. View CBB balance, live staking rewards, vesting schedule, and transaction history.",
  openGraph: {
    title: "Dashboard — FixVesta",
    description: "Track your CBB balance, staking rewards, and vesting schedule in real time.",
    url: "https://fixvesta.com/dashboard",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
