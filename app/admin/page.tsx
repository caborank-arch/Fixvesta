"use client";
import { useEffect, useState, useCallback } from "react";

type User = {
  id: number;
  walletAddress: string;
  walletType: string;
  isBanned: boolean;
  bonusBalance: string;
  createdAt: string;
  _count?: { stakes: number; claims: number };
};

type Settings = {
  dailyRate: number;
  stakeDays: number;
  refPercent: number;
  minStake: number;
  maintenance: boolean;
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

async function api<T>(url: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);
  return res.json();
}

export default function AdminPage() {
  const [tab, setTab] = useState<"users" | "settings" | "stakes">("users");
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [settings, setSettings] = useState<Settings | null>(null);
  const [stakes, setStakes] = useState<Array<Record<string, unknown>>>([]);
  const [tvl, setTvl] = useState<Array<{ currency: string; _sum: { amount: string } }>>([]);

  const loadUsers = useCallback(async () => {
    try {
      const data = await api<{ users: User[] }>(`/api/admin/users?search=${encodeURIComponent(search)}`);
      setUsers(data.users);
      setError(null);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
  }, [search]);

  const loadSettings = useCallback(async () => {
    try {
      const s = await api<Settings>(`/api/admin/settings`);
      setSettings(s);
      setError(null);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
  }, []);

  const loadStakes = useCallback(async () => {
    try {
      const data = await api<{ stakes: Array<Record<string, unknown>>; tvl: typeof tvl }>(`/api/admin/stakes`);
      setStakes(data.stakes);
      setTvl(data.tvl);
      setError(null);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
  }, [tvl]);

  useEffect(() => {
    if (tab === "users") loadUsers();
    if (tab === "settings") loadSettings();
    if (tab === "stakes") loadStakes();
  }, [tab, loadUsers, loadSettings, loadStakes]);

  async function toggleBan(u: User) {
    try {
      await api(`/api/admin/users`, {
        method: "PATCH",
        body: JSON.stringify({ userId: u.id, isBanned: !u.isBanned }),
      });
      loadUsers();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
  }

  async function addBonus(u: User) {
    const amt = prompt(`Bonus amount for ${u.walletAddress}`);
    if (!amt) return;
    try {
      await api(`/api/admin/users`, {
        method: "PATCH",
        body: JSON.stringify({ userId: u.id, bonusAmount: Number(amt) }),
      });
      loadUsers();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
  }

  async function saveSettings(patch: Partial<Settings>) {
    try {
      const s = await api<Settings>(`/api/admin/settings`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setSettings(s);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
  }

  return (
    <div className="page-wrap">
      <h1 className="dash-title">Admin</h1>

      <div className="stake-tabs">
        {(["users", "stakes", "settings"] as const).map((t) => (
          <button
            key={t}
            className={`stake-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#ef4444" }}>
          {error}
        </div>
      )}

      {tab === "users" && (
        <div className="glass-card">
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <input
              className="stake-input"
              placeholder="Search wallet…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ marginBottom: 0 }}
            />
            <button className="btn-secondary" onClick={loadUsers}>Search</button>
          </div>

          <div className="tx-table" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}>
            <div className="tx-header">
              <span>Wallet</span><span>Type</span><span>Stakes</span><span>Status</span><span>Actions</span>
            </div>
            {users.map((u) => (
              <div className="tx-row" key={u.id}>
                <span className="tx-sig">{u.walletAddress}</span>
                <span>{u.walletType}</span>
                <span>{u._count?.stakes ?? 0}</span>
                <span>
                  {u.isBanned
                    ? <span className="badge-red">BANNED</span>
                    : <span className="badge-green">ACTIVE</span>}
                </span>
                <span style={{ display: "flex", gap: "8px" }}>
                  <button className="pct-btn" onClick={() => toggleBan(u)}>
                    {u.isBanned ? "Unban" : "Ban"}
                  </button>
                  <button className="pct-btn" onClick={() => addBonus(u)}>+Bonus</button>
                </span>
              </div>
            ))}
            {users.length === 0 && <span style={{ padding: "20px", color: "#666" }}>No users.</span>}
          </div>
        </div>
      )}

      {tab === "settings" && settings && (
        <div className="glass-card">
          <h3 className="card-title">Platform Settings</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
            <label>
              <div className="vest-label">Daily rate (0.005 = 0.5%)</div>
              <input
                className="stake-input"
                type="number" step="0.0001"
                defaultValue={settings.dailyRate}
                onBlur={(e) => saveSettings({ dailyRate: Number(e.target.value) })}
              />
            </label>
            <label>
              <div className="vest-label">Stake duration (days)</div>
              <input
                className="stake-input"
                type="number"
                defaultValue={settings.stakeDays}
                onBlur={(e) => saveSettings({ stakeDays: Number(e.target.value) })}
              />
            </label>
            <label>
              <div className="vest-label">Referral % (0.03 = 3%)</div>
              <input
                className="stake-input"
                type="number" step="0.001"
                defaultValue={settings.refPercent}
                onBlur={(e) => saveSettings({ refPercent: Number(e.target.value) })}
              />
            </label>
            <label>
              <div className="vest-label">Minimum stake</div>
              <input
                className="stake-input"
                type="number"
                defaultValue={settings.minStake}
                onBlur={(e) => saveSettings({ minStake: Number(e.target.value) })}
              />
            </label>
            <label>
              <div className="vest-label">Maintenance mode</div>
              <button
                className={settings.maintenance ? "btn-primary" : "btn-secondary"}
                onClick={() => saveSettings({ maintenance: !settings.maintenance })}
                style={{ width: "100%" }}
              >
                {settings.maintenance ? "ON — site blocked" : "OFF — site live"}
              </button>
            </label>
          </div>
        </div>
      )}

      {tab === "stakes" && (
        <div>
          <div className="stat-cards-grid">
            {tvl.map((t) => (
              <div className="stat-card" key={t.currency}>
                <div className="stat-card-label">TVL · {t.currency}</div>
                <div className="stat-card-value cyan">{Number(t._sum.amount ?? 0).toLocaleString()}</div>
              </div>
            ))}
            {tvl.length === 0 && <div style={{ color: "#666" }}>No active stakes yet.</div>}
          </div>

          <div className="glass-card" style={{ marginTop: "20px" }}>
            <div className="tx-table" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}>
              <div className="tx-header">
                <span>Wallet</span><span>Currency</span><span>Amount</span><span>Start</span><span>Status</span>
              </div>
              {stakes.map((s) => (
                <div className="tx-row" key={s.id as number}>
                  <span className="tx-sig">{(s.user as { walletAddress: string })?.walletAddress}</span>
                  <span>{s.currency as string}</span>
                  <span>{Number(s.amount).toLocaleString()}</span>
                  <span>{new Date(s.startDate as string).toLocaleDateString()}</span>
                  <span>
                    {(s.isActive as boolean)
                      ? <span className="badge-green">ACTIVE</span>
                      : <span className="badge-red">CLOSED</span>}
                  </span>
                </div>
              ))}
              {stakes.length === 0 && <span style={{ padding: "20px", color: "#666" }}>No stakes.</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
