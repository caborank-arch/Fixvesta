export const metadata = { title: "Swap — Coming Soon" };

export default function SwapPage() {
  return (
    <div className="page-wrap" style={{ textAlign: "center", paddingTop: "120px" }}>
      <div style={{ fontSize: "64px", marginBottom: "20px" }}>🔁</div>
      <h1 style={{ fontSize: "44px", marginBottom: "16px", color: "#fff" }}>
        Swap — <span style={{ color: "#00ffff" }}>Coming Soon</span>
      </h1>
      <p style={{ color: "#888", fontSize: "16px", maxWidth: "520px", margin: "0 auto 32px" }}>
        In-app swap will be available after launch. For now, stake directly with USDT or USDC.
      </p>
      <a href="/stake" className="btn-primary">Go to Stake →</a>
    </div>
  );
}
