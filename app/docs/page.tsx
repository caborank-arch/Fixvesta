import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Docs",
  description: "FixVesta documentation: staking, presale vesting, trading bots, tokenomics and how to get started with CBB on Solana.",
  openGraph: {
    title: "Documentation — FixVesta",
    description: "Everything you need to know about CBB staking, presale, trading bots and tokenomics.",
    url: "https://fixvesta.com/docs",
  },
};

const sections = [
  {
    title: "Getting Started",
    icon: "🚀",
    items: [
      { q: "What is FixVesta?", a: "FixVesta is a Solana-based staking protocol where rewards are funded by algorithmic trading bots. Stake CBB tokens, earn real yields." },
      { q: "How do I get CBB tokens?", a: "Participate in the presale on the Presale page or buy on DEX after listing. Presale offers the lowest price: Round 1 at 0.0001 SOL per CBB." },
      { q: "Which wallet do I need?", a: "Phantom wallet on Solana. Download from phantom.app, create a wallet, and fund it with SOL for transactions." },
    ],
  },
  {
    title: "Staking",
    icon: "⚡",
    items: [
      { q: "How does staking work?", a: "Stake your CBB tokens on the Stake page. The protocol allocates 30% of total supply as staking rewards. 60% of bot trading profits are distributed to stakers each epoch (7 days)." },
      { q: "What is the APY?", a: "Estimated APY is ~25% based on bot performance. This varies depending on market conditions and trading bot profits. Past performance does not guarantee future returns." },
      { q: "When can I unstake?", a: "You can unstake at any time with no lock-up period. Rewards stop accumulating for unstaked tokens." },
      { q: "When are rewards distributed?", a: "Rewards accumulate continuously and can be claimed at any time. Reward amount depends on your stake share and bot epoch profits." },
    ],
  },
  {
    title: "Presale & Vesting",
    icon: "🔐",
    items: [
      { q: "How does presale vesting work?", a: "Presale participants receive 20% of their purchased tokens immediately. The remaining 80% unlocks at 2% per day over 40 days. Full unlock occurs after 40 days from purchase." },
      { q: "What are the presale prices?", a: "Round 1 (whitelist): 0.0001 SOL per CBB. Round 2 (public): 0.00015 SOL per CBB. DEX launch: 0.0002 SOL per CBB." },
      { q: "Where do I see my vesting schedule?", a: "Connect your wallet and go to the Dashboard page. Your vesting progress, unlocked amount, and daily unlock rate are shown there." },
      { q: "What is the minimum presale purchase?", a: "Minimum purchase is 0.1 SOL in Round 1." },
    ],
  },
  {
    title: "Trading Bots",
    icon: "🤖",
    items: [
      { q: "What bots does FixVesta run?", a: "Three bots: Front-run/Sandwich BOT (exploits large pending swaps via Jito bundles), Arbitrage BOT (exploits DEX price differences across Raydium, Meteora, Orca, Jupiter), and Liquidation BOT (captures liquidation bonuses on Marginfi, Kamino, Solend). All operate 24/7 on Solana." },
      { q: "Where can I see bot performance?", a: "The Analytics page shows live (and simulated during pre-launch) bot metrics: PnL, win rate, trade count, and real treasury wallet transactions." },
      { q: "Are the bot profits guaranteed?", a: "No. Bot trading involves risk. Returns depend on market conditions. Historical performance does not guarantee future results." },
    ],
  },
  {
    title: "Tokenomics",
    icon: "💎",
    items: [
      { q: "What is the total supply?", a: "1,000,000,000 CBB (1 billion). Mint authority permanently revoked — no new tokens can ever be created." },
      { q: "How is supply allocated?", a: "Presale: 25% · Liquidity: 20% · Staking Rewards: 30% · Treasury: 15% · Team (vested): 7% · Marketing: 3%" },
      { q: "What is the contract address?", a: "Mint: F4CtPFg719r5pjrr3MhGnrH5PZ6Sh92uRN2N2D111e7t — verify on Solscan." },
    ],
  },
];

export default function Docs() {
  return (
    <div className="page-wrap">
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0f1525, #1a1f35)",
        padding: "80px 20px 60px",
        textAlign: "center",
        borderBottom: "1px solid rgba(0,255,255,0.08)",
        marginBottom: "60px",
        marginLeft: "-20px", marginRight: "-20px",
        marginTop: "-40px",
      }}>
        <h1 style={{ fontSize: "42px", marginBottom: "16px" }}>Documentation</h1>
        <p style={{ color: "#888", fontSize: "18px", maxWidth: "560px", margin: "0 auto" }}>
          Everything you need to know about FixVesta, CBB token, staking, and trading bots.
        </p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {sections.map((section, i) => (
          <div key={i} style={{ marginBottom: "48px" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
              <span>{section.icon}</span>
              <span>{section.title}</span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {section.items.map((item, j) => (
                <div key={j} className="glass-card" style={{ padding: "20px 24px" }}>
                  <div style={{ fontWeight: "bold", color: "#fff", marginBottom: "8px", fontSize: "16px" }}>
                    {item.q}
                  </div>
                  <div style={{ color: "#aaa", fontSize: "15px", lineHeight: "1.7" }}>
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Quick links */}
        <div className="glass-card" style={{ textAlign: "center", padding: "40px" }}>
          <h2 style={{ fontSize: "22px", marginBottom: "12px" }}>Ready to start?</h2>
          <p style={{ color: "#888", marginBottom: "28px" }}>Join the presale or start staking today.</p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/presale" className="btn-primary" style={{ padding: "12px 28px" }}>Buy CBB</Link>
            <Link href="/stake" className="btn-secondary" style={{ padding: "12px 28px" }}>Stake CBB</Link>
            <a href="https://t.me/caborank" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: "12px 28px" }}>Telegram</a>
          </div>
        </div>

        <div className="risk-disclaimer" style={{ marginTop: "40px" }}>
          ⚠️ This documentation is for informational purposes only. CBB token is a utility token.
          Staking rewards are not guaranteed. All participation involves financial risk.
        </div>
      </div>
    </div>
  );
}
