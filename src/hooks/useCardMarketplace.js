import { useState, useCallback, useRef, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi'
import { parseEther } from 'viem'

// Card data with fixed prices (in MATIC)
const cardData = [
  // Common Tier - 4 cards (10-12 MATIC)
  { 
    id: 'C01', 
    name: 'Killua', 
    anime: 'Hunter x Hunter', 
    power: 'Godspeed', 
    quote: 'I want to be your friend',
    description: 'Killua Zoldyck is the heir of the Zoldyck Family, a legendary family of assassins. Despite his dark upbringing, he seeks friendship and adventure with Gon. His lightning-fast Godspeed ability makes him one of the most formidable assassins in the world.',
    image: '/anime/killua.jpg', 
    tier: 'common',
    price: 10,
    maxSupply: 1000,
    currentSupply: 0
  },
  { 
    id: 'C02', 
    name: 'Zenitsu', 
    anime: 'Demon Slayer', 
    power: 'Thunder Breathing', 
    quote: 'I must be brave',
    description: 'Zenitsu Agatsuma is a Demon Slayer who fights despite his timid nature and constant fear. When unconscious, his true potential awakens, unleashing devastating Thunder Breathing techniques. His journey proves that courage is not the absence of fear, but action despite it.',
    image: '/anime/zenitsu.jpg', 
    tier: 'common',
    price: 10,
    maxSupply: 1000,
    currentSupply: 0
  },
  { 
    id: 'C03', 
    name: 'Bakugo', 
    anime: 'My Hero Academia', 
    power: 'Explosion', 
    quote: 'I will surpass All Might',
    description: 'Katsuki Bakugo is a natural-born genius with an explosive personality to match his Quirk. His sweat becomes nitroglycerin, allowing him to create powerful explosions. Beneath his aggressive exterior lies an unwavering determination to become the greatest hero.',
    image: '/anime/bakugo.jpg', 
    tier: 'common',
    price: 12,
    maxSupply: 800,
    currentSupply: 0
  },
  { 
    id: 'C04', 
    name: 'Nobara', 
    anime: 'Jujutsu Kaisen', 
    power: 'Straw Doll Technique', 
    quote: 'I am here to save your life',
    description: 'Nobara Kugisaki is a fierce jujutsu sorcerer who combines her Straw Doll Technique with unwavering confidence. Using her hammer, nails, and a straw doll, she can inflict damage from a distance. Her strength comes from embracing who she truly is without compromise.',
    image: '/anime/nobara.jpg', 
    tier: 'common',
    price: 12,
    maxSupply: 800,
    currentSupply: 0
  },
  
  // Rare Tier - 3 cards (25-30 MATIC)
  { 
    id: 'R01', 
    name: 'Deku', 
    anime: 'My Hero Academia', 
    power: 'One For All', 
    quote: 'I will save everyone',
    description: 'Izuku Midoriya, known as Deku, was born without a Quirk in a world where they are common. Through sheer determination and the inheritance of One For All, he strives to become the Symbol of Peace. His analytical mind and heroic heart make him a true hero.',
    image: '/anime/deku.jpg', 
    tier: 'rare',
    price: 25,
    maxSupply: 500,
    currentSupply: 0
  },
  { 
    id: 'R02', 
    name: 'Itachi', 
    anime: 'Naruto', 
    power: 'Mangekyo Sharingan', 
    quote: 'People live their lives bound by what they accept',
    description: 'Itachi Uchiha was a prodigy of the Uchiha clan who sacrificed everything for peace. His Mangekyo Sharingan granted him devastating power, but he chose to carry the burden of being a villain to protect his village and his beloved younger brother, Sasuke.',
    image: '/anime/itachi.jpg', 
    tier: 'rare',
    price: 30,
    maxSupply: 400,
    currentSupply: 0
  },
  { 
    id: 'R03', 
    name: 'Tanjiro', 
    anime: 'Demon Slayer', 
    power: 'Sun Breathing', 
    quote: 'I will save my sister',
    description: 'Tanjiro Kamado is a kind-hearted Demon Slayer who fights to cure his sister Nezuko and avenge his family. His mastery of Sun Breathing and his unwavering compassion even toward demons make him a unique and powerful warrior in the Demon Slayer Corps.',
    image: '/anime/tanjiro.jpg', 
    tier: 'rare',
    price: 28,
    maxSupply: 450,
    currentSupply: 0
  },
  
  // Epic Tier - 2 cards (50-60 MATIC)
  { 
    id: 'E01', 
    name: 'Levi', 
    anime: 'Attack on Titan', 
    power: 'Ackerman Bloodline', 
    quote: 'Give up on your dreams and die',
    description: 'Levi Ackerman is humanity\'s strongest soldier, feared by Titans and humans alike. His Ackerman bloodline grants him superhuman strength and reflexes. Despite his harsh words and methods, he carries the weight of his comrades\' deaths with every battle he fights.',
    image: '/anime/levi.jpg', 
    tier: 'epic',
    price: 50,
    maxSupply: 200,
    currentSupply: 0
  },
  { 
    id: 'E02', 
    name: 'Gojo', 
    anime: 'Jujutsu Kaisen', 
    power: 'Limitless & Six Eyes', 
    quote: 'I am the strongest',
    description: 'Satoru Gojo is the strongest jujutsu sorcerer alive, wielding the Limitless technique and Six Eyes. His boundless confidence and overwhelming power make him a force of nature. He seeks to reform the jujutsu world by nurturing the next generation of sorcerers.',
    image: '/anime/gojo.jpg', 
    tier: 'epic',
    price: 60,
    maxSupply: 150,
    currentSupply: 0
  },
  
  // Legendary Tier - 1 card (100 MATIC)
  { 
    id: 'L01', 
    name: 'Goku', 
    anime: 'Dragon Ball', 
    power: 'Ultra Instinct', 
    quote: 'I am the hope of the universe',
    description: 'Son Goku is a Saiyan warrior who protects Earth and the universe from countless threats. From his humble beginnings, he has grown into a legendary fighter who achieves forms beyond imagination. His pure heart and love for battle inspire all who know him.',
    image: '/anime/goku.jpg', 
    tier: 'legendary',
    price: 100,
    maxSupply: 50,
    currentSupply: 0
  }
]

// Simplified ABI for CardMarketplace
const MARKETPLACE_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "_cardId", "type": "string"}],
    "name": "buyCard",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_tokenId", "type": "uint256"}, {"internalType": "uint256", "name": "_price", "type": "uint256"}],
    "name": "listCard",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_listingId", "type": "uint256"}],
    "name": "delistCard",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_listingId", "type": "uint256"}],
    "name": "buyFromMarketplace",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllCards",
    "outputs": [{"components": [{"internalType": "string", "name": "id", "type": "string"}, {"internalType": "uint8", "name": "tier", "type": "uint8"}, {"internalType": "string", "name": "name", "type": "string"}, {"internalType": "string", "name": "anime", "type": "string"}, {"internalType": "string", "name": "power", "type": "string"}, {"internalType": "string", "name": "quote", "type": "string"}, {"internalType": "string", "name": "imageURI", "type": "string"}, {"internalType": "uint256", "name": "price", "type": "uint256"}, {"internalType": "uint256", "name": "maxSupply", "type": "uint256"}, {"internalType": "uint256", "name": "currentSupply", "type": "uint256"}, {"internalType": "bool", "name": "active", "type": "bool"}], "internalType": "struct CardMarketplace.Card[]", "name": "", "type": "tuple[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActiveListings",
    "outputs": [{"components": [{"internalType": "uint256", "name": "listingId", "type": "uint256"}, {"internalType": "string", "name": "cardId", "type": "string"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}, {"internalType": "address", "name": "seller", "type": "address"}, {"internalType": "uint256", "name": "price", "type": "uint256"}, {"internalType": "uint256", "name": "listedAt", "type": "uint256"}, {"internalType": "bool", "name": "active", "type": "bool"}], "internalType": "struct CardMarketplace.Listing[]", "name": "", "type": "tuple[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getUserListings",
    "outputs": [{"components": [{"internalType": "uint256", "name": "listingId", "type": "uint256"}, {"internalType": "string", "name": "cardId", "type": "string"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}, {"internalType": "address", "name": "seller", "type": "address"}, {"internalType": "uint256", "name": "price", "type": "uint256"}, {"internalType": "uint256", "name": "listedAt", "type": "uint256"}, {"internalType": "bool", "name": "active", "type": "bool"}], "internalType": "struct CardMarketplace.Listing[]", "name": "", "type": "tuple[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getUserTokens",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_cardId", "type": "string"}],
    "name": "cards",
    "outputs": [{"internalType": "string", "name": "id", "type": "string"}, {"internalType": "uint8", "name": "tier", "type": "uint8"}, {"internalType": "string", "name": "name", "type": "string"}, {"internalType": "string", "name": "anime", "type": "string"}, {"internalType": "string", "name": "power", "type": "string"}, {"internalType": "string", "name": "quote", "type": "string"}, {"internalType": "string", "name": "imageURI", "type": "string"}, {"internalType": "uint256", "name": "price", "type": "uint256"}, {"internalType": "uint256", "name": "maxSupply", "type": "uint256"}, {"internalType": "uint256", "name": "currentSupply", "type": "uint256"}, {"internalType": "bool", "name": "active", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PLATFORM_FEE_BPS",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
]

// Contract address from environment or fallback to localhost for development
const MARKETPLACE_CONTRACT_ADDRESS = import.meta.env.VITE_MARKETPLACE_CONTRACT_AMOY || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

// Platform fee in basis points (2.5%)
const PLATFORM_FEE_BPS = 250

export const useCardMarketplace = () => {
  const { address } = useAccount()
  const [ownedCards, setOwnedCards] = useState([])
  const [userListings, setUserListings] = useState([])
  const [marketplaceListings, setMarketplaceListings] = useState([])
  const [error, setError] = useState(null)
  
  // Refs for cleanup
  const intervalsRef = useRef([])
  const timeoutsRef = useRef([])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      intervalsRef.current.forEach(id => clearInterval(id))
      timeoutsRef.current.forEach(id => clearTimeout(id))
    }
  }, [])

  // Write contract hooks
  const { 
    writeContract: buyCardWrite, 
    isPending: isBuyPending, 
    error: buyError,
    data: buyHash 
  } = useWriteContract()

  const { 
    writeContract: listCardWrite, 
    isPending: isListPending, 
    error: listError,
    data: listHash 
  } = useWriteContract()

  const { 
    writeContract: delistCardWrite, 
    isPending: isDelistPending, 
    error: delistError,
    data: delistHash 
  } = useWriteContract()

  const { 
    writeContract: buyFromMarketplaceWrite, 
    isPending: isMarketplaceBuyPending, 
    error: marketplaceBuyError,
    data: marketplaceBuyHash 
  } = useWriteContract()

  // Wait for transaction receipts
  const { isLoading: isBuyConfirming, isSuccess: isBuySuccess } = useWaitForTransactionReceipt({ hash: buyHash })
  const { isLoading: isListConfirming, isSuccess: isListSuccess } = useWaitForTransactionReceipt({ hash: listHash })
  const { isLoading: isDelistConfirming, isSuccess: isDelistSuccess } = useWaitForTransactionReceipt({ hash: delistHash })
  const { isLoading: isMarketplaceBuyConfirming, isSuccess: isMarketplaceBuySuccess } = useWaitForTransactionReceipt({ hash: marketplaceBuyHash })

  // Read contract hooks
  useReadContract({
    address: MARKETPLACE_CONTRACT_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getAllCards',
    query: {
      enabled: MARKETPLACE_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000'
    }
  })

  useReadContract({
    address: MARKETPLACE_CONTRACT_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getActiveListings',
    query: {
      enabled: MARKETPLACE_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000'
    }
  })

  useReadContract({
    address: MARKETPLACE_CONTRACT_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getUserListings',
    args: [address],
    query: {
      enabled: !!address && MARKETPLACE_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000'
    }
  })

  // Buy card directly from store with dynamic pricing
  const buyCard = useCallback(async (cardId, price) => {
    const card = cardData.find(c => c.id === cardId)
    if (!card) throw new Error('Card not found')

    // Convert price to wei - price is in MATIC (ether units)
    const priceInWei = parseEther(price.toString())

    // Clear previous error
    setError(null)

    // Execute contract buy
    buyCardWrite({
      address: MARKETPLACE_CONTRACT_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'buyCard',
      args: [cardId],
      value: priceInWei
    })

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(() => {
        if (isBuySuccess) {
          clearInterval(intervalId)
          intervalsRef.current = intervalsRef.current.filter(id => id !== intervalId)
          const newCard = { ...card, tokenId: Date.now() }
          setOwnedCards(prev => [...prev, newCard])
          resolve(newCard)
        }
        if (buyError) {
          clearInterval(intervalId)
          intervalsRef.current = intervalsRef.current.filter(id => id !== intervalId)
          setError(buyError)
          reject(buyError)
        }
      }, 1000)
      
      intervalsRef.current.push(intervalId)
      
      // Timeout after 60 seconds
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId)
        intervalsRef.current = intervalsRef.current.filter(id => id !== intervalId)
        timeoutsRef.current = timeoutsRef.current.filter(id => id !== timeoutId)
        const timeoutError = new Error('Transaction timeout')
        setError(timeoutError)
        reject(timeoutError)
      }, 60000)
      
      timeoutsRef.current.push(timeoutId)
    })
  }, [buyCardWrite, isBuySuccess, buyError])

  // List card on marketplace
  const listCard = useCallback(async (tokenId, price) => {
    const card = ownedCards.find(c => c.tokenId === tokenId)
    if (!card) throw new Error('Card not found')

    // Execute contract list
    listCardWrite({
      address: MARKETPLACE_CONTRACT_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'listCard',
      args: [card.id, tokenId, parseEther(price.toString())]
    })

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(() => {
        if (isListSuccess) {
          clearInterval(intervalId)
          intervalsRef.current = intervalsRef.current.filter(id => id !== intervalId)
          const listing = {
            listingId: Date.now(),
            cardId: card.id,
            tokenId,
            seller: address,
            price,
            listedAt: Date.now(),
            active: true
          }
          setUserListings(prev => [...prev, listing])
          resolve(listing)
        }
        if (listError) {
          clearInterval(intervalId)
          intervalsRef.current = intervalsRef.current.filter(id => id !== intervalId)
          reject(listError)
        }
      }, 1000)
      
      intervalsRef.current.push(intervalId)
      
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId)
        intervalsRef.current = intervalsRef.current.filter(id => id !== intervalId)
        reject(new Error('Transaction timeout'))
      }, 60000)
      
      timeoutsRef.current.push(timeoutId)
    })
  }, [listCardWrite, isListSuccess, listError, ownedCards, address])

  // Delist card from marketplace
  const delistCard = useCallback(async (listingId) => {
    delistCardWrite({
      address: MARKETPLACE_CONTRACT_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'delistCard',
      args: [listingId]
    })

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(() => {
        if (isDelistSuccess) {
          clearInterval(intervalId)
          intervalsRef.current = intervalsRef.current.filter(id => id !== intervalId)
          setUserListings(prev => prev.filter(l => l.listingId !== listingId))
          setMarketplaceListings(prev => prev.filter(l => l.listingId !== listingId))
          resolve(true)
        }
        if (delistError) {
          clearInterval(intervalId)
          intervalsRef.current = intervalsRef.current.filter(id => id !== intervalId)
          setError(delistError)
          reject(delistError)
        }
      }, 1000)
      
      intervalsRef.current.push(intervalId)
      
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId)
        intervalsRef.current = intervalsRef.current.filter(id => id !== intervalId)
        timeoutsRef.current = timeoutsRef.current.filter(id => id !== timeoutId)
        const timeoutError = new Error('Transaction timeout')
        setError(timeoutError)
        reject(timeoutError)
      }, 60000)
      
      timeoutsRef.current.push(timeoutId)
    })
  }, [delistCardWrite, isDelistSuccess, delistError])

  // Buy from marketplace
  const buyFromMarketplace = useCallback(async (listingId, price) => {
    buyFromMarketplaceWrite({
      address: MARKETPLACE_CONTRACT_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'buyFromMarketplace',
      args: [listingId],
      value: parseEther(price.toString())
    })

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(() => {
        if (isMarketplaceBuySuccess) {
          clearInterval(intervalId)
          intervalsRef.current = intervalsRef.current.filter(id => id !== intervalId)
          const listing = marketplaceListings.find(l => l.listingId === listingId)
          if (listing) {
            const card = cardData.find(c => c.id === listing.cardId)
            if (card) {
              const newCard = { ...card, tokenId: listing.tokenId }
              setOwnedCards(prev => [...prev, newCard])
              setMarketplaceListings(prev => prev.filter(l => l.listingId !== listingId))
            }
          }
          resolve(true)
        }
        if (marketplaceBuyError) {
          clearInterval(intervalId)
          intervalsRef.current = intervalsRef.current.filter(id => id !== intervalId)
          reject(marketplaceBuyError)
        }
      }, 1000)
      
      intervalsRef.current.push(intervalId)
      
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId)
        reject(new Error('Transaction timeout'))
      }, 60000)
      
      timeoutsRef.current.push(timeoutId)
    })
  }, [buyFromMarketplaceWrite, isMarketplaceBuySuccess, marketplaceBuyError, marketplaceListings])

  // Get all available cards
  const getAllCards = useCallback(() => {
    return cardData
  }, [])

  // Get cards by tier
  const getCardsByTier = useCallback((tier) => {
    return cardData.filter(card => card.tier === tier)
  }, [])

  // Get card by ID
  const getCardById = useCallback((id) => {
    return cardData.find(card => card.id === id)
  }, [])

  // Calculate total price with platform fee
  const calculateTotalPrice = useCallback((price) => {
    const platformFee = (price * PLATFORM_FEE_BPS) / 10000
    return {
      basePrice: price,
      platformFee,
      total: price + platformFee
    }
  }, [])

  // Get user's owned cards
  const getUserCards = useCallback(() => {
    return ownedCards
  }, [ownedCards])

  // Check if user owns a card
  const userOwnsCard = useCallback((cardId) => {
    return ownedCards.some(card => card.id === cardId)
  }, [ownedCards])

  // Remove card from owned (for testing)
  const removeOwnedCard = useCallback((tokenId) => {
    setOwnedCards(prev => prev.filter(c => c.tokenId !== tokenId))
  }, [])

  return {
    // Actions
    buyCard,
    listCard,
    delistCard,
    buyFromMarketplace,
    
    // Data getters
    getAllCards,
    getCardsByTier,
    getCardById,
    getUserCards,
    calculateTotalPrice,
    userOwnsCard,
    removeOwnedCard,
    
    // State
    ownedCards,
    userListings,
    marketplaceListings,
    
    // Loading states
    isPending: isBuyPending || isListPending || isDelistPending || isMarketplaceBuyPending,
    isConfirming: isBuyConfirming || isListConfirming || isDelistConfirming || isMarketplaceBuyConfirming,
    isSuccess: isBuySuccess || isListSuccess || isDelistSuccess || isMarketplaceBuySuccess,
    
    // Errors
    error: error || buyError || listError || delistError || marketplaceBuyError,
    
    // Clear error function
    clearError: () => setError(null),
    
    // Config
    platformFeeBps: PLATFORM_FEE_BPS,
    contractAddress: MARKETPLACE_CONTRACT_ADDRESS,
    cardData
  }
}

export default useCardMarketplace
