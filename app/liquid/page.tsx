"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const pools = [
  {
    id: "sol-cbb",
    name: "SOL / CBB",
    iconA: "◎",
    iconB: "⬡",
    colorA: "#9945ff",
    colorB: "#00ffff",
    tvl: "—",
    apr: "—",
    volume24h: "—",
    fees24h: "—",
    feeRate: "0.3%",
    dex: "Meteora",
    dexUrl: "https://app.meteora.ag/pools",
    status: "live",
  },
  {
    id: "usdt-cbb",
    name: "USDT / CBB",
    iconA: "₮",
    iconB: "⬡",
    colorA: "#26a17b",
    colorB: "#00ffff",
    tvl: "—",
    apr: "—",
    volume24h: "—",
    fees24h: "—",
    feeRate: "0.3%",
    dex: "Meteora",
    dexUrl: "https://app.meteora.ag/pools",
    status: "live",
  },
];

const steps = [
  { step: "1", title: "Connect Wallet", desc: "Connect your Phantom wallet to get started." },
  { step: "2", title: "Choose Pool", desc: "Select SOL/CBB or USDT/CBB pool." },
  { step: "3", title: "Add Liquidity", desc: "Enter amounts for both tokens and confirm on Meteora." },
  { step: "4", title: "Earn Fees", desc: "Start earning trading fees proportional to your share." },
];

type Tab = "add" | "remove" | "positions";

export default function Liquid() {
  const [activePool, setActivePool] = useState(pools[0]);
  const [tab, setTab] = useState<Tab>("add");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [wallet, setWallet] = useState<string | null>(null);

  useEffect(() => {
    setWallet(localStorage.getItem("walletAddress"));
  }, []);

  // Simulated ratio SOL/CBB: 1 SOL = 5000 CBB (0.0002 SOL per CBB)
  // USDT/CBB: 1 USDT = ~62.5 CBB (0.016 USD per CBB)
  const ratios: Record<string, number> = {
    "sol-cbb": 5000,
    "usdt-cbb": 62.5,
  };

  function handleAmountA(val: string) {
    setAmountA(val);
    const n = parseFloat(val);
    if (!isNaN(n) && n > 0) {
      setAmountB((n * ratios[activePool.id]).toFixed(2));
    } else {
      setAmountB("");
    }
  }

  function handleAmountB(val: string) {
    setAmountB(val);
    const n = parseFloat(val);
    if (!isNaN(n) && n > 0) {
      setAmountA((n / ratios[activePool.id]).toFixed(6));
    } else {
      setAmountA("");
    }
  }

  const tokenALabel = activePool.name.split(" / ")[0];
  const tokenBLabel = activePool.name.split(" / ")[1];

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
          ● 2 Pools Active — Meteora
        </div>
        <h1 style={{ fontSize: "42px", marginBottom: "16px" }}>Liquidity Pools</h1>
        <p style={{ color: "#888", fontSize: "18px", maxWidth: "580px", margin: "0 auto 32px" }}>
          Add liquidity to SOL/CBB or USDT/CBB pools. Earn trading fees from every swap.
        </p>

        {/* Stats row */}
        <div style={{ display: "inline-flex", gap: "40px", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { label: "Total TVL",   value: "—" },
            { label: "Avg APR",     value: "—" },
            { label: "Active Pools",value: "2" },
            { label: "DEX",         value: "Meteora" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#00ffff" }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "#555" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 20px 80px" }}>

        {/* Live data notice */}
        <div style={{ marginBottom: "32px", padding: "14px 20px", background: "rgba(0,255,255,0.04)", border: "1px solid rgba(0,255,255,0.15)", borderRadius: "10px", fontSize: "13px", color: "#888", textAlign: "center" }}>
          Pool stats (TVL, APR, volume) will show live data after pool activation on Meteora.
        </div>

        {/* Pool selector cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          {pools.map((pool) => (
            <div
              key={pool.id}
              onClick={() => setActivePool(pool)}
              style={{
                background: "linear-gradient(135deg, rgba(31,35,51,0.95), rgba(18,24,38,0.95))",
                border: `1px solid ${activePool.id === pool.id ? "rgba(0,255,255,0.4)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: "16px",
                padding: "24px",
                cursor: "pointer",
                transition: "border-color 0.2s",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {activePool.id === pool.id && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #00ffff, transparent)" }} />
              )}

              {/* Pool name */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ display: "flex" }}>
                    <span style={{ fontSize: "28px", color: pool.colorA }}>{pool.iconA}</span>
                    <span style={{ fontSize: "28px", color: pool.colorB, marginLeft: "-8px" }}>{pool.iconB}</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "16px", color: "#fff" }}>{pool.name}</div>
                    <div style={{ fontSize: "12px", color: "#555" }}>{pool.dex} · {pool.feeRate}</div>
                  </div>
                </div>
                <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "12px", background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)" }}>
                  ● Live
                </span>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { label: "TVL",        value: pool.tvl,      color: "#fff" },
                  { label: "APR",        value: pool.apr,      color: "#10b981" },
                  { label: "24h Volume", value: pool.volume24h, color: "#aaa" },
                  { label: "24h Fees",   value: pool.fees24h,  color: "#f59e0b" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "10px 12px" }}>
                    <div style={{ fontSize: "11px", color: "#555", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
                    <div style={{ fontSize: "15px", fontWeight: "bold", color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Main panel */}
        <div style={{ display: "flex", gap: "28px", alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* Left: liquidity form */}
          <div style={{ flex: 2, minWidth: "320px" }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(31,35,51,0.95), rgba(18,24,38,0.95))",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              overflow: "hidden",
            }}>
              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {(["add", "remove", "positions"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      flex: 1,
                      padding: "16px",
                      background: "transparent",
                      border: "none",
                      borderBottom: tab === t ? "2px solid #00ffff" : "2px solid transparent",
                      color: tab === t ? "#00ffff" : "#555",
                      fontSize: "14px",
                      fontWeight: tab === t ? "bold" : "normal",
                      cursor: "pointer",
                      textTransform: "capitalize",
                      transition: "color 0.2s",
                    }}
                  >
                    {t === "add" ? "Add Liquidity" : t === "remove" ? "Remove" : "My Positions"}
                  </button>
                ))}
              </div>

              <div style={{ padding: "28px" }}>
                {tab === "add" && (
                  <>
                    <div style={{ fontSize: "14px", color: "#888", marginBottom: "20px" }}>
                      Selected pool: <span style={{ color: "#00ffff", fontWeight: "bold" }}>{activePool.name}</span>
                    </div>

                    {/* Token A */}
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <label style={{ fontSize: "13px", color: "#888" }}>{tokenALabel}</label>
                        <span style={{ fontSize: "12px", color: "#555" }}>Balance: —</span>
                      </div>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                          type="number"
                          placeholder="0.0"
                          value={amountA}
                          onChange={(e) => handleAmountA(e.target.value)}
                          style={{ flex: 1, padding: "14px", background: "#1e2235", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", fontSize: "18px" }}
                        />
                        <div style={{ minWidth: "80px", textAlign: "center", padding: "10px", background: "rgba(0,255,255,0.08)", border: "1px solid rgba(0,255,255,0.2)", borderRadius: "10px", fontWeight: "bold", color: "#fff", fontSize: "15px" }}>
                          {tokenALabel}
                        </div>
                      </div>
                    </div>

                    {/* Plus icon */}
                    <div style={{ textAlign: "center", color: "#555", fontSize: "20px", marginBottom: "12px" }}>+</div>

                    {/* Token B */}
                    <div style={{ marginBottom: "24px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <label style={{ fontSize: "13px", color: "#888" }}>{tokenBLabel}</label>
                        <span style={{ fontSize: "12px", color: "#555" }}>Balance: —</span>
                      </div>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                          type="number"
                          placeholder="0.0"
                          value={amountB}
                          onChange={(e) => handleAmountB(e.target.value)}
                          style={{ flex: 1, padding: "14px", background: "#1e2235", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", fontSize: "18px" }}
                        />
                        <div style={{ minWidth: "80px", textAlign: "center", padding: "10px", background: "rgba(0,255,255,0.08)", border: "1px solid rgba(0,255,255,0.2)", borderRadius: "10px", fontWeight: "bold", color: "#00ffff", fontSize: "15px" }}>
                          CBB
                        </div>
                      </div>
                    </div>

                    {/* Pool info summary */}
                    {(amountA || amountB) && (
                      <div style={{ background: "rgba(0,255,255,0.04)", border: "1px solid rgba(0,255,255,0.12)", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
                        <div style={{ fontSize: "12px", color: "#555", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Pool preview</div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "8px" }}>
                          <span style={{ color: "#aaa" }}>Rate</span>
                          <span style={{ color: "#fff" }}>1 {tokenALabel} = {ratios[activePool.id].toLocaleString()} CBB</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "8px" }}>
                          <span style={{ color: "#aaa" }}>Fee tier</span>
                          <span style={{ color: "#f59e0b" }}>{activePool.feeRate}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                          <span style={{ color: "#aaa" }}>Est. APR</span>
                          <span style={{ color: "#10b981", fontWeight: "bold" }}>{activePool.apr}</span>
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    {!wallet ? (
                      <button
                        className="btn-primary"
                        style={{ width: "100%", padding: "16px", fontSize: "16px" }}
                        onClick={() => {
                          const solana = (window as any).solana;
                          if (solana?.isPhantom) {
                            solana.connect().then((resp: any) => {
                              const addr = resp.publicKey.toString();
                              localStorage.setItem("walletAddress", addr);
                              setWallet(addr);
                            });
                          } else {
                            window.open("https://phantom.app/", "_blank");
                          }
                        }}
                      >
                        Connect Wallet
                      </button>
                    ) : (
                      <a
                        href={activePool.dexUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "16px",
                          textAlign: "center",
                          background: "linear-gradient(45deg, #00bcd4, #0059ff)",
                          border: "none",
                          borderRadius: "12px",
                          color: "#fff",
                          fontSize: "16px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          textDecoration: "none",
                          boxSizing: "border-box",
                        }}
                      >
                        Add Liquidity on Meteora ↗
                      </a>
                    )}

                    <p style={{ fontSize: "12px", color: "#444", marginTop: "12px", textAlign: "center", lineHeight: "1.5" }}>
                      Liquidity is managed on Meteora. You will be redirected to complete the transaction.
                    </p>
                  </>
                )}

                {tab === "remove" && (
                  <div style={{ textAlign: "center", padding: "32px 0" }}>
                    <div style={{ fontSize: "40px", marginBottom: "16px" }}>📤</div>
                    <div style={{ color: "#fff", fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Remove Liquidity</div>
                    <p style={{ color: "#888", fontSize: "14px", marginBottom: "24px", lineHeight: "1.6" }}>
                      To remove your liquidity position, visit Meteora directly with your connected wallet.
                    </p>
                    <a
                      href={activePool.dexUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ textDecoration: "none", padding: "14px 32px", display: "inline-block" }}
                    >
                      Open Meteora ↗
                    </a>
                  </div>
                )}

                {tab === "positions" && (
                  <div>
                    {!wallet ? (
                      <div style={{ textAlign: "center", padding: "32px 0" }}>
                        <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔗</div>
                        <p style={{ color: "#888", fontSize: "14px", marginBottom: "20px" }}>Connect wallet to view your positions</p>
                        <button
                          className="btn-primary"
                          style={{ padding: "12px 28px" }}
                          onClick={() => {
                            const solana = (window as any).solana;
                            if (solana?.isPhantom) {
                              solana.connect().then((resp: any) => {
                                const addr = resp.publicKey.toString();
                                localStorage.setItem("walletAddress", addr);
                                setWallet(addr);
                              });
                            } else {
                              window.open("https://phantom.app/", "_blank");
                            }
                          }}
                        >
                          Connect Wallet
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
                          Wallet: <span style={{ color: "#00ffff" }}>{wallet.slice(0, 8)}...{wallet.slice(-8)}</span>
                        </div>
                        <div style={{ padding: "24px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", textAlign: "center" }}>
                          <div style={{ color: "#555", fontSize: "14px", marginBottom: "12px" }}>No active LP positions found</div>
                          <p style={{ color: "#444", fontSize: "13px", lineHeight: "1.6" }}>
                            LP positions are tracked on-chain via Meteora.
                            Once you add liquidity your position will appear here.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: info panel */}
          <div style={{ flex: 1, minWidth: "280px", display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* How it works */}
            <div style={{
              background: "linear-gradient(135deg, rgba(31,35,51,0.95), rgba(18,24,38,0.95))",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px",
              padding: "24px",
            }}>
              <h3 style={{ fontSize: "16px", marginBottom: "20px", color: "#fff" }}>How it works</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div style={{
                      minWidth: "28px", height: "28px", borderRadius: "50%",
                      background: "rgba(0,255,255,0.1)", border: "1px solid rgba(0,255,255,0.3)",
                      color: "#00ffff", fontSize: "13px", fontWeight: "bold",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {s.step}
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "bold", color: "#fff", marginBottom: "2px" }}>{s.title}</div>
                      <div style={{ fontSize: "13px", color: "#888", lineHeight: "1.5" }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LP rewards info */}
            <div style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(0,89,255,0.06))",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: "16px",
              padding: "24px",
            }}>
              <div style={{ fontSize: "20px", marginBottom: "10px" }}>💸</div>
              <h3 style={{ fontSize: "15px", marginBottom: "10px", color: "#10b981" }}>Earn Trading Fees</h3>
              <p style={{ fontSize: "13px", color: "#888", lineHeight: "1.6", marginBottom: "12px" }}>
                Every swap in the pool generates 0.3% in fees. As an LP provider
                you earn a share proportional to your position.
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "#555" }}>SOL/CBB APR</span>
                <span style={{ color: "#555" }}>— (live after launch)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginTop: "6px" }}>
                <span style={{ color: "#555" }}>USDT/CBB APR</span>
                <span style={{ color: "#555" }}>— (live after launch)</span>
              </div>
            </div>

            {/* Staking alternative */}
            <div style={{
              background: "rgba(0,255,255,0.04)",
              border: "1px solid rgba(0,255,255,0.12)",
              borderRadius: "16px",
              padding: "20px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "13px", color: "#888", marginBottom: "10px", lineHeight: "1.5" }}>
                Prefer a simpler option?
              </div>
              <Link href="/stake" className="btn-primary" style={{ display: "inline-block", padding: "10px 24px", fontSize: "14px", textDecoration: "none" }}>
                Stake CBB — 25% APY →
              </Link>
            </div>
          </div>
        </div>

        {/* Risk disclaimer */}
        <div style={{ marginTop: "48px", padding: "16px 24px", background: "rgba(255,140,0,0.06)", border: "1px solid rgba(255,140,0,0.2)", borderRadius: "10px", fontSize: "13px", color: "#aaa", textAlign: "center", lineHeight: "1.6" }}>
          ⚠️ Providing liquidity involves impermanent loss risk. Pool APRs are estimates based on recent volume and may change.
          Always do your own research before providing liquidity.
        </div>
      </div>
    </div>
  );
}
