# HNTRS - Sports NFT Marketplace

HNTRS is a premium, sports-exclusive creative design studio and NFT marketplace. It features a modern, high-performance interface with fluid typography, advanced animations, and a sophisticated aesthetic tailored for the sports industry, now powered by blockchain technology.

## Tech Stack

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Animations:** Motion (formerly Framer Motion)
- **Routing:** React Router DOM 7
- **Web3:** wagmi, viem, @tanstack/react-query

### Blockchain
- **Smart Contracts:** Solidity 0.8.24
- **Development Framework:** Hardhat
- **Network:** Polygon (MATIC)
- **Token Standards:** ERC-721, ERC-2981 (Royalties)
- **Storage:** IPFS via Pinata

## Key Features

### Website
- **Premium Visual Design:** A high-end editorial aesthetic with a focus on sports culture.
- **Fluid Typography:** Responsive text scaling across all device sizes using modern CSS techniques.
- **Advanced Animations:** Smooth entrance sequences, parallax effects, and interactive micro-animations.
- **Dynamic Layouts:** Alternating content sections and grid-based case studies.
- **Global Navigation:** A unified, responsive navbar and footer system.
- **Custom UI Elements:** Integrated custom cursor and bespoke interactive components.

### NFT Marketplace
- **NFT Minting:** Create and mint sports designs as NFTs with IPFS storage
- **Fixed-Price Sales:** List NFTs for direct purchase
- **Auctions:** Time-limited auctions with automatic extensions
- **Offers:** Make offers on any NFT
- **Royalties:** Automatic royalty distribution (ERC-2981)
- **Collections:** Create and mint from themed collections
- **Wallet Integration:** MetaMask, WalletConnect, Coinbase Wallet

## Getting Started

### Prerequisites

- Node.js (v18+)
- MetaMask or other Web3 wallet
- Polygon MATIC for gas fees

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Navigate to the project directory:
   ```bash
   cd HNTRS
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Install contract dependencies:
   ```bash
   cd contracts && npm install
   ```

5. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and contract addresses
   ```

### Development

To start the development server:
```bash
npm run dev
```

### Smart Contracts

Compile contracts:
```bash
cd contracts
npm run compile
```

Run tests:
```bash
npm run test
```

Deploy to Polygon Amoy (testnet):
```bash
npm run deploy:mumbai
```

Deploy to Polygon mainnet:
```bash
npm run deploy:polygon
```

### Production

To build the project for production:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## Project Structure

### Frontend
- `src/components/`: Reusable UI components (Navbar, Footer, Hero, WalletConnect, etc.)
- `src/pages/`: Main page views (Home, Work, News, Contact, Mint, Marketplace, Profile)
- `src/hooks/`: Custom React hooks (useIPFS, useHNTRSContract)
- `src/config/`: Configuration files (wagmi.js, contracts.js)
- `src/assets/`: Static assets including images and custom fonts
- `src/index.css`: Global styles and design system tokens

### Smart Contracts
- `contracts/src/`: Solidity smart contracts (HNTRSNFT.sol, HNTRSMarketplace.sol)
- `contracts/scripts/`: Deployment scripts
- `test/`: Contract tests

## Smart Contract Architecture

### HNTRSNFT (ERC-721 + ERC-2981)
- Mint single NFTs with metadata
- Create and mint from collections
- Lazy minting for gas efficiency
- Batch minting support
- Configurable royalties

### HNTRSMarketplace
- Fixed-price listings
- English auctions with time extensions
- Offer system
- Platform fee (2.5%)
- Automatic royalty distribution

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID |
| `VITE_PINATA_API_KEY` | Pinata API key for IPFS |
| `VITE_PINATA_SECRET_KEY` | Pinata secret key |
| `VITE_NFT_CONTRACT_POLYGON` | NFT contract address on Polygon |
| `VITE_MARKETPLACE_CONTRACT_POLYGON` | Marketplace contract on Polygon |

## License

This project is private and all rights are reserved.
