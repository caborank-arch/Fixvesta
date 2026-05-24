// Minimal ABIs for the on-chain stake flow.

export const ERC20_ABI = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
] as const;

export const STAKING_ABI = [
  {
    type: "function",
    name: "stake",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "referrer", type: "address" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "claimDaily",
    stateMutability: "nonpayable",
    inputs: [{ name: "stakeIndex", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "withdrawPrincipal",
    stateMutability: "nonpayable",
    inputs: [{ name: "stakeIndex", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "withdrawReferral",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
] as const;

// Currency-specific config used by /stake and /dashboard.
export const CURRENCIES = {
  USDT_BEP20: {
    id: "USDT_BEP20" as const,
    label: "USDT BEP20",
    network: "BSC",
    onChain: true,                             // wagmi flow enabled
    decimals: 18,
    token:    process.env.NEXT_PUBLIC_BSC_USDT             as `0x${string}` | undefined,
    staking:  process.env.NEXT_PUBLIC_BSC_STAKING_CONTRACT as `0x${string}` | undefined,
    chainId:  Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID  || 56),
    explorer: "https://bscscan.com/tx/",
  },
  USDT_TRX: {
    id: "USDT_TRX" as const,
    label: "USDT TRC20",
    network: "TRON",
    onChain: false,                            // manual tx hash for now
    decimals: 6,
    token:   process.env.NEXT_PUBLIC_TRON_USDT,
    staking: process.env.NEXT_PUBLIC_TRON_STAKING_CONTRACT,
    explorer: "https://tronscan.org/#/transaction/",
  },
  USDC_SOL: {
    id: "USDC_SOL" as const,
    label: "USDC Solana",
    network: "Solana",
    onChain: false,
    decimals: 6,
    token:   process.env.NEXT_PUBLIC_USDC_MINT,
    staking: process.env.NEXT_PUBLIC_SOL_PROGRAM_ID,
    explorer: "https://solscan.io/tx/",
  },
} as const;

export type CurrencyId = keyof typeof CURRENCIES;

export function getCurrency(id: CurrencyId) {
  return CURRENCIES[id];
}
