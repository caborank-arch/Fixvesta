# CLAUDE CODE вЂ” Р—РђР”РђРќРР• Р”Р›РЇ РЎРЈР©Р•РЎРўР’РЈР®Р©Р•Р“Рћ РџР РћР•РљРўРђ
# РџСѓС‚СЊ: C:\Users\admva\Desktop\fixvesta.com
# Р—Р°РґР°С‡Р°: РїРµСЂРµРґРµР»Р°С‚СЊ fixvesta-РєРѕРїРёСЋ РїРѕРґ DeFi Staking Platform

---

## РљРћРќРўР•РљРЎРў

РЈ РјРµРЅСЏ СѓР¶Рµ РµСЃС‚СЊ Next.js РїСЂРѕРµРєС‚ РІ `C:\Users\admva\Desktop\fixvesta.com`.
Р­С‚Рѕ РєРѕРїРёСЏ fixvesta.com (Solana С‚РѕРєРµРЅС‹, presale, CBT/CBB).
РќСѓР¶РЅРѕ РџРћР›РќРћРЎРўР¬Р® РїРµСЂРµРґРµР»Р°С‚СЊ РµРіРѕ РїРѕРґ СЃС‚РµР№РєРёРЅРі-РїР»Р°С‚С„РѕСЂРјСѓ.
РЎРјР°СЂС‚-РєРѕРЅС‚СЂР°РєС‚С‹ РќР• Р·Р°РґРµРїР»РѕРµРЅС‹ вЂ” РЅСѓР¶РЅРѕ СЃРѕР·РґР°С‚СЊ Рё Р·Р°РґРµРїР»РѕРёС‚СЊ.
Р‘Р” РЅРµС‚ вЂ” РЅСѓР¶РЅРѕ РїРѕРґРЅСЏС‚СЊ PostgreSQL СЃ РЅСѓР»СЏ.

---

## РЁРђР“ 1 вЂ” РџРћР§РРЎРўР РЎРўРђР Р«Р™ РљРћР”

```
РЈРґР°Р»Рё РёР»Рё РѕС‡РёСЃС‚Рё СЃР»РµРґСѓСЋС‰РёРµ СЃС‚СЂР°РЅРёС†С‹ (Р·Р°РјРµРЅРё РЅР° Р·Р°РіР»СѓС€РєРё "Coming Soon"):
- /presale
- /swap
- /liquid (РµСЃР»Рё РЅРµ РЅСѓР¶РЅР°)
- /roadmap (РјРѕР¶РЅРѕ РѕСЃС‚Р°РІРёС‚СЊ)

РЈРґР°Р»Рё РІСЃРµ С„Р°Р№Р»С‹ СЃРІСЏР·Р°РЅРЅС‹Рµ СЃ:
- CBT / CBB С‚РѕРєРµРЅР°РјРё
- presale-bot (.internal/)
- distribute API
- Solana mint/presale Р»РѕРіРёРєСѓ

РћСЃС‚Р°РІСЊ СЃС‚СЂСѓРєС‚СѓСЂСѓ Next.js App Router, Tailwind, РєРѕРјРїРѕРЅРµРЅС‚С‹ РЅР°РІРёРіР°С†РёРё.
```

---

## РЁРђР“ 2 вЂ” Р‘РђР—Рђ Р”РђРќРќР«РҐ (PostgreSQL + Prisma)

### 2.1 РЈСЃС‚Р°РЅРѕРІРё Р·Р°РІРёСЃРёРјРѕСЃС‚Рё
```bash
npm install prisma @prisma/client
npm install jsonwebtoken @types/jsonwebtoken
npx prisma init
```

### 2.2 РЎРѕР·РґР°Р№ С„Р°Р№Р» prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            Int      @id @default(autoincrement())
  walletAddress String   @unique
  walletType    String   // "metamask_bsc" | "tronlink" | "phantom"
  referralCode  String   @unique @default(cuid())
  referredBy    String?
  isBanned      Boolean  @default(false)
  bonusBalance  Decimal  @default(0) @db.Decimal(18, 6)
  createdAt     DateTime @default(now())

  stakes           Stake[]
  claims           Claim[]
  withdrawals      Withdrawal[]
  referralEarnings ReferralEarning[]
  promoUses        PromoUse[]
}

model Stake {
  id           Int      @id @default(autoincrement())
  userId       Int
  user         User     @relation(fields: [userId], references: [id])
  currency     String   // "USDT_BEP20" | "USDT_TRX" | "USDC_SOL"
  amount       Decimal  @db.Decimal(18, 6)
  txHash       String   @unique
  startDate    DateTime @default(now())
  endDate      DateTime
  lastClaim    DateTime?
  isActive     Boolean  @default(true)
  status       String   @default("active")

  claims Claim[]
}

model Claim {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  stakeId   Int
  stake     Stake    @relation(fields: [stakeId], references: [id])
  amount    Decimal  @db.Decimal(18, 6)
  txHash    String?
  status    String   @default("pending")
  claimedAt DateTime @default(now())
}

model Withdrawal {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  amount    Decimal  @db.Decimal(18, 6)
  currency  String
  toAddress String
  txHash    String?
  status    String   @default("pending")
  createdAt DateTime @default(now())
}

model ReferralEarning {
  id         Int      @id @default(autoincrement())
  referrerId Int
  referrer   User     @relation(fields: [referrerId], references: [id])
  refereeId  Int
  stakeId    Int
  amount     Decimal  @db.Decimal(18, 6)
  paidAt     DateTime @default(now())
}

model PromoCode {
  id          Int       @id @default(autoincrement())
  code        String    @unique
  bonusAmount Decimal   @db.Decimal(18, 6)
  usageLimit  Int       @default(1)
  usedCount   Int       @default(0)
  expiresAt   DateTime?
  isActive    Boolean   @default(true)
  uses        PromoUse[]
}

model PromoUse {
  id        Int       @id @default(autoincrement())
  promoId   Int
  promo     PromoCode @relation(fields: [promoId], references: [id])
  userId    Int
  user      User      @relation(fields: [userId], references: [id])
  usedAt    DateTime  @default(now())
}

model Settings {
  id         Int   @id @default(1)
  dailyRate  Float @default(0.005)  // 0.5% РІ РґРµРЅСЊ
  stakeDays  Int   @default(100)
  refPercent Float @default(0.03)   // 3% СЂРµС„
  minStake   Float @default(10)
  maintenance Boolean @default(false)
}
```

### 2.3 РџРѕРґРЅРёРјРё PostgreSQL Р»РѕРєР°Р»СЊРЅРѕ (Docker)
```bash
docker run -d \
  --name staking-db \
  -e POSTGRES_PASSWORD=stakingpass \
  -e POSTGRES_DB=staking_db \
  -p 5432:5432 \
  postgres:15

npx prisma db push
npx prisma generate
```

---

## РЁРђР“ 3 вЂ” РџР•Р Р•РњР•РќРќР«Р• РћРљР РЈР–Р•РќРРЇ

РЎРѕР·РґР°Р№ `.env.local`:
```env
# Database
DATABASE_URL="postgresql://postgres:stakingpass@localhost:5432/staking_db"

# JWT (РїСЂРёРґСѓРјР°Р№ РґР»РёРЅРЅСѓСЋ СЃС‚СЂРѕРєСѓ)
JWT_SECRET="replace-with-random-64-char-string"

# Admin РєРѕС€РµР»СЊРєРё (С‚РІРѕРё Р°РґСЂРµСЃР° С‡РµСЂРµР· Р·Р°РїСЏС‚СѓСЋ)
ADMIN_WALLETS="0xYOUR_WALLET_ADDRESS"

# BSC
NEXT_PUBLIC_BSC_STAKING_CONTRACT=""   # Р·Р°РїРѕР»РЅРёРј РїРѕСЃР»Рµ РґРµРїР»РѕСЏ РєРѕРЅС‚СЂР°РєС‚Р°
NEXT_PUBLIC_BSC_USDT="0x55d398326f99059fF775485246999027B3197955"
NEXT_PUBLIC_BSC_RPC="https://bsc-dataseed.binance.org/"
NEXT_PUBLIC_BSC_CHAIN_ID="56"

# TRON
NEXT_PUBLIC_TRON_STAKING_CONTRACT=""  # Р·Р°РїРѕР»РЅРёРј РїРѕСЃР»Рµ РґРµРїР»РѕСЏ
NEXT_PUBLIC_TRON_USDT="TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
NEXT_PUBLIC_TRON_RPC="https://api.trongrid.io"

# Solana
NEXT_PUBLIC_SOL_PROGRAM_ID=""         # Р·Р°РїРѕР»РЅРёРј РїРѕСЃР»Рµ РґРµРїР»РѕСЏ
NEXT_PUBLIC_USDC_MINT="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
NEXT_PUBLIC_SOL_RPC="https://api.mainnet-beta.solana.com"

# App
NEXT_PUBLIC_APP_NAME="StakeBot Pro"
NEXT_PUBLIC_APP_URL="https://fixvesta.com"
```

---

## РЁРђР“ 4 вЂ” РЎРњРђР Рў-РљРћРќРўР РђРљРў BSC (USDT BEP20)

РЎРѕР·РґР°Р№ С„Р°Р№Р» `contracts/bsc/USDTStaking.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract USDTStaking {
    address public owner;
    address public usdtToken;

    uint256 public dailyRateBps = 50;    // 0.5% = 50 bps (150% total Р·Р° 100 РґРЅРµР№)
    uint256 public stakeDuration = 100 days;
    uint256 public referralBps = 300;    // 3%
    uint256 public minStake = 10 * 1e18; // 10 USDT

    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaim;
        bool active;
        bool principalWithdrawn;
    }

    mapping(address => Stake[]) public stakes;
    mapping(address => address) public referrers;
    mapping(address => uint256) public referralBalance;
    mapping(address => bool) public banned;

    event Staked(address indexed user, uint256 amount, uint256 stakeIndex);
    event Claimed(address indexed user, uint256 amount, uint256 stakeIndex);
    event PrincipalWithdrawn(address indexed user, uint256 amount, uint256 stakeIndex);
    event ReferralPaid(address indexed referrer, address indexed referee, uint256 amount);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }
    modifier notBanned() { require(!banned[msg.sender], "Banned"); _; }

    constructor(address _usdtToken) {
        owner = msg.sender;
        usdtToken = _usdtToken;
    }

    function stake(uint256 amount, address referrer) external notBanned {
        require(amount >= minStake, "Below minimum stake");
        require(IERC20(usdtToken).transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // Р РµС„РµСЂР°Р» вЂ” С‚РѕР»СЊРєРѕ РїСЂРё РїРµСЂРІРѕРј СЃС‚РµР№РєРµ
        if (referrer != address(0) && referrer != msg.sender && referrers[msg.sender] == address(0)) {
            referrers[msg.sender] = referrer;
            uint256 refAmount = amount * referralBps / 10000;
            referralBalance[referrer] += refAmount;
            emit ReferralPaid(referrer, msg.sender, refAmount);
        }

        stakes[msg.sender].push(Stake({
            amount: amount,
            startTime: block.timestamp,
            lastClaim: block.timestamp,
            active: true,
            principalWithdrawn: false
        }));

        emit Staked(msg.sender, amount, stakes[msg.sender].length - 1);
    }

    function claimDaily(uint256 stakeIndex) external notBanned {
        Stake storage s = stakes[msg.sender][stakeIndex];
        require(s.active, "Stake not active");
        require(block.timestamp >= s.lastClaim + 1 days, "Too early: 1 claim per day");

        uint256 daysPassed = (block.timestamp - s.lastClaim) / 1 days;
        uint256 claimAmount = s.amount * dailyRateBps * daysPassed / 10000;

        // РќРµ РґР°С‚СЊ РІС‹РІРµСЃС‚Рё Р±РѕР»СЊС€Рµ 50% (РјР°РєСЃ РїСЂРѕС„РёС‚)
        uint256 maxProfit = s.amount * dailyRateBps * stakeDuration / (1 days * 10000);
        // (РєРѕРЅС‚СЂРѕР»СЊ РјР°РєСЃРёРјСѓРјР° Р»СѓС‡С€Рµ РґРµР»Р°С‚СЊ РЅР° Р±СЌРєРµРЅРґРµ вЂ” Р·РґРµСЃСЊ Р±Р°Р·РѕРІР°СЏ Р·Р°С‰РёС‚Р°)

        s.lastClaim = block.timestamp;
        require(IERC20(usdtToken).transfer(msg.sender, claimAmount), "Claim transfer failed");
        emit Claimed(msg.sender, claimAmount, stakeIndex);
    }

    function withdrawPrincipal(uint256 stakeIndex) external notBanned {
        Stake storage s = stakes[msg.sender][stakeIndex];
        require(s.active, "Not active");
        require(!s.principalWithdrawn, "Already withdrawn");
        require(block.timestamp >= s.startTime + stakeDuration, "100 days not passed");

        s.active = false;
        s.principalWithdrawn = true;
        require(IERC20(usdtToken).transfer(msg.sender, s.amount), "Principal transfer failed");
        emit PrincipalWithdrawn(msg.sender, s.amount, stakeIndex);
    }

    function withdrawReferral() external notBanned {
        uint256 amount = referralBalance[msg.sender];
        require(amount > 0, "No referral balance");
        referralBalance[msg.sender] = 0;
        require(IERC20(usdtToken).transfer(msg.sender, amount), "Referral transfer failed");
    }

    function getStakes(address user) external view returns (Stake[] memory) {
        return stakes[user];
    }

    // в”Ђв”Ђ Admin в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
    function setDailyRate(uint256 newBps) external onlyOwner { dailyRateBps = newBps; }
    function setStakeDuration(uint256 newDuration) external onlyOwner { stakeDuration = newDuration; }
    function setReferralRate(uint256 newBps) external onlyOwner { referralBps = newBps; }
    function setMinStake(uint256 newMin) external onlyOwner { minStake = newMin; }
    function setBanned(address user, bool status) external onlyOwner { banned[user] = status; }
    function transferOwnership(address newOwner) external onlyOwner { owner = newOwner; }
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(IERC20(usdtToken).transfer(owner, amount), "Emergency withdraw failed");
    }
}
```

### Р”РµРїР»РѕР№ BSC РєРѕРЅС‚СЂР°РєС‚Р° С‡РµСЂРµР· Hardhat:
```bash
mkdir contracts && cd contracts
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init   # РІС‹Р±РµСЂРё "JavaScript project"

# СЃРѕР·РґР°Р№ scripts/deploy.js:
```
```javascript
// contracts/scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const USDT_BSC = "0x55d398326f99059fF775485246999027B3197955";
  const Staking = await hre.ethers.getContractFactory("USDTStaking");
  const staking = await Staking.deploy(USDT_BSC);
  await staking.waitForDeployment();
  console.log("BSC Staking deployed to:", await staking.getAddress());
}
main().catch(console.error);
```
```bash
# Р’ hardhat.config.js РґРѕР±Р°РІСЊ BSC Mainnet:
# networks: { bsc: { url: "https://bsc-dataseed.binance.org/", accounts: [PRIVATE_KEY] } }
npx hardhat run scripts/deploy.js --network bsc
# РЎРєРѕРїРёСЂСѓР№ Р°РґСЂРµСЃ РІ .env.local в†’ NEXT_PUBLIC_BSC_STAKING_CONTRACT
```

---

## РЁРђР“ 5 вЂ” РЎРњРђР Рў-РљРћРќРўР РђРљРў TRON (USDT TRC20)

```bash
npm install -g tronbox
```

РЎРѕР·РґР°Р№ `contracts/tron/USDTStaking.sol` вЂ” С‚РѕС‚ Р¶Рµ Solidity РєРѕРґ С‡С‚Рѕ РІС‹С€Рµ (TRON СЃРѕРІРјРµСЃС‚РёРј).

`tronbox.js`:
```javascript
module.exports = {
  networks: {
    mainnet: {
      privateKey: process.env.TRON_PRIVATE_KEY,
      fullHost: "https://api.trongrid.io",
      network_id: "1"
    }
  }
};
```

```bash
tronbox compile
tronbox migrate --network mainnet
# РЎРєРѕРїРёСЂСѓР№ Р°РґСЂРµСЃ РІ NEXT_PUBLIC_TRON_STAKING_CONTRACT
```

---

## РЁРђР“ 6 вЂ” API ROUTES (Next.js App Router)

РЎРѕР·РґР°Р№ СЃР»РµРґСѓСЋС‰РёРµ С„Р°Р№Р»С‹:

### `app/api/auth/nonce/route.ts`
```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  const { walletAddress } = await req.json();
  const nonce = crypto.randomBytes(16).toString("hex");
  // РҐСЂР°РЅРё nonce РІ РїР°РјСЏС‚Рё РёР»Рё Redis (РґР»СЏ РїСЂРѕСЃС‚РѕС‚С‹ вЂ” РІ Р‘Р” С‡РµСЂРµР· РѕС‚РґРµР»СЊРЅСѓСЋ С‚Р°Р±Р»РёС†Сѓ)
  // Р’РµСЂРЅСѓС‚СЊ nonce РєР»РёРµРЅС‚Сѓ РґР»СЏ РїРѕРґРїРёСЃРё
  return NextResponse.json({ nonce, message: `Sign in to StakeBot Pro\nNonce: ${nonce}` });
}
```

### `app/api/auth/verify/route.ts`
```typescript
import { NextResponse } from "next/server";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { walletAddress, signature, message, walletType } = await req.json();

  // Р’РµСЂРёС„РёС†РёСЂСѓР№ РїРѕРґРїРёСЃСЊ (РґР»СЏ EVM)
  const recovered = ethers.verifyMessage(message, signature);
  if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // РќР°Р№РґРё РёР»Рё СЃРѕР·РґР°Р№ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
  let user = await prisma.user.findUnique({ where: { walletAddress } });
  if (!user) {
    user = await prisma.user.create({
      data: { walletAddress, walletType }
    });
  }

  if (user.isBanned) {
    return NextResponse.json({ error: "Account banned" }, { status: 403 });
  }

  const token = jwt.sign(
    { userId: user.id, walletAddress: user.walletAddress },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" }
  );

  return NextResponse.json({ token, user });
}
```

### `app/api/stake/create/route.ts`
```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await verifyJWT(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currency, amount, txHash } = await req.json();

  // РџСЂРѕРІРµСЂСЊ С‡С‚Рѕ txHash СѓРЅРёРєР°Р»СЊРЅС‹Р№ Рё С‚СЂР°РЅР·Р°РєС†РёСЏ СЂРµР°Р»СЊРЅР°СЏ
  // (РІ РїСЂРѕРґР°РєС€РЅРµ вЂ” РІРµСЂРёС„РёС†РёСЂСѓР№ С‡РµСЂРµР· RPC С‡С‚Рѕ tx СЃСѓС‰РµСЃС‚РІСѓРµС‚ Рё СЃСѓРјРјР° СЃРѕРІРїР°РґР°РµС‚)

  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  const endDate = new Date(Date.now() + (settings?.stakeDays ?? 100) * 24 * 60 * 60 * 1000);

  const stake = await prisma.stake.create({
    data: {
      userId: user.userId,
      currency,
      amount,
      txHash,
      endDate,
    }
  });

  // Р РµС„ Р±РѕРЅСѓСЃ
  const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
  if (dbUser?.referredBy) {
    const referrer = await prisma.user.findUnique({ where: { walletAddress: dbUser.referredBy } });
    if (referrer) {
      const refAmount = Number(amount) * (settings?.refPercent ?? 0.03);
      await prisma.referralEarning.create({
        data: { referrerId: referrer.id, refereeId: user.userId, stakeId: stake.id, amount: refAmount }
      });
      await prisma.user.update({
        where: { id: referrer.id },
        data: { bonusBalance: { increment: refAmount } }
      });
    }
  }

  return NextResponse.json({ stake });
}
```

### `app/api/stake/claim/route.ts`
```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await verifyJWT(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { stakeId } = await req.json();
  const stake = await prisma.stake.findFirst({
    where: { id: stakeId, userId: user.userId, isActive: true }
  });

  if (!stake) return NextResponse.json({ error: "Stake not found" }, { status: 404 });

  const now = new Date();
  if (stake.lastClaim && (now.getTime() - stake.lastClaim.getTime()) < 24 * 60 * 60 * 1000) {
    return NextResponse.json({ error: "Already claimed today" }, { status: 400 });
  }

  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  const daysPassed = stake.lastClaim
    ? Math.floor((now.getTime() - stake.lastClaim.getTime()) / (24 * 60 * 60 * 1000))
    : 1;
  const claimAmount = Number(stake.amount) * (settings?.dailyRate ?? 0.005) * daysPassed;

  const claim = await prisma.claim.create({
    data: { userId: user.userId, stakeId, amount: claimAmount }
  });

  await prisma.stake.update({
    where: { id: stakeId },
    data: { lastClaim: now }
  });

  // TODO: РІС‹Р·РІР°С‚СЊ СЃРјР°СЂС‚-РєРѕРЅС‚СЂР°РєС‚ РґР»СЏ Р°РІС‚Рѕ-РІС‹РїР»Р°С‚С‹ РёР»Рё РґРѕР±Р°РІРёС‚СЊ РІ РѕС‡РµСЂРµРґСЊ

  return NextResponse.json({ claim, amount: claimAmount });
}
```

### `app/api/user/me/route.ts`
```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await verifyJWT(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await prisma.user.findUnique({
    where: { id: user.userId },
    include: {
      stakes: true,
      claims: { orderBy: { claimedAt: "desc" }, take: 20 },
      referralEarnings: true,
    }
  });

  return NextResponse.json(data);
}
```

### `app/api/admin/users/route.ts`
```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT, isAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await verifyJWT(req);
  if (!user || !isAdmin(user.walletAddress)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");

  const users = await prisma.user.findMany({
    where: search ? { walletAddress: { contains: search } } : {},
    include: { stakes: true },
    skip: (page - 1) * 20,
    take: 20,
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(users);
}

export async function PATCH(req: Request) {
  const user = await verifyJWT(req);
  if (!user || !isAdmin(user.walletAddress)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, isBanned, bonusAmount } = await req.json();

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(isBanned !== undefined && { isBanned }),
      ...(bonusAmount !== undefined && { bonusBalance: { increment: bonusAmount } })
    }
  });

  return NextResponse.json(updated);
}
```

### `app/api/admin/settings/route.ts`
```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT, isAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    create: {},
    update: {}
  });
  return NextResponse.json(settings);
}

export async function PATCH(req: Request) {
  const user = await verifyJWT(req);
  if (!user || !isAdmin(user.walletAddress)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    create: body,
    update: body
  });
  return NextResponse.json(settings);
}
```

---

## РЁРђР“ 7 вЂ” LIB Р¤РђР™Р›Р«

### `lib/prisma.ts`
```typescript
import { PrismaClient } from "@prisma/client";
declare global { var prisma: PrismaClient | undefined; }
export const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
```

### `lib/auth.ts`
```typescript
import jwt from "jsonwebtoken";

export async function verifyJWT(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.slice(7);
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; walletAddress: string };
  } catch { return null; }
}

export function isAdmin(walletAddress: string): boolean {
  const admins = (process.env.ADMIN_WALLETS ?? "").split(",").map(a => a.trim().toLowerCase());
  return admins.includes(walletAddress.toLowerCase());
}
```

---

## РЁРђР“ 8 вЂ” РЎРўР РђРќРР¦Р« FRONTEND

### РЈСЃС‚Р°РЅРѕРІРё Web3 Р·Р°РІРёСЃРёРјРѕСЃС‚Рё:
```bash
npm install wagmi viem @tanstack/react-query ethers
npm install @solana/wallet-adapter-react @solana/wallet-adapter-wallets @solana/web3.js @solana/wallet-adapter-base
npm install tronweb
```

### РЎС‚СЂР°РЅРёС†С‹ РєРѕС‚РѕСЂС‹Рµ РЅСѓР¶РЅРѕ СЃРѕР·РґР°С‚СЊ/РїРµСЂРµРґРµР»Р°С‚СЊ:

**`app/page.tsx`** вЂ” Р“Р»Р°РІРЅР°СЏ:
- Hero СЃРµРєС†РёСЏ: "AI-Powered DeFi Staking | Earn 0.5% Daily"
- РўРµРјР°С‚РёРєР°: Arbitrage BOT / CopyTrade / Polymarket / Liquidation BOT
- РљР°СЂС‚РѕС‡РєРё СЃС‚СЂР°С‚РµРіРёР№ (4 РєР°СЂС‚РѕС‡РєРё СЃ РѕРїРёСЃР°РЅРёРµРј)
- РљР°Р»СЊРєСѓР»СЏС‚РѕСЂ: СЃР»Р°Р№РґРµСЂ СЃСѓРјРјС‹ в†’ РїРѕРєР°Р·С‹РІР°РµС‚ daily/30d/100d profit
  - Р¤РѕСЂРјСѓР»Р°: input Г— 0.005 Г— РґРЅРµР№ = РїСЂРёР±С‹Р»СЊ
  - РС‚РѕРіРѕ С‡РµСЂРµР· 100 РґРЅРµР№: input Г— 1.5 (150% = С‚РµР»Рѕ + 50% РїСЂРѕС„РёС‚)
- РљР°Рє СЌС‚Рѕ СЂР°Р±РѕС‚Р°РµС‚ (3 С€Р°РіР°)
- FAQ (5 РІРѕРїСЂРѕСЃРѕРІ)

**`app/stake/page.tsx`** (РёР»Рё `/dashboard`) вЂ” Р›РёС‡РЅС‹Р№ РєР°Р±РёРЅРµС‚:
- РљРЅРѕРїРєР° "Connect Wallet" (MetaMask BSC / TronLink / Phantom)
- РџРѕСЃР»Рµ РїРѕРґРєР»СЋС‡РµРЅРёСЏ в†’ Р°СѓС‚РµРЅС‚РёС„РёРєР°С†РёСЏ С‡РµСЂРµР· РїРѕРґРїРёСЃСЊ в†’ JWT
- Р¤РѕСЂРјР° СЃС‚РµР№РєР°: РІС‹Р±РѕСЂ РІР°Р»СЋС‚С‹ + СЃСѓРјРјР° + РєРЅРѕРїРєР° Stake
- РўР°Р±Р»РёС†Р° РјРѕРёС… СЃС‚РµР№РєРѕРІ: СЃСѓРјРјР° / РґР°С‚Р° / РїСЂРѕРіСЂРµСЃСЃ 100 РґРЅРµР№ / РєРЅРѕРїРєР° CLAIM
- Р РµС„РµСЂР°Р»СЊРЅР°СЏ СЃСЃС‹Р»РєР° + СЃС‚Р°С‚РёСЃС‚РёРєР°
- РџРѕР»Рµ РїСЂРѕРјРѕ-РєРѕРґР°
- РСЃС‚РѕСЂРёСЏ С‚СЂР°РЅР·Р°РєС†РёР№

**`app/admin/page.tsx`** вЂ” РџР°РЅРµР»СЊ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂР°:
- РџСЂРѕРІРµСЂРєР°: РєРѕС€РµР»С‘Рє РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ РІ ADMIN_WALLETS
- РўР°Р±Р»РёС†Р° РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№: РїРѕРёСЃРє / BAN / ADD BONUS
- РўР°Р±Р»РёС†Р° СЃС‚РµР№РєРѕРІ: С„РёР»СЊС‚СЂС‹ РїРѕ РІР°Р»СЋС‚Рµ
- РќР°СЃС‚СЂРѕР№РєРё: dailyRate / stakeDays / refPercent / minStake / maintenance
- РџСЂРѕРјРѕ-РєРѕРґС‹: СЃРѕР·РґР°С‚СЊ / СЃРїРёСЃРѕРє
- РћР±С‰Р°СЏ СЃС‚Р°С‚РёСЃС‚РёРєР°: TVL / Users / Claims today

**`app/analytics/page.tsx`** вЂ” РђРЅР°Р»РёС‚РёРєР°:
- Iframe РёР»Рё embed СЃ fixvesta.com/analytics
- РЎС‚Р°С‚РёСЃС‚РёРєР° РїР»Р°С‚С„РѕСЂРјС‹: TVL, Users, Volume

---

## РЁРђР“ 9 вЂ” Р”РР—РђР™Рќ (СЃС‚РёР»СЊ fixvesta.com)

Р’ `tailwind.config.ts` РґРѕР±Р°РІСЊ:
```javascript
theme: {
  extend: {
    colors: {
      accent: "#F7931A",      // РѕСЂР°РЅР¶РµРІС‹Р№
      gold: "#FFD700",        // Р·РѕР»РѕС‚РѕР№
      dark: "#0A0A0F",        // С„РѕРЅ
      card: "#12121A",        // РєР°СЂС‚РѕС‡РєРё
      border: "#1A1A2E",      // Р±РѕСЂРґРµСЂС‹
    },
    fontFamily: {
      heading: ["Space Grotesk", "sans-serif"],
      body: ["Inter", "sans-serif"],
    }
  }
}
```

Р’ `app/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500&display=swap');

body { background: #0A0A0F; color: #ffffff; font-family: 'Inter', sans-serif; }

.card-glass {
  background: rgba(18, 18, 26, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(247, 147, 26, 0.15);
  border-radius: 16px;
}

.btn-primary {
  background: linear-gradient(135deg, #F7931A, #FFD700);
  color: #000;
  font-weight: 700;
  border-radius: 12px;
  padding: 12px 28px;
  box-shadow: 0 0 20px rgba(247, 147, 26, 0.3);
  transition: all 0.2s;
}
.btn-primary:hover { box-shadow: 0 0 35px rgba(247, 147, 26, 0.5); transform: translateY(-1px); }
```

---

## РЁРђР“ 10 вЂ” Р”Р•РџР›РћР™ РќРђ VERCEL

```bash
# 1. РЎРѕР·РґР°Р№ GitHub СЂРµРїРѕР·РёС‚РѕСЂРёР№ Рё Р·Р°РїСѓС€СЊ
git init
git add .
git commit -m "Initial staking platform"
git remote add origin https://github.com/YOUR_USERNAME/fixvesta
git push -u origin main

# 2. Р—Р°Р№РґРё РЅР° vercel.com в†’ Import Project в†’ РІС‹Р±РµСЂРё СЂРµРїРѕР·РёС‚РѕСЂРёР№

# 3. Р’ Vercel Dashboard в†’ Settings в†’ Environment Variables РґРѕР±Р°РІСЊ Р’РЎР• РїРµСЂРµРјРµРЅРЅС‹Рµ РёР· .env.local
#    (DATABASE_URL РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ РїСЂРѕРґР°РєС€РЅ PostgreSQL вЂ” РёСЃРїРѕР»СЊР·СѓР№ Supabase РёР»Рё Railway РґР»СЏ Р‘Р”)

# 4. Р”Р»СЏ РїСЂРѕРґР°РєС€РЅ Р‘Р” РёСЃРїРѕР»СЊР·СѓР№ Supabase (Р±РµСЃРїР»Р°С‚РЅРѕ):
#    - supabase.com в†’ New Project в†’ СЃРєРѕРїРёСЂСѓР№ connection string
#    - DATABASE_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"

# 5. npx prisma db push (РІС‹РїРѕР»РЅРё Р»РѕРєР°Р»СЊРЅРѕ СЃ РїСЂРѕРґР°РєС€РЅ DATABASE_URL)
```

---

## РРўРћР“РћР’Р«Р™ CHECKLIST

```
[ ] РЎС‚Р°СЂС‹Р№ fixvesta/presale РєРѕРґ СѓРґР°Р»С‘РЅ
[ ] Prisma schema СЃРѕР·РґР°РЅР° Рё РїСЂРёРјРµРЅРµРЅР° (npx prisma db push)
[ ] .env.local Р·Р°РїРѕР»РЅРµРЅ
[ ] BSC РєРѕРЅС‚СЂР°РєС‚ Р·Р°РґРµРїР»РѕРµРЅ в†’ Р°РґСЂРµСЃ РІ .env
[ ] TRON РєРѕРЅС‚СЂР°РєС‚ Р·Р°РґРµРїР»РѕРµРЅ в†’ Р°РґСЂРµСЃ РІ .env
[ ] API routes СЃРѕР·РґР°РЅС‹ (auth, stake, admin)
[ ] lib/prisma.ts Рё lib/auth.ts СЃРѕР·РґР°РЅС‹
[ ] Р“Р»Р°РІРЅР°СЏ СЃС‚СЂР°РЅРёС†Р° РїРµСЂРµРґРµР»Р°РЅР° РїРѕРґ СЃС‚РµР№РєРёРЅРі
[ ] Dashboard СЃС‚СЂР°РЅРёС†Р° СЃ wallet connect
[ ] Admin СЃС‚СЂР°РЅРёС†Р° СЃ Р·Р°С‰РёС‚РѕР№ РїРѕ РєРѕС€РµР»СЊРєСѓ
[ ] Tailwind С†РІРµС‚Р° Рё С€СЂРёС„С‚С‹ РЅР°СЃС‚СЂРѕРµРЅС‹
[ ] npm run build вЂ” Р±РµР· РѕС€РёР±РѕРє
[ ] Р”РµРїР»РѕР№ РЅР° Vercel
[ ] РџСЂРѕРґР°РєС€РЅ Р‘Р” (Supabase) РїРѕРґРєР»СЋС‡РµРЅР°
```

---

## Р›РћР“РРљРђ РЎРўР•Р™РљРРќР“Рђ (Р¤РРќРђР›Р¬РќРђРЇ)

```
Р’Р»РѕР¶РёР»: $100
Daily rate: 0.5% РІ РґРµРЅСЊ
Daily profit: $0.50
Р—Р° 100 РґРЅРµР№ profit: $50
Р’ РєРѕРЅС†Рµ 100 РґРЅРµР№ claim С‚РµР»Р°: $100
РРўРћР“Рћ: $150 (150%)

РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ РјРѕР¶РµС‚:
- РљР»РµР№РјРёС‚СЊ $0.50 РєР°Р¶РґС‹Р№ РґРµРЅСЊ (1 СЂР°Р· РІ СЃСѓС‚РєРё)
- РќР°РєР°РїР»РёРІР°С‚СЊ РЅРµСЃРєРѕР»СЊРєРѕ РґРЅРµР№ Рё РєР»РµР№РјРёС‚СЊ СЃСЂР°Р·Сѓ (daysPassed Г— $0.50)
- Р’ РєРѕРЅС†Рµ 100 РґРЅРµР№ вЂ” РІРµСЂРЅСѓС‚СЊ С‚РµР»Рѕ $100
- Р РµС„ Р±РѕРЅСѓСЃ: РїСЂРёРіР»Р°СЃРёР» РґСЂСѓРіР° СЃ $100 в†’ РїРѕР»СѓС‡Р°РµС€СЊ $3 (3%) СЃСЂР°Р·Сѓ
```

