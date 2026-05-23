import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "32px", marginBottom: "40px" }}>
          {/* Brand */}
          <div>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#00ffff", marginBottom: "10px" }}>⬡ FixVesta</div>
            <p style={{ color: "#555", fontSize: "14px", maxWidth: "260px", lineHeight: "1.6" }}>
              Multi-chain DeFi staking on BSC, TRON and Solana. 0.5% daily, 100-day term, principal returned.
            </p>
          </div>

          {/* Nav */}
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "12px", color: "#444", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Protocol</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Link href="/presale" style={{ color: "#666", fontSize: "14px", textDecoration: "none" }}>Presale</Link>
                <Link href="/stake"   style={{ color: "#666", fontSize: "14px", textDecoration: "none" }}>Stake</Link>
                <Link href="/liquid"  style={{ color: "#666", fontSize: "14px", textDecoration: "none" }}>Liquidity</Link>
                <Link href="/analytics" style={{ color: "#666", fontSize: "14px", textDecoration: "none" }}>Analytics</Link>
              </div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#444", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Learn</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Link href="/docs"    style={{ color: "#666", fontSize: "14px", textDecoration: "none" }}>Docs</Link>
                <Link href="/roadmap" style={{ color: "#666", fontSize: "14px", textDecoration: "none" }}>Roadmap</Link>
                <Link href="/market"  style={{ color: "#666", fontSize: "14px", textDecoration: "none" }}>Market</Link>
                <Link href="/about"   style={{ color: "#666", fontSize: "14px", textDecoration: "none" }}>About</Link>
              </div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#444", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Community</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <a href="https://t.me/caborank"      target="_blank" rel="noopener noreferrer" style={{ color: "#666", fontSize: "14px", textDecoration: "none" }}>Telegram</a>
                <a href="https://x.com/CaborankN" target="_blank" rel="noopener noreferrer" style={{ color: "#666", fontSize: "14px", textDecoration: "none" }}>Twitter / X</a>
                <a href="https://github.com/caborank-arch/Fixvesta" target="_blank" rel="noopener noreferrer" style={{ color: "#666", fontSize: "14px", textDecoration: "none" }}>GitHub</a>
              </div>
            </div>
          </div>
        </div>

        {/* Token address — hidden until presale launch (set NEXT_PUBLIC_CBB_MINT to reveal) */}
        {process.env.NEXT_PUBLIC_CBB_MINT && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "24px", marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", color: "#333", marginBottom: "6px" }}>CBB Token (Solana)</div>
            <div style={{ fontSize: "13px", color: "#444", fontFamily: "monospace", letterSpacing: "0.5px" }}>
              {process.env.NEXT_PUBLIC_CBB_MINT}
              <a
                href={`https://solscan.io/token/${process.env.NEXT_PUBLIC_CBB_MINT}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00ffff", marginLeft: "10px", fontSize: "12px" }}
              >
                Solscan ↗
              </a>
            </div>
          </div>
        )}

        {/* Bottom */}
        <div style={{ fontSize: "13px", color: "#333" }}>
          © 2026 FixVesta. All rights reserved.
          Staking rewards are not guaranteed. Participation involves financial risk. Not a security.
        </div>
      </div>
    </footer>
  );
}
