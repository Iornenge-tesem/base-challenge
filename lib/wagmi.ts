import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector'
import { baseAccount } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base],
  transports: { [base.id]: http() },
  connectors: [
    farcasterMiniApp(),
    baseAccount({
      appName: 'Base Challenge',
      appLogoUrl: 'https://base-challenge-iota.vercel.app/icon.png',
    })
  ],
})
