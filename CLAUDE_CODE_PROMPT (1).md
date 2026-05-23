# рџљЂ CLAUDE CODE вЂ” РџРћР›РќРћР• РўР•РҐРќРР§Р•РЎРљРћР• Р—РђР”РђРќРР•
# РџСЂРѕРµРєС‚: Web3 Staking Platform (DeFi)
# РЎС‚РёР»СЊ: fixvesta.com | Р¤СѓРЅРєС†РёРѕРЅР°Р»: СЃС‚РµР№РєРёРЅРі РєСЂРёРїС‚РѕРІР°Р»СЋС‚ С‡РµСЂРµР· MetaMask / Phantom

---

## рџ“Њ РћР‘Р—РћР  РџР РћР•РљРўРђ

РЎРѕР·РґР°Р№ РїРѕР»РЅРѕС†РµРЅРЅС‹Р№ **Web3 DeFi Staking Platform** вЂ” РѕРґРЅРѕСЃС‚СЂР°РЅРёС‡РЅС‹Р№ СЃР°Р№С‚ + РїР°РЅРµР»СЊ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂР°.

**РўРµРјР°С‚РёРєР°:** Polymarket / CopyTrade / Arbitrage BOT / Front-run & Sandwich BOT / Liquidation BOT  
**Р”РёР·Р°Р№РЅ:** Р’ СЃС‚РёР»Рµ fixvesta.com (С‚С‘РјРЅР°СЏ С‚РµРјР°, РѕСЂР°РЅР¶РµРІРѕ-Р·РѕР»РѕС‚С‹Рµ Р°РєС†РµРЅС‚С‹, РїСЂРѕС„РµСЃСЃРёРѕРЅР°Р»СЊРЅС‹Р№ DeFi РІРёРґ)  
**РќРµС‚ Р°РєРєР°СѓРЅС‚РѕРІ СЃ РїР°СЂРѕР»СЏРјРё** вЂ” РІСЃСЏ Р°СѓС‚РµРЅС‚РёС„РёРєР°С†РёСЏ С‚РѕР»СЊРєРѕ С‡РµСЂРµР· РєСЂРёРїС‚РѕРєРѕС€РµР»С‘Рє (MetaMask / Phantom).  
Р”Р°РЅРЅС‹Рµ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ С…СЂР°РЅСЏС‚СЃСЏ РІ Р±Р°Р·Рµ РґР°РЅРЅС‹С… РїСЂРёРІСЏР·Р°РЅРЅС‹Рµ Рє Р°РґСЂРµСЃСѓ РєРѕС€РµР»СЊРєР°.

---

## рџ› пёЏ РўР•РҐРќРР§Р•РЎРљРР™ РЎРўР•Рљ

### Frontend
- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (С‚С‘РјРЅР°СЏ С‚РµРјР°, РѕСЂР°РЅР¶РµРІРѕ-Р·РѕР»РѕС‚С‹Рµ Р°РєС†РµРЅС‚С‹ РєР°Рє РЅР° fixvesta.com)
- **wagmi v2** + **viem** вЂ” РґР»СЏ MetaMask (EVM: BNB Smart Chain + TRON С‡РµСЂРµР· TronWeb)
- **@solana/wallet-adapter** вЂ” РґР»СЏ Phantom (Solana)
- **ethers.js v6** вЂ” РІР·Р°РёРјРѕРґРµР№СЃС‚РІРёРµ СЃРѕ СЃРјР°СЂС‚-РєРѕРЅС‚СЂР°РєС‚Р°РјРё
- Google Fonts: **Space Grotesk** (Р·Р°РіРѕР»РѕРІРєРё) + **Inter** (С‚РµРєСЃС‚)

### Backend
- **Node.js** + **Express** РёР»Рё **Next.js API Routes**
- **PostgreSQL** (С‡РµСЂРµР· Prisma ORM) вЂ” С…СЂР°РЅРµРЅРёРµ РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№, РґРµРїРѕР·РёС‚РѕРІ, С‚СЂР°РЅР·Р°РєС†РёР№, СЂРµС„РµСЂР°Р»РѕРІ
- **JWT** вЂ” Р°РІС‚РѕСЂРёР·Р°С†РёСЏ С‡РµСЂРµР· РїРѕРґРїРёСЃСЊ РєРѕС€РµР»СЊРєР° (sign message в†’ verify в†’ JWT С‚РѕРєРµРЅ)

### Smart Contracts
- **Solidity** (BSC) вЂ” РєРѕРЅС‚СЂР°РєС‚ РґР»СЏ USDT BEP20 СЃС‚РµР№РєРёРЅРіР°
- **Tron (TRC20)** вЂ” РґР»СЏ USDT TRC20 (TronWeb / TronLink)
- **Solana Program** (РёР»Рё escrow С‡РµСЂРµР· SPL Token) вЂ” РґР»СЏ USDC SOL

---

## рџ—„пёЏ РЎРўР РЈРљРўРЈР Рђ Р‘РђР—Р« Р”РђРќРќР«РҐ (PostgreSQL + Prisma)

```prisma
model User {
  id           Int      @id @default(autoincrement())
  walletAddress String  @unique   // "0x..." РёР»Рё "T..." РёР»Рё "So..."
  walletType   String             // "metamask_bsc" | "metamask_tron" | "phantom"
  referralCode String  @unique   // СѓРЅРёРєР°Р»СЊРЅС‹Р№ РєРѕРґ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
  referredBy   String?            // walletAddress СЂРµС„РµСЂРµСЂР°
  isBanned     Boolean @default(false)
  bonusBalance Decimal @default(0)
  createdAt    DateTime @default(now())
  stakes       Stake[]
  withdrawals  Withdrawal[]
  claims       Claim[]
}

model Stake {
  id            Int      @id @default(autoincrement())
  userId        Int
  user          User     @relation(fields: [userId], references: [id])
  currency      String   // "USDT_BEP20" | "USDT_TRX" | "USDC_SOL"
  amount        Decimal
  txHash        String   @unique
  startDate     DateTime @default(now())
  endDate       DateTime // startDate + 100 РґРЅРµР№
  totalEarned   Decimal @default(0)  // РЅР°РєРѕРїР»РµРЅРЅС‹Рµ РїСЂРѕС†РµРЅС‚С‹
  lastClaimDate DateTime?
  isActive      Boolean @default(true)
  status        String  @default("active") // "active" | "completed" | "cancelled"
}

model Claim {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  stakeId   Int
  amount    Decimal
  txHash    String?  // С…СЌС€ С‚СЂР°РЅР·Р°РєС†РёРё РІС‹РІРѕРґР°
  claimedAt DateTime @default(now())
  status    String  @default("pending") // "pending" | "completed" | "failed"
}

model Withdrawal {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  amount    Decimal
  currency  String
  toAddress String
  txHash    String?
  status    String  @default("pending")
  createdAt DateTime @default(now())
}

model ReferralEarning {
  id         Int      @id @default(autoincrement())
  referrerId Int
  refereeId  Int
  stakeId    Int
  amount     Decimal  // 3% РѕС‚ РґРµРїРѕР·РёС‚Р° СЂРµС„РµСЂР°Р»Р°
  paidAt     DateTime @default(now())
}

model PromoCode {
  id          Int      @id @default(autoincrement())
  code        String   @unique
  bonusAmount Decimal
  usageLimit  Int      @default(1)
  usedCount   Int      @default(0)
  expiresAt   DateTime?
  isActive    Boolean  @default(true)
}

model Settings {
  id         Int    @id @default(1)
  dailyRate  Float  @default(0.005)  // 0.5% РІ РґРµРЅСЊ в†’ 50% Р·Р° 100 РґРЅРµР№ + С‚РµР»Рѕ = 150% total
  stakeDays  Int    @default(100)     // СЃСЂРѕРє СЃС‚РµР№РєРёРЅРіР°
  refPercent Float  @default(0.03)   // 3% СЂРµС„РµСЂР°Р»СЊРЅС‹С…
  minStake   Float  @default(10)     // РјРёРЅРёРјР°Р»СЊРЅС‹Р№ РґРµРїРѕР·РёС‚
}
```

---

## рџ’° Р›РћР“РРљРђ РЎРўР•Р™РљРРќР“Рђ

### РџР°СЂР°РјРµС‚СЂС‹ (РјРµРЅСЏСЋС‚СЃСЏ РёР· Р°РґРјРёРЅРєРё):
- **РЎСЂРѕРє:** 100 РґРЅРµР№
- **РџСЂРѕС„РёС‚:** 1% РІ РґРµРЅСЊ РѕС‚ СЃСѓРјРјС‹ РґРµРїРѕР·РёС‚Р°
- **РС‚РѕРіРѕ Р·Р° 100 РґРЅРµР№:** 150% РѕС‚ РґРµРїРѕР·РёС‚Р° (С‚РµР»Рѕ + 50% РїСЂРёР±С‹Р»СЊ)
  - РџСЂРёРјРµСЂ: РІР»РѕР¶РёР» $100 в†’ РєР°Р¶РґС‹Р№ РґРµРЅСЊ РґРѕСЃС‚СѓРїРЅРѕ $0.50 (0.5%/РґРµРЅСЊ) в†’ С‡РµСЂРµР· 100 РґРЅРµР№ total claim = $50 (РїСЂРѕС„РёС‚) + $100 (С‚РµР»Рѕ РґРµРїРѕР·РёС‚Р°) = **$150 total**
  - РќРћ С‡РёС‚Р°Р№ РЅРёР¶Рµ вЂ” РІС‹РІРѕРґ С‚РµР»Р° С‚РѕР»СЊРєРѕ РІ РєРѕРЅС†Рµ СЃСЂРѕРєР°, claim РїСЂРёР±С‹Р»Рё РєР°Р¶РґС‹Р№ РґРµРЅСЊ

### Р›РѕРіРёРєР° Claim (РІС‹РІРѕРґР°):
- РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ РјРѕР¶РµС‚ РґРµР»Р°С‚СЊ **claim 1 СЂР°Р· РІ РґРµРЅСЊ**
- Claim = 0.5% РѕС‚ СЃСѓРјРјС‹ РґРµРїРѕР·РёС‚Р° РІ РґРµРЅСЊ (РЅР°РєР°РїР»РёРІР°РµС‚СЃСЏ, РјРѕР¶РЅРѕ РЅРµ РєР»РµР№РјРёС‚СЊ РЅРµСЃРєРѕР»СЊРєРѕ РґРЅРµР№)
- **Р’ РєРѕРЅС†Рµ 100 РґРЅРµР№** вЂ” РІРѕР·РІСЂР°С‰Р°РµС‚СЃСЏ С‚РµР»Рѕ РґРµРїРѕР·РёС‚Р° + РѕСЃС‚Р°С‚РѕРє РЅРµРІС‹РІРµРґРµРЅРЅРѕРіРѕ РїСЂРѕС„РёС‚Р°
- Р’С‹РІРѕРґ РёРґС‘С‚ Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё **РѕР±СЂР°С‚РЅРѕ РЅР° С‚РѕС‚ РєРѕС€РµР»С‘Рє** РѕС‚РєСѓРґР° Р±С‹Р» РґРµРїРѕР·РёС‚

### РџРѕРґРґРµСЂР¶РёРІР°РµРјС‹Рµ РІР°Р»СЋС‚С‹:
| Р’Р°Р»СЋС‚Р° | РЎРµС‚СЊ | РљРѕС€РµР»С‘Рє |
|--------|------|---------|
| USDT BEP20 | BNB Smart Chain (BSC) | MetaMask |
| USDT TRC20 | TRON | MetaMask (TronLink) РёР»Рё РѕС‚РґРµР»СЊРЅР°СЏ РёРЅС‚РµРіСЂР°С†РёСЏ |
| USDC SOL | Solana | Phantom |

---

## рџ”— Р Р•Р¤Р•Р РђР›Р¬РќРђРЇ РџР РћР“Р РђРњРњРђ

- РљР°Р¶РґС‹Р№ РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ РїРѕР»СѓС‡Р°РµС‚ СѓРЅРёРєР°Р»СЊРЅС‹Р№ СЂРµС„РµСЂР°Р»СЊРЅС‹Р№ РєРѕРґ/СЃСЃС‹Р»РєСѓ
- РљРѕРіРґР° СЂРµС„РµСЂР°Р» РґРµР»Р°РµС‚ РґРµРїРѕР·РёС‚ в†’ СЂРµС„РµСЂРµСЂСѓ РЅР°С‡РёСЃР»СЏРµС‚СЃСЏ **3% РѕС‚ СЃСѓРјРјС‹ РґРµРїРѕР·РёС‚Р°** Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё
- Р РµС„РµСЂР°Р»СЊРЅС‹Р№ Р±РѕРЅСѓСЃ РґРѕР±Р°РІР»СЏРµС‚СЃСЏ Рє Р±Р°Р»Р°РЅСЃСѓ Рё РґРѕСЃС‚СѓРїРµРЅ РґР»СЏ РІС‹РІРѕРґР°
- РџРѕРєР°Р·С‹РІР°С‚СЊ: РєРѕР»-РІРѕ СЂРµС„РµСЂР°Р»РѕРІ, РѕР±С‰Р°СЏ СЃСѓРјРјР° Р·Р°СЂР°Р±РѕС‚РєР° РѕС‚ СЂРµС„РµСЂР°Р»РѕРІ, СЃРїРёСЃРѕРє СЂРµС„РµСЂР°Р»РѕРІ

---

## рџ“„ РЎРўР РђРќРР¦Р« РЎРђР™РўРђ

### 1. Р“Р»Р°РІРЅР°СЏ СЃС‚СЂР°РЅРёС†Р° (`/`)

**Hero СЃРµРєС†РёСЏ:**
- Р‘РѕР»СЊС€РѕР№ Р·Р°РіРѕР»РѕРІРѕРє: "AI-Powered DeFi Staking Protocol"
- РџРѕРґР·Р°РіРѕР»РѕРІРѕРє Рѕ СЃС‚СЂР°С‚РµРіРёСЏС…: Polymarket Predictions / CopyTrade / Arbitrage / Liquidation BOT
- РљРЅРѕРїРєРё: "Connect Wallet" + "View Analytics"
- РђРЅРёРјРёСЂРѕРІР°РЅРЅР°СЏ СЃС‚Р°С‚РёСЃС‚РёРєР°: Total Staked / Active Users / Daily Rewards Paid

**РЎРµРєС†РёСЏ "How It Works"** (3 С€Р°РіР°):
1. Connect your wallet (MetaMask or Phantom)
2. Stake USDT or USDC вЂ” choose your network
3. Claim 0.5% daily profit вЂ” auto to your wallet

**РЎРµРєС†РёСЏ СЃС‚СЂР°С‚РµРіРёР№** (РєР°СЂС‚РѕС‡РєРё, РІР·СЏС‚СЊ РєРѕРЅС‚РµРЅС‚ РёР· fixvesta Рё Р°РґР°РїС‚РёСЂРѕРІР°С‚СЊ):
- рџ¤– Arbitrage BOT вЂ” РѕРїРёСЃР°РЅРёРµ РєР°Рє РїР»Р°С‚С„РѕСЂРјР° РёСЃРїРѕР»СЊР·СѓРµС‚ РјРµР¶Р±РёСЂР¶РµРІРѕР№ Р°СЂР±РёС‚СЂР°Р¶
- рџ“Љ CopyTrade вЂ” РєРѕРїРёСЂСѓРµС‚ СЃРґРµР»РєРё С‚РѕРї С‚СЂРµР№РґРµСЂРѕРІ Polymarket
- вљЎ Front-run / Sandwich BOT вЂ” MEV СЃС‚СЂР°С‚РµРіРёРё РЅР° DEX
- рџ’§ Liquidation BOT вЂ” РјРѕРЅРёС‚РѕСЂРёРЅРі РїРѕР·РёС†РёР№ РґР»СЏ Р»РёРєРІРёРґР°С†РёРё

**РљР°Р»СЊРєСѓР»СЏС‚РѕСЂ РїСЂРёР±С‹Р»Рё:**
- РЎР»Р°Р№РґРµСЂ СЃСѓРјРјС‹ РґРµРїРѕР·РёС‚Р° (РѕС‚ $10 РґРѕ $100,000)
- РџРѕРєР°Р·С‹РІР°РµС‚: Daily Profit / 30-day Profit / 100-day Total
- Р’С‹Р±РѕСЂ РІР°Р»СЋС‚С‹ (USDT BEP20 / USDT TRX / USDC SOL)

**РЎРµРєС†РёСЏ Analytics** (РёРЅС‚РµРіСЂР°С†РёСЏ РІРёРґР¶РµС‚РѕРІ РѕС‚ fixvesta.com/analytics):
- Embed iframe РёР»Рё API РѕС‚ fixvesta.com market/analytics СЃРµРєС†РёРё
- Live СЃС‚Р°С‚РёСЃС‚РёРєР° СЂС‹РЅРєР°

**FAQ СЃРµРєС†РёСЏ** (5-7 РІРѕРїСЂРѕСЃРѕРІ Рѕ СЃС‚РµР№РєРёРЅРіРµ, Р±РµР·РѕРїР°СЃРЅРѕСЃС‚Рё, РІС‹РІРѕРґРµ)

**Footer:** РЎРѕС†РёР°Р»СЊРЅС‹Рµ СЃРµС‚Рё, СЃСЃС‹Р»РєРё, РєРѕРїРёСЂР°Р№С‚

---

### 2. РЎС‚СЂР°РЅРёС†Р° Dashboard (`/dashboard`) вЂ” С‚РѕР»СЊРєРѕ РїРѕСЃР»Рµ РїРѕРґРєР»СЋС‡РµРЅРёСЏ РєРѕС€РµР»СЊРєР°

**Р’РµСЂС…РЅСЏСЏ РїР°РЅРµР»СЊ:**
- РђРґСЂРµСЃ РєРѕС€РµР»СЊРєР° (СЃРѕРєСЂР°С‰С‘РЅРЅС‹Р№) + РёРєРѕРЅРєР° СЃРµС‚Рё
- РљРЅРѕРїРєР° Disconnect

**РњРѕРё СЃС‚РµР№РєРё (С‚Р°Р±Р»РёС†Р°):**
- Р’Р°Р»СЋС‚Р° | РЎСѓРјРјР° | Р”Р°С‚Р° РЅР°С‡Р°Р»Р° | Р”Р°С‚Р° РѕРєРѕРЅС‡Р°РЅРёСЏ | Р—Р°СЂР°Р±РѕС‚Р°РЅРѕ | Р”РѕСЃС‚СѓРїРЅРѕ Рє claim | РљРЅРѕРїРєР° CLAIM
- РџСЂРѕРіСЂРµСЃСЃ-Р±Р°СЂ (СЃРєРѕР»СЊРєРѕ РґРЅРµР№ РїСЂРѕС€Р»Рѕ РёР· 100)

**Р¤РѕСЂРјР° РЅРѕРІРѕРіРѕ СЃС‚РµР№РєР°:**
- Р’С‹Р±РѕСЂ РІР°Р»СЋС‚С‹: USDT BEP20 / USDT TRX / USDC SOL
- РџРѕР»Рµ СЃСѓРјРјС‹
- РљРЅРѕРїРєР° "Stake Now" в†’ Р·Р°РїСѓСЃРєР°РµС‚ С‚СЂР°РЅР·Р°РєС†РёСЋ С‡РµСЂРµР· РєРѕС€РµР»С‘Рє
- РџРѕСЃР»Рµ РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ С‚СЂР°РЅР·Р°РєС†РёРё вЂ” Р·Р°РїРёСЃС‹РІР°РµС‚СЃСЏ РІ Р‘Р”

**Р РµС„РµСЂР°Р»СЊРЅР°СЏ СЃРµРєС†РёСЏ:**
- РњРѕСЏ СЂРµС„-СЃСЃС‹Р»РєР° (СЃРєРѕРїРёСЂРѕРІР°С‚СЊ)
- РЎС‚Р°С‚РёСЃС‚РёРєР°: СЂРµС„РµСЂР°Р»РѕРІ / Р·Р°СЂР°Р±РѕС‚Р°РЅРѕ
- РўР°Р±Р»РёС†Р° СЂРµС„РµСЂР°Р»РѕРІ

**РџРѕР»Рµ РїСЂРѕРјРѕ-РєРѕРґР°:**
- Р’РІРµСЃС‚Рё РїСЂРѕРјРѕ-РєРѕРґ в†’ РїСЂРёРјРµРЅРёС‚СЊ Р±РѕРЅСѓСЃ

**РСЃС‚РѕСЂРёСЏ С‚СЂР°РЅР·Р°РєС†РёР№:**
- Р”РµРїРѕР·РёС‚С‹ / Claims / Р РµС„РµСЂР°Р»С‹ вЂ” СЃ С…СЌС€Р°РјРё С‚СЂР°РЅР·Р°РєС†РёР№ Рё СЃСЃС‹Р»РєР°РјРё РЅР° explorer

---

### 3. РЎС‚СЂР°РЅРёС†Р° Analytics (`/analytics`)
- РџРѕР»РЅР°СЏ РёРЅС‚РµРіСЂР°С†РёСЏ СЃ fixvesta.com/analytics Рё fixvesta.com/market
- РСЃРїРѕР»СЊР·СѓР№ `<iframe>` РёР»Рё fetch API РґР°РЅРЅС‹С…
- Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅРѕ: СЃС‚Р°С‚РёСЃС‚РёРєР° СЃР°РјРѕР№ РїР»Р°С‚С„РѕСЂРјС‹ (total staked, users, APY chart)

---

### 4. РЎС‚СЂР°РЅРёС†Р° Admin (`/admin`) вЂ” Р·Р°С‰РёС‰С‘РЅРЅР°СЏ

**Р”РѕСЃС‚СѓРї:** С‚РѕР»СЊРєРѕ СЃ РѕРїСЂРµРґРµР»С‘РЅРЅС‹С… wallet-Р°РґСЂРµСЃРѕРІ (Р·Р°РґР°С‘С‚СЃСЏ РІ `.env` РєР°Рє `ADMIN_WALLETS=0x...`)

**Р Р°Р·РґРµР»С‹:**

#### РџРѕР»СЊР·РѕРІР°С‚РµР»Рё
- РўР°Р±Р»РёС†Р° РІСЃРµС… РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№ (wallet, СЃРµС‚СЊ, РґР°С‚Р° СЂРµРіРёСЃС‚СЂР°С†РёРё, СЃСѓРјРјР° СЃС‚РµР№РєРѕРІ, СЃС‚Р°С‚СѓСЃ)
- РџРѕРёСЃРє РїРѕ Р°РґСЂРµСЃСѓ РєРѕС€РµР»СЊРєР°
- РљРЅРѕРїРєРё: EDIT / BAN / UNBAN / ADD BONUS
- РџСЂРѕСЃРјРѕС‚СЂ РґРµС‚Р°Р»СЊРЅРѕР№ СЃС‚СЂР°РЅРёС†С‹ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ

#### РЎС‚РµР№РєРё
- Р’СЃРµ Р°РєС‚РёРІРЅС‹Рµ Рё Р·Р°РІРµСЂС€С‘РЅРЅС‹Рµ СЃС‚РµР№РєРё
- Р¤РёР»СЊС‚СЂС‹ РїРѕ РІР°Р»СЋС‚Рµ, СЃС‚Р°С‚СѓСЃСѓ, РґР°С‚Рµ
- РћР±С‰Р°СЏ СЃС‚Р°С‚РёСЃС‚РёРєР°: TVL (Total Value Locked) РїРѕ РєР°Р¶РґРѕР№ РІР°Р»СЋС‚Рµ

#### РўСЂР°РЅР·Р°РєС†РёРё
- Р’СЃРµ РґРµРїРѕР·РёС‚С‹, claims, РІС‹РІРѕРґС‹
- РЎС‚Р°С‚СѓСЃ РєР°Р¶РґРѕР№ С‚СЂР°РЅР·Р°РєС†РёРё, С…СЌС€, СЃСЃС‹Р»РєР° РЅР° explorer

#### РќР°СЃС‚СЂРѕР№РєРё (Settings)
- **Daily Rate %** вЂ” РёР·РјРµРЅРёС‚СЊ % РїСЂРёР±С‹Р»Рё РІ РґРµРЅСЊ (РІР»РёСЏРµС‚ РЅР° РІСЃРµ РЅРѕРІС‹Рµ СЃС‚РµР№РєРё)
- **Stake Duration (days)** вЂ” РёР·РјРµРЅРёС‚СЊ СЃСЂРѕРє
- **Referral %** вЂ” РёР·РјРµРЅРёС‚СЊ СЂРµС„ РІРѕР·РЅР°РіСЂР°Р¶РґРµРЅРёРµ
- **Min Stake Amount** вЂ” РјРёРЅРёРјР°Р»СЊРЅС‹Р№ РґРµРїРѕР·РёС‚
- **Maintenance Mode** вЂ” РІРєР»СЋС‡РёС‚СЊ СЃС‚СЂР°РЅРёС†Сѓ РѕР±СЃР»СѓР¶РёРІР°РЅРёСЏ

#### РџСЂРѕРјРѕ-РєРѕРґС‹
- РЎРѕР·РґР°С‚СЊ РїСЂРѕРјРѕ-РєРѕРґ (СЃСѓРјРјР° Р±РѕРЅСѓСЃР°, Р»РёРјРёС‚ РёСЃРїРѕР»СЊР·РѕРІР°РЅРёР№, РґР°С‚Р° РёСЃС‚РµС‡РµРЅРёСЏ)
- РЎРїРёСЃРѕРє РІСЃРµС… РїСЂРѕРјРѕ-РєРѕРґРѕРІ, СЃС‚Р°С‚СѓСЃ, РєРѕР»-РІРѕ РёСЃРїРѕР»СЊР·РѕРІР°РЅРёР№

#### Р Р°СЃСЃС‹Р»РєР° (Newsletter)
- РћС‚РїСЂР°РІРёС‚СЊ СЃРѕРѕР±С‰РµРЅРёРµ РІСЃРµРј РїРѕР»СЊР·РѕРІР°С‚РµР»СЏРј (email РµСЃР»Рё РµСЃС‚СЊ РёР»Рё push)

#### Р’С‹РїР»Р°С‚С‹
- Р СѓС‡РЅР°СЏ РѕС‚РїСЂР°РІРєР° pending РІС‹РїР»Р°С‚ РµСЃР»Рё Р°РІС‚РѕРјР°С‚РёРєР° РЅРµ СЃСЂР°Р±РѕС‚Р°Р»Р°
- РЎС‚Р°С‚СѓСЃ pending / completed РґР»СЏ РєР°Р¶РґРѕР№ РІС‹РїР»Р°С‚С‹

---

## рџ”ђ РђРЈРўР•РќРўРР¤РРљРђР¦РРЇ (Wallet-based, Р±РµР· РїР°СЂРѕР»РµР№)

```
1. РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ РЅР°Р¶РёРјР°РµС‚ "Connect Wallet"
2. Р’С‹Р±РёСЂР°РµС‚: MetaMask (BSC/TRON) РёР»Рё Phantom (Solana)
3. РљРѕС€РµР»С‘Рє РїРѕРґРєР»СЋС‡Р°РµС‚СЃСЏ в†’ РїРѕР»СѓС‡Р°РµРј walletAddress
4. Р‘СЌРєРµРЅРґ РіРµРЅРµСЂРёСЂСѓРµС‚ nonce (СЃР»СѓС‡Р°Р№РЅСѓСЋ СЃС‚СЂРѕРєСѓ)
5. РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ РїРѕРґРїРёСЃС‹РІР°РµС‚ СЃРѕРѕР±С‰РµРЅРёРµ: "Sign in to StakePlatform: {nonce}"
6. Р‘СЌРєРµРЅРґ РІРµСЂРёС„РёС†РёСЂСѓРµС‚ РїРѕРґРїРёСЃСЊ в†’ СѓР±РµР¶РґР°РµС‚СЃСЏ С‡С‚Рѕ Р°РґСЂРµСЃ СЃРѕРІРїР°РґР°РµС‚
7. РЎРѕР·РґР°С‘С‚СЃСЏ JWT С‚РѕРєРµРЅ в†’ СЃРѕС…СЂР°РЅСЏРµС‚СЃСЏ РІ localStorage
8. Р•СЃР»Рё РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ РЅРѕРІС‹Р№ в†’ СЃРѕР·РґР°С‘С‚СЃСЏ Р·Р°РїРёСЃСЊ РІ User С‚Р°Р±Р»РёС†Рµ
9. Р’СЃРµ РїРѕСЃР»РµРґСѓСЋС‰РёРµ Р·Р°РїСЂРѕСЃС‹ РёРґСѓС‚ СЃ JWT РІ Р·Р°РіРѕР»РѕРІРєРµ
```

**Р”Р»СЏ TRON (TronWeb):**
```javascript
// TronLink РїРѕРґРєР»СЋС‡РµРЅРёРµ
const tronWeb = window.tronWeb;
const address = tronWeb.defaultAddress.base58;
const signedMessage = await tronWeb.trx.sign(message);
```

**Р”Р»СЏ Solana (Phantom):**
```javascript
const { solana } = window;
const response = await solana.connect();
const publicKey = response.publicKey.toString();
const encodedMessage = new TextEncoder().encode(message);
const signedMessage = await solana.signMessage(encodedMessage, "utf8");
```

---

## в›“пёЏ РЎРњРђР Рў-РљРћРќРўР РђРљРўР«

### BSC вЂ” USDT BEP20 Staking Contract (Solidity)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract USDTStaking {
    address public owner;
    address public usdtToken = 0x55d398326f99059fF775485246999027B3197955; // USDT BSC
    
    uint256 public dailyRateBps = 50;   // 0.5% = 50 basis points в†’ 150% total Р·Р° 100 РґРЅРµР№
    uint256 public stakeDuration = 100 days;
    uint256 public referralBps = 300;   // 3%
    
    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaim;
        bool active;
    }
    
    mapping(address => Stake[]) public stakes;
    mapping(address => address) public referrers;
    mapping(address => uint256) public referralBalance;
    
    event Staked(address indexed user, uint256 amount, uint256 stakeId);
    event Claimed(address indexed user, uint256 amount, uint256 stakeId);
    event ReferralPaid(address indexed referrer, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function stake(uint256 amount, address referrer) external {
        require(amount >= 10e18, "Min stake 10 USDT");
        IERC20(usdtToken).transferFrom(msg.sender, address(this), amount);
        
        stakes[msg.sender].push(Stake({
            amount: amount,
            startTime: block.timestamp,
            lastClaim: block.timestamp,
            active: true
        }));
        
        // Р РµС„РµСЂР°Р»СЊРЅР°СЏ РїСЂРѕРіСЂР°РјРјР°
        if (referrer != address(0) && referrer != msg.sender && referrers[msg.sender] == address(0)) {
            referrers[msg.sender] = referrer;
            uint256 refAmount = amount * referralBps / 10000;
            referralBalance[referrer] += refAmount;
            emit ReferralPaid(referrer, refAmount);
        }
        
        emit Staked(msg.sender, amount, stakes[msg.sender].length - 1);
    }
    
    function claimDaily(uint256 stakeId) external {
        Stake storage s = stakes[msg.sender][stakeId];
        require(s.active, "Stake not active");
        require(block.timestamp >= s.lastClaim + 1 days, "Can only claim once per day");
        
        uint256 daysPassed = (block.timestamp - s.lastClaim) / 1 days;
        uint256 claimAmount = s.amount * dailyRateBps * daysPassed / 10000;
        
        s.lastClaim = block.timestamp;
        IERC20(usdtToken).transfer(msg.sender, claimAmount);
        
        emit Claimed(msg.sender, claimAmount, stakeId);
    }
    
    function withdrawPrincipal(uint256 stakeId) external {
        Stake storage s = stakes[msg.sender][stakeId];
        require(s.active, "Stake not active");
        require(block.timestamp >= s.startTime + stakeDuration, "Stake period not ended");
        
        s.active = false;
        IERC20(usdtToken).transfer(msg.sender, s.amount);
    }
    
    function withdrawReferral() external {
        uint256 amount = referralBalance[msg.sender];
        require(amount > 0, "No referral balance");
        referralBalance[msg.sender] = 0;
        IERC20(usdtToken).transfer(msg.sender, amount);
    }
    
    // Admin С„СѓРЅРєС†РёРё
    function setDailyRate(uint256 newRateBps) external onlyOwner {
        dailyRateBps = newRateBps;
    }
    
    function setStakeDuration(uint256 newDuration) external onlyOwner {
        stakeDuration = newDuration;
    }
    
    function setReferralRate(uint256 newBps) external onlyOwner {
        referralBps = newBps;
    }
    
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner, amount);
    }
}
```

### Р”Р»СЏ TRON (TRC20 / Solidity СЃРѕРІРјРµСЃС‚РёРјС‹Р№):
- РСЃРїРѕР»СЊР·СѓР№ TronBox РёР»Рё С‚РѕС‚ Р¶Рµ Solidity (TRON РїРѕРґРґРµСЂР¶РёРІР°РµС‚ Solidity)
- USDT TRC20 Р°РґСЂРµСЃ: `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`
- Р”РµРїР»РѕР№ С‡РµСЂРµР· TronBox + TronLink

### Р”Р»СЏ Solana (USDC):
- РСЃРїРѕР»СЊР·СѓР№ **SPL Token** + **Anchor framework**
- РЎРѕР·РґР°Р№ Anchor РїСЂРѕРіСЂР°РјРјСѓ РґР»СЏ escrow СЃС‚РµР№РєРёРЅРіР° USDC
- Program ID Р·Р°РґР°С‘С‚СЃСЏ РІ `.env`

---

## рџ—‚пёЏ РЎРўР РЈРљРўРЈР Рђ Р¤РђР™Р›РћР’ РџР РћР•РљРўРђ

```
project/
в”њв”Ђв”Ђ contracts/
в”‚   в”њв”Ђв”Ђ bsc/
в”‚   в”‚   в”њв”Ђв”Ђ USDTStaking.sol
в”‚   в”‚   в””в”Ђв”Ђ deploy.js
в”‚   в”њв”Ђв”Ђ tron/
в”‚   в”‚   в”њв”Ђв”Ђ USDTStaking.sol
в”‚   в”‚   в””в”Ђв”Ђ tronbox.js
в”‚   в””в”Ђв”Ђ solana/
в”‚       в”њв”Ђв”Ђ programs/staking/src/lib.rs
в”‚       в””в”Ђв”Ђ Anchor.toml
в”њв”Ђв”Ђ frontend/                    # Next.js App
в”‚   в”њв”Ђв”Ђ app/
в”‚   в”‚   в”њв”Ђв”Ђ page.tsx             # Р“Р»Р°РІРЅР°СЏ
в”‚   в”‚   в”њв”Ђв”Ђ dashboard/page.tsx   # Р”Р°С€Р±РѕСЂРґ
в”‚   в”‚   в”њв”Ђв”Ђ analytics/page.tsx   # РђРЅР°Р»РёС‚РёРєР°
в”‚   в”‚   в”њв”Ђв”Ђ admin/page.tsx       # РђРґРјРёРЅРєР°
в”‚   в”‚   в””в”Ђв”Ђ api/                 # API Routes
в”‚   в”‚       в”њв”Ђв”Ђ auth/
в”‚   в”‚       в”‚   в”њв”Ђв”Ђ nonce/route.ts
в”‚   в”‚       в”‚   в””в”Ђв”Ђ verify/route.ts
в”‚   в”‚       в”њв”Ђв”Ђ stake/
в”‚   в”‚       в”‚   в”њв”Ђв”Ђ create/route.ts
в”‚   в”‚       в”‚   в””в”Ђв”Ђ claim/route.ts
в”‚   в”‚       в”њв”Ђв”Ђ user/route.ts
в”‚   в”‚       в”њв”Ђв”Ђ admin/
в”‚   в”‚       в”‚   в”њв”Ђв”Ђ users/route.ts
в”‚   в”‚       в”‚   в”њв”Ђв”Ђ stakes/route.ts
в”‚   в”‚       в”‚   в”њв”Ђв”Ђ settings/route.ts
в”‚   в”‚       в”‚   в””в”Ђв”Ђ promo/route.ts
в”‚   в”‚       в””в”Ђв”Ђ referral/route.ts
в”‚   в”њв”Ђв”Ђ components/
в”‚   в”‚   в”њв”Ђв”Ђ WalletConnect.tsx
в”‚   в”‚   в”њв”Ђв”Ђ StakeForm.tsx
в”‚   в”‚   в”њв”Ђв”Ђ ClaimButton.tsx
в”‚   в”‚   в”њв”Ђв”Ђ ReferralSection.tsx
в”‚   в”‚   в”њв”Ђв”Ђ Calculator.tsx
в”‚   в”‚   в”њв”Ђв”Ђ AdminTable.tsx
в”‚   в”‚   в””в”Ђв”Ђ ...
в”‚   в”њв”Ђв”Ђ lib/
в”‚   в”‚   в”њв”Ђв”Ђ prisma.ts
в”‚   в”‚   в”њв”Ђв”Ђ auth.ts              # JWT + wallet verify
в”‚   в”‚   в”њв”Ђв”Ђ contracts.ts         # ABI + contract instances
в”‚   в”‚   в””в”Ђв”Ђ wagmi.ts             # wagmi config
в”‚   в”њв”Ђв”Ђ prisma/
в”‚   в”‚   в””в”Ђв”Ђ schema.prisma
в”‚   в””в”Ђв”Ђ .env.local
в””в”Ђв”Ђ README.md
```

---

## вљ™пёЏ .env РџР•Р Р•РњР•РќРќР«Р•

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/staking_db"

# JWT
JWT_SECRET="your-secret-key-here"

# Admin wallets (С‡РµСЂРµР· Р·Р°РїСЏС‚СѓСЋ)
ADMIN_WALLETS="0xYourAdminWallet1,0xYourAdminWallet2"

# BSC Contract
NEXT_PUBLIC_BSC_STAKING_CONTRACT="0x..."
NEXT_PUBLIC_BSC_USDT_ADDRESS="0x55d398326f99059fF775485246999027B3197955"
NEXT_PUBLIC_BSC_RPC="https://bsc-dataseed.binance.org/"

# TRON Contract  
NEXT_PUBLIC_TRON_STAKING_CONTRACT="T..."
NEXT_PUBLIC_TRON_USDT_ADDRESS="TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
NEXT_PUBLIC_TRON_FULL_NODE="https://api.trongrid.io"

# Solana
NEXT_PUBLIC_SOLANA_PROGRAM_ID="..."
NEXT_PUBLIC_SOLANA_RPC="https://api.mainnet-beta.solana.com"
NEXT_PUBLIC_USDC_MINT="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"

# App
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_NAME="StakeBot Pro"
```

---

## рџЋЁ Р”РР—РђР™Рќ-РЎРРЎРўР•РњРђ (РЎС‚РёР»СЊ fixvesta.com)

```css
/* Р¦РІРµС‚РѕРІР°СЏ РїР°Р»РёС‚СЂР° */
--color-bg-primary: #0A0A0F;        /* РџРѕС‡С‚Рё С‡С‘СЂРЅС‹Р№ С„РѕРЅ */
--color-bg-secondary: #12121A;      /* РљР°СЂС‚РѕС‡РєРё */
--color-bg-tertiary: #1A1A2E;       /* Р‘РѕСЂРґРµСЂС‹ */
--color-accent-orange: #F7931A;     /* Bitcoin orange вЂ” РѕСЃРЅРѕРІРЅРѕР№ Р°РєС†РµРЅС‚ */
--color-accent-gold: #FFD700;       /* Р—РѕР»РѕС‚РѕР№ вЂ” РґР»СЏ highlights */
--color-accent-blue: #4F8EF7;       /* РЎРёРЅРёР№ вЂ” РґР»СЏ СЃСЃС‹Р»РѕРє */
--color-text-primary: #FFFFFF;
--color-text-secondary: #8B8B9B;
--color-success: #00C896;
--color-danger: #FF4D4D;

/* РЁСЂРёС„С‚С‹ */
font-family: 'Space Grotesk', sans-serif;  /* Р—Р°РіРѕР»РѕРІРєРё */
font-family: 'Inter', sans-serif;           /* РўРµРєСЃС‚ */

/* Р­С„С„РµРєС‚С‹ */
/* Р“Р»РѕСѓ СЌС„С„РµРєС‚ РЅР° РєРЅРѕРїРєР°С… */
box-shadow: 0 0 20px rgba(247, 147, 26, 0.3);
/* РЎС‚РµРєР»СЏРЅРЅС‹Р№ СЌС„С„РµРєС‚ РЅР° РєР°СЂС‚РѕС‡РєР°С… */
background: rgba(18, 18, 26, 0.8);
backdrop-filter: blur(20px);
border: 1px solid rgba(247, 147, 26, 0.1);
/* Р“СЂР°РґРёРµРЅС‚С‹ */
background: linear-gradient(135deg, #F7931A 0%, #FFD700 100%);
```

---

## рџ“‹ РџРћРЁРђР“РћР’Р«Р™ РџР›РђРќ Р Р•РђР›РР—РђР¦РР Р”Р›РЇ CLAUDE CODE

```
STEP 1: РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ РїСЂРѕРµРєС‚Р°
- npx create-next-app@latest staking-platform --typescript --tailwind --app
- cd staking-platform
- npm install wagmi viem @tanstack/react-query ethers
- npm install @solana/wallet-adapter-react @solana/wallet-adapter-wallets @solana/web3.js
- npm install prisma @prisma/client jsonwebtoken
- npm install tronweb

STEP 2: Р‘Р°Р·Р° РґР°РЅРЅС‹С…
- npx prisma init
- РЎРѕР·РґР°С‚СЊ schema.prisma (РїРѕ СЃС…РµРјРµ РІС‹С€Рµ)
- npx prisma db push
- npx prisma generate

STEP 3: Smart Contracts
- РЎРѕР·РґР°С‚СЊ contracts/bsc/USDTStaking.sol
- Р—Р°РґРµРїР»РѕРёС‚СЊ РЅР° BSC Mainnet С‡РµСЂРµР· Hardhat РёР»Рё Remix
- Р—Р°РґРµРїР»РѕРёС‚СЊ РЅР° TRON С‡РµСЂРµР· TronBox
- Р—Р°РґРµРїР»РѕРёС‚СЊ Anchor РїСЂРѕРіСЂР°РјРјСѓ РЅР° Solana

STEP 4: Backend API Routes
- POST /api/auth/nonce вЂ” РіРµРЅРµСЂРёСЂСѓРµС‚ nonce РґР»СЏ РїРѕРґРїРёСЃРё
- POST /api/auth/verify вЂ” РІРµСЂРёС„РёС†РёСЂСѓРµС‚ РїРѕРґРїРёСЃСЊ в†’ JWT
- POST /api/stake/create вЂ” СЃРѕР·РґР°С‚СЊ РЅРѕРІС‹Р№ СЃС‚РµР№Рє (Р·Р°РїРёСЃР°С‚СЊ tx hash)
- POST /api/stake/claim вЂ” Р·Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊ claim
- GET /api/user/stakes вЂ” РїРѕР»СѓС‡РёС‚СЊ СЃС‚РµР№РєРё РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
- GET /api/user/referrals вЂ” СЂРµС„РµСЂР°Р»СЊРЅР°СЏ СЃС‚Р°С‚РёСЃС‚РёРєР°
- POST /api/promo/apply вЂ” РїСЂРёРјРµРЅРёС‚СЊ РїСЂРѕРјРѕ-РєРѕРґ
- GET /api/admin/users вЂ” СЃРїРёСЃРѕРє РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№ (С‚РѕР»СЊРєРѕ ADMIN)
- PATCH /api/admin/users/:id вЂ” Р±Р°РЅ/Р±РѕРЅСѓСЃ/СЂРµРґР°РєС‚РёСЂРѕРІР°С‚СЊ
- GET/PATCH /api/admin/settings вЂ” РЅР°СЃС‚СЂРѕР№РєРё РїР»Р°С‚С„РѕСЂРјС‹
- POST /api/admin/promo вЂ” СЃРѕР·РґР°С‚СЊ РїСЂРѕРјРѕ-РєРѕРґ

STEP 5: Frontend РєРѕРјРїРѕРЅРµРЅС‚С‹
- WalletConnectButton (MetaMask BSC + TRON, Phantom)
- HomePage СЃ hero, РєР°Р»СЊРєСѓР»СЏС‚РѕСЂРѕРј, СЃС‚СЂР°С‚РµРіРёСЏРјРё
- Dashboard СЃ С„РѕСЂРјРѕР№ СЃС‚РµР№РєР° Рё РєР»РµР№РјР°
- AdminPanel СЃРѕ РІСЃРµРјРё С‚Р°Р±Р»РёС†Р°РјРё
- AnalyticsPage СЃ embed РѕС‚ fixvesta.com

STEP 6: РўРµСЃС‚РёСЂРѕРІР°РЅРёРµ РЅР° testnet
- BSC Testnet в†’ Mainnet
- TRON Shasta в†’ Mainnet
- Solana Devnet в†’ Mainnet
```

---

## рџ”’ Р‘Р•Р—РћРџРђРЎРќРћРЎРўР¬

1. **РЎРјР°СЂС‚-РєРѕРЅС‚СЂР°РєС‚:** РђСѓРґРёС‚ С‡РµСЂРµР· Slither РїРµСЂРµРґ РґРµРїР»РѕРµРј. Emergency withdraw С‚РѕР»СЊРєРѕ owner.
2. **Backend:** Rate limiting (express-rate-limit). Р’Р°Р»РёРґР°С†РёСЏ РІСЃРµС… РІС…РѕРґРЅС‹С… РґР°РЅРЅС‹С….
3. **JWT:** РљРѕСЂРѕС‚РєРёР№ СЃСЂРѕРє Р¶РёР·РЅРё (24h) + refresh token.
4. **Admin:** РџСЂРѕРІРµСЂРєР° wallet address РёР· `.env ADMIN_WALLETS` РЅР° РєР°Р¶РґС‹Р№ Р·Р°РїСЂРѕСЃ.
5. **Banning:** Р—Р°Р±Р°РЅРµРЅРЅС‹Рµ РїРѕР»СЊР·РѕРІР°С‚РµР»Рё РЅРµ РјРѕРіСѓС‚ РґРµР»Р°С‚СЊ РЅРѕРІС‹Рµ СЃС‚РµР№РєРё (РїСЂРѕРІРµСЂСЏРµС‚СЃСЏ РЅР° Р±СЌРєРµ).
6. **CORS:** РќР°СЃС‚СЂРѕРёС‚СЊ С‚РѕР»СЊРєРѕ РґР»СЏ СЃРІРѕРµРіРѕ РґРѕРјРµРЅР°.

---

## рџ“Љ РЎРўР РђРќРР¦Рђ РђРќРђР›РРўРРљР

```tsx
// analytics/page.tsx
// Embed fixvesta.com market data
export default function AnalyticsPage() {
  return (
    <div>
      <h1>Market Analytics</h1>
      
      {/* Iframe СЃ fixvesta.com/analytics */}
      <iframe 
        src="https://www.fixvesta.com/analytics"
        width="100%" 
        height="800px"
        style={{ border: 'none', borderRadius: '12px' }}
      />
      
      {/* Р•СЃР»Рё iframe РЅРµ СЂР°Р±РѕС‚Р°РµС‚ вЂ” РёСЃРїРѕР»СЊР·СѓР№ РёС… API */}
      {/* Fetch РґР°РЅРЅС‹Рµ СЃ fixvesta.com/market С‡РµСЂРµР· РёС… РїСѓР±Р»РёС‡РЅС‹Р№ API */}
      
      {/* Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅРѕ вЂ” СЃС‚Р°С‚РёСЃС‚РёРєР° РЅР°С€РµР№ РїР»Р°С‚С„РѕСЂРјС‹ */}
      <PlatformStats />  {/* TVL, Users, Daily Volume */}
    </div>
  );
}
```

---

## рџљЂ РљРђРљ Р—РђРџРЈРЎРўРРўР¬

```bash
# 1. РљР»РѕРЅРёСЂРѕРІР°С‚СЊ / СЃРѕР·РґР°С‚СЊ РїСЂРѕРµРєС‚
git init staking-platform && cd staking-platform

# 2. РЈСЃС‚Р°РЅРѕРІРёС‚СЊ Р·Р°РІРёСЃРёРјРѕСЃС‚Рё
npm install

# 3. РќР°СЃС‚СЂРѕРёС‚СЊ .env.local (РІСЃРµ РїРµСЂРµРјРµРЅРЅС‹Рµ РІС‹С€Рµ)

# 4. Р—Р°РїСѓСЃС‚РёС‚СЊ Р±Р°Р·Сѓ РґР°РЅРЅС‹С… (PostgreSQL)
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=staking_db postgres

# 5. РњРёРіСЂРёСЂРѕРІР°С‚СЊ Р‘Р”
npx prisma db push

# 6. Р—Р°РїСѓСЃС‚РёС‚СЊ dev СЃРµСЂРІРµСЂ
npm run dev

# 7. Р”РµРїР»РѕР№ СЃРјР°СЂС‚-РєРѕРЅС‚СЂР°РєС‚РѕРІ (РѕС‚РґРµР»СЊРЅРѕ С‡РµСЂРµР· Hardhat/TronBox/Anchor)

# 8. Р”РµРїР»РѕР№ СЃР°Р№С‚Р° РЅР° Vercel / VPS
vercel deploy --prod
```

---

## вќ“ РћРўР’Р•РўР« РќРђ РўР’РћР Р’РћРџР РћРЎР«

### "РќСѓР¶РЅР° Р»Рё Р±Р°Р·Р° РґР°РЅРЅС‹С… РµСЃР»Рё РµСЃС‚СЊ MetaMask/Phantom?"
**Р”Р°, Р±Р°Р·Р° РґР°РЅРЅС‹С… РќРЈР–РќРђ.** Р‘Р»РѕРєС‡РµР№РЅ С…СЂР°РЅРёС‚ С‚СЂР°РЅР·Р°РєС†РёРё, РЅРѕ РќР• С…СЂР°РЅРёС‚:
- Р РµС„РµСЂР°Р»СЊРЅС‹Рµ СЃРІСЏР·Рё РјРµР¶РґСѓ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏРјРё
- РџСЂРѕРјРѕ-РєРѕРґС‹ Рё Р±РѕРЅСѓСЃС‹
- РСЃС‚РѕСЂРёСЏ РєР»РµР№РјРѕРІ СЃ РґР°С‚Р°РјРё
- РќР°СЃС‚СЂРѕР№РєРё (Р±Р°РЅ, % РєРѕС‚РѕСЂС‹Р№ С‚С‹ РјРµРЅСЏРµС€СЊ)
- РРЅС„РѕСЂРјР°С†РёСЏ Рѕ С‚РѕРј РєС‚Рѕ СЏРІР»СЏРµС‚СЃСЏ СЂРµС„РµСЂРѕРј РєРѕРіРѕ

Р‘Р°Р·Р° РїСЂРёРІСЏР·Р°РЅР° Рє wallet address (РЅРµ email/РїР°СЂРѕР»СЊ). РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ "Р»РѕРіРёРЅРёС‚СЃСЏ" РїРѕРґРїРёСЃР°РІ СЃРѕРѕР±С‰РµРЅРёРµ РєРѕС€РµР»СЊРєРѕРј.

### "РљР°Рє РјРµРЅСЏС‚СЊ % РёР· Р°РґРјРёРЅРєРё?"
Р”РІР° РІР°СЂРёР°РЅС‚Р°:
1. **РўРѕР»СЊРєРѕ РІ Р‘Р”** вЂ” РЅРѕРІС‹Р№ % РїСЂРёРјРµРЅСЏРµС‚СЃСЏ Рє РЅРѕРІС‹Рј СЃС‚РµР№РєР°Рј, СЃС‚Р°СЂС‹Рµ СЃС‚РµР№РєРё СЃС‡РёС‚Р°СЋС‚СЃСЏ РїРѕ СЃС‚Р°СЂРѕРјСѓ % (СЂРµРєРѕРјРµРЅРґСѓРµС‚СЃСЏ)
2. **Р’ СЃРјР°СЂС‚-РєРѕРЅС‚СЂР°РєС‚Рµ** вЂ” С‡РµСЂРµР· `setDailyRate()` С„СѓРЅРєС†РёСЋ (РґРѕСЂРѕРіРѕ, С‚СЂРµР±СѓРµС‚ gas)

Р РµРєРѕРјРµРЅРґСѓСЋ: РЅР°СЃС‚СЂРѕР№РєРё С…СЂР°РЅРёС‚СЊ РІ Р‘Р” С‚Р°Р±Р»РёС†Рµ `Settings`, СЃРјР°СЂС‚-РєРѕРЅС‚СЂР°РєС‚ РёСЃРїРѕР»СЊР·РѕРІР°С‚СЊ С‚РѕР»СЊРєРѕ РґР»СЏ С…СЂР°РЅРµРЅРёСЏ/РѕС‚РїСЂР°РІРєРё СЃСЂРµРґСЃС‚РІ.

---

*Р­С‚РѕС‚ РїСЂРѕРјРїС‚ СЃРѕР·РґР°РЅ РґР»СЏ РёСЃРїРѕР»СЊР·РѕРІР°РЅРёСЏ РІ Claude Code (claude.ai/code РёР»Рё CLI). РЎРєРѕРїРёСЂСѓР№ РµРіРѕ РїРѕР»РЅРѕСЃС‚СЊСЋ Рё РІСЃС‚Р°РІСЊ РєР°Рє РїРµСЂРІС‹Р№ Р·Р°РїСЂРѕСЃ РІ РЅРѕРІРѕР№ СЃРµСЃСЃРёРё Claude Code.*
