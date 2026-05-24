import Link from "next/link";
import Image from "next/image";
import TradeTicker from "./components/TradeTicker";
import ProfitCalculator from "./components/ProfitCalculator";

const bots = [
  {
    name: "Arbitrage BOT",
    icon: "⚡",
    tag: "Most Popular",
    tagColor: "#00ffff",
    color: "#00ffff",
    winRate: "74%",
    desc: "Scans Jupiter, Meteora, Raydium & Orca in milliseconds. Executes via Jito bundles across 5 RPC endpoints.",
    stats: [
      { label: "Win Rate", value: "74%" },
      { label: "24h Trades", value: "2,847" },
      { label: "24h PnL", value: "+$410" },
    ],
  },
  {
    name: "Front-run / Sandwich BOT",
    icon: "⚔️",
    tag: "High Yield",
    tagColor: "#7c3aed",
    color: "#7c3aed",
    winRate: "81%",
    desc: "Monitors Solana mempool via Jito. Detects large pending swaps and front-runs or sandwiches them before block finalization.",
    stats: [
      { label: "Win Rate", value: "81%" },
      { label: "24h Trades", value: "1,240" },
      { label: "24h PnL", value: "+$890" },
    ],
  },
  {
    name: "Liquidation BOT",
    icon: "🏦",
    tag: "Consistent",
    tagColor: "#10b981",
    color: "#10b981",
    winRate: "92%",
    desc: "Tracks Marginfi, Kamino & Solend. Triggers instantly on health-factor breach. Flash loan + priority fee execution.",
    stats: [
      { label: "Win Rate", value: "92%" },
      { label: "24h Trades", value: "38" },
      { label: "24h PnL", value: "+$280" },
    ],
  },
];

export default async function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-network">
          <svg className="network-svg" viewBox="0 0 800 600" preserveAspectRatio="none">
            <line x1="100" y1="100" x2="300" y2="200" stroke="#00ffff" strokeWidth="1" opacity="0.5" />
            <line x1="300" y1="200" x2="500" y2="100" stroke="#00ffff" strokeWidth="1" opacity="0.5" />
            <line x1="500" y1="100" x2="700" y2="250" stroke="#00ffff" strokeWidth="1" opacity="0.4" />
            <line x1="100" y1="100" x2="200" y2="350" stroke="#00ffff" strokeWidth="1" opacity="0.3" />
            <line x1="200" y1="350" x2="400" y2="400" stroke="#00ffff" strokeWidth="1" opacity="0.3" />
            <line x1="400" y1="400" x2="600" y2="350" stroke="#00ffff" strokeWidth="1" opacity="0.3" />
            <line x1="600" y1="350" x2="700" y2="250" stroke="#00ffff" strokeWidth="1" opacity="0.4" />
            <line x1="300" y1="200" x2="400" y2="400" stroke="#00ffff" strokeWidth="1" opacity="0.2" />
            <circle className="node" cx="100" cy="100" r="4" fill="#00ffff" />
            <circle className="node" cx="300" cy="200" r="4" fill="#00ffff" />
            <circle className="node" cx="500" cy="100" r="4" fill="#00ffff" />
            <circle className="node" cx="700" cy="250" r="4" fill="#00ffff" />
            <circle className="node" cx="200" cy="350" r="4" fill="#00ffff" />
            <circle className="node" cx="400" cy="400" r="4" fill="#00ffff" />
            <circle className="node" cx="600" cy="350" r="3" fill="#00ffff" />
          </svg>
        </div>

        <div className="hero-content-wrapper">
          <div className="hero-content">
            <h1>Stake USDT &amp; USDC — <span>Earn 0.5% Daily</span></h1>
            <p>
              AI-powered arbitrage bots generate yield on BSC, TRON and Solana.
              100-day term. 150% total return. Claim daily.
            </p>

            <ul className="hero-features">
              <li><strong>0.5% Daily:</strong> Profit paid every day for 100 days</li>
              <li><strong>150% Total:</strong> Principal returned + 50% yield at term</li>
              <li><strong>Multi-Chain:</strong> BNB Smart Chain · TRON · Solana</li>
              <li><strong>3% Referral:</strong> Earn from every deposit you bring in</li>
            </ul>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">0.5%</span>
                <span className="stat-label">Daily Rate</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">100d</span>
                <span className="stat-label">Term Length</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">3</span>
                <span className="stat-label">Networks</span>
              </div>
            </div>

            <div className="hero-buttons">
              <Link href="/stake" className="btn-primary">Start Staking →</Link>
              <a href="#how-it-works" className="btn-secondary">How It Works</a>
            </div>
          </div>

          <div className="hero-image">
            <Image
              src="/logo.svg"
              alt="FixVesta"
              width={480}
              height={130}
              className="hero-coin"
              priority
            />
          </div>
        </div>
      </section>

      {/* LIVE TRADE TICKER */}
      <TradeTicker />

      {/* ── LIVE STATS BAR ── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(0,255,255,0.04), rgba(0,89,255,0.04))",
        borderBottom: "1px solid rgba(0,255,255,0.08)",
        padding: "28px 32px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
          {[
            { label: "Daily Rate",       value: "0.5%",   sub: "Paid every 24h to stakers",     color: "#00ffff" },
            { label: "Term",             value: "100 d",  sub: "Principal returned at end",      color: "#10b981" },
            { label: "Total Yield",      value: "150%",   sub: "50% profit + 100% principal",    color: "#f59e0b" },
            { label: "Bots Running",     value: "3 / 3",  sub: "Arbitrage · Front-run · Liquidation", color: "#10b981" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "3px", height: "40px", background: s.color, borderRadius: "2px", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>{s.label}</div>
                <div style={{ fontSize: "22px", fontWeight: "bold", color: s.color, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="neon-divider" />

      {/* ── 3 BOT CARDS ── */}
      <section className="section">
        <h2 className="section-title">Our Trading Bots</h2>
        <p className="section-subtitle">3 algorithmic strategies running 24/7 on Solana mainnet</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "32px" }}>
          {bots.map((bot, i) => (
            <div key={i} style={{
              background: "linear-gradient(135deg, rgba(31,35,51,0.95), rgba(18,24,38,0.95))",
              border: `1px solid ${bot.color}33`,
              borderRadius: "20px",
              padding: "28px",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${bot.color}, transparent)` }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <span style={{ fontSize: "40px" }}>{bot.icon}</span>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                  <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", background: `${bot.tagColor}22`, color: bot.tagColor, border: `1px solid ${bot.tagColor}44` }}>{bot.tag}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#10b981" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 2s infinite" }} />
                    Running
                  </span>
                </div>
              </div>

              <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#fff", marginBottom: "10px" }}>{bot.name}</h3>
              <p style={{ color: "#777", fontSize: "13px", lineHeight: "1.7", marginBottom: "20px" }}>{bot.desc}</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "20px" }}>
                {bot.stats.map((s, j) => (
                  <div key={j} style={{ background: `${bot.color}0d`, border: `1px solid ${bot.color}1a`, borderRadius: "8px", padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: "15px", fontWeight: "bold", color: bot.color }}>{s.value}</div>
                    <div style={{ fontSize: "10px", color: "#555", marginTop: "2px" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <Link href="/market" style={{
                display: "block", textAlign: "center", padding: "11px",
                background: `${bot.color}18`, border: `1px solid ${bot.color}44`,
                borderRadius: "10px", color: bot.color, fontSize: "13px",
                fontWeight: "bold", textDecoration: "none",
              }}>
                Buy License →
              </Link>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/analytics" className="btn-secondary" style={{ padding: "12px 32px" }}>
            View Live Analytics →
          </Link>
        </div>
      </section>

      <div className="neon-divider" />

      {/* ── HOW IT WORKS — terminal style ── */}
      <div className="section-full" id="how-it-works">
        <div className="section-inner">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">From bot execution to your wallet — fully on-chain</p>

          <div style={{ maxWidth: "860px", margin: "0 auto", background: "#0d1117", border: "1px solid rgba(0,255,255,0.15)", borderRadius: "16px", overflow: "hidden" }}>
            {/* Terminal header */}
            <div style={{ background: "#161b22", padding: "12px 20px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f57" }} />
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#febc2e" }} />
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#28c840" }} />
              <span style={{ marginLeft: "12px", fontSize: "12px", color: "#555", fontFamily: "monospace" }}>fixvesta — bot-engine v1.0</span>
              <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#10b981" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                LIVE
              </span>
            </div>

            {/* Steps */}
            <div style={{ padding: "32px 28px", display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                { n: "01", icon: "⚡", color: "#00ffff",  title: "Bot Detects Opportunity",   code: `[ARB]  route: Raydium → Jupiter  gap: +0.42%  executing...`, detail: "Scanner finds price gap across DEXes in milliseconds" },
                { n: "02", icon: "🔗", color: "#7c3aed",  title: "Jito Bundle Submitted",     code: `[EXEC] bundle_id: 0x4f2a...  priority_fee: 0.0003 SOL  status: confirmed`, detail: "Atomic MEV execution — transaction lands or nothing executes" },
                { n: "03", icon: "💰", color: "#10b981",  title: "Profit Sent to Treasury",   code: `[TRSRY] +0.041 SOL  epoch: 147  tx: 3xK9...mF2`, detail: "60% of epoch profits flow into the on-chain reward pool" },
                { n: "04", icon: "🎯", color: "#f59e0b",  title: "Stakers Claim Rewards",     code: `[STAKE] wallet: 9xDQ...  reward: +124.5 CBB  apy: ~25%`, detail: "Claim your proportional share at any time — no lock-up" },
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "20px", paddingBottom: i < 3 ? "0" : "0" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: `${step.color}18`, border: `1px solid ${step.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                      {step.icon}
                    </div>
                    {i < 3 && <div style={{ width: "1px", flex: 1, background: "rgba(255,255,255,0.06)", margin: "6px 0" }} />}
                  </div>
                  <div style={{ paddingBottom: i < 3 ? "28px" : "0", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", color: step.color, fontFamily: "monospace", fontWeight: "bold" }}>{step.n}</span>
                      <span style={{ fontWeight: "bold", color: "#fff", fontSize: "15px" }}>{step.title}</span>
                    </div>
                    <div style={{ background: "#0a0e16", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", fontFamily: "monospace", fontSize: "12px", color: step.color, marginBottom: "8px" }}>
                      {step.code}
                    </div>
                    <p style={{ fontSize: "13px", color: "#666" }}>{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="neon-divider" />

      {/* ── PROFIT CALCULATOR ── */}
      <section className="section">
        <h2 className="section-title">Profit Calculator</h2>
        <p className="section-subtitle">Move the slider to see your daily, monthly and term profit</p>
        <ProfitCalculator />
      </section>

      {/* DISCLAIMER */}
      <div style={{ padding: "0 32px 60px" }}>
        <div className="risk-disclaimer">
          ⚠️ Staking rewards depend on bot trading performance and are not guaranteed.
          Past performance does not guarantee future returns. Do not stake more than you can afford to lose.
          FixVesta is a DeFi protocol — funds are managed by an audited smart contract.
        </div>
      </div>
    </>
  );
}
