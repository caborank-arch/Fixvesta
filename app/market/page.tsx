"use client";
import { useState } from "react";
import Link from "next/link";

const bots = [
  {
    name: "Front-run / Sandwich BOT",
    icon: "⚔️",
    tag: "High Yield",
    tagColor: "#7c3aed",
    description:
      "Monitors the Solana mempool in real time via Jito, detects large pending swaps and executes front-run or sandwich bundles before the block is finalized. Filters out false signals automatically.",
    features: [
      "Real-time mempool scanner via Jito",
      "False signal filters — no bad trades",
      "Live / Paper / Jito execution modes",
      "Telegram bot control & alerts",
      "PnL dashboard, recent trades, executor stats",
      "Priority fee & Solana RPC optimized",
      "Logging & full trade metrics",
    ],
    return: "Up to 25% / month",
    returnNote: "Estimate based on backtesting",
    priceCBB: 300_000,
    priceSOL: "30 SOL",
    color: "#7c3aed",
    status: "Available",
  },
  {
    name: "Arbitrage BOT",
    icon: "⚡",
    tag: "Most Popular",
    tagColor: "#00ffff",
    description:
      "High-speed scanner across Jupiter, Meteora, Raydium and Orca. Detects price gaps in milliseconds, filters false signals and executes the optimal path with priority fees and Jito bundles.",
    features: [
      "Fast scanner — Jupiter, Meteora, Raydium, Orca",
      "False signal filters on every route",
      "Optimal execution path selection",
      "Jito bundles — atomic MEV execution",
      "5 RPC endpoints — zero downtime failover",
      "Live / Paper / Jito execution modes",
      "Telegram control & real-time alerts",
      "PnL / recent trades / executor stats",
      "Priority fee + Solana RPC management",
      "Full logging & trade metrics",
    ],
    return: "8–18% / month",
    returnNote: "Varies with liquidity & volatility",
    priceCBB: 1_000_000,
    priceSOL: "100 SOL",
    color: "#00ffff",
    status: "Available",
  },
  {
    name: "Liquidation BOT",
    icon: "🏦",
    tag: "Consistent Yield",
    tagColor: "#10b981",
    description:
      "Monitors Marginfi, Kamino and Solend for undercollateralized positions. Triggers instantly on health-factor breach, captures the liquidation bonus via flash loans with priority execution.",
    features: [
      "Tracks Marginfi, Kamino & Solend",
      "Instant trigger on health-factor breach",
      "False signal filters — no failed liquidations",
      "Live / Paper / Jito execution modes",
      "Telegram control & alerts",
      "PnL / recent liquidations / executor stats",
      "Flash loan + priority fee execution",
      "Logging & full metrics",
    ],
    return: "10–20% / month",
    returnNote: "Depends on market volatility & liquidation events",
    priceCBB: 500_000,
    priceSOL: "50 SOL",
    color: "#10b981",
    status: "Available",
  },
];

const faqs = [
  {
    q: "How does buying a bot work?",
    a: "Purchase a bot license with CBB tokens or SOL. After payment confirmation, you receive access credentials and setup instructions within 24 hours.",
  },
  {
    q: "Do I need technical knowledge?",
    a: "No. Each bot comes with a full setup guide. Our team provides onboarding support via Telegram.",
  },
  {
    q: "What's the difference between buying a bot and staking CBB?",
    a: "Staking CBB earns you a share of the collective bot profits (~25% APY). Buying a bot license gives you a private instance running exclusively for your account.",
  },
  {
    q: "Are returns guaranteed?",
    a: "No. All return estimates are based on historical performance. Bot trading involves risk. Never invest more than you can afford to lose.",
  },
];

export default function Market() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [orderBot, setOrderBot] = useState<string | null>(null);

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
          ● 3 Bots Available
        </div>
        <h1 style={{ fontSize: "42px", marginBottom: "16px" }}>Bot Marketplace</h1>
        <p style={{ color: "#888", fontSize: "18px", maxWidth: "600px", margin: "0 auto 32px" }}>
          Buy a private instance of our Solana trading bots. Each bot runs exclusively for your wallet, 24/7.
        </p>

        {/* Stats row */}
        <div style={{ display: "inline-flex", gap: "40px", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { label: "Active Bots",   value: "3" },
            { label: "Avg Win Rate",  value: "68%" },
            { label: "Chains",        value: "Solana" },
            { label: "Support",       value: "24/7" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#00ffff" }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "#555" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 20px 80px" }}>

        {/* Bot cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px", marginBottom: "60px" }}>
          {bots.map((bot, i) => (
            <div key={i} style={{
              background: "linear-gradient(135deg, rgba(31,35,51,0.95), rgba(18,24,38,0.95))",
              border: `1px solid ${bot.color}33`,
              borderRadius: "20px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              transition: "border-color 0.2s, transform 0.2s",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Glow */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${bot.color}, transparent)` }} />

              {/* Tag */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <span style={{ fontSize: "48px" }}>{bot.icon}</span>
                <span style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "20px", background: `${bot.tagColor}22`, color: bot.tagColor, border: `1px solid ${bot.tagColor}44` }}>
                  {bot.tag}
                </span>
              </div>

              {/* Name */}
              <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#fff", marginBottom: "12px" }}>{bot.name}</h2>
              <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.7", marginBottom: "20px", flex: 1 }}>{bot.description}</p>

              {/* Features */}
              <ul style={{ listStyle: "none", marginBottom: "24px" }}>
                {bot.features.map((f, j) => (
                  <li key={j} style={{ fontSize: "13px", color: "#aaa", padding: "5px 0", paddingLeft: "18px", position: "relative", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <span style={{ position: "absolute", left: 0, color: bot.color, fontSize: "11px" }}>▸</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Return estimate */}
              <div style={{ background: `${bot.color}0d`, border: `1px solid ${bot.color}22`, borderRadius: "10px", padding: "14px", marginBottom: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: bot.color }}>{bot.return}</div>
                <div style={{ fontSize: "11px", color: "#555", marginTop: "4px" }}>{bot.returnNote}</div>
              </div>

              {/* Price */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#555", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>License price</div>
                  <div style={{ fontSize: "22px", fontWeight: "bold", color: "#fff" }}>{bot.priceCBB.toLocaleString()} <span style={{ color: "#00ffff", fontSize: "16px" }}>CBB</span></div>
                  <div style={{ fontSize: "13px", color: "#555" }}>or {bot.priceSOL}</div>
                </div>
                <span style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "12px", background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)" }}>
                  ● {bot.status}
                </span>
              </div>

              {/* CTA */}
              {orderBot === bot.name ? (
                <div style={{ padding: "16px", background: "rgba(0,255,255,0.06)", borderRadius: "12px", textAlign: "center", fontSize: "14px", color: "#00ffff", lineHeight: "1.7" }}>
                  To order <strong>{bot.name}</strong>, contact us on{" "}
                  <a href="https://t.me/caborank" target="_blank" rel="noopener noreferrer" style={{ color: "#00ffff", fontWeight: "bold" }}>
                    Telegram @caborank
                  </a>
                  {" "}with your wallet address. We'll set up your private instance within 24h.
                </div>
              ) : (
                <button
                  onClick={() => setOrderBot(bot.name)}
                  style={{
                    width: "100%", padding: "14px",
                    background: `linear-gradient(45deg, ${bot.color}, ${bot.color === "#7c3aed" ? "#0059ff" : bot.color === "#00ffff" ? "#0059ff" : "#00bcd4"})`,
                    border: "none", borderRadius: "10px",
                    color: "#fff", fontSize: "15px", fontWeight: "bold",
                    cursor: "pointer", transition: "opacity 0.2s",
                  }}
                >
                  Get {bot.name} →
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Staking alternative banner */}
        <div style={{
          background: "linear-gradient(135deg, rgba(0,255,255,0.06), rgba(0,89,255,0.06))",
          border: "1px solid rgba(0,255,255,0.15)",
          borderRadius: "20px",
          padding: "40px",
          textAlign: "center",
          marginBottom: "60px",
        }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>💡</div>
          <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>Not ready to buy a bot?</h2>
          <p style={{ color: "#888", fontSize: "16px", maxWidth: "500px", margin: "0 auto 24px", lineHeight: "1.7" }}>
            Stake CBB tokens and earn a share of all 3 bots' profits automatically — no setup required. ~25% APY.
          </p>
          <Link href="/stake" className="btn-primary" style={{ padding: "14px 36px", fontSize: "15px" }}>
            Stake CBB Instead →
          </Link>
        </div>

        {/* FAQ */}
        <div>
          <h2 style={{ fontSize: "28px", textAlign: "center", marginBottom: "32px" }}>FAQ</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "720px", margin: "0 auto" }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{
                background: "linear-gradient(135deg, rgba(31,35,51,0.9), rgba(18,24,38,0.9))",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                overflow: "hidden",
              }}>
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  style={{
                    width: "100%", padding: "18px 24px",
                    background: "transparent", border: "none",
                    color: "#fff", fontSize: "15px", fontWeight: "bold",
                    cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
                    textAlign: "left",
                  }}
                >
                  {faq.q}
                  <span style={{ color: "#00ffff", fontSize: "18px", flexShrink: 0, marginLeft: "12px" }}>
                    {expanded === i ? "−" : "+"}
                  </span>
                </button>
                {expanded === i && (
                  <div style={{ padding: "0 24px 18px", color: "#aaa", fontSize: "14px", lineHeight: "1.7" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "48px", padding: "16px 24px", background: "rgba(255,140,0,0.06)", border: "1px solid rgba(255,140,0,0.2)", borderRadius: "10px", fontSize: "13px", color: "#aaa", textAlign: "center", lineHeight: "1.6" }}>
          ⚠️ Monthly return estimates are based on backtesting. Past performance does not guarantee future results.
          Bot trading involves financial risk. Returns depend on market conditions and liquidity.
        </div>
      </div>
    </div>
  );
}
