import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAccount } from 'wagmi'
import { ShoppingCart, Store, Search, X, Clock, User, Wallet } from '../lib/icons'
import { useCardMarketplace } from '../hooks/useCardMarketplace'

const tierIcons = {
  common: { icon: '★', color: '#64748B', bg: 'bg-slate-500/20' },
  rare: { icon: '◆', color: '#3B82F6', bg: 'bg-blue-500/20' },
  epic: { icon: '⚡', color: '#A855F7', bg: 'bg-purple-500/20' },
  legendary: { icon: '👑', color: '#F59E0B', bg: 'bg-amber-500/20' }
}

const CardMarketplace = () => {
  const { isConnected } = useAccount()
  const { marketplaceListings, buyFromMarketplace, calculateTotalPrice } = useCardMarketplace()
  const [searchTerm, setSearchTerm] = useState('')
  const [buyingListing, setBuyingListing] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 60_000)
    return () => clearInterval(timer)
  }, [])

  // Filter listings
  const filteredListings = marketplaceListings.filter(listing => {
    const matchesSearch = listing.cardId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.seller.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleBuyClick = (listing) => {
    if (!isConnected) return
    setSelectedListing(listing)
    setShowConfirmModal(true)
  }

  const handleConfirmBuy = async () => {
    if (!selectedListing) return
    
    setBuyingListing(selectedListing.listingId)
    setShowConfirmModal(false)
    
    try {
      await buyFromMarketplace(selectedListing.listingId)
    } catch (error) {
      console.error('Purchase failed:', error)
    }
    
    setBuyingListing(null)
    setSelectedListing(null)
  }

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((nowMs - timestamp) / 1000)
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-2 text-2xl text-white mb-1">Marketplace</h2>
          <p className="text-white/40 text-sm">Buy cards from other collectors</p>
        </div>
        
        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48 md:w-64 bg-white/[0.03] text-white text-sm pl-10 pr-4 py-2 rounded-lg border border-white/[0.08] focus:border-white/20 focus:outline-none placeholder:text-white/30"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Active Listings</p>
          <p className="font-2 text-2xl text-white">{marketplaceListings.length}</p>
        </div>
        <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Floor Price</p>
          <p className="font-2 text-2xl text-white">
            {marketplaceListings.length > 0 
              ? Math.min(...marketplaceListings.map(l => l.price)) 
              : 0} MATIC
          </p>
        </div>
        <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">24h Volume</p>
          <p className="font-2 text-2xl text-white">0 MATIC</p>
        </div>
      </div>

      {/* Listings */}
      {marketplaceListings.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="font-2 text-lg text-white mb-2">No Active Listings</h3>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            The marketplace is currently empty. Be the first to list a card from your collection!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredListings.map((listing, index) => {
              const isBuying = buyingListing === listing.listingId
              const priceBreakdown = calculateTotalPrice(listing.price)
              
              return (
                <motion.div
                  key={listing.listingId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-all"
                >
                  {/* Card Preview */}
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-white/[0.08] to-white/[0.02] flex items-center justify-center text-2xl">
                    {tierIcons.common.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-2 text-white truncate">Card #{listing.cardId}</h4>
                      <span className="px-2 py-0.5 rounded text-[9px] bg-white/[0.08] text-white/50 uppercase">
                        Token #{listing.tokenId}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-white/40">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {formatAddress(listing.seller)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(listing.listedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-2 text-lg text-white">{listing.price} MATIC</p>
                    <p className="text-[10px] text-white/40">
                      + {priceBreakdown.platformFee.toFixed(3)} fee
                    </p>
                  </div>

                  {/* Buy Button */}
                  <motion.button
                    onClick={() => handleBuyClick(listing)}
                    disabled={!isConnected || isBuying}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider
                      transition-all duration-200
                      ${!isConnected 
                        ? 'bg-white/[0.03] text-white/30 border border-white/[0.08] cursor-not-allowed'
                        : isBuying
                          ? 'bg-white/[0.1] text-white/60 cursor-wait'
                          : 'bg-blue-500 text-white hover:bg-blue-400'
                      }
                    `}
                  >
                    {isBuying ? (
                      <>
                        <motion.div
                          className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        <span>Buying...</span>
                      </>
                    ) : !isConnected ? (
                      <>
                        <Wallet className="w-3.5 h-3.5" />
                        <span>Connect</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Buy</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Confirm Purchase Modal */}
      <AnimatePresence>
        {showConfirmModal && selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-gradient-to-b from-[#18181b] to-[#0c0c0e] rounded-3xl border border-white/[0.08] p-6 max-w-sm w-full"
            >
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="absolute top-4 right-4 p-1 text-white/30 hover:text-white/60"
              >
                <X className="w-4 h-4" />
              </button>
              
              <h3 className="font-2 text-xl text-white mb-4">Confirm Purchase</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/[0.03] rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-white/[0.08] to-white/[0.02] flex items-center justify-center text-xl">
                      {tierIcons.common.icon}
                    </div>
                    <div>
                      <p className="text-white font-medium">Card #{selectedListing.cardId}</p>
                      <p className="text-[10px] text-white/40">Token #{selectedListing.tokenId}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-white/60">
                      <span>Price</span>
                      <span>{selectedListing.price} MATIC</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Platform Fee (2.5%)</span>
                      <span>{calculateTotalPrice(selectedListing.price).platformFee.toFixed(4)} MATIC</span>
                    </div>
                    <div className="h-px bg-white/[0.08] my-2" />
                    <div className="flex justify-between text-white font-medium">
                      <span>Total</span>
                      <span>{calculateTotalPrice(selectedListing.price).total.toFixed(4)} MATIC</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-white/[0.05] text-white border border-white/[0.1] hover:bg-white/[0.08] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBuy}
                    className="flex-1 py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-blue-500 text-white hover:bg-blue-400 transition-all"
                  >
                    Confirm Purchase
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CardMarketplace
