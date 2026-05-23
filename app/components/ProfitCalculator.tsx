"use client";
import { useEffect, useState } from "react";

type Settings = {
  dailyRate: number;
  stakeDays: number;
  refPercent: number;
  minStake: number;
};

const PRESETS = [100, 500, 1000, 5000, 10000];

function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

export default function ProfitCalculator() {
  const [amount, setAmount] = useState(1000);
  const [s, setS] = useState<Settings>({ dailyRate: 0.005, stakeDays: 100, refPercent: 0.03, minStake: 10 });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((cfg) => setS({
        dailyRate: cfg.dailyRate ?? 0.005,
        stakeDays: cfg.stakeDays ?? 100,
        refPercent: cfg.refPercent ?? 0.03,
        minStake: cfg.minStake ?? 10,
      }))
      .catch(() => {});
  }, []);

  const daily   = amount * s.dailyRate;
  const monthly = daily * 30;
  const total   = daily * s.stakeDays;
  const final   = amount + total;
  const refBonus = amount * s.refPercent;

  return (
    <div className="glass-card" style={{ maxWidth: "880px", margin: "0 auto", padding: "32px" }}>
      <h3 className="card-title" style={{ fontSize: "24px", textAlign: "center", marginBottom: "8px" }}>
        Profit Calculator
      </h3>
      <p style={{ textAlign: "center", color: "#888", marginBottom: "28px", fontSize: "14px" }}>
        Daily rate {(s.dailyRate * 100).toFixed(2)}% · Term {s.stakeDays} days · Referral {(s.refPercent * 100).toFixed(0)}%
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span className="vest-label">Stake Amount</span>
        <span style={{ fontSize: "20px", fontWeight: 700, color: "#00ffff" }}>${fmt(amount, 0)}</span>
      </div>

      <input
        type="range"
        min={s.minStake}
        max={100000}
        step={s.minStake}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#00ffff", marginBottom: "12px" }}
      />

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
        {PRESETS.map((v) => (
          <button
            key={v}
            className="pct-btn"
            style={{ flex: "0 0 auto", padding: "6px 14px" }}
            onClick={() => setAmount(v)}
          >
            ${v.toLocaleString()}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
        <div className="vest-stat">
          <div className="vest-label">Daily</div>
          <div className="vest-val cyan">${fmt(daily)}</div>
        </div>
        <div className="vest-stat">
          <div className="vest-label">30 days</div>
          <div className="vest-val green">${fmt(monthly)}</div>
        </div>
        <div className="vest-stat">
          <div className="vest-label">{s.stakeDays} days profit</div>
          <div className="vest-val yellow">${fmt(total)}</div>
        </div>
        <div className="vest-stat">
          <div className="vest-label">Total returned</div>
          <div className="vest-val cyan">${fmt(final)}</div>
        </div>
      </div>

      <div style={{
        marginTop: "20px",
        padding: "14px 18px",
        background: "rgba(16,185,129,0.06)",
        border: "1px solid rgba(16,185,129,0.2)",
        borderRadius: "10px",
        textAlign: "center",
        fontSize: "13px",
        color: "#10b981",
      }}>
        Refer a friend who stakes ${fmt(amount, 0)} → you earn ${fmt(refBonus)} instantly.
      </div>
    </div>
  );
}
