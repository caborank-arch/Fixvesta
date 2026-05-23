"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import WalletConnectButton from "./WalletConnectButton";
import { getStoredUser, clearSession, type SignedSession } from "../lib/auth-client";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "FixVesta";

const navLinks = [
  { href: "/stake",     label: "Stake" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/analytics", label: "Analytics" },
  { href: "/market",    label: "Market" },
  { href: "/docs",      label: "Docs" },
];

export default function Navbar() {
  const [user, setUser] = useState<SignedSession["user"] | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setMenuOpen(false); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Poll storage so navbar reflects sign-in done in WalletConnectButton.
  useEffect(() => {
    const t = setInterval(() => {
      const u = getStoredUser();
      setUser((prev) => (prev?.walletAddress !== u?.walletAddress ? u : prev));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  function disconnect() {
    clearSession();
    setUser(null);
  }

  return (
    <>
      <nav className="top-nav">
        <Link href="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          <span>⬡</span> {APP_NAME}
        </Link>

        <ul className="nav-menu">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <WalletConnectButton />

          <button
            className={`hamburger-btn ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />
      )}

      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        {user && (
          <div style={{ padding: "12px 20px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "8px" }}>
            <div style={{ fontSize: "13px", color: "#888" }}>Connected</div>
            <div style={{ color: "#00ffff", fontSize: "14px", marginBottom: "12px" }}>
              {user.walletAddress.slice(0, 8)}…{user.walletAddress.slice(-8)}
            </div>
          </div>
        )}
        <ul className="mobile-nav-list">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {user ? (
            <button className="disconnect-btn" style={{ width: "100%", padding: "10px" }} onClick={() => { disconnect(); setMenuOpen(false); }}>
              Disconnect Wallet
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}
