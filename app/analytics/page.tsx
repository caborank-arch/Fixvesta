"use client";
import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { getRecentTransactions, TREASURY_WALLET, timeAgo, shorten, type TxRecord } from "../lib/solana";

// Simulated cumulative profit data (30 days)
const cumulativePnL = [
  { day: "Day 1",  profit: 520,   daily: 520 },
  { day: "Day 3",  profit: 1180,  daily: 660 },
  { day: "Day 5",  profit: 2050,  daily: 870 },
  { day: "Day 7",  profit: 3100,  daily: 1050 },
  { day: "Day 9",  profit: 4350,  daily: 1250 },
  { day: "Day 11", profit: 5800,  daily: 1450 },
  { day: "Day 13", profit: 7300,  daily: 1500 },
  { day: "Day 15", profit: 9200,  daily: 1900 },
  { day: "Day 17", profit: 11000, daily: 1800 },
  { day: "Day 19", profit: 13100, daily: 2100 },
  { day: "Day 21", profit: 15800, daily: 2700 },
];

const botBreakdown = [
  { name: "Arbitrage",  value: 45, color: "#00ffff" },
  { name: "Front-run",  value: 35, color: "#7c3aed" },
  { name: "Liquidation",value: 20, color: "#10b981" },
];

const botStats = [
  { name: "Front-run / Sandwich BOT", icon: "⚔️", trades: 1240, pnlDay: "+$890",  pnlTotal: "+$5,530", winRate: "81%", status: "Running", color: "#7c3aed" },
  { name: "Arbitrage BOT",            icon: "⚡",  trades: 2847, pnlDay: "+$410",  pnlTotal: "+$7,580", winRate: "74%", status: "Running", color: "#00ffff" },
  { name: "Liquidation BOT",          icon: "🏦",  trades: 38,   pnlDay: "+$280",  pnlTotal: "+$2,690", winRate: "92%", status: "Running", color: "#10b981" },
];

const tooltipStyle = {
  contentStyle: { background: "#1a1f2e", border: "1px solid rgba(0,255,255,0.2)", borderRadius: "8px" },
  labelStyle: { color: "#aaa" },
};

const CBB_MINT = process.env.NEXT_PUBLIC_CBB_MINT || "";

export default function Analytics() {
  const [txs, setTxs] = useState<TxRecord[]>([]);
  const [txLoading, setTxLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [holders, setHolders] = useState<number | null>(null);

  async function fetchTxs() {
    setTxLoading(true);
    const data = await getRecentTransactions(TREASURY_WALLET, 5);
    setTxs(data);
    setLastRefresh(Date.now());
    setTxLoading(false);
  }

  useEffect(() => {
    fetchTxs();
    // Fetch holder count from Solscan public API
    fetch(`https://api.solscan.io/v2/token/holders?token=${CBB_MINT}&limit=1&offset=0`)
      .then((r) => r.json())
      .then((d) => { if (d?.data?.total) setHolders(d.data.total); })
      .catch(() => {});
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchTxs, 30_000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="page-wrap">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Bot Analytics</h1>
          <p style={{ color: "#888", fontSize: "14px" }}>Live performance metrics — 3 bots running on Solana</p>
        </div>
        <div className="live-badge"><span className="live-dot" />Live</div>
      </div>

      <div className="risk-disclaimer" style={{ marginBottom: "28px" }}>
        ⚠️ [Simulated bot data] — Live on-chain integration coming after bot deployment. Treasury wallet transactions are real.
      </div>

      {/* Top KPI Cards */}
      <div className="stat-cards-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        {[
          { label: "Bot Status",   value: "Running", color: "#10b981" },
          { label: "Total Bots",   value: "3",        color: "#00ffff" },
          { label: "24h PnL",      value: "+$1,580",  color: "#10b981" },
          { label: "Total PnL",    value: "+$15,800", color: "#10b981" },
          { label: "Avg Win Rate", value: "68%",      color: "#f59e0b" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value" style={{ color: s.color, fontSize: "22px" }}>{s.value}</div>
          </div>
        ))}
        <div className="stat-card">
          <div className="stat-card-label">CBB Holders</div>
          <div className="stat-card-value" style={{ color: "#00ffff", fontSize: "22px" }}>
            {holders === null ? "..." : holders.toLocaleString()}
          </div>
          <div className="stat-card-sub">on-chain</div>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="dash-charts-row" style={{ marginTop: "0" }}>
        {/* Cumulative PnL */}
        <div className="glass-card" style={{ flex: 2, minWidth: 0 }}>
          <div className="chart-header">
            <span>Cumulative Bot Profit</span>
            <span style={{ color: "#10b981", fontSize: "13px" }}>+$15,800 total</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={cumulativePnL}>
              <defs>
                <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" stroke="#555" tick={{ fontSize: 11 }} />
              <YAxis stroke="#555" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(1)}K`} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`$${Number(v).toLocaleString()}`, "Profit"]} />
              <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2.5} fill="url(#pnlGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie: Profit by bot */}
        <div className="glass-card" style={{ flex: 1, minWidth: "240px" }}>
          <div className="chart-header">
            <span>Profit by Bot</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={botBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                dataKey="value" paddingAngle={3}>
                {botBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, "Share"]} />
              <Legend iconType="circle" iconSize={10} formatter={(value) => (
                <span style={{ color: "#aaa", fontSize: "12px" }}>{value}</span>
              )} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily profit bar chart */}
      <div className="glass-card" style={{ marginTop: "24px" }}>
        <div className="chart-header">
          <span>Daily Profit (USD)</span>
          <span style={{ color: "#f59e0b", fontSize: "13px" }}>+$1,580 today</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={cumulativePnL}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" stroke="#555" tick={{ fontSize: 11 }} />
            <YAxis stroke="#555" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
            <Tooltip {...tooltipStyle} formatter={(v) => [`$${Number(v).toLocaleString()}`, "Daily Profit"]} />
            <Bar dataKey="daily" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-bot stats table */}
      <div className="glass-card" style={{ marginTop: "24px" }}>
        <div className="chart-header" style={{ marginBottom: "20px" }}>
          <span>Bot Performance Breakdown</span>
          <span style={{ fontSize: "12px", color: "#10b981" }}>● 3/3 Running</span>
        </div>
        <div className="tx-table">
          <div className="tx-header" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr" }}>
            <span>Bot</span>
            <span>Trades</span>
            <span>24h PnL</span>
            <span>Total PnL</span>
            <span>Win Rate</span>
            <span>Status</span>
          </div>
          {botStats.map((bot, i) => (
            <div key={i} className="tx-row" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>{bot.icon}</span>
                <span style={{ color: bot.color, fontWeight: "600" }}>{bot.name}</span>
              </span>
              <span style={{ color: "#aaa" }}>{bot.trades.toLocaleString()}</span>
              <span style={{ color: "#10b981" }}>{bot.pnlDay}</span>
              <span style={{ color: "#10b981" }}>{bot.pnlTotal}</span>
              <span style={{ color: "#f59e0b" }}>{bot.winRate}</span>
              <span><span className="badge-green">{bot.status}</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Treasury Transactions */}
      <div className="glass-card" style={{ marginTop: "24px" }}>
        <div className="chart-header">
          <div>
            <span>Treasury Wallet — Live Transactions</span>
            <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
              {shorten(TREASURY_WALLET, 8)}
              <a
                href={`https://solscan.io/account/${TREASURY_WALLET}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00ffff", marginLeft: "8px", fontSize: "11px" }}
              >
                View on Solscan ↗
              </a>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span className="live-dot" />
              <span style={{ fontSize: "12px", color: "#10b981" }}>
                Refreshed {Math.floor((Date.now() - lastRefresh) / 1000)}s ago
              </span>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              style={{
                fontSize: "11px", color: autoRefresh ? "#00ffff" : "#555",
                background: "transparent", border: "1px solid",
                borderColor: autoRefresh ? "rgba(0,255,255,0.3)" : "rgba(255,255,255,0.1)",
                borderRadius: "8px", padding: "3px 8px", cursor: "pointer",
              }}
            >
              Auto-refresh: {autoRefresh ? "ON" : "OFF"}
            </button>
            <button onClick={fetchTxs} className="pct-btn" style={{ fontSize: "11px", padding: "4px 12px" }}>
              ↺ Refresh now
            </button>
          </div>
        </div>

        <div className="tx-table">
          <div className="tx-header">
            <span>Signature</span>
            <span>Time</span>
            <span>Status</span>
            <span>Solscan</span>
          </div>
          {txLoading
            ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="tx-row">
                <span className="loading-shimmer" style={{ width: "160px" }}>Loading...</span>
                <span>—</span><span>—</span><span>—</span>
              </div>
            ))
            : txs.length === 0
              ? <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#555", padding: "24px" }}>
                No transactions found
              </div>
              : txs.map((tx) => (
                <div key={tx.signature} className="tx-row">
                  <span className="tx-sig">{shorten(tx.signature, 8)}</span>
                  <span style={{ color: "#888", fontSize: "13px" }}>{timeAgo(tx.blockTime)}</span>
                  <span>
                    {tx.err
                      ? <span className="badge-red">Failed</span>
                      : <span className="badge-green">Success</span>
                    }
                  </span>
                  <span>
                    <a href={`https://solscan.io/tx/${tx.signature}`} target="_blank" rel="noopener noreferrer" className="tx-link">
                      View ↗
                    </a>
                  </span>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}
