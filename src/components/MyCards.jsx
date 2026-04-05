import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAccount } from 'wagmi'
import { 
  Wallet, 
  Package, 
  Tag, 
  X, 
  Check, 
  TrendingUp,
  DollarSign,
  ArrowRight,
  Store
} from '../lib/icons'
import { useCardMarketplace } from '../hooks/useCardMarketplace'

const MyCards = () => {
  const { isConnected } = useAccount()
  const { 
    getUserCards, 
    listCard, 
    delistCard, 
    userListings,
    marketplaceListings
  } = useCardMarketplace()
  
  const [showListModal, setShowListModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [listingPrice, setListingPrice] = useState('')
  const [listingCard, setListingCard] = useState(null)
  const [delistingId, setDelistingId] = useState(null)
  const [activeTab, setActiveTab] = useState('owned') // 'owned' or 'listed'
  
  const ownedCards = getUserCards()
  const myActiveListings = userListings.filter(l => l.active)
  
  // Calculate portfolio value
  const portfolioValue = ownedCards.reduce((total, card) => {
    return total + (card.price || 25)
  }, 0)
  
  const handleListClick = (card) => {
    setSelectedCard(card)
    setListingPrice(card.price?.toString() || '25')
    setShowListModal(true)
  }
  
  const handleListSubmit = async () => {
    if (!selectedCard || !listingPrice) return
    
    setListingCard(selectedCard.tokenId)
    try {
      await listCard(selectedCard.tokenId, parseFloat(listingPrice))
      setShowListModal(false)
      setSelectedCard(null)
      setListingPrice('')
    } catch (error) {
      console.error('Listing failed:', error)
    }
    setListingCard(null)
  }
  
  const handleDelist = async (listingId) => {
    setDelistingId(listingId)
    try {
      await delistCard(listingId)
    } catch (error) {
      console.error('Delist failed:', error)
    }
    setDelistingId(null)
  }
  
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mb-4">
          <Wallet className="w-8 h-8 text-white/40" />
        </div>
        <h3 className="font-2 text-xl text-white mb-2">Connect Your Wallet</h3>
        <p className="text-white/50 text-sm text-center max-w-md">
          Connect your wallet to view your card collection and list cards for sale on the marketplace.
        </p>
      </div>
    )
  }
  
  if (ownedCards.length === 0 && myActiveListings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-white/40" />
        </div>
        <h3 className="font-2 text-xl text-white mb-2">No Cards Yet</h3>
        <p className="text-white/50 text-sm text-center max-w-md mb-6">
          You don't own any cards yet. Visit the Card Store to purchase your first collectibles!
        </p>
        <a 
          href="/collect" 
          className="flex items-center gap-2 px-6 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-lg transition-all"
        >
          <Store className="w-4 h-4" />
          <span>Browse Cards</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header with Portfolio Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-2 text-2xl text-white mb-1">My Collection</h2>
          <p className="text-white/40 text-sm">
            {ownedCards.length} cards owned • {myActiveListings.length} listed for sale
          </p>
        </div>
        
        {/* Portfolio Value */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08]">
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Portfolio Value</p>
            <p className="font-2 text-xl text-white">{portfolioValue.toFixed(2)} MATIC</p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/[0.08]">
        <button
          onClick={() => setActiveTab('owned')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'owned' ? 'text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          <span className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Owned Cards ({ownedCards.length})
          </span>
          {activeTab === 'owned' && (
            <motion.div 
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('listed')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'listed' ? 'text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          <span className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            My Listings ({myActiveListings.length})
          </span>
          {activeTab === 'listed' && (
            <motion.div 
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
            />
          )}
        </button>
      </div>
      
      {/* Owned Cards Grid */}
      {activeTab === 'owned' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {ownedCards.map((card, index) => (
              <motion.div
                key={card.tokenId}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group relative rounded-2xl border border-white/[0.08] overflow-hidden bg-[#0a0a0a] h-[380px]"
              >
                {/* Card Image */}
                <div className="relative h-[55%] overflow-hidden">
                  <img 
                    src={card.image} 
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
                </div>
                
                {/* Card Info */}
                <div className="h-[45%] p-4 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-2 text-lg text-white">{card.name}</h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider">{card.anime}</p>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded bg-white/[0.06] text-white/70 uppercase">
                      {card.tier}
                    </span>
                  </div>
                  
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-white/50">Current Value</span>
                      <span className="font-2 text-lg text-white">{card.price || 25} MATIC</span>
                    </div>
                    
                    {/* Sell Button */}
                    <motion.button
                      onClick={() => handleListClick(card)}
                      disabled={listingCard === card.tokenId}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full flex items-center justify-center gap-2 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] bg-white/[0.05] hover:bg-white/[0.1] text-white border-t border-white/[0.08] transition-all"
                    >
                      {listingCard === card.tokenId ? (
                        <>
                          <motion.div 
                            className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          <span>Listing...</span>
                        </>
                      ) : (
                        <>
                          <Tag className="w-3.5 h-3.5" />
                          <span>List for Sale</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Listed Cards */}
      {activeTab === 'listed' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {myActiveListings.map((listing, index) => {
              const card = ownedCards.find(c => c.tokenId === listing.tokenId) || 
                marketplaceListings.find(l => l.listingId === listing.listingId)
              
              if (!card) return null
              
              return (
                <motion.div
                  key={listing.listingId}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative rounded-2xl border border-white/[0.08] overflow-hidden bg-[#0a0a0a] h-[380px]"
                >
                  {/* Listed Badge */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-green-400 font-medium">Listed</span>
                  </div>
                  
                  {/* Card Image */}
                  <div className="relative h-[55%] overflow-hidden">
                    <img 
                      src={card.image} 
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
                  </div>
                  
                  {/* Listing Info */}
                  <div className="h-[45%] p-4 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-2 text-lg text-white">{card.name}</h3>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider">{card.anime}</p>
                      </div>
                    </div>
                    
                    <div className="mt-auto space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-white/50">Listed Price</span>
                        <span className="font-2 text-lg text-green-400">{listing.price} MATIC</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-[10px] text-white/40">
                        <span>Listed {new Date(listing.listedAt).toLocaleDateString()}</span>
                        <span>ID: #{listing.listingId}</span>
                      </div>
                      
                      {/* Delist Button */}
                      <motion.button
                        onClick={() => handleDelist(listing.listingId)}
                        disabled={delistingId === listing.listingId}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full flex items-center justify-center gap-2 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] bg-red-500/10 hover:bg-red-500/20 text-red-400 border-t border-red-500/20 transition-all"
                      >
                        {delistingId === listing.listingId ? (
                          <>
                            <motion.div 
                              className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                            <span>Delisting...</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            <span>Remove Listing</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
      
      {/* List Modal */}
      <AnimatePresence>
        {showListModal && selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={() => setShowListModal(false)} 
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-gradient-to-b from-[#18181b] to-[#0c0c0e] rounded-3xl border border-white/[0.08] p-6 max-w-md w-full"
            >
              <button 
                onClick={() => setShowListModal(false)}
                className="absolute top-4 right-4 p-1 text-white/30 hover:text-white/60"
              >
                <X className="w-4 h-4" />
              </button>
              
              <h3 className="font-2 text-xl text-white mb-4">List Card for Sale</h3>
              
              {/* Card Preview */}
              <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl mb-6">
                <img 
                  src={selectedCard.image} 
                  alt={selectedCard.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <p className="text-white font-medium">{selectedCard.name}</p>
                  <p className="text-[10px] text-white/40 uppercase">{selectedCard.tier}</p>
                  <p className="text-[11px] text-white/60 mt-1">
                    Current value: {selectedCard.price || 25} MATIC
                  </p>
                </div>
              </div>
              
              {/* Price Input */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-[11px] text-white/50 uppercase tracking-wider mb-2 block">
                    Listing Price (MATIC)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="number"
                      value={listingPrice}
                      onChange={(e) => setListingPrice(e.target.value)}
                      placeholder="25"
                      min="10"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-10 py-3 text-white placeholder-white/30 focus:border-white/20 focus:outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/40">
                      MATIC
                    </span>
                  </div>
                </div>
                
                {/* Fee Info */}
                <div className="p-3 bg-white/[0.03] rounded-lg space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/40">Listing Price</span>
                    <span className="text-white">{listingPrice || 0} MATIC</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/40">Platform Fee (2.5%)</span>
                    <span className="text-white/60">
                      -{((parseFloat(listingPrice || 0) * 0.025)).toFixed(2)} MATIC
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] pt-2 border-t border-white/[0.08]">
                    <span className="text-white">You Receive</span>
                    <span className="text-green-400 font-medium">
                      {(parseFloat(listingPrice || 0) * 0.975).toFixed(2)} MATIC
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowListModal(false)}
                  className="flex-1 py-3 text-sm font-medium text-white/60 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] rounded-lg transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleListSubmit}
                  disabled={!listingPrice || parseFloat(listingPrice) < 10}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex-[2] py-3 text-sm font-semibold text-white bg-white/[0.1] hover:bg-white/[0.15] rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Tag className="w-4 h-4" />
                  List for Sale
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MyCards
