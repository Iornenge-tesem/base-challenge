import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'

// Simple config without custom connectors to diagnose white screen
export const config = createConfig({
  chains: [base],
  transports: { [base.id]: http() },
  connectors: [],
})
