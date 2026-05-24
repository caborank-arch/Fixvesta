"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { parseUnits, type Address } from "viem";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { apiFetch, getStoredUser } from "../lib/auth-client";
import { CURRENCIES, type CurrencyId, ERC20_ABI, STAKING_ABI, getCurrency } from "../lib/contracts";

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

type Me = {
  id: number;
  walletAddress: string;
  walletType: string;
  referralCode: string;
  bonusBalance: string;
  stakes: Stake[];
  claims: { id: number; stakeId: number; amount: string; status: string; claimedAt: string }[];
  referralsEarned: { id: number; amount: string; paidAt: string }[];
};

type Settings = { dailyRate: number; stakeDays: number; refPercent: number; minStake: number };

const ZERO_ADDR = "0x0000000000000000000000000000000000000000" as const;

function fmt(n: number | string, digits = 2): string {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (!Number.isFinite(v)) return "0";
  return v.toLocaleString(undefined, { maximumFractionDigits: digits });
}

export default function StakePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [currency, setCurrency] = useState<CurrencyId>("USDT_BEP20");
  const [amountStr, setAmountStr] = useState("100");
  const [manualTx, setManualTx] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo]   = useState<string | null>(null);
  const [busy, setBusy]   = useState(false);

  const { address: evmAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [pendingTxHash, setPendingTxHash] = useState<`0x${string}` | undefined>();
  const { isLoading: txMining, isSuccess: txMined } = useWaitForTransactionReceipt({ hash: pendingTxHash });

  const cfg = getCurrency(currency);
  const amount = Number(amountStr) || 0;

  // Referral code from URL or stored
  const refCode = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("ref") || "";
  }, []);

  // Approval check for BSC flow
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: ERC20_ABI,
    address: cfg.onChain ? (cfg.token as Address | undefined) : undefined,
    functionName: "allowance",
    args: evmAddress && cfg.staking ? [evmAddress, cfg.staking as Address] : undefined,
    query: { enabled: !!(cfg.onChain && evmAddress && cfg.token && cfg.staking) },
  });

  const refresh = useCallback(async () => {
    try { setMe(await apiFetch<Me>("/api/user/me")); setError(null); }
    catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg !== "Unauthorized") setError(msg);
    }
  }, []);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then(setSettings).catch(() => {});
    if (getStoredUser()) refresh();
  }, [refresh]);

  // After on-chain tx confirms, register with backend
  useEffect(() => {
    if (!txMined || !pendingTxHash) return;
    (async () => {
      try {
        await apiFetch("/api/stake/create", {
          method: "POST",
          body: JSON.stringify({ currency, amount, txHash: pendingTxHash }),
        });
        setInfo("Stake confirmed on-chain and recorded.");
        setPendingTxHash(undefined);
        setAmountStr("100");
        refresh();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally { setBusy(false); }
    })();
  }, [txMined, pendingTxHash, currency, amount, refresh]);

  // --- on-chain flow (BSC only) ----------------------------------------------
  async function approve() {
    if (!cfg.token || !cfg.staking) { setError("BSC contracts not configured yet"); return; }
    if (amount < (settings?.minStake ?? 10)) { setError(`Min stake is ${settings?.minStake ?? 10}`); return; }
    setBusy(true); setError(null); setInfo(null);
    try {
      const raw = parseUnits(String(amount), cfg.decimals);
      const hash = await writeContractAsync({
        abi: ERC20_ABI,
        address: cfg.token as Address,
        functionName: "approve",
        args: [cfg.staking as Address, raw],
      });
      setInfo(`Approve tx sent: ${hash.slice(0, 10)}…`);
      // After approve mines, allowance updates
      setTimeout(() => refetchAllowance(), 6000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setBusy(false); }
  }

  async function stakeOnChain() {
    if (!cfg.token || !cfg.staking) { setError("BSC contracts not configured yet"); return; }
    if (amount < (settings?.minStake ?? 10)) { setError(`Min stake is ${settings?.minStake ?? 10}`); return; }
    setBusy(true); setError(null); setInfo(null);
    try {
      const raw = parseUnits(String(amount), cfg.decimals);
      const referrer = refCode && refCode.startsWith("0x") ? (refCode as Address) : (ZERO_ADDR as Address);
      const hash = await writeContractAsync({
        abi: STAKING_ABI,
        address: cfg.staking as Address,
        functionName: "stake",
        args: [raw, referrer],
      });
      setPendingTxHash(hash);
      setInfo(`Stake tx sent: ${hash.slice(0, 10)}… awaiting confirmation`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setBusy(false);
    }
  }

  // --- manual flow (TRON / Solana) -------------------------------------------
  async function submitManualStake() {
    if (amount < (settings?.minStake ?? 10)) { setError(`Min stake is ${settings?.minStake ?? 10}`); return; }
    if (!manualTx) { setError("Paste the transaction hash"); return; }
    setBusy(true); setError(null);
    try {
      await apiFetch("/api/stake/create", {
        method: "POST",
        body: JSON.stringify({ currency, amount, txHash: manualTx }),
      });
      setInfo("Stake recorded.");
      setManualTx(""); setAmountStr("100");
      refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setBusy(false); }
  }

  if (!getStoredUser()) {
    return (
      <div className="page-wrap" style={{ textAlign: "center" }}>
        <div className="dash-connect-card">
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🔐</div>
          <h2 style={{ fontSize: "28px", marginBottom: "12px" }}>Connect Your Wallet</h2>
          <p style={{ color: "#888", marginBottom: "20px" }}>
            Use the “Connect Wallet” button at the top right.<br />
            MetaMask for BSC · TronLink for TRON · Phantom for Solana.
          </p>
        </div>
      </div>
    );
  }

  const dailyRate    = settings?.dailyRate ?? 0.005;
  const stakeDays    = settings?.stakeDays ?? 100;
  const minStake     = settings?.minStake  ?? 10;
  const dailyProfit  = amount * dailyRate;
  const totalProfit  = dailyProfit * stakeDays;
  const totalReturn  = amount + totalProfit;

  // BSC step state
  const needsApprove = useMemo(() => {
    if (!cfg.onChain || !cfg.token || !cfg.staking) return false;
    try {
      const need = parseUnits(String(amount || 0), cfg.decimals);
      return (allowance ?? 0n) < need;
    } catch { return true; }
  }, [allowance, amount, cfg.decimals, cfg.onChain, cfg.token, cfg.staking]);

  return (
    <div className="page-wrap">
      <h1 className="dash-title">Stake</h1>

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

      <div className="glass-card" style={{ maxWidth: "640px", margin: "0 auto" }}>
        <h3 className="card-title">New Stake</h3>

        <div className="vest-label" style={{ marginTop: "12px" }}>Currency</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "16px" }}>
          {(Object.keys(CURRENCIES) as CurrencyId[]).map((id) => (
            <button
              key={id}
              className={currency === id ? "btn-primary" : "btn-secondary"}
              style={{ padding: "10px 8px", fontSize: "13px" }}
              onClick={() => { setCurrency(id); setError(null); setInfo(null); }}
            >
              {CURRENCIES[id].label}
            </button>
          ))}
        </div>

        <div className="vest-label">Amount (USD)</div>
        <input
          className="stake-input"
          type="number"
          min={minStake}
          step="0.01"
          value={amountStr}
          onChange={(e) => setAmountStr(e.target.value)}
        />
        <div className="pct-buttons">
          {[50, 100, 500, 1000, 5000].map((v) => (
            <button key={v} className="pct-btn" onClick={() => setAmountStr(String(v))}>${v}</button>
          ))}
        </div>

        <div className="stake-preview">
          <div className="preview-row"><span>Daily reward</span><span className="cyan">${fmt(dailyProfit)}</span></div>
          <div className="preview-row"><span>Profit ({stakeDays}d)</span><span className="green">${fmt(totalProfit)}</span></div>
          <div className="preview-row"><span>Total returned</span><span className="cyan">${fmt(totalReturn)}</span></div>
          {refCode && <div className="preview-row"><span>Referrer</span><span>{refCode.slice(0, 8)}…{refCode.slice(-6)}</span></div>}
        </div>

        {/* On-chain BSC flow */}
        {cfg.onChain && cfg.token && cfg.staking && (
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button
              className={needsApprove ? "btn-primary" : "btn-secondary"}
              style={{ flex: 1 }}
              onClick={approve}
              disabled={busy || !needsApprove || amount < minStake}
            >
              {needsApprove ? `Approve ${cfg.label}` : "✓ Approved"}
            </button>
            <button
              className="btn-primary"
              style={{ flex: 1 }}
              onClick={stakeOnChain}
              disabled={busy || needsApprove || amount < minStake || txMining}
            >
              {txMining ? "Confirming…" : "Stake Now"}
            </button>
          </div>
        )}

        {/* On-chain BSC, contracts not yet deployed */}
        {cfg.onChain && (!cfg.token || !cfg.staking) && (
          <div style={{ marginTop: "16px", padding: "12px 16px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "10px", color: "#f59e0b", fontSize: "13px" }}>
            BSC staking contract not deployed yet. Set <code>NEXT_PUBLIC_BSC_STAKING_CONTRACT</code> in Vercel after deploy to enable in-app staking.
          </div>
        )}

        {/* Manual flow for TRON / Solana */}
        {!cfg.onChain && (
          <>
            <div style={{ marginTop: "16px", padding: "12px 16px", background: "rgba(0,255,255,0.04)", border: "1px solid rgba(0,255,255,0.15)", borderRadius: "10px", color: "#aaa", fontSize: "13px" }}>
              Send <strong>${fmt(amount)}</strong> {cfg.label} from your wallet to{" "}
              <code style={{ color: "#00ffff" }}>{cfg.staking || "(contract address pending)"}</code>{" "}
              on {cfg.network}, then paste the transaction hash below.
            </div>
            <div className="vest-label" style={{ marginTop: "12px" }}>Transaction hash</div>
            <input
              className="stake-input"
              type="text"
              placeholder="Paste tx hash"
              value={manualTx}
              onChange={(e) => setManualTx(e.target.value)}
            />
            <button className="btn-primary" style={{ width: "100%", marginTop: "8px" }} onClick={submitManualStake} disabled={busy}>
              {busy ? "Recording…" : "Record Stake"}
            </button>
          </>
        )}
      </div>

      {/* Existing stakes summary */}
      <div className="glass-card" style={{ marginTop: "24px" }}>
        <h3 className="card-title">My Stakes</h3>
        {!me || me.stakes.length === 0 ? (
          <p style={{ color: "#666", padding: "20px 0" }}>
            No stakes yet. Manage stakes and claim rewards on the{" "}
            <Link href="/dashboard" style={{ color: "#00ffff" }}>Dashboard</Link>.
          </p>
        ) : (
          <div className="tx-table" style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr" }}>
            <div className="tx-header">
              <span>Currency</span><span>Amount</span><span>Start</span><span>Ends</span><span>Status</span>
            </div>
            {me.stakes.map((s) => (
              <div key={s.id} className="tx-row">
                <span>{s.currency}</span>
                <span className="position-value cyan">${fmt(s.amount)}</span>
                <span style={{ color: "#888", fontSize: "13px" }}>{new Date(s.startDate).toLocaleDateString()}</span>
                <span style={{ color: "#888", fontSize: "13px" }}>{new Date(s.endDate).toLocaleDateString()}</span>
                <span>{s.isActive ? <span className="badge-green">ACTIVE</span> : <span className="badge-red">CLOSED</span>}</span>
              </div>
            ))}
          </div>
        )}
        <Link href="/dashboard" className="btn-secondary" style={{ display: "inline-block", marginTop: "16px", padding: "10px 24px" }}>
          Go to Dashboard →
        </Link>
      </div>
    </div>
  );
}
