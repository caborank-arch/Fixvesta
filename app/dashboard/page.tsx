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

type Claim = {
  id: number;
  stakeId: number;
  amount: string;
  status: string;
  claimedAt: string;
};

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

function pendingFor(stake: Stake, dailyRate: number): number {
  const last = stake.lastClaim ? new Date(stake.lastClaim).getTime() : new Date(stake.startDate).getTime();
  const days = Math.floor((Date.now() - last) / (24 * 60 * 60 * 1000));
  return Math.max(0, parseFloat(stake.amount) * dailyRate * days);
}

function buildHistory(stakes: Stake[], claims: Claim[]): { day: string; cumulative: number }[] {
  if (claims.length === 0) {
    const total = stakes.reduce((s, k) => s + parseFloat(k.amount), 0);
    return Array.from({ length: 7 }, (_, i) => ({ day: `Day ${i + 1}`, cumulative: total * 0.005 * (i + 1) }));
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

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<Me>("/api/user/me");
      setMe(data);
      setError(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg !== "Unauthorized") setError(msg);
    }
  }, []);

  useEffect(() => {
    setUser(getStoredUser());
    fetch("/api/admin/settings").then((r) => r.json()).then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  function disconnect() {
    clearSession();
    setUser(null);
    setMe(null);
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

  const dailyRate  = settings?.dailyRate ?? 0.005;
  const stakeDays  = settings?.stakeDays ?? 100;
  const stakes     = me?.stakes ?? [];
  const claims     = me?.claims ?? [];
  const activeStakes = stakes.filter((s) => s.isActive);

  const totalStaked  = activeStakes.reduce((sum, s) => sum + parseFloat(s.amount), 0);
  const dailyReward  = totalStaked * dailyRate;
  const available    = activeStakes.reduce((sum, s) => sum + pendingFor(s, dailyRate), 0);

  let daysRemaining = 0;
  if (activeStakes.length > 0) {
    const endTimes = activeStakes.map((s) => new Date(s.endDate).getTime());
    const minEnd   = Math.min(...endTimes);
    daysRemaining  = Math.max(0, Math.ceil((minEnd - Date.now()) / (24 * 60 * 60 * 1000)));
  }

  const history = buildHistory(stakes, claims);
  const tooltipStyle = {
    contentStyle: { background: "#1a1f2e", border: "1px solid rgba(0,255,255,0.2)", borderRadius: "8px" },
    labelStyle: { color: "#aaa" },
  };

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
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#ef4444" }}>
          {error}
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
          <div className="stat-card-value yellow">${fmt(available)}</div>
          <div className="stat-card-sub tick-label">● Updates every 24h</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Days Remaining</div>
          <div className="stat-card-value cyan">{daysRemaining}</div>
          <div className="stat-card-sub">of {stakeDays}-day term</div>
        </div>
      </div>

      <div className="dash-charts-row" style={{ marginTop: "24px" }}>
        <div className="glass-card" style={{ flex: 2, minWidth: 0 }}>
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

        <div className="glass-card dash-position-card" style={{ flex: 1, minWidth: "240px" }}>
          <h3 className="card-title" style={{ marginBottom: "20px" }}>Quick Stats</h3>
          <div className="position-row">
            <span className="position-label">Total Claimed</span>
            <span className="position-value green">
              ${fmt(claims.reduce((s, c) => s + parseFloat(c.amount), 0))}
            </span>
          </div>
          <div className="position-row">
            <span className="position-label">Bonus Balance</span>
            <span className="position-value yellow">${fmt(me?.bonusBalance ?? 0)}</span>
          </div>
          <div className="position-row">
            <span className="position-label">Referrals Earned</span>
            <span className="position-value cyan">
              ${fmt((me?.referralsEarned ?? []).reduce((s, r) => s + parseFloat(r.amount), 0))}
            </span>
          </div>
          <div className="position-row">
            <span className="position-label">Active Currencies</span>
            <span className="position-value">
              {Array.from(new Set(activeStakes.map((s) => s.currency.split("_")[0]))).join(", ") || "—"}
            </span>
          </div>

          <Link href="/stake" className="btn-primary" style={{ display: "block", textAlign: "center", padding: "12px", fontSize: "14px", marginTop: "16px" }}>
            Manage Stakes →
          </Link>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: "24px" }}>
        <div className="chart-header">
          <span>Recent Claims</span>
          <span style={{ fontSize: "12px", color: "#10b981" }}>● Live</span>
        </div>
        {claims.length === 0 ? (
          <div style={{ textAlign: "center", color: "#555", fontSize: "14px", padding: "24px" }}>
            No claims yet. Stake USDT or USDC to start earning daily rewards.
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
        ⚠️ Returns depend on bot performance and are not guaranteed. Funds are held in an audited smart contract.
      </div>
    </div>
  );
}
