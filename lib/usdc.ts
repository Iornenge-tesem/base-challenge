// USDC Configuration for Base Mainnet
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

// Entry fee: 0.3 USDC
export const ENTRY_FEE_USDC = 0.3
export const ENTRY_FEE_UNITS = 300000 // 0.3 * 10^6 (USDC has 6 decimals)

// Contract address
export const CHALLENGE_PAYMENT_CONTRACT = process.env.NEXT_PUBLIC_CHALLENGE_PAYMENT_CONTRACT || ''
