import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Providers from "./components/Providers";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "FixVesta";
const APP_URL  = process.env.NEXT_PUBLIC_APP_URL  || "https://fixvesta.com";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} | DeFi Staking — 0.5% Daily`,
    template: `%s | ${APP_NAME}`,
  },
  description: "Stake USDT or USDC across BNB Smart Chain, TRON and Solana. Earn 0.5% daily for 100 days, principal returned at term.",
  keywords: ["staking", "DeFi", "USDT", "USDC", "BSC", "TRON", "Solana", "yield"],
  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} | Stake & Earn 0.5% Daily`,
    description: "Multi-chain DeFi staking. 0.5% daily payout for 100 days. Principal returned + 50% yield.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} | Stake & Earn 0.5% Daily`,
    description: "Multi-chain DeFi staking on BSC, TRON, Solana.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32.svg", type: "image/svg+xml" },
    ],
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main style={{ paddingTop: "64px" }}>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
