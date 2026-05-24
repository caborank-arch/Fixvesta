import Link from "next/link";

const strategies = [
  {
    icon: "⚡",
    name: "Arbitrage BOT",
    desc: "Detects price gaps across decentralized exchanges and executes atomic swaps within milliseconds. Runs on multiple DEXes simultaneously.",
    color: "#00ffff",
  },
  {
    icon: "📊",
    name: "CopyTrade",
    desc: "Mirrors trades of top-performing on-chain traders identified by sustained Sharpe ratio. Sizing is auto-rebalanced per epoch.",
    color: "#7c3aed",
  },
  {
    icon: "🎯",
    name: "Polymarket Strategy",
    desc: "Trades event-prediction markets against statistical baselines. Picks +EV positions when the implied probability deviates from model output.",
    color: "#f59e0b",
  },
  {
    icon: "💧",
    name: "Liquidation BOT",
    desc: "Monitors undercollateralized lending positions on Marginfi, Kamino, Aave and triggers liquidations the moment health-factor breaches threshold.",
    color: "#10b981",
  },
];

const principles = [
  { title: "Audited Contracts",  body: "Every staking contract is open-source and reviewed before mainnet deploy. No proxy upgrades, no hidden owner functions." },
  { title: "Non-Custodial",      body: "We never hold user funds. Stake-and-claim runs against the smart contract — your wallet is the only key." },
  { title: "Multi-Chain Native", body: "Stake USDT BEP20 on BSC, USDT TRC20 on TRON, or USDC on Solana. Same terms, three networks." },
  { title: "Transparent Yield",  body: "Bot performance is on-chain — anyone can verify treasury inflows. Yields come from trading, not from new deposits." },
];

export default function About() {
  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0f1525, #1a1f35)",
        padding: "80px 20px 60px",
        textAlign: "center",
        borderBottom: "1px solid rgba(0,255,255,0.08)",
      }}>
        <h1 style={{ fontSize: "42px", marginBottom: "16px" }}>About FixVesta</h1>
        <p style={{ color: "#888", fontSize: "18px", maxWidth: "640px", margin: "0 auto", lineHeight: 1.6 }}>
          A multi-chain DeFi staking protocol on BNB Smart Chain, TRON and Solana.
          Daily yields are funded by algorithmic trading strategies running 24/7 on-chain.
        </p>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 20px 80px" }}>
        {/* Mission */}
        <div className="glass-card" style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "26px", marginBottom: "16px" }}>Our Mission</h2>
          <p style={{ color: "#ccc", fontSize: "16px", lineHeight: 1.7 }}>
            High-frequency arbitrage, MEV and liquidation strategies have historically been
            accessible only to well-capitalised quant funds. FixVesta pools retail stablecoin
            deposits into the same execution infrastructure — and pays the trading profit back
            to stakers, daily, on-chain.
          </p>
          <p style={{ color: "#ccc", fontSize: "16px", lineHeight: 1.7, marginTop: "12px" }}>
            Our goal is simple: give anyone with $10 of USDT or USDC the same effective access
            to algorithmic yield that previously required a six-figure account at a prop shop.
          </p>
        </div>

        {/* Strategies */}
        <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>Our Strategies</h2>
        <p style={{ color: "#888", marginBottom: "28px" }}>
          Four independent bots run on different markets, smoothing out yield across the term.
        </p>
        <div className="cards-grid" style={{ marginBottom: "48px" }}>
          {strategies.map((s) => (
            <div key={s.name} className="glass-card" style={{ borderColor: `${s.color}33` }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>{s.icon}</div>
              <div className="card-title" style={{ color: s.color }}>{s.name}</div>
              <p className="card-text">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Principles */}
        <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>Our Principles</h2>
        <div className="cards-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginBottom: "48px" }}>
          {principles.map((p) => (
            <div key={p.title} className="glass-card">
              <div className="card-title">{p.title}</div>
              <p className="card-text">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="glass-card" style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>The Team</h2>
          <p style={{ color: "#ccc", fontSize: "16px", lineHeight: 1.7 }}>
            FixVesta is built by an anonymous team — the standard for serious DeFi protocols.
            What matters is on-chain: audited contracts, open-source code, transparent treasury
            flow. Pseudonymity protects contributors from coercion and makes the protocol
            governed by code, not personalities.
          </p>
          <p style={{ color: "#ccc", fontSize: "16px", lineHeight: 1.7, marginTop: "12px" }}>
            Smart contracts are public on BscScan, TronScan and Solscan. Treasury flows can be
            verified independently. Don&apos;t trust — verify.
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/stake"       className="btn-primary"   style={{ padding: "14px 32px" }}>Start Staking →</Link>
            <Link href="/partnership" className="btn-secondary" style={{ padding: "14px 32px" }}>Referral Program</Link>
            <Link href="/faq"         className="btn-secondary" style={{ padding: "14px 32px" }}>FAQ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
