"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Settings = { refPercent: number };

function fmt(n: number, digits = 0): string {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

const REFERRAL_PRESETS = [1, 5, 10, 25, 50];
const AMOUNT_PRESETS   = [100, 500, 1000, 5000, 10000];

export default function Partnership() {
  const [refs, setRefs]     = useState(10);
  const [amount, setAmount] = useState(1000);
  const [pct, setPct]       = useState(0.03);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((s: Settings) => { if (typeof s?.refPercent === "number") setPct(s.refPercent); })
      .catch(() => {});
  }, []);

  const oneRef   = amount * pct;
  const total    = refs * oneRef;
  const monthly  = total * 4;
  const yearly   = total * 52;

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0f1525, #1a1f35)",
        padding: "80px 20px 60px",
        textAlign: "center",
        borderBottom: "1px solid rgba(0,255,255,0.08)",
      }}>
        <div style={{ display: "inline-block", padding: "4px 14px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "20px", fontSize: "13px", color: "#10b981", marginBottom: "20px" }}>
          ● {(pct * 100).toFixed(0)}% Lifetime Reward
        </div>
        <h1 style={{ fontSize: "44px", marginBottom: "16px" }}>Partnership Program</h1>
        <p style={{ color: "#888", fontSize: "18px", maxWidth: "640px", margin: "0 auto", lineHeight: 1.6 }}>
          Earn {(pct * 100).toFixed(0)}% of every deposit your referrals make.
          Paid instantly to your wallet — no minimums, no claim delays.
        </p>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 20px 80px" }}>
        {/* How it works */}
        <div className="cards-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginBottom: "48px" }}>
          {[
            { n: "01", title: "Share Your Link", body: "Connect a wallet, open Dashboard and copy your personal referral link." },
            { n: "02", title: "Friend Stakes",   body: `When they deposit USDT or USDC, the system records you as the referrer.` },
            { n: "03", title: "Get Paid",        body: `${(pct * 100).toFixed(0)}% of their deposit is added to your bonus balance instantly.` },
            { n: "04", title: "Auto Payout",     body: "Bonus balance is withdrawable directly to your wallet at any time." },
          ].map((s) => (
            <div key={s.n} className="glass-card">
              <div style={{ fontSize: "13px", color: "#00ffff", fontFamily: "monospace", marginBottom: "8px" }}>{s.n}</div>
              <div className="card-title">{s.title}</div>
              <p className="card-text">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Calculator */}
        <div className="glass-card" style={{ padding: "32px", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "8px", textAlign: "center" }}>Referral Calculator</h2>
          <p style={{ textAlign: "center", color: "#888", marginBottom: "28px", fontSize: "14px" }}>
            See your potential earnings — paid instantly per deposit
          </p>

          {/* Referrals slider */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span className="vest-label">Number of Referrals</span>
            <span style={{ fontSize: "20px", fontWeight: 700, color: "#00ffff" }}>{refs}</span>
          </div>
          <input
            type="range"
            min={1} max={100} step={1}
            value={refs}
            onChange={(e) => setRefs(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#00ffff", marginBottom: "12px" }}
          />
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
            {REFERRAL_PRESETS.map((v) => (
              <button key={v} className="pct-btn" style={{ flex: "0 0 auto", padding: "6px 14px" }} onClick={() => setRefs(v)}>
                {v} refs
              </button>
            ))}
          </div>

          {/* Amount slider */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span className="vest-label">Avg Deposit per Referral</span>
            <span style={{ fontSize: "20px", fontWeight: 700, color: "#10b981" }}>${fmt(amount)}</span>
          </div>
          <input
            type="range"
            min={10} max={50000} step={10}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#10b981", marginBottom: "12px" }}
          />
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "32px" }}>
            {AMOUNT_PRESETS.map((v) => (
              <button key={v} className="pct-btn" style={{ flex: "0 0 auto", padding: "6px 14px" }} onClick={() => setAmount(v)}>
                ${v.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Results */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
            <div className="vest-stat">
              <div className="vest-label">Per Referral</div>
              <div className="vest-val cyan">${fmt(oneRef, 2)}</div>
            </div>
            <div className="vest-stat">
              <div className="vest-label">Total earnings</div>
              <div className="vest-val green">${fmt(total, 2)}</div>
            </div>
            <div className="vest-stat">
              <div className="vest-label">If repeated weekly</div>
              <div className="vest-val yellow">${fmt(monthly, 0)} / mo</div>
            </div>
            <div className="vest-stat">
              <div className="vest-label">Annual potential</div>
              <div className="vest-val cyan">${fmt(yearly, 0)}</div>
            </div>
          </div>

          <div style={{
            marginTop: "24px",
            padding: "14px 18px",
            background: "rgba(0,255,255,0.06)",
            border: "1px solid rgba(0,255,255,0.2)",
            borderRadius: "10px",
            textAlign: "center",
            fontSize: "13px",
            color: "#00ffff",
          }}>
            {refs} referrals × ${fmt(amount)} deposit × {(pct * 100).toFixed(0)}% = <strong>${fmt(total, 2)}</strong> instant earnings
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link href="/dashboard" className="btn-primary" style={{ padding: "14px 40px", fontSize: "16px" }}>
            Get My Referral Link →
          </Link>
          <p style={{ color: "#666", fontSize: "13px", marginTop: "16px" }}>
            Connect your wallet from the Dashboard to copy your personal link.
          </p>
        </div>
      </div>
    </div>
  );
}
