# Smart contracts

## BSC — `bsc/USDTStaking.sol`

USDT BEP20 staking on BNB Smart Chain. USDT contract: `0x55d398326f99059fF775485246999027B3197955` (18 decimals).

### Deploy via Hardhat

```bash
cd contracts
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv
npx hardhat init        # choose "JavaScript project"

# Move bsc/USDTStaking.sol to contracts/contracts/
mkdir -p contracts && cp bsc/USDTStaking.sol contracts/

# scripts/deploy-bsc.js
cat > scripts/deploy-bsc.js <<'JS'
const hre = require("hardhat");
async function main() {
  const USDT = "0x55d398326f99059fF775485246999027B3197955";
  const Factory = await hre.ethers.getContractFactory("USDTStaking");
  const c = await Factory.deploy(USDT);
  await c.waitForDeployment();
  console.log("BSC USDTStaking deployed to:", await c.getAddress());
}
main().catch(e => { console.error(e); process.exit(1); });
JS

# hardhat.config.js
# networks: { bsc: { url: process.env.BSC_RPC, accounts: [process.env.DEPLOYER_PRIVATE_KEY] } }

npx hardhat run scripts/deploy-bsc.js --network bsc
```

Copy the deployed address into `.env.local` as `NEXT_PUBLIC_BSC_STAKING_CONTRACT`.

## TRON — `tron/USDTStaking.sol`

USDT TRC20 has **6 decimals** (vs 18 on BEP20). The minStake default in the
TRON contract reflects this.

```bash
npm install -g tronbox
mkdir -p tron-build && cd tron-build
tronbox init

# Copy ../tron/USDTStaking.sol into contracts/

cat > tronbox.js <<'JS'
module.exports = {
  networks: {
    mainnet: {
      privateKey: process.env.TRON_PRIVATE_KEY,
      fullHost:   "https://api.trongrid.io",
      network_id: "1",
    },
    shasta: {
      privateKey: process.env.TRON_PRIVATE_KEY,
      fullHost:   "https://api.shasta.trongrid.io",
      network_id: "2",
    },
  },
};
JS

tronbox compile
tronbox migrate --network shasta   # test first
tronbox migrate --network mainnet
```

USDT TRC20 mainnet contract: `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`.

## Solana — TODO

For USDC SPL staking, use an Anchor program with a treasury PDA. Skipped in
this pass; see `CLAUDE_CODE_PROMPT_V2.md` for the rough shape.

## Funding the contract

The contract pays daily rewards and principal **from its own balance**. Before
opening staking publicly you must fund it with enough USDT to cover worst-case
payout (`TVL × 1.5` for 100-day terms at 0.5%/day).
