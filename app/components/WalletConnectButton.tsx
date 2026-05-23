"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import {
  clearSession,
  getStoredUser,
  signInWithEVM,
  signInWithPhantom,
  signInWithTronLink,
  type SignedSession,
} from "../lib/auth-client";

type Option = { id: "metamask" | "phantom" | "tronlink"; label: string; icon: string };

const OPTIONS: Option[] = [
  { id: "metamask", label: "MetaMask (BSC)",  icon: "🦊" },
  { id: "tronlink", label: "TronLink (TRC20)", icon: "🔺" },
  { id: "phantom",  label: "Phantom (Solana)", icon: "👻" },
];

export default function WalletConnectButton() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SignedSession["user"] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { address, isConnected } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  useEffect(() => { setUser(getStoredUser()); }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const referralCode = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("ref") ?? undefined
    : undefined;

  async function chooseWallet(opt: Option) {
    setBusy(true);
    setError(null);
    setOpen(false);
    try {
      if (opt.id === "metamask") {
        let addr = address;
        if (!isConnected) {
          const mm = connectors.find((c) => c.id === "metaMask" || c.id === "injected") ?? connectors[0];
          const res = await connectAsync({ connector: mm });
          addr = res.accounts[0];
        }
        if (!addr) throw new Error("No address from MetaMask");
        const s = await signInWithEVM(addr, signMessageAsync, referralCode);
        setUser(s.user);
      } else if (opt.id === "phantom") {
        const s = await signInWithPhantom(referralCode);
        setUser(s.user);
      } else if (opt.id === "tronlink") {
        const s = await signInWithTronLink(referralCode);
        setUser(s.user);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
    clearSession();
    setUser(null);
    try { await disconnectAsync(); } catch { /* ignore */ }
  }

  if (user) {
    return (
      <div className="wallet-info" style={{ position: "relative" }}>
        <Link href="/dashboard" className="wallet-text">
          {user.walletAddress.slice(0, 5)}…{user.walletAddress.slice(-5)}
        </Link>
        <button className="disconnect-btn" onClick={disconnect}>✕</button>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <button
        className="wallet-btn"
        onClick={() => setOpen((v) => !v)}
        disabled={busy}
      >
        {busy ? "Connecting…" : "Connect Wallet"}
      </button>
      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 8px)",
          background: "#161b22", border: "1px solid rgba(0,255,255,0.15)",
          borderRadius: "12px", padding: "8px", minWidth: "220px", zIndex: 100,
        }}>
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              onClick={() => chooseWallet(o)}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                width: "100%", padding: "10px 12px", background: "transparent",
                border: "none", color: "#ddd", cursor: "pointer", textAlign: "left",
                borderRadius: "8px", fontSize: "14px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,255,255,0.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: "18px" }}>{o.icon}</span> {o.label}
            </button>
          ))}
          {error && (
            <div style={{ padding: "8px 12px", fontSize: "12px", color: "#ef4444" }}>{error}</div>
          )}
        </div>
      )}
    </div>
  );
}
