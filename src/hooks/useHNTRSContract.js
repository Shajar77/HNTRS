import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { HNTRSNFT_ABI, HNTRS_MARKETPLACE_ABI } from '../config/contracts'
import { CONTRACT_ADDRESSES } from '../config/wagmi'
import { useChainId } from 'wagmi'

// Hook for interacting with HNTRSNFT contract
export const useHNTRSNFT = () => {
  const { address } = useAccount()
  const chainId = useChainId()
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const contractAddress = CONTRACT_ADDRESSES[chainId]?.nft

  // Read: Get token URI
  const useTokenURI = (tokenId) => {
    return useReadContract({
      address: contractAddress,
      abi: HNTRSNFT_ABI,
      functionName: 'tokenURI',
      args: [tokenId],
      query: {
        enabled: !!contractAddress && tokenId !== undefined,
      },
    })
  }

  // Read: Get token metadata
  const useTokenMeta = (tokenId) => {
    return useReadContract({
      address: contractAddress,
      abi: HNTRSNFT_ABI,
      functionName: 'tokenMeta',
      args: [tokenId],
      query: {
        enabled: !!contractAddress && tokenId !== undefined,
      },
    })
  }

  // Read: Get tokens by owner
  const useTokensByOwner = (ownerAddress) => {
    return useReadContract({
      address: contractAddress,
      abi: HNTRSNFT_ABI,
      functionName: 'getTokensByOwner',
      args: [ownerAddress || address],
      query: {
        enabled: !!contractAddress && !!(ownerAddress || address),
      },
    })
  }

  // Read: Balance of address
  const useBalanceOf = (ownerAddress) => {
    return useReadContract({
      address: contractAddress,
      abi: HNTRSNFT_ABI,
      functionName: 'balanceOf',
      args: [ownerAddress || address],
      query: {
        enabled: !!contractAddress && !!(ownerAddress || address),
      },
    })
  }

  // Read: Total supply
  const useTotalSupply = () => {
    return useReadContract({
      address: contractAddress,
      abi: HNTRSNFT_ABI,
      functionName: 'totalSupply',
      query: {
        enabled: !!contractAddress,
      },
    })
  }

  // Read: Get collection info
  const useCollection = (collectionId) => {
    return useReadContract({
      address: contractAddress,
      abi: HNTRSNFT_ABI,
      functionName: 'getCollection',
      args: [collectionId],
      query: {
        enabled: !!contractAddress && collectionId !== undefined,
      },
    })
  }

  // Write: Mint single NFT
  const mintSingle = (to, uri, name, category, royaltyRecipient, royaltyPercentage) => {
    return writeContract({
      address: contractAddress,
      abi: HNTRSNFT_ABI,
      functionName: 'mintSingle',
      args: [to, uri, name, category, royaltyRecipient, royaltyPercentage],
    })
  }

  // Write: Create collection
  const createCollection = (name, description, maxSupply, price) => {
    return writeContract({
      address: contractAddress,
      abi: HNTRSNFT_ABI,
      functionName: 'createCollection',
      args: [name, description, maxSupply, price],
    })
  }

  // Write: Mint from collection
  const mintFromCollection = (to, collectionId, uri, royaltyRecipient, royaltyPercentage) => {
    return writeContract({
      address: contractAddress,
      abi: HNTRSNFT_ABI,
      functionName: 'mintFromCollection',
      args: [to, collectionId, uri, royaltyRecipient, royaltyPercentage],
    })
  }

  // Write: Batch mint
  const batchMint = (to, uris, names, categories, royaltyRecipient, royaltyPercentage) => {
    return writeContract({
      address: contractAddress,
      abi: HNTRSNFT_ABI,
      functionName: 'batchMint',
      args: [to, uris, names, categories, royaltyRecipient, royaltyPercentage],
    })
  }

  // Write: Approve NFT for marketplace
  const approve = (spender, tokenId) => {
    return writeContract({
      address: contractAddress,
      abi: HNTRSNFT_ABI,
      functionName: 'approve',
      args: [spender, tokenId],
    })
  }

  return {
    contractAddress,
    // Reads
    useTokenURI,
    useTokenMeta,
    useTokensByOwner,
    useBalanceOf,
    useTotalSupply,
    useCollection,
    // Writes
    mintSingle,
    createCollection,
    mintFromCollection,
    batchMint,
    approve,
    // Transaction state
    hash,
    isPending,
    error,
  }
}

// Hook for interacting with HNTRS Marketplace contract
export const useHNTRSMarketplace = () => {
  const { address } = useAccount()
  const chainId = useChainId()
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const nftContractAddress = CONTRACT_ADDRESSES[chainId]?.nft
  const contractAddress = CONTRACT_ADDRESSES[chainId]?.marketplace

  // Read: Get listing by ID
  const useListing = (listingId) => {
    return useReadContract({
      address: contractAddress,
      abi: HNTRS_MARKETPLACE_ABI,
      functionName: 'listings',
      args: [listingId],
      query: {
        enabled: !!contractAddress && listingId !== undefined,
      },
    })
  }

  // Read: Get active listings
  const useActiveListings = (offset = 0, limit = 20) => {
    return useReadContract({
      address: contractAddress,
      abi: HNTRS_MARKETPLACE_ABI,
      functionName: 'getActiveListings',
      args: [BigInt(offset), BigInt(limit)],
      query: {
        enabled: !!contractAddress,
      },
    })
  }

  // Read: Get listings by seller
  const useListingsBySeller = (sellerAddress) => {
    return useReadContract({
      address: contractAddress,
      abi: HNTRS_MARKETPLACE_ABI,
      functionName: 'getListingsBySeller',
      args: [sellerAddress || address],
      query: {
        enabled: !!contractAddress && !!(sellerAddress || address),
      },
    })
  }

  // Read: Platform fee
  const usePlatformFee = () => {
    return useReadContract({
      address: contractAddress,
      abi: HNTRS_MARKETPLACE_ABI,
      functionName: 'platformFeeBps',
      query: {
        enabled: !!contractAddress,
      },
    })
  }

  // Write: Create fixed price listing
  const createFixedPriceListing = (nftContract, tokenId, price, duration) => {
    return writeContract({
      address: contractAddress,
      abi: HNTRS_MARKETPLACE_ABI,
      functionName: 'createFixedPriceListing',
      args: [nftContract, tokenId, price, duration],
    })
  }

  // Write: Create auction listing
  const createAuctionListing = (nftContract, tokenId, reservePrice, duration) => {
    return writeContract({
      address: contractAddress,
      abi: HNTRS_MARKETPLACE_ABI,
      functionName: 'createAuctionListing',
      args: [nftContract, tokenId, reservePrice, duration],
    })
  }

  // Write: Buy fixed price
  const buyFixedPrice = (listingId, value) => {
    return writeContract({
      address: contractAddress,
      abi: HNTRS_MARKETPLACE_ABI,
      functionName: 'buyFixedPrice',
      args: [listingId],
      value,
    })
  }

  // Write: Place bid
  const placeBid = (listingId, value) => {
    return writeContract({
      address: contractAddress,
      abi: HNTRS_MARKETPLACE_ABI,
      functionName: 'placeBid',
      args: [listingId],
      value,
    })
  }

  // Write: Settle auction
  const settleAuction = (listingId) => {
    return writeContract({
      address: contractAddress,
      abi: HNTRS_MARKETPLACE_ABI,
      functionName: 'settleAuction',
      args: [listingId],
    })
  }

  // Write: Cancel listing
  const cancelListing = (listingId) => {
    return writeContract({
      address: contractAddress,
      abi: HNTRS_MARKETPLACE_ABI,
      functionName: 'cancelListing',
      args: [listingId],
    })
  }

  // Write: Make offer
  const makeOffer = (nftContract, tokenId, amount, duration) => {
    return writeContract({
      address: contractAddress,
      abi: HNTRS_MARKETPLACE_ABI,
      functionName: 'makeOffer',
      args: [nftContract, tokenId, amount, duration],
      value: amount,
    })
  }

  // Write: Accept offer
  const acceptOffer = (offerId) => {
    return writeContract({
      address: contractAddress,
      abi: HNTRS_MARKETPLACE_ABI,
      functionName: 'acceptOffer',
      args: [offerId],
    })
  }

  return {
    contractAddress,
    nftContractAddress,
    // Reads
    useListing,
    useActiveListings,
    useListingsBySeller,
    usePlatformFee,
    // Writes
    createFixedPriceListing,
    createAuctionListing,
    buyFixedPrice,
    placeBid,
    settleAuction,
    cancelListing,
    makeOffer,
    acceptOffer,
    // Transaction state
    hash,
    isPending,
    error,
  }
}

export default { useHNTRSNFT, useHNTRSMarketplace }
