"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { apiFetch, getStoredUser, clearSession, type SignedSession } from "../lib/auth-client";

type Stake = {
  id: number;
  currency: string;
  amount: string;
  txHash: string;
  startDate: string;
  endDate: string;
  lastClaim: string | null;
  isActive: boolean;
};

type Claim = { id: number; stakeId: number; amount: string; status: string; claimedAt: string };

type Me = {
  id: number;
  walletAddress: string;
  walletType: string;
  referralCode: string;
  bonusBalance: string;
  stakes: Stake[];
  claims: Claim[];
  referralsEarned: { id: number; amount: string; paidAt: string }[];
};

type Settings = { dailyRate: number; stakeDays: number; refPercent: number; minStake: number };

function fmt(n: number | string, digits = 2): string {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (!Number.isFinite(v)) return "0";
  return v.toLocaleString(undefined, { maximumFractionDigits: digits });
}

function pendingFor(stake: Stake, dailyRate: number): { amount: number; days: number; readyIn: number } {
  const last = stake.lastClaim ? new Date(stake.lastClaim).getTime() : new Date(stake.startDate).getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const elapsed = Date.now() - last;
  const days = Math.floor(elapsed / oneDay);
  const amount = Math.max(0, parseFloat(stake.amount) * dailyRate * days);
  const readyIn = days > 0 ? 0 : oneDay - (elapsed % oneDay);
  return { amount, days, readyIn };
}

function fmtCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function buildHistory(claims: Claim[], totalStaked: number, dailyRate: number) {
  if (claims.length === 0) {
    return Array.from({ length: 7 }, (_, i) => ({
      day: `Day ${i + 1}`,
      cumulative: parseFloat((totalStaked * dailyRate * (i + 1)).toFixed(2)),
    }));
  }
  const sorted = [...claims].sort((a, b) => +new Date(a.claimedAt) - +new Date(b.claimedAt));
  let cum = 0;
  return sorted.map((c, i) => {
    cum += parseFloat(c.amount);
    return { day: `Claim ${i + 1}`, cumulative: parseFloat(cum.toFixed(2)) };
  });
}

export default function Dashboard() {
  const [user, setUser] = useState<SignedSession["user"] | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [tick, setTick] = useState(0);            // forces re-render so countdowns tick
  const [copied, setCopied] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try { setMe(await apiFetch<Me>("/api/user/me")); setError(null); }
    catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg !== "Unauthorized") setError(msg);
    }
  }, []);

  useEffect(() => {
    setUser(getStoredUser());
    fetch("/api/admin/settings").then((r) => r.json()).then(setSettings).catch(() => {});
  }, []);

  useEffect(() => { if (user) load(); }, [user, load]);

  // Tick every 1s so countdown timers update
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);

  function disconnect() {
    clearSession();
    setUser(null); setMe(null);
  }

  async function claim(stakeId: number) {
    setBusyId(stakeId); setError(null); setInfo(null);
    try {
      const res = await apiFetch<{ amount: number; days: number }>("/api/stake/claim", {
        method: "POST",
        body: JSON.stringify({ stakeId }),
      });
      setInfo(`Claimed $${fmt(res.amount)} for ${res.days} day${res.days === 1 ? "" : "s"}.`);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setBusyId(null); }
  }

  async function copyRef() {
    if (!me) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://fixvesta.com";
    await navigator.clipboard.writeText(`${origin}/?ref=${me.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!user) {
    return (
      <div className="page-wrap">
        <div className="dash-connect-card">
          <div style={{ fontSize: "56px", marginBottom: "20px" }}>🔐</div>
          <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>Connect Your Wallet</h2>
          <p style={{ color: "#888", marginBottom: "28px", lineHeight: "1.6" }}>
            Connect MetaMask, TronLink or Phantom from the top-right<br />
            to see your staking position, daily rewards and referral stats.
          </p>
          <Link href="/stake" className="btn-primary" style={{ padding: "14px 40px", fontSize: "16px", display: "inline-block" }}>
            Go to Stake
          </Link>
        </div>
      </div>
    );
  }

  const dailyRate    = settings?.dailyRate ?? 0.005;
  const stakeDays    = settings?.stakeDays ?? 100;
  const refPercent   = settings?.refPercent ?? 0.03;
  const stakes       = me?.stakes ?? [];
  const claims       = me?.claims ?? [];
  const activeStakes = stakes.filter((s) => s.isActive);

  const totalStaked  = activeStakes.reduce((sum, s) => sum + parseFloat(s.amount), 0);
  const dailyReward  = totalStaked * dailyRate;
  const totalAvail   = activeStakes.reduce((sum, s) => sum + pendingFor(s, dailyRate).amount, 0);

  let daysRemaining = 0;
  if (activeStakes.length > 0) {
    const endTimes = activeStakes.map((s) => new Date(s.endDate).getTime());
    const minEnd   = Math.min(...endTimes);
    daysRemaining  = Math.max(0, Math.ceil((minEnd - Date.now()) / (24 * 60 * 60 * 1000)));
  }

  const history = buildHistory(claims, totalStaked, dailyRate);
  const totalClaimed = claims.reduce((s, c) => s + parseFloat(c.amount), 0);
  const refsEarned   = (me?.referralsEarned ?? []).reduce((s, r) => s + parseFloat(r.amount), 0);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://fixvesta.com";
  const refUrl = me ? `${origin}/?ref=${me.referralCode}` : "";

  const tooltipStyle = {
    contentStyle: { background: "#1a1f2e", border: "1px solid rgba(0,255,255,0.2)", borderRadius: "8px" },
    labelStyle: { color: "#aaa" },
  };

  // touch tick so eslint is happy
  void tick;

  return (
    <div className="page-wrap">
      <div className="dash-header">
        <div>
          <h1 className="dash-title">My Dashboard</h1>
          <div className="dash-wallet-label">
            <span className="live-dot" />
            {user.walletAddress.slice(0, 8)}…{user.walletAddress.slice(-8)} · {user.walletType}
          </div>
        </div>
        <button className="disconnect-btn" onClick={disconnect}>Disconnect</button>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", color: "#ef4444" }}>
          {error}
        </div>
      )}
      {info && (
        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", color: "#10b981" }}>
          {info}
        </div>
      )}

      <div className="stat-cards-grid">
        <div className="stat-card">
          <div className="stat-card-label">USDT Staked</div>
          <div className="stat-card-value cyan">${fmt(totalStaked)}</div>
          <div className="stat-card-sub">{activeStakes.length} active stake{activeStakes.length === 1 ? "" : "s"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Daily Reward</div>
          <div className="stat-card-value green">${fmt(dailyReward)}</div>
          <div className="stat-card-sub">{(dailyRate * 100).toFixed(2)}% of stake</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Available to Claim</div>
          <div className="stat-card-value yellow">${fmt(totalAvail)}</div>
          <div className="stat-card-sub tick-label">● Updates every 24h</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Days Remaining</div>
          <div className="stat-card-value cyan">{daysRemaining}</div>
          <div className="stat-card-sub">of {stakeDays}-day term</div>
        </div>
      </div>

      {/* My Stakes with CLAIM buttons */}
      <div className="glass-card" style={{ marginTop: "24px" }}>
        <h3 className="card-title">Active Stakes</h3>
        {activeStakes.length === 0 ? (
          <div style={{ color: "#666", padding: "20px 0", textAlign: "center" }}>
            No active stakes.{" "}
            <Link href="/stake" style={{ color: "#00ffff" }}>Create your first one →</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {activeStakes.map((s) => {
              const p = pendingFor(s, dailyRate);
              const elapsedDays = Math.floor((Date.now() - new Date(s.startDate).getTime()) / (24 * 60 * 60 * 1000));
              const progressPct = Math.min(100, (elapsedDays / stakeDays) * 100);
              const canClaim = p.amount > 0;
              return (
                <div key={s.id} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 600, color: "#fff" }}>
                        ${fmt(s.amount)} · {s.currency}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        Started {new Date(s.startDate).toLocaleDateString()} · ends {new Date(s.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <span className="badge-green">ACTIVE</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#888", marginBottom: "4px" }}>
                    <span>{elapsedDays} / {stakeDays} days</span>
                    <span>{progressPct.toFixed(1)}%</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "#888" }}>Available to claim</div>
                      <div style={{ fontSize: "20px", fontWeight: 700, color: canClaim ? "#10b981" : "#666" }}>
                        ${fmt(p.amount)}
                      </div>
                      {!canClaim && (
                        <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>
                          Next in {fmtCountdown(p.readyIn)}
                        </div>
                      )}
                    </div>
                    <button
                      className="btn-primary"
                      onClick={() => claim(s.id)}
                      disabled={!canClaim || busyId === s.id}
                      style={{ minWidth: "140px" }}
                    >
                      {busyId === s.id ? "Claiming…" : canClaim ? "Claim Now" : "Wait 24h"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Referral section */}
      <div className="glass-card" style={{ marginTop: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <h3 className="card-title" style={{ margin: 0 }}>Referral Program</h3>
          <span style={{ fontSize: "13px", color: "#10b981" }}>
            ● {(refPercent * 100).toFixed(0)}% per deposit · paid instantly
          </span>
        </div>

        <div className="vest-label">Your referral link</div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <input
            className="stake-input"
            readOnly
            value={refUrl}
            style={{ marginBottom: 0, fontFamily: "monospace", fontSize: "13px" }}
            onFocus={(e) => e.currentTarget.select()}
          />
          <button className="btn-secondary" onClick={copyRef} style={{ minWidth: "110px" }}>
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>

        <div className="stat-cards-grid">
          <div className="vest-stat">
            <div className="vest-label">Referrals</div>
            <div className="vest-val cyan">{me?.referralsEarned.length ?? 0}</div>
          </div>
          <div className="vest-stat">
            <div className="vest-label">Earned (total)</div>
            <div className="vest-val green">${fmt(refsEarned)}</div>
          </div>
          <div className="vest-stat">
            <div className="vest-label">Bonus Balance</div>
            <div className="vest-val yellow">${fmt(me?.bonusBalance ?? 0)}</div>
          </div>
          <div className="vest-stat">
            <div className="vest-label">Total Claimed</div>
            <div className="vest-val green">${fmt(totalClaimed)}</div>
          </div>
        </div>
      </div>

      {/* Rewards chart */}
      <div className="glass-card" style={{ marginTop: "24px" }}>
        <div className="chart-header">
          <span>Reward Accumulation</span>
          <span style={{ color: "#10b981", fontSize: "13px" }}>+{(dailyRate * 100).toFixed(2)}% / day</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={history}>
            <defs>
              <linearGradient id="rewardGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#00ffff" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00ffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" stroke="#555" tick={{ fontSize: 11 }} />
            <YAxis stroke="#555" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
            <Tooltip {...tooltipStyle} formatter={(v) => [`$${Number(v).toFixed(2)}`, "Rewards"]} />
            <Area type="monotone" dataKey="cumulative" stroke="#00ffff" strokeWidth={2} fill="url(#rewardGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent claims */}
      <div className="glass-card" style={{ marginTop: "24px" }}>
        <div className="chart-header">
          <span>Recent Claims</span>
          <span style={{ fontSize: "12px", color: "#10b981" }}>● Live</span>
        </div>
        {claims.length === 0 ? (
          <div style={{ textAlign: "center", color: "#555", fontSize: "14px", padding: "24px" }}>
            No claims yet. Once you stake, daily rewards become claimable every 24h.
          </div>
        ) : (
          <div className="tx-table" style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr" }}>
            <div className="tx-header">
              <span>Date</span><span>Amount</span><span>Stake</span><span>Status</span>
            </div>
            {claims.slice(0, 10).map((c) => (
              <div className="tx-row" key={c.id}>
                <span style={{ color: "#888", fontSize: "13px" }}>{new Date(c.claimedAt).toLocaleString()}</span>
                <span className="position-value green">${fmt(c.amount)}</span>
                <span style={{ color: "#888", fontSize: "13px" }}>#{c.stakeId}</span>
                <span>
                  {c.status === "completed"
                    ? <span className="badge-green">PAID</span>
                    : <span className="badge-red">{c.status.toUpperCase()}</span>}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="risk-disclaimer" style={{ marginTop: "32px" }}>
        ⚠️ Returns depend on bot trading performance and are not guaranteed.
        Funds are held in an audited smart contract — never in our custody.
      </div>
    </div>
  );
}
