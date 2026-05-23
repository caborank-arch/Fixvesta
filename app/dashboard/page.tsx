"use client";
import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  getCBBBalance, getRecentTransactions, getStakeData, calcPendingRewards,
  getVestingEntries, calcTotalVesting, timeAgo, shorten, DAILY_RATE,
  type TxRecord,
} from "../lib/solana";

// Generate 30-day simulated reward history for chart
function buildRewardHistory(staked: number, stakedAt: number) {
  const now = Date.now() / 1000;
  const days = Math.min(30, Math.floor((now - stakedAt) / 86400));
  return Array.from({ length: Math.max(days + 1, 7) }, (_, i) => ({
    day: `Day ${i + 1}`,
    rewards: parseFloat((staked * DAILY_RATE * (i + 1)).toFixed(2)),
    staked: parseFloat(staked.toFixed(0)),
  }));
}

export default function Dashboard() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [cbbBalance, setCbbBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [stakeData, setStakeData] = useState<ReturnType<typeof getStakeData>>(null);
  const [pendingRewards, setPendingRewards] = useState(0);
  const [txs, setTxs] = useState<TxRecord[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [vestingTotal, setVestingTotal] = useState<ReturnType<typeof calcTotalVesting>>(null);
  const [vestingEntries, setVestingEntries] = useState<ReturnType<typeof getVestingEntries>>([]);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const addr = localStorage.getItem("walletAddress");
    if (addr) setWallet(addr);
    const sd = getStakeData();
    setStakeData(sd);
    const entries = getVestingEntries();
    setVestingEntries(entries);
    setVestingTotal(calcTotalVesting(entries));
  }, []);

  // Fetch real on-chain data when wallet changes
  useEffect(() => {
    if (!wallet) return;
    setLoading(true);
    getCBBBalance(wallet).then((b) => { setCbbBalance(b); setLoading(false); });
    setTxLoading(true);
    getRecentTransactions(wallet, 5).then((t) => { setTxs(t); setTxLoading(false); });
  }, [wallet]);

  // Live rewards ticker
  useEffect(() => {
    if (!stakeData) return;
    setPendingRewards(calcPendingRewards(stakeData));
    tickRef.current = setInterval(() => {
      setPendingRewards(calcPendingRewards(stakeData));
    }, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [stakeData]);

  async function connectWallet() {
    const solana = (window as any).solana;
    if (solana?.isPhantom) {
      const resp = await solana.connect();
      const addr = resp.publicKey.toString();
      localStorage.setItem("walletAddress", addr);
      setWallet(addr);
    } else {
      window.open("https://phantom.app/", "_blank");
    }
  }

  function disconnect() {
    localStorage.removeItem("walletAddress");
    setWallet(null);
    setCbbBalance(null);
  }

  const stakedAmt = stakeData?.amount ?? 0;
  const dailyReward = stakedAmt * DAILY_RATE;
  const rewardHistory = stakeData
    ? buildRewardHistory(stakeData.amount, stakeData.stakedAt)
    : buildRewardHistory(5000, Date.now() / 1000 - 7 * 86400);

  const tooltipStyle = {
    contentStyle: { background: "#1a1f2e", border: "1px solid rgba(0,255,255,0.2)", borderRadius: "8px" },
    labelStyle: { color: "#aaa" },
  };

  // === NOT CONNECTED ===
  if (!wallet) {
    return (
      <div className="page-wrap">
        <div className="dash-connect-card">
          <div style={{ fontSize: "56px", marginBottom: "20px" }}>🔐</div>
          <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>Connect Your Wallet</h2>
          <p style={{ color: "#888", marginBottom: "28px", lineHeight: "1.6" }}>
            Connect Phantom to see your CBB balance, staking position,<br />
            vesting schedule and transaction history.
          </p>
          <button className="btn-primary" style={{ padding: "14px 40px", fontSize: "16px" }} onClick={connectWallet}>
            Connect Phantom
          </button>
        </div>
      </div>
    );
  }

  // === CONNECTED ===
  return (
    <div className="page-wrap">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">My Dashboard</h1>
          <div className="dash-wallet-label">
            <span className="live-dot" />
            {shorten(wallet, 6)}
          </div>
        </div>
        <button className="disconnect-btn" onClick={disconnect}>Disconnect</button>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards-grid">
        <div className="stat-card">
          <div className="stat-card-label">CBB in Wallet</div>
          <div className="stat-card-value cyan">
            {loading ? <span className="loading-shimmer">Loading...</span> : (cbbBalance ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div className="stat-card-sub">CBB tokens</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Staked</div>
          <div className="stat-card-value">{stakedAmt.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div className="stat-card-sub">CBB locked in protocol</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Pending Rewards</div>
          <div className="stat-card-value green">
            {pendingRewards.toLocaleString(undefined, { maximumFractionDigits: 4 })}
          </div>
          <div className="stat-card-sub tick-label">● Counting live</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Est. APY</div>
          <div className="stat-card-value cyan">~25%</div>
          <div className="stat-card-sub">{dailyReward.toFixed(2)} CBB / day</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="dash-charts-row">
        {/* Rewards Area Chart */}
        <div className="glass-card" style={{ flex: 2, minWidth: 0 }}>
          <div className="chart-header">
            <span>Reward Accumulation</span>
            <span style={{ color: "#10b981", fontSize: "13px" }}>
              +{((DAILY_RATE) * 100).toFixed(3)}% / day
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={rewardHistory}>
              <defs>
                <linearGradient id="rewardGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00ffff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" stroke="#555" tick={{ fontSize: 11 }} />
              <YAxis stroke="#555" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}`} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`${Number(v).toFixed(2)} CBB`, "Rewards"]} />
              <Area type="monotone" dataKey="rewards" stroke="#00ffff" strokeWidth={2} fill="url(#rewardGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Position Card */}
        <div className="glass-card dash-position-card" style={{ flex: 1, minWidth: "240px" }}>
          <h3 className="card-title" style={{ marginBottom: "20px" }}>My Position</h3>

          {stakedAmt === 0 ? (
            <div style={{ textAlign: "center", color: "#555", fontSize: "14px", padding: "20px 0" }}>
              No active stake.<br />
              <a href="/stake" className="btn-primary" style={{ display: "inline-block", marginTop: "16px", padding: "10px 24px", fontSize: "14px" }}>
                Stake Now
              </a>
            </div>
          ) : (
            <>
              <div className="position-row">
                <span className="position-label">Staked</span>
                <span className="position-value cyan">{stakedAmt.toLocaleString(undefined, { maximumFractionDigits: 2 })} CBB</span>
              </div>
              <div className="position-row">
                <span className="position-label">In Wallet</span>
                <span className="position-value">{(cbbBalance ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} CBB</span>
              </div>
              <div className="position-row">
                <span className="position-label">Daily Earnings</span>
                <span className="position-value green">+{dailyReward.toFixed(2)} CBB</span>
              </div>
              <div className="position-row">
                <span className="position-label">Unclaimed</span>
                <span className="position-value yellow">{pendingRewards.toFixed(4)} CBB</span>
              </div>

              {/* Reward progress bar */}
              <div style={{ marginTop: "16px", marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#555", marginBottom: "6px" }}>
                  <span>Epoch progress</span>
                  <span>7-day epoch</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{
                    width: `${Math.min(((Date.now() / 1000 - stakeData!.stakedAt) % (7 * 86400)) / (7 * 86400) * 100, 100)}%`,
                  }} />
                </div>
              </div>

              <a href="/stake" className="btn-primary" style={{ display: "block", textAlign: "center", padding: "12px", fontSize: "14px" }}>
                Claim Rewards →
              </a>
            </>
          )}
        </div>
      </div>

      {/* Staked vs Wallet Breakdown */}
      {(stakedAmt > 0 || (cbbBalance ?? 0) > 0) && (
        <div className="glass-card" style={{ marginTop: "24px" }}>
          <h3 className="chart-header"><span>Token Breakdown</span></h3>
          <div className="breakdown-bars">
            {[
              { label: "In Wallet", value: cbbBalance ?? 0, color: "#00ffff" },
              { label: "Staked", value: stakedAmt, color: "#0059ff" },
              { label: "Pending Rewards", value: pendingRewards, color: "#10b981" },
            ].map((item, i) => {
              const total = (cbbBalance ?? 0) + stakedAmt + pendingRewards;
              const pct = total > 0 ? (item.value / total * 100) : 0;
              return (
                <div key={i} className="breakdown-row">
                  <span className="breakdown-label">{item.label}</span>
                  <div className="breakdown-track">
                    <div className="breakdown-fill" style={{ width: `${pct}%`, background: item.color }} />
                  </div>
                  <span className="breakdown-val" style={{ color: item.color }}>
                    {item.value.toLocaleString(undefined, { maximumFractionDigits: 2 })} CBB
                  </span>
                  <span style={{ fontSize: "12px", color: "#555", width: "42px", textAlign: "right" }}>{pct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vesting Schedule */}
      {vestingTotal && vestingEntries.length > 0 && (
        <div className="glass-card" style={{ marginTop: "24px" }}>
          <div className="chart-header">
            <span>Presale Vesting Schedule</span>
            <span style={{ color: "#f59e0b", fontSize: "13px" }}>
              {vestingTotal.pct.toFixed(1)}% Unlocked · {vestingEntries.length} purchase{vestingEntries.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="stat-cards-grid" style={{ marginBottom: "20px" }}>
            <div className="vest-stat">
              <div className="vest-label">Total Purchased</div>
              <div className="vest-val">{vestingTotal.totalPurchased.toLocaleString(undefined, { maximumFractionDigits: 0 })} CBB</div>
            </div>
            <div className="vest-stat">
              <div className="vest-label">Unlocked</div>
              <div className="vest-val green">{Math.floor(vestingTotal.unlocked).toLocaleString()} CBB</div>
            </div>
            <div className="vest-stat">
              <div className="vest-label">Still Locked</div>
              <div className="vest-val yellow">{Math.floor(vestingTotal.locked).toLocaleString()} CBB</div>
            </div>
            <div className="vest-stat">
              <div className="vest-label">Daily Unlock</div>
              <div className="vest-val cyan">+{Math.floor(vestingTotal.dailyUnlock).toLocaleString()} CBB</div>
            </div>
          </div>

          <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#888" }}>
            <span>Vesting progress</span>
            <span>{vestingTotal.daysLeft > 0 ? `${vestingTotal.daysLeft} days to full unlock` : "Fully unlocked!"}</span>
          </div>
          <div className="progress-track" style={{ height: "12px" }}>
            <div className="progress-fill" style={{ width: `${vestingTotal.pct}%`, background: "linear-gradient(90deg, #f59e0b, #10b981)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#444", marginTop: "6px" }}>
            <span>20% at launch</span>
            <span>+2% / day</span>
            <span>100% in 40 days</span>
          </div>

          {/* Individual purchases */}
          {vestingEntries.length > 0 && (
            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ fontSize: "12px", color: "#555", marginBottom: "4px" }}>Purchase history</div>
              {vestingEntries.map((entry, i) => {
                const v = { unlocked: 0, locked: 0 };
                try {
                  const calc = { unlocked: entry.totalAmount * Math.min(0.20 + 0.02 * ((Date.now()/1000 - entry.purchasedAt)/86400), 1) };
                  v.unlocked = calc.unlocked;
                  v.locked = entry.totalAmount - calc.unlocked;
                } catch {}
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", fontSize: "13px", flexWrap: "wrap", gap: "6px" }}>
                    <span style={{ color: "#aaa" }}>Purchase {i + 1}: <span style={{ color: "#fff", fontWeight: "bold" }}>{entry.totalAmount.toLocaleString()} CBB</span></span>
                    <span style={{ color: "#10b981" }}>{Math.floor(v.unlocked).toLocaleString()} unlocked</span>
                    <a href={`https://solscan.io/tx/${entry.txSig}`} target="_blank" rel="noopener noreferrer" style={{ color: "#00ffff", fontSize: "12px" }}>
                      {shorten(entry.txSig, 6)} ↗
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Recent Transactions */}
      <div className="glass-card" style={{ marginTop: "24px" }}>
        <div className="chart-header">
          <span>Recent Transactions</span>
          {txLoading
            ? <span style={{ fontSize: "12px", color: "#555" }}>Loading...</span>
            : <span style={{ fontSize: "12px", color: "#10b981" }}>● Live</span>
          }
        </div>
        {txs.length === 0 && !txLoading ? (
          <div style={{ textAlign: "center", color: "#555", fontSize: "14px", padding: "24px" }}>
            No transactions found for this wallet.
          </div>
        ) : (
          <div className="tx-table">
            <div className="tx-header">
              <span>Signature</span>
              <span>Time</span>
              <span>Status</span>
              <span>Solscan</span>
            </div>
            {txLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="tx-row">
                  <span className="loading-shimmer">Loading...</span>
                  <span>—</span><span>—</span><span>—</span>
                </div>
              ))
              : txs.map((tx) => (
                <div key={tx.signature} className="tx-row">
                  <span className="tx-sig">{shorten(tx.signature, 6)}</span>
                  <span style={{ color: "#888", fontSize: "13px" }}>{timeAgo(tx.blockTime)}</span>
                  <span>
                    {tx.err
                      ? <span className="badge-red">Failed</span>
                      : <span className="badge-green">Success</span>
                    }
                  </span>
                  <span>
                    <a
                      href={`https://solscan.io/tx/${tx.signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tx-link"
                    >
                      View ↗
                    </a>
                  </span>
                </div>
              ))
            }
          </div>
        )}
      </div>

      <div className="risk-disclaimer" style={{ marginTop: "32px" }}>
        ⚠️ Staking and reward data is simulated — on-chain staking contract not yet deployed.
        CBB balance is fetched live from Solana mainnet.
      </div>
    </div>
  );
}
