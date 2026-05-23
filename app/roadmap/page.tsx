import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "FixVesta development roadmap: from token launch to fully decentralized bot-funded staking. Q1 2025 — Q2 2026.",
  openGraph: {
    title: "Roadmap — FixVesta",
    description: "Our path from CBB token launch to on-chain staking smart contract and governance.",
    url: "https://fixvesta.com/roadmap",
  },
};

const phases = [
  {
    quarter: "Q1 2025",
    title: "Foundation",
    status: "done",
    items: [
      "CBB token created on Solana Mainnet",
      "1,000,000,000 CBB fixed supply — mint authority revoked",
      "Token distributed to all allocation wallets",
      "FixVesta website launched",
      "Phantom wallet integration",
    ],
  },
  {
    quarter: "Q2 2025",
    title: "Presale & Community",
    status: "done",
    items: [
      "Presale Round 1 — 0.0001 SOL per CBB",
      "Presale Round 2 — 0.00015 SOL per CBB",
      "Community building — Telegram & Twitter",
      "Analytics dashboard",
      "Staking UI",
    ],
  },
  {
    quarter: "Q3 2025",
    title: "DEX Listing",
    status: "done",
    items: [
      "Meteora liquidity pool — 200M CBB locked",
      "Jupiter aggregator integration",
      "Token metadata via Arweave",
      "LP tokens locked for 12 months",
      "DEX launch price: 0.0002 SOL per CBB",
    ],
  },
  {
    quarter: "Q4 2025",
    title: "Bot Deployment",
    status: "active",
    items: [
      "Airdrop BOT go live on Solana",
      "Sniper BOT with Jito bundle execution",
      "Arbitrage BOT — Raydium, Meteora, Orca, Jupiter",
      "Treasury multisig with 48h timelock",
      "Real-time bot metrics on Analytics",
    ],
  },
  {
    quarter: "Q1 2026",
    title: "Staking Contract",
    status: "active",
    items: [
      "On-chain staking smart contract deployment",
      "Real reward distribution from bot profits",
      "60% of epoch profits → Reward Pool",
      "Automatic epoch settlement",
      "Third-party security audit",
    ],
  },
  {
    quarter: "Q2 2026",
    title: "Governance & Expansion",
    status: "upcoming",
    items: [
      "CBB holder governance voting",
      "Additional trading strategies",
      "Mobile app (iOS / Android)",
      "Cross-chain bridge exploration",
      "Institutional staking tiers",
    ],
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  done:     { label: "Completed",   color: "#10b981", bg: "rgba(16,185,129,0.12)", icon: "✓" },
  active:   { label: "In Progress", color: "#00ffff", bg: "rgba(0,255,255,0.08)",  icon: "▶" },
  upcoming: { label: "Upcoming",    color: "#f59e0b", bg: "rgba(245,158,11,0.08)", icon: "◷" },
};

export default function Roadmap() {
  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0f1525, #1a1f35)",
        padding: "80px 20px 60px",
        textAlign: "center",
        borderBottom: "1px solid rgba(0,255,255,0.08)",
      }}>
        <div style={{ display: "inline-block", padding: "4px 14px", background: "rgba(0,255,255,0.1)", border: "1px solid rgba(0,255,255,0.3)", borderRadius: "20px", fontSize: "13px", color: "#00ffff", marginBottom: "16px" }}>
          ▶ In Progress — Q1 2026
        </div>
        <h1 style={{ fontSize: "42px", marginBottom: "16px" }}>Roadmap</h1>
        <p style={{ color: "#888", fontSize: "18px", maxWidth: "560px", margin: "0 auto" }}>
          Our path from token launch to a fully decentralized, bot-funded staking protocol.
        </p>
      </div>

      {/* Timeline */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 20px 80px", position: "relative" }}>

        {/* Vertical line */}
        <div style={{
          position: "absolute",
          left: "calc(20px + 20px)",
          top: "60px",
          bottom: "80px",
          width: "2px",
          background: "linear-gradient(180deg, #10b981, #00ffff, #00ffff, #f59e0b)",
          opacity: 0.25,
        }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {phases.map((phase, i) => {
            const cfg = statusConfig[phase.status];
            return (
              <div key={i} style={{ display: "flex", gap: "0", alignItems: "flex-start", marginBottom: "8px" }}>

                {/* Dot column */}
                <div style={{ width: "40px", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "28px" }}>
                  <div style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: cfg.color,
                    boxShadow: `0 0 10px ${cfg.color}`,
                    flexShrink: 0,
                    zIndex: 1,
                    position: "relative",
                  }} />
                </div>

                {/* Card */}
                <div style={{
                  flex: 1,
                  background: "linear-gradient(135deg, rgba(31,35,51,0.9), rgba(18,24,38,0.9))",
                  border: `1px solid ${phase.status === "active" ? "rgba(0,255,255,0.25)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "16px",
                  padding: "24px 28px",
                  marginBottom: "24px",
                  transition: "border-color 0.2s",
                }}>
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "13px", color: "#555", fontFamily: "monospace" }}>{phase.quarter}</span>
                      <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#fff" }}>{phase.title}</h2>
                    </div>
                    <span style={{
                      fontSize: "12px",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      color: cfg.color,
                      background: cfg.bg,
                      border: `1px solid ${cfg.color}22`,
                      whiteSpace: "nowrap",
                    }}>
                      {cfg.icon} {cfg.label}
                    </span>
                  </div>

                  {/* Items */}
                  <ul style={{ listStyle: "none", marginTop: "16px" }}>
                    {phase.items.map((item, j) => (
                      <li key={j} style={{
                        fontSize: "14px",
                        color: phase.status === "done" ? "#666" : "#bbb",
                        padding: "5px 0",
                        paddingLeft: "18px",
                        position: "relative",
                        borderBottom: j < phase.items.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                      }}>
                        <span style={{
                          position: "absolute", left: 0,
                          color: phase.status === "done" ? "#10b981" : cfg.color,
                          fontSize: "12px",
                        }}>
                          {phase.status === "done" ? "✓" : "▸"}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          background: "rgba(255,140,0,0.06)",
          border: "1px solid rgba(255,140,0,0.2)",
          borderRadius: "10px",
          padding: "16px 24px",
          fontSize: "13px",
          color: "#aaa",
          textAlign: "center",
          lineHeight: "1.6",
          marginTop: "20px",
        }}>
          Roadmap is subject to change based on market conditions and community feedback.
          Follow us on{" "}
          <a href="https://t.me/caborank" target="_blank" rel="noopener noreferrer" style={{ color: "#00ffff" }}>Telegram</a>
          {" "}and{" "}
          <a href="https://x.com/CaborankN" target="_blank" rel="noopener noreferrer" style={{ color: "#00ffff" }}>Twitter</a>
          {" "}for updates.
        </div>
      </div>
    </div>
  );
}
