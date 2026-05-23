"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, getStoredUser } from "../lib/auth-client";

type Stake = {
  id: number;
  currency: string;
  amount: string;
  txHash: string;
  startDate: string;
  endDate: string;
  lastClaim: string | null;
  isActive: boolean;
  status: string;
};

type Claim = {
  id: number;
  stakeId: number;
  amount: string;
  status: string;
  claimedAt: string;
};

type Referral = { id: number; amount: string; paidAt: string };

type Me = {
  id: number;
  walletAddress: string;
  walletType: string;
  referralCode: string;
  referredBy: string | null;
  bonusBalance: string;
  stakes: Stake[];
  claims: Claim[];
  referralsEarned: Referral[];
};

type Settings = {
  dailyRate: number;
  stakeDays: number;
  refPercent: number;
  minStake: number;
  maintenance: boolean;
};

const CURRENCIES = [
  { id: "USDT_BEP20", label: "USDT BEP20 (BSC)" },
  { id: "USDT_TRX",   label: "USDT TRC20 (TRON)" },
  { id: "USDC_SOL",   label: "USDC (Solana)" },
];

function fmt(n: number | string, digits = 2): string {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (!Number.isFinite(v)) return "0";
  return v.toLocaleString(undefined, { maximumFractionDigits: digits });
}

function daysProgress(stake: Stake, totalDays: number): { passed: number; pct: number } {
  const ms = Date.now() - new Date(stake.startDate).getTime();
  const passed = Math.max(0, Math.floor(ms / (24 * 60 * 60 * 1000)));
  return { passed, pct: Math.min(100, (passed / totalDays) * 100) };
}

function pendingClaim(stake: Stake, dailyRate: number): number {
  const last = stake.lastClaim ? new Date(stake.lastClaim).getTime() : new Date(stake.startDate).getTime();
  const days = Math.floor((Date.now() - last) / (24 * 60 * 60 * 1000));
  return Math.max(0, parseFloat(stake.amount) * dailyRate * days);
}

export default function StakePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [currency, setCurrency] = useState(CURRENCIES[0].id);
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(async () => {
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
    fetch("/api/admin/settings").then((r) => r.json()).then(setSettings).catch(() => {});
    if (getStoredUser()) refresh();
  }, [refresh]);

  async function createStake(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await apiFetch("/api/stake/create", {
        method: "POST",
        body: JSON.stringify({ currency, amount: Number(amount), txHash }),
      });
      setAmount("");
      setTxHash("");
      refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setBusy(false); }
  }

  async function claim(stakeId: number) {
    setBusy(true);
    setError(null);
    try {
      await apiFetch("/api/stake/claim", { method: "POST", body: JSON.stringify({ stakeId }) });
      refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setBusy(false); }
  }

  async function applyPromo() {
    setBusy(true);
    setError(null);
    try {
      await apiFetch("/api/promo/apply", { method: "POST", body: JSON.stringify({ code: promoCode }) });
      setPromoCode("");
      refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setBusy(false); }
  }

  async function copyRefLink() {
    if (!me) return;
    const url = `${window.location.origin}?ref=${me.referralCode}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!getStoredUser()) {
    return (
      <div className="page-wrap" style={{ textAlign: "center" }}>
        <div className="dash-connect-card">
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🔐</div>
          <h2 style={{ fontSize: "28px", marginBottom: "12px" }}>Connect Your Wallet</h2>
          <p style={{ color: "#888", marginBottom: "20px" }}>
            Connect MetaMask (BSC), TronLink, or Phantom to start staking.
          </p>
          <p style={{ color: "#555", fontSize: "13px" }}>
            Use the “Connect Wallet” button at the top right.
          </p>
        </div>
      </div>
    );
  }

  const dailyRate = settings?.dailyRate ?? 0.005;
  const stakeDays = settings?.stakeDays ?? 100;
  const totalActive = me?.stakes.filter((s) => s.isActive).reduce((sum, s) => sum + parseFloat(s.amount), 0) ?? 0;
  const totalEarned = me?.claims.reduce((sum, c) => sum + parseFloat(c.amount), 0) ?? 0;
  const refUrl = me ? `${typeof window !== "undefined" ? window.location.origin : ""}?ref=${me.referralCode}` : "";

  return (
    <div className="page-wrap">
      <div className="dash-header">
        <div>
          <h1 className="dash-title">My Staking</h1>
          {me && (
            <div className="dash-wallet-label">
              {me.walletAddress.slice(0, 8)}…{me.walletAddress.slice(-8)} · {me.walletType}
            </div>
          )}
        </div>
        <Link href="/dashboard" className="btn-secondary" style={{ padding: "10px 24px" }}>
          Open Dashboard →
        </Link>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#ef4444" }}>
          {error}
        </div>
      )}

      <div className="stat-cards-grid">
        <div className="stat-card">
          <div className="stat-card-label">Total Active</div>
          <div className="stat-card-value cyan">${fmt(totalActive)}</div>
          <div className="stat-card-sub">{me?.stakes.filter((s) => s.isActive).length ?? 0} active stakes</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Total Claimed</div>
          <div className="stat-card-value green">${fmt(totalEarned)}</div>
          <div className="stat-card-sub">{me?.claims.length ?? 0} claims</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Bonus Balance</div>
          <div className="stat-card-value yellow">${fmt(me?.bonusBalance ?? 0)}</div>
          <div className="stat-card-sub">Referrals + promos</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Daily Rate</div>
          <div className="stat-card-value cyan">{(dailyRate * 100).toFixed(2)}%</div>
          <div className="stat-card-sub">{stakeDays}-day term</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "24px" }}>
        <div className="glass-card">
          <h3 className="card-title">New Stake</h3>
          <form className="stake-form" onSubmit={createStake}>
            <label>
              <div className="vest-label">Currency</div>
              <select
                className="stake-input"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </label>
            <label>
              <div className="vest-label">Amount</div>
              <input
                className="stake-input"
                type="number"
                min={settings?.minStake ?? 10}
                step="0.01"
                placeholder={`Min ${settings?.minStake ?? 10}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </label>
            <label>
              <div className="vest-label">Transaction hash (after on-chain deposit)</div>
              <input
                className="stake-input"
                type="text"
                placeholder="0x… or T…"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                required
              />
            </label>

            <div className="stake-preview">
              <div className="preview-row">
                <span>Daily profit</span>
                <span className="cyan">${fmt(Number(amount || 0) * dailyRate)}</span>
              </div>
              <div className="preview-row">
                <span>Total profit ({stakeDays}d)</span>
                <span className="green">${fmt(Number(amount || 0) * dailyRate * stakeDays)}</span>
              </div>
              <div className="preview-row">
                <span>Returned at term</span>
                <span className="cyan">${fmt(Number(amount || 0) * (1 + dailyRate * stakeDays))}</span>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: "16px", width: "100%" }} disabled={busy}>
              {busy ? "Processing…" : "Stake Now"}
            </button>
            <p style={{ color: "#666", fontSize: "12px", marginTop: "10px" }}>
              Send the amount to the staking contract first (BSC: <code>NEXT_PUBLIC_BSC_STAKING_CONTRACT</code>),
              then paste the tx hash here. Backend verifies the deposit.
            </p>
          </form>
        </div>

        <div className="glass-card">
          <h3 className="card-title">Referrals</h3>
          {me && (
            <>
              <div className="vest-label">Your referral link</div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <input className="stake-input" readOnly value={refUrl} style={{ marginBottom: 0 }} />
                <button className="btn-secondary" onClick={copyRefLink}>{copied ? "Copied!" : "Copy"}</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                <div className="vest-stat">
                  <div className="vest-label">Referrals</div>
                  <div className="vest-val">{me.referralsEarned.length}</div>
                </div>
                <div className="vest-stat">
                  <div className="vest-label">Earned</div>
                  <div className="vest-val green">
                    ${fmt(me.referralsEarned.reduce((s, r) => s + parseFloat(r.amount), 0))}
                  </div>
                </div>
              </div>

              <h3 className="card-title" style={{ fontSize: "16px", marginTop: "24px" }}>Promo Code</h3>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  className="stake-input"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{ marginBottom: 0 }}
                />
                <button className="btn-primary" onClick={applyPromo} disabled={busy || !promoCode}>
                  Apply
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: "24px" }}>
        <h3 className="card-title">My Stakes</h3>
        {!me || me.stakes.length === 0 ? (
          <p style={{ color: "#666", padding: "20px 0" }}>No stakes yet. Create your first one above.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {me.stakes.map((stake) => {
              const p = daysProgress(stake, stakeDays);
              const pending = pendingClaim(stake, dailyRate);
              const canClaim = pending > 0 && stake.isActive;
              return (
                <div key={stake.id} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 600, color: "#fff" }}>
                        ${fmt(stake.amount)} · {stake.currency}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        Started {new Date(stake.startDate).toLocaleDateString()} · ends {new Date(stake.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    {stake.isActive
                      ? <span className="badge-green">ACTIVE</span>
                      : <span className="badge-red">CLOSED</span>}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#888", marginBottom: "4px" }}>
                    <span>{p.passed} / {stakeDays} days</span>
                    <span>{p.pct.toFixed(1)}%</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill" style={{ width: `${p.pct}%` }} /></div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "#888" }}>Available to claim</div>
                      <div style={{ fontSize: "18px", fontWeight: 600, color: "#10b981" }}>${fmt(pending)}</div>
                    </div>
                    <button
                      className="btn-primary"
                      onClick={() => claim(stake.id)}
                      disabled={!canClaim || busy}
                    >
                      {busy ? "…" : canClaim ? "Claim" : "Nothing to claim"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
