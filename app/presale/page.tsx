export const metadata = { title: "Presale — Coming Soon" };

export default function PresalePage() {
  return (
    <div className="page-wrap" style={{ textAlign: "center", paddingTop: "120px" }}>
      <div style={{ fontSize: "64px", marginBottom: "20px" }}>🚀</div>
      <h1 style={{ fontSize: "44px", marginBottom: "16px", color: "#fff" }}>
        Presale — <span style={{ color: "#00ffff" }}>Coming Soon</span>
      </h1>
      <p style={{ color: "#888", fontSize: "16px", maxWidth: "520px", margin: "0 auto 32px" }}>
        Our token presale is being prepared. Stay tuned — details will be published before launch.
      </p>
      <a href="/stake" className="btn-primary">Explore Staking →</a>
    </div>
  );
}
