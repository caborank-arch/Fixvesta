"use client";
import { useEffect, useState } from "react";

const BASE_TRADES = [
  { bot: "⚡ ARB",       pair: "SOL/USDC",  pnl: "+$12.40", color: "#00ffff" },
  { bot: "⚔️ FRONT",    pair: "BONK/SOL",  pnl: "+$8.20",  color: "#7c3aed" },
  { bot: "🏦 LIQ",      pair: "mSOL",      pnl: "+$45.00", color: "#10b981" },
  { bot: "⚡ ARB",       pair: "RAY/USDC",  pnl: "+$6.80",  color: "#00ffff" },
  { bot: "⚔️ FRONT",    pair: "WIF/SOL",   pnl: "+$19.60", color: "#7c3aed" },
  { bot: "⚡ ARB",       pair: "JUP/SOL",   pnl: "+$3.90",  color: "#00ffff" },
  { bot: "🏦 LIQ",      pair: "USDC/SOL",  pnl: "+$88.00", color: "#10b981" },
  { bot: "⚔️ FRONT",    pair: "POPCAT/SOL",pnl: "+$14.20", color: "#7c3aed" },
  { bot: "⚡ ARB",       pair: "ORCA/USDC", pnl: "+$5.50",  color: "#00ffff" },
  { bot: "🏦 LIQ",      pair: "SOL/USDT",  pnl: "+$32.10", color: "#10b981" },
];

function randomPnl() {
  const val = (Math.random() * 90 + 2).toFixed(2);
  return `+$${val}`;
}

export default function TradeTicker() {
  const [trades, setTrades] = useState(BASE_TRADES);

  // Every 3s randomly update one trade's PnL to simulate live data
  useEffect(() => {
    const t = setInterval(() => {
      setTrades((prev) => {
        const next = [...prev];
        const idx = Math.floor(Math.random() * next.length);
        next[idx] = { ...next[idx], pnl: randomPnl() };
        return next;
      });
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // Duplicate for seamless loop
  const items = [...trades, ...trades];

  return (
    <div style={{
      overflow: "hidden",
      borderTop: "1px solid rgba(0,255,255,0.08)",
      borderBottom: "1px solid rgba(0,255,255,0.08)",
      background: "rgba(0,0,0,0.3)",
      padding: "10px 0",
      marginBottom: "0",
    }}>
      <div className="ticker-track">
        {items.map((t, i) => (
          <div key={i} className="ticker-item">
            <span style={{ color: t.color, fontWeight: "bold", fontSize: "13px" }}>{t.bot}</span>
            <span style={{ color: "#555", fontSize: "12px", margin: "0 6px" }}>·</span>
            <span style={{ color: "#888", fontSize: "12px" }}>{t.pair}</span>
            <span style={{ color: "#555", fontSize: "12px", margin: "0 6px" }}>·</span>
            <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "13px" }}>{t.pnl}</span>
            <span style={{ color: "#333", margin: "0 24px", fontSize: "12px" }}>|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
