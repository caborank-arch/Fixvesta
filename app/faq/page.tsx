import Link from "next/link";

const faqs = [
  {
    q: "What is FixVesta?",
    a: "FixVesta is a DeFi protocol for staking USDT and USDC with daily payouts. Stakes earn 0.5% per day for 100 days; principal is returned at the end of the term.",
  },
  {
    q: "What is the minimum amount?",
    a: "$10 USDT or USDC. There is no upper cap.",
  },
  {
    q: "When can I claim rewards?",
    a: "Once every 24 hours. Each claim pays 0.5% of your stake. You can skip days and claim accumulated rewards in a single transaction.",
  },
  {
    q: "How much will I earn over 100 days?",
    a: "150% of your deposit. Example: stake $100 → claim $0.50 daily ($50 total profit) plus the original $100 principal returned at the end = $150 total.",
  },
  {
    q: "When is the principal returned?",
    a: "At the end of the 100-day term, the smart contract automatically releases the principal back to the wallet you staked from.",
  },
  {
    q: "Which networks are supported?",
    a: "BSC (USDT BEP20), TRON (USDT TRC20) and Solana (USDC). One wallet per network — MetaMask for BSC, TronLink for TRON, Phantom for Solana.",
  },
  {
    q: "How does the referral program work?",
    a: "Share your referral link. When a referee stakes, you instantly receive 3% of their deposit to your bonus balance — withdrawable at any time to your wallet.",
  },
  {
    q: "Is it safe to store funds here?",
    a: "Funds sit in an audited, open-source smart contract — never in our custody. You can verify the contract code on BscScan, TronScan or Solscan. Like any DeFi protocol, smart-contract risk is non-zero; never stake more than you can afford to lose.",
  },
];

export default function FAQ() {
  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0f1525, #1a1f35)",
        padding: "80px 20px 60px",
        textAlign: "center",
        borderBottom: "1px solid rgba(0,255,255,0.08)",
      }}>
        <h1 style={{ fontSize: "44px", marginBottom: "16px" }}>FAQ</h1>
        <p style={{ color: "#888", fontSize: "18px", maxWidth: "560px", margin: "0 auto", lineHeight: 1.6 }}>
          Everything you need to know about staking on FixVesta. Still stuck? Reach out on Telegram.
        </p>
      </div>

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "60px 20px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {faqs.map((f, i) => (
            <details key={i} className="glass-card" style={{ padding: "20px 24px", cursor: "pointer" }}>
              <summary style={{ fontWeight: "bold", color: "#fff", fontSize: "16px", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                <span>{f.q}</span>
                <span style={{ color: "#00ffff", fontSize: "20px", flexShrink: 0 }}>+</span>
              </summary>
              <div style={{ color: "#aaa", fontSize: "15px", lineHeight: 1.7, marginTop: "12px" }}>
                {f.a}
              </div>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="glass-card" style={{ marginTop: "40px", textAlign: "center", padding: "32px" }}>
          <h2 style={{ fontSize: "22px", marginBottom: "12px" }}>Ready to start?</h2>
          <p style={{ color: "#888", marginBottom: "24px" }}>Connect your wallet and stake in under 2 minutes.</p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/stake"       className="btn-primary"   style={{ padding: "12px 28px" }}>Start Staking</Link>
            <Link href="/partnership" className="btn-secondary" style={{ padding: "12px 28px" }}>Referral Program</Link>
            <a href="https://t.me/caborank" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: "12px 28px" }}>Telegram</a>
          </div>
        </div>

        <div className="risk-disclaimer" style={{ marginTop: "32px" }}>
          ⚠️ Returns depend on bot trading performance and are not guaranteed.
          Do not stake more than you can afford to lose.
        </div>
      </div>
    </div>
  );
}
