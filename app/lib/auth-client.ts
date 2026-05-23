"use client";

// Lightweight client-side auth helpers. Stores JWT in localStorage and
// exposes the multi-step sign-in flow that talks to /api/auth/*.

export type WalletType = "metamask_bsc" | "tronlink" | "phantom";

export interface SignedSession {
  token: string;
  user: {
    id: number;
    walletAddress: string;
    walletType: string;
    referralCode: string;
  };
}

const STORAGE_TOKEN = "auth_token";
const STORAGE_USER  = "auth_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_TOKEN);
}

export function getStoredUser(): SignedSession["user"] | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_USER);
  return raw ? JSON.parse(raw) as SignedSession["user"] : null;
}

export function clearSession() {
  localStorage.removeItem(STORAGE_TOKEN);
  localStorage.removeItem(STORAGE_USER);
}

export function saveSession(s: SignedSession) {
  localStorage.setItem(STORAGE_TOKEN, s.token);
  localStorage.setItem(STORAGE_USER, JSON.stringify(s.user));
}

async function requestNonce(walletAddress: string): Promise<{ nonce: string; message: string }> {
  const res = await fetch("/api/auth/nonce", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  });
  if (!res.ok) throw new Error((await res.json()).error ?? "Nonce request failed");
  return res.json();
}

async function postVerify(body: Record<string, unknown>): Promise<SignedSession> {
  const res = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json()).error ?? "Verification failed");
  return res.json();
}

// EVM (MetaMask on BSC). Expects an already-connected wagmi account.
export async function signInWithEVM(
  address: string,
  signMessageAsync: (args: { message: string }) => Promise<string>,
  referralCode?: string
): Promise<SignedSession> {
  const { nonce, message } = await requestNonce(address);
  const signature = await signMessageAsync({ message });
  const session = await postVerify({
    walletAddress: address,
    walletType: "metamask_bsc",
    signature,
    nonce,
    referralCode,
  });
  saveSession(session);
  return session;
}

// Phantom (Solana). Returns ed25519 signature — backend currently logs but
// trusts on first connect; tightening verification belongs in /api/auth/verify.
export async function signInWithPhantom(referralCode?: string): Promise<SignedSession> {
  const sol = (window as unknown as { solana?: { isPhantom?: boolean; connect: () => Promise<{ publicKey: { toString(): string } }>; signMessage: (m: Uint8Array, e: string) => Promise<{ signature: Uint8Array }> } }).solana;
  if (!sol?.isPhantom) {
    window.open("https://phantom.app/", "_blank");
    throw new Error("Phantom not installed");
  }
  const resp = await sol.connect();
  const address = resp.publicKey.toString();
  const { nonce, message } = await requestNonce(address);
  const encoded = new TextEncoder().encode(message);
  const signed = await sol.signMessage(encoded, "utf8");
  const signature = Array.from(signed.signature).map((b) => b.toString(16).padStart(2, "0")).join("");
  const session = await postVerify({
    walletAddress: address,
    walletType: "phantom",
    signature,
    nonce,
    referralCode,
  });
  saveSession(session);
  return session;
}

// TronLink — relies on injected window.tronWeb.
export async function signInWithTronLink(referralCode?: string): Promise<SignedSession> {
  const w = window as unknown as { tronWeb?: { defaultAddress?: { base58?: string }; trx: { sign: (m: string) => Promise<string> } } };
  if (!w.tronWeb?.defaultAddress?.base58) {
    window.open("https://www.tronlink.org/", "_blank");
    throw new Error("TronLink not connected");
  }
  const address = w.tronWeb.defaultAddress.base58;
  const { nonce, message } = await requestNonce(address);
  const signature = await w.tronWeb.trx.sign(message);
  const session = await postVerify({
    walletAddress: address,
    walletType: "tronlink",
    signature,
    nonce,
    referralCode,
  });
  saveSession(session);
  return session;
}

// Authorized fetch — auto-attaches the JWT.
export async function apiFetch<T = unknown>(url: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}
