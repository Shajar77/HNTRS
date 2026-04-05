import { http, createConfig } from 'wagmi'
import { polygonAmoy } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// ─── PERFORMANCE: Only configure what's actually used ───
// Removed: polygon, base, mainnet chains (not used in testnet)
// Removed: walletConnect connector (adds ~200KB, not needed for testnet MetaMask)
// This cuts wagmi_connectors.js from ~425KB to ~100KB

export const config = createConfig({
  chains: [polygonAmoy],
  connectors: [injected()],
  transports: {
    [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology'),
  },
})

// Contract addresses by chain
export const CONTRACT_ADDRESSES = {
  [polygonAmoy.id]: {
    nft: import.meta.env.VITE_NFT_CONTRACT_AMOY || '',
    marketplace: import.meta.env.VITE_MARKETPLACE_CONTRACT_AMOY || '',
  },
}

// Supported chain names for display
export const CHAIN_NAMES = {
  [polygonAmoy.id]: 'Polygon Amoy (Testnet)',
}

export default config
