"use client";

const features = [
  {
    title: "Security",
    description: "Built on the Solana network, our platform leverages smart contracts that eliminate the need for centralized control, significantly reducing security risks.",
  },
  {
    title: "Transparency",
    description: "All transactions are recorded on-chain, ensuring no hidden fees or manipulation. Bot performance is publicly visible on the Analytics page.",
  },
  {
    title: "Passive Income",
    description: "Our automated trading bots and staking protocols offer continuous rewards, letting you earn even when you're not actively trading.",
  },
  {
    title: "Community-Driven",
    description: "CBB token holders influence platform governance, shaping the project's roadmap and future developments.",
  },
];

export default function About() {
  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0f1525, #1a1f35)",
        padding: "80px 20px 60px",
        textAlign: "center",
        borderBottom: "1px solid rgba(0,255,255,0.08)"
      }}>
        <h1 style={{ fontSize: "42px", marginBottom: "16px" }}>About Us</h1>
        <p style={{ color: "#888", fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
          We are a team of dedicated professionals united by a single mission: to provide
          a secure, transparent, and innovative DeFi platform for investors and traders worldwide.
        </p>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 20px" }}>
        <div className="glass-card" style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>Who We Are</h2>
          <p style={{ color: "#ccc", fontSize: "16px", lineHeight: "1.7" }}>
            We specialize in merging advanced trading bots, blockchain technology, and
            user-centric design into a seamless ecosystem. Our automated strategies monitor
            the market 24/7, allowing you to earn rewards without the complexity of active
            trading. Built natively on Solana, FixVesta is designed for speed, low fees,
            and full on-chain transparency.
          </p>
        </div>

        <div className="glass-card" style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>Our Mission</h2>
          <p style={{ color: "#ccc", fontSize: "16px", lineHeight: "1.7" }}>
            Our mission is to empower investors with transparent financial tools that maximize
            growth and minimize risk. We believe in a decentralized future, where individuals
            have full control over their assets, free from intermediaries. Through the CBB
            token and our staking ecosystem, we are building a community-owned protocol that
            distributes real trading profits back to holders.
          </p>
        </div>

        <div className="glass-card" style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Why Choose FixVesta?</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{
                  minWidth: "8px", height: "8px", borderRadius: "50%",
                  background: "#00ffff", marginTop: "8px"
                }} />
                <div>
                  <div style={{ fontWeight: "bold", marginBottom: "4px", color: "#fff" }}>{f.title}</div>
                  <div style={{ color: "#aaa", fontSize: "15px", lineHeight: "1.6" }}>{f.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#888", marginBottom: "20px", fontSize: "16px" }}>
            By choosing FixVesta, you join a forward-thinking community that embraces
            innovation and transparency. Whether you're new to crypto or a seasoned trader,
            we provide the tools and support to help you reach your financial goals.
          </p>
          <p style={{ color: "#888", marginBottom: "24px" }}>
            Learn more about our approach and what we do in detail:
          </p>
          <a href="/market" className="btn-primary" style={{ textDecoration: "none", padding: "14px 32px" }}>
            How We Work
          </a>
        </div>
      </div>
    </div>
  );
}
