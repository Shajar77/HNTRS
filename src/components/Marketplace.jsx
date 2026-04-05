import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAccount } from 'wagmi'
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  ExternalLink,
  User,
  Clock,
  Tag,
  X,
  Check,
  ArrowRight,
  TrendingUp,
  TrendingDown
} from '../lib/icons'
import { useCardMarketplace } from '../hooks/useCardMarketplace'

const Marketplace = () => {
  const { isConnected, address } = useAccount()
  const { 
    marketplaceListings,
    buyFromMarketplace,
    getAllCards
  } = useCardMarketplace()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTier, setSelectedTier] = useState('all')
  const [sortBy, setSortBy] = useState('newest') // 'newest', 'price_asc', 'price_desc'
  const [buyingListing, setBuyingListing] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)
  
  const allCards = getAllCards()
  
  // Filter and sort listings
  const filteredListings = marketplaceListings
    .filter(listing => listing.active)
    .filter(listing => {
      const card = allCards.find(c => c.id === listing.cardId)
      if (!card) return false
      
      // Search filter
      if (searchQuery && !card.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !card.anime.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      // Tier filter
      if (selectedTier !== 'all' && card.tier !== selectedTier) {
        return false
      }
      
      // Don't show own listings
      if (listing.seller === address) return false
      
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price
        case 'price_desc':
          return b.price - a.price
        case 'newest':
        default:
          return b.listedAt - a.listedAt
      }
    })
  
  const handleBuyClick = (listing) => {
    setSelectedListing(listing)
    setShowConfirmModal(true)
  }
  
  const handleConfirmBuy = async () => {
    if (!selectedListing) return
    
    setBuyingListing(selectedListing.listingId)
    try {
      await buyFromMarketplace(selectedListing.listingId, selectedListing.price)
      setShowConfirmModal(false)
      setSelectedListing(null)
    } catch (error) {
      console.error('Purchase failed:', error)
    }
    setBuyingListing(null)
  }
  
  // Calculate stats
  const totalListings = marketplaceListings.filter(l => l.active).length
  const avgPrice = marketplaceListings.length > 0
    ? (marketplaceListings.reduce((sum, l) => sum + l.price, 0) / marketplaceListings.length).toFixed(2)
    : 0
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-2 text-2xl text-white mb-1">Marketplace</h2>
          <p className="text-white/40 text-sm">
            {totalListings} cards listed • Avg. price {avgPrice} MATIC
          </p>
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08]">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-green-400" />
              <span className="text-[10px] text-white/60">Active Listings</span>
            </div>
            <p className="font-2 text-lg text-white">{totalListings}</p>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards or anime..."
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-white/20 focus:outline-none"
          />
        </div>
        
        {/* Tier Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="appearance-none bg-white/[0.03] border border-white/[0.08] rounded-lg pl-10 pr-10 py-2.5 text-sm text-white focus:border-white/20 focus:outline-none cursor-pointer min-w-[140px]"
          >
            <option value="all" className="bg-[#0a0a0a]">All Tiers</option>
            <option value="common" className="bg-[#0a0a0a]">Common</option>
            <option value="rare" className="bg-[#0a0a0a]">Rare</option>
            <option value="epic" className="bg-[#0a0a0a]">Epic</option>
            <option value="legendary" className="bg-[#0a0a0a]">Legendary</option>
          </select>
        </div>
        
        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 pr-10 py-2.5 text-sm text-white focus:border-white/20 focus:outline-none cursor-pointer min-w-[140px]"
          >
            <option value="newest" className="bg-[#0a0a0a]">Newest First</option>
            <option value="price_asc" className="bg-[#0a0a0a]">Price: Low to High</option>
            <option value="price_desc" className="bg-[#0a0a0a]">Price: High to Low</option>
          </select>
        </div>
      </div>
      
      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mb-4">
            <Tag className="w-8 h-8 text-white/40" />
          </div>
          <h3 className="font-2 text-xl text-white mb-2">No Listings Found</h3>
          <p className="text-white/50 text-sm text-center max-w-md">
            {searchQuery || selectedTier !== 'all' 
              ? 'Try adjusting your filters to see more results.'
              : 'No cards are currently listed on the marketplace. Be the first to list a card!'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredListings.map((listing, index) => {
              const card = allCards.find(c => c.id === listing.cardId)
              if (!card) return null
              
              // Character-specific color themes
              const cardThemes = {
                'Killua': { primary: '#94A3B8', accent: '#E2E8F0', bg: '#13171a' },
                'Zenitsu': { primary: '#FDE047', accent: '#FEF08A', bg: '#1a1805' },
                'Bakugo': { primary: '#FB923C', accent: '#FED7AA', bg: '#1a1205' },
                'Nobara': { primary: '#EC4899', accent: '#F9A8D4', bg: '#1a0a14' },
                'Deku': { primary: '#3B82F6', accent: '#93C5FD', bg: '#0a121a' },
                'Itachi': { primary: '#EF4444', accent: '#FCA5A5', bg: '#1a0a0a' },
                'Tanjiro': { primary: '#60A5FA', accent: '#BFDBFE', bg: '#0a141a' },
                'Levi': { primary: '#FFFFFF', accent: '#E5E5E5', bg: '#0d0d0d' },
                'Gojo': { primary: '#3B82F6', accent: '#60A5FA', bg: '#0a121a' },
                'Goku': { primary: '#F59E0B', accent: '#FCD34D', bg: '#1a1505' }
              }
              const theme = cardThemes[card.name] || { primary: '#888', accent: '#aaa', bg: '#0a0a0a' }
              
              const isBuying = buyingListing === listing.listingId
              
              return (
                <motion.div
                  key={listing.listingId}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.03 }}
                  className="group relative rounded-2xl border border-white/[0.08] overflow-hidden hover:border-white/[0.15] transition-all bg-[#0a0a0a]"
                >
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30">
                    <Tag className="w-3 h-3 text-green-400" />
                    <span className="text-sm font-semibold text-green-400">{listing.price} MATIC</span>
                  </div>
                  
                  {/* Card Image */}
                  <div className="relative h-[200px] overflow-hidden">
                    <img 
                      src={card.image} 
                      alt={card.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                  </div>
                  
                  {/* Card Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-2 text-lg text-white">{card.name}</h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider">{card.anime}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-[10px] px-2 py-1 rounded border"
                        style={{ 
                          background: `${theme.primary}20`, 
                          color: theme.accent,
                          borderColor: `${theme.primary}40`
                        }}
                      >
                        {card.tier}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-white/40">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(listing.listedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {/* Seller Info */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                      <div className="w-6 h-6 rounded-full bg-white/[0.1] flex items-center justify-center">
                        <User className="w-3 h-3 text-white/60" />
                      </div>
                      <span className="text-[11px] text-white/50">
                        {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                      </span>
                    </div>
                    
                    {/* Buy Button */}
                    <motion.button
                      onClick={() => handleBuyClick(listing)}
                      disabled={!isConnected || isBuying}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full flex items-center justify-center gap-2 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] bg-white/[0.05] hover:bg-white/[0.1] disabled:bg-white/[0.02] disabled:text-white/30 text-white border-t border-white/[0.08] transition-all"
                    >
                      {isBuying ? (
                        <>
                          <motion.div 
                            className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          <span>Processing...</span>
                        </>
                      ) : !isConnected ? (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Connect to Buy</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Buy Now</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
      
      {/* Buy Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={() => setShowConfirmModal(false)} 
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-gradient-to-b from-[#18181b] to-[#0c0c0e] rounded-3xl border border-white/[0.08] p-6 max-w-md w-full"
            >
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="absolute top-4 right-4 p-1 text-white/30 hover:text-white/60"
              >
                <X className="w-4 h-4" />
              </button>
              
              <h3 className="font-2 text-xl text-white mb-4">Confirm Purchase</h3>
              
              {(() => {
                const card = allCards.find(c => c.id === selectedListing.cardId)
                if (!card) return null
                
                return (
                  <>
                    {/* Card Preview */}
                    <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl mb-6">
                      <img 
                        src={card.image} 
                        alt={card.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <p className="text-white font-medium">{card.name}</p>
                        <p className="text-[10px] text-white/40 uppercase">{card.tier}</p>
                        <p className="font-2 text-lg text-green-400 mt-1">{selectedListing.price} MATIC</p>
                      </div>
                    </div>
                    
                    {/* Purchase Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Card Price</span>
                        <span className="text-white">{selectedListing.price} MATIC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Platform Fee (2.5%)</span>
                        <span className="text-white/60">{(selectedListing.price * 0.025).toFixed(2)} MATIC</span>
                      </div>
                      <div className="flex justify-between text-sm pt-3 border-t border-white/[0.08]">
                        <span className="text-white font-medium">Total</span>
                        <span className="font-2 text-lg text-white">{(selectedListing.price * 1.025).toFixed(2)} MATIC</span>
                      </div>
                    </div>
                    
                    {/* Seller Info */}
                    <div className="p-3 bg-white/[0.03] rounded-lg mb-6">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-white/40" />
                        <span className="text-[11px] text-white/50">Seller:</span>
                        <span className="text-[11px] text-white font-medium">
                          {selectedListing.seller.slice(0, 8)}...{selectedListing.seller.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </>
                )
              })()}
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 text-sm font-medium text-white/60 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] rounded-lg transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleConfirmBuy}
                  disabled={buyingListing === selectedListing?.listingId}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex-[2] py-3 text-sm font-semibold text-white bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {buyingListing === selectedListing?.listingId ? (
                    <>
                      <motion.div 
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Confirm Purchase</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Marketplace
