"use client";

// All on-chain identifiers are read from env (NEXT_PUBLIC_*) so the CBT/CBB
// token mint and treasury/presale/staking wallets stay out of committed source.
// Real values live in .env.local (git-ignored). See .env.local.example.
export const CBB_MINT        = process.env.NEXT_PUBLIC_CBB_MINT        || "";
export const TREASURY_WALLET = process.env.NEXT_PUBLIC_TREASURY_WALLET || "";
export const PRESALE_WALLET  = process.env.NEXT_PUBLIC_PRESALE_WALLET  || "";
export const STAKING_WALLET  = process.env.NEXT_PUBLIC_STAKING_WALLET  || "";
// Client-side RPC goes through our proxy to avoid browser CORS/403 issues
export const RPC_ENDPOINT    = process.env.NEXT_PUBLIC_SOLANA_RPC      || "https://api.mainnet-beta.solana.com";

// Returns proxy URL in browser, fallback in SSR
export function getRpcEndpoint(): string {
  if (typeof window !== "undefined") {
    return window.location.origin + "/api/rpc";
  }
  return RPC_ENDPOINT;
}
export const CBB_DECIMALS = 9;

// APR configuration
export const STAKING_APR = 0.25; // 25%
export const DAILY_RATE = STAKING_APR / 365;
export const SECONDS_RATE = DAILY_RATE / 86400;

// Vesting configuration
export const PRESALE_IMMEDIATE_PCT = 0.20; // 20% immediately
export const PRESALE_DAILY_UNLOCK_PCT = 0.02; // 2% per day

// Fetch real CBB token balance for a wallet
export async function getCBBBalance(walletAddress: string): Promise<number> {
  try {
    const { Connection, PublicKey } = await import("@solana/web3.js");
    const connection = new Connection(getRpcEndpoint(), "confirmed");
    const wallet = new PublicKey(walletAddress);
    const mint = new PublicKey(CBB_MINT);
    const tokenAccounts = await connection.getTokenAccountsByOwner(wallet, { mint });
    if (tokenAccounts.value.length === 0) return 0;
    const info = await connection.getTokenAccountBalance(tokenAccounts.value[0].pubkey);
    return parseFloat(info.value.uiAmountString || "0");
  } catch {
    return 0;
  }
}

// Fetch real SOL balance
export async function getSOLBalance(walletAddress: string): Promise<number> {
  try {
    const { Connection, PublicKey, LAMPORTS_PER_SOL } = await import("@solana/web3.js");
    const connection = new Connection(getRpcEndpoint(), "confirmed");
    const lamports = await connection.getBalance(new PublicKey(walletAddress));
    return lamports / LAMPORTS_PER_SOL;
  } catch {
    return 0;
  }
}

export interface TxRecord {
  signature: string;
  blockTime: number | null | undefined;
  err: unknown;
  memo: string | null | undefined;
}

// Fetch last N transaction signatures for a wallet
export async function getRecentTransactions(walletAddress: string, limit = 5): Promise<TxRecord[]> {
  try {
    const { Connection, PublicKey } = await import("@solana/web3.js");
    const connection = new Connection(getRpcEndpoint(), "confirmed");
    const pubkey = new PublicKey(walletAddress);
    const sigs = await connection.getSignaturesForAddress(pubkey, { limit });
    return sigs.map((s) => ({
      signature: s.signature,
      blockTime: s.blockTime,
      err: s.err,
      memo: s.memo,
    }));
  } catch {
    return [];
  }
}

// Format relative time
export function timeAgo(blockTime: number | null | undefined): string {
  if (!blockTime) return "—";
  const secs = Math.floor(Date.now() / 1000) - blockTime;
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

// Shorten a Solana address or signature
export function shorten(str: string, chars = 4): string {
  if (!str) return "—";
  return `${str.slice(0, chars)}...${str.slice(-chars)}`;
}

// Staking localStorage helpers
export interface StakeData {
  amount: number;    // CBB staked
  stakedAt: number;  // Unix timestamp
  rewardsClaimed: number; // total CBB claimed ever
}

export function getStakeData(): StakeData | null {
  try {
    const raw = localStorage.getItem("cbb_stake");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setStakeData(data: StakeData) {
  localStorage.setItem("cbb_stake", JSON.stringify(data));
}

export function clearStakeData() {
  localStorage.removeItem("cbb_stake");
}

export function calcPendingRewards(stake: StakeData): number {
  const secondsStaked = Date.now() / 1000 - stake.stakedAt;
  return stake.amount * SECONDS_RATE * secondsStaked;
}

// Vesting localStorage helpers
export interface VestingData {
  totalAmount: number;  // CBB purchased in this purchase
  purchasedAt: number;  // Unix timestamp of this purchase
  txSig: string;
}

// ── Multi-purchase array (replaces single entry) ──────────────────────────

export function getVestingEntries(): VestingData[] {
  try {
    const arr = localStorage.getItem("cbb_vesting_entries");
    if (arr) return JSON.parse(arr);
    // Backward compat: migrate old single entry
    const old = localStorage.getItem("cbb_vesting");
    if (old) {
      const parsed: VestingData = JSON.parse(old);
      localStorage.setItem("cbb_vesting_entries", JSON.stringify([parsed]));
      return [parsed];
    }
    return [];
  } catch { return []; }
}

// Add a new purchase — deduplicates by txSig
export function addVestingEntry(entry: VestingData) {
  try {
    const entries = getVestingEntries();
    if (entries.find((e) => e.txSig === entry.txSig)) return; // already saved
    entries.push(entry);
    localStorage.setItem("cbb_vesting_entries", JSON.stringify(entries));
  } catch { /* ignore */ }
}

// Legacy setter — now appends instead of overwriting
export function setVestingData(data: VestingData) {
  addVestingEntry(data);
}

// Legacy getter — returns first entry for backward compat (prefer calcTotalVesting)
export function getVestingData(): VestingData | null {
  const entries = getVestingEntries();
  return entries.length > 0 ? entries[0] : null;
}

export function calcVesting(v: VestingData): {
  unlocked: number;
  locked: number;
  pct: number;
  daysLeft: number;
  dailyUnlock: number;
} {
  const daysPassed = (Date.now() / 1000 - v.purchasedAt) / 86400;
  const rawPct = Math.min(PRESALE_IMMEDIATE_PCT + PRESALE_DAILY_UNLOCK_PCT * daysPassed, 1);
  const unlocked = v.totalAmount * rawPct;
  const locked = v.totalAmount - unlocked;
  const daysLeft = Math.max(0, Math.ceil((1 - rawPct) / PRESALE_DAILY_UNLOCK_PCT));
  const dailyUnlock = v.totalAmount * PRESALE_DAILY_UNLOCK_PCT;
  return { unlocked, locked, pct: rawPct * 100, daysLeft, dailyUnlock };
}

// Aggregate vesting across ALL purchases (correct per-entry calculation)
export function calcTotalVesting(entries: VestingData[]): {
  totalPurchased: number;
  unlocked: number;
  locked: number;
  pct: number;
  dailyUnlock: number;
  daysLeft: number;
} | null {
  if (entries.length === 0) return null;
  let totalPurchased = 0, unlocked = 0, dailyUnlock = 0, daysLeft = 0;
  for (const entry of entries) {
    const v = calcVesting(entry);
    totalPurchased += entry.totalAmount;
    unlocked       += v.unlocked;
    dailyUnlock    += v.dailyUnlock;
    daysLeft        = Math.max(daysLeft, v.daysLeft);
  }
  const locked = totalPurchased - unlocked;
  const pct    = totalPurchased > 0 ? (unlocked / totalPurchased) * 100 : 0;
  return { totalPurchased, unlocked, locked, pct, dailyUnlock, daysLeft };
}
