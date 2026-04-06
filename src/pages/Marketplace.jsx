import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { Link } from 'react-router-dom'
import WalletConnect from '../components/WalletConnect'
import { useHNTRSMarketplace } from '../hooks/useHNTRSContract'

const Marketplace = () => {
  const { isConnected } = useAccount()
  const { useActiveListings, buyFixedPrice, placeBid, isPending } = useHNTRSMarketplace()

  // Mouse glow effect refs
  const spotRef = useRef(null)
  const sectionRef = useRef(null)
  const rectRef = useRef(null)
  const rafRef = useRef(null)
  const pointRef = useRef({ x: 0, y: 0 })
  const [isInteractive, setIsInteractive] = useState(false)

  useEffect(() => {
    const pointerMedia = window.matchMedia('(pointer: fine)')
    const reduceMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateEnabled = () => setIsInteractive(pointerMedia.matches && !reduceMotionMedia.matches)
    updateEnabled()
    pointerMedia.addEventListener('change', updateEnabled)
    reduceMotionMedia.addEventListener('change', updateEnabled)
    return () => {
      pointerMedia.removeEventListener('change', updateEnabled)
      reduceMotionMedia.removeEventListener('change', updateEnabled)
    }
  }, [])

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  const updateRect = useCallback(() => {
    if (!sectionRef.current) return
    rectRef.current = sectionRef.current.getBoundingClientRect()
  }, [])

  useEffect(() => {
    if (!isInteractive) return
    updateRect()
    window.addEventListener('resize', updateRect, { passive: true })
    window.addEventListener('scroll', updateRect, { passive: true })
    return () => {
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect)
    }
  }, [isInteractive, updateRect])

  const applyTransform = useCallback(() => {
    rafRef.current = null
    if (!spotRef.current || !rectRef.current) return
    const x = pointRef.current.x - rectRef.current.left - 150
    const y = pointRef.current.y - rectRef.current.top - 150
    spotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (!isInteractive) return
    pointRef.current = { x: e.clientX, y: e.clientY }
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(applyTransform)
  }, [applyTransform, isInteractive])

  const handlePointerEnter = useCallback(() => { if (isInteractive) updateRect() }, [isInteractive, updateRect])
  const handlePointerLeave = useCallback(() => { if (spotRef.current) spotRef.current.style.transform = 'translate3d(calc(50vw - 150px), calc(50vh - 150px), 0)' }, [])

  const [selectedListing, setSelectedListing] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [bidAmount, setBidAmount] = useState('')

  const { data: listingsData, isLoading, refetch } = useActiveListings(0, 50)
  const listings = listingsData || []
  
  const filteredListings = listings.filter((listing) => {
    if (filter === 'all') return true
    if (filter === 'fixed') return listing.listingType === 0
    if (filter === 'auction') return listing.listingType === 1
    return true
  })

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return Number(a.price) - Number(b.price)
      case 'price-high':
        return Number(b.price) - Number(a.price)
      default:
        return Number(b.startTime) - Number(a.startTime)
    }
  })

  const formatPrice = (price) => parseFloat(formatEther(price)).toFixed(4)

  const getTimeRemaining = (endTime) => {
    const now = Math.floor(Date.now() / 1000)
    const remaining = Number(endTime) - now
    if (remaining <= 0) return 'Ended'
    const days = Math.floor(remaining / 86400)
    const hours = Math.floor((remaining % 86400) / 3600)
    const minutes = Math.floor((remaining % 3600) / 60)
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const handleBuy = async (listing) => {
    if (!isConnected) return
    try {
      await buyFixedPrice(listing.listingId, listing.price)
      setSelectedListing(null)
      refetch()
    } catch (err) {
      console.error('Purchase failed:', err)
    }
  }

  const handleBid = async (listing) => {
    if (!isConnected || !bidAmount) return
    try {
      const bidWei = BigInt(Math.floor(parseFloat(bidAmount) * 1e18))
      await placeBid(listing.listingId, bidWei)
      setSelectedListing(null)
      setBidAmount('')
      refetch()
    } catch (err) {
      console.error('Bid failed:', err)
    }
  }

  const NFTCard = ({ listing, index }) => {
    const isAuction = listing.listingType === 1
    const isEnded = Number(listing.endTime) < Math.floor(Date.now() / 1000)

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="group cursor-pointer"
        onClick={() => setSelectedListing(listing)}
      >
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white/60 backdrop-blur-sm border border-black/[0.06] overflow-hidden shadow-[0_4px_20px_-5px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-12px_rgba(222,81,39,0.15)] transition-all duration-500">
          {/* Image */}
          <div className="aspect-[4/5] relative overflow-hidden bg-black/[0.02]">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 3 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 border border-black/8 flex items-center justify-center group-hover:border-[#DE5127]/25 transition-all duration-500">
                <svg className="w-8 h-8 text-black/15 group-hover:text-[#DE5127]/40 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </motion.div>
            </div>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <span className={`px-3 py-1.5 text-[9px] font-gs font-bold uppercase tracking-wider ${isAuction ? 'bg-black text-white' : 'bg-[#DE5127] text-white'}`}>
                {isAuction ? 'Auction' : 'Fixed'}
              </span>
              {isAuction && (
                <span className={`px-3 py-1.5 text-[9px] font-gs font-bold ${isEnded ? 'bg-red-500 text-white' : 'bg-white/95 text-black border border-black/[0.08]'}`}>
                  {getTimeRemaining(listing.endTime)}
                </span>
              )}
            </div>

            {/* Hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#DE5127]/40 via-[#DE5127]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-gs text-[9px] uppercase tracking-[0.3em] text-black/30 mb-1">Token ID</p>
                <h3 className="font-2 text-2xl text-black tracking-tight">#{listing.tokenId.toString()}</h3>
              </div>
              <div className="text-right">
                <p className="font-gs text-[9px] uppercase tracking-[0.3em] text-black/30 mb-1">{isAuction ? 'Current Bid' : 'Price'}</p>
                <p className="font-2 text-2xl text-black">{isAuction ? formatPrice(listing.highestBid || listing.price) : formatPrice(listing.price)}</p>
                <p className="font-gs text-[9px] uppercase tracking-[0.15em] text-black/35">MATIC</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-black/[0.04] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="font-mono text-[10px] text-black/40">{listing.seller.slice(0, 4)}...{listing.seller.slice(-4)}</span>
              </div>
              <motion.div 
                whileHover={{ scale: 1.1, x: 2 }} 
                className="w-9 h-9 bg-black/[0.03] flex items-center justify-center group-hover:bg-[#DE5127] transition-all duration-300">
                <svg className="w-4 h-4 text-black/25 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  const PurchaseModal = ({ listing, onClose }) => {
    if (!listing) return null
    const isAuction = listing.listingType === 1
    const isEnded = Number(listing.endTime) < Math.floor(Date.now() / 1000)

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-[#DE5127]/5 to-[#FF8F6B]/5 border-b border-black/5 flex items-center justify-between">
            <div>
              <span className="text-xs font-gs font-bold uppercase tracking-[0.25em] text-black/40">NFT</span>
              <h2 className="text-3xl font-bold text-black tracking-tight">
                #{listing.tokenId.toString()}
              </h2>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose} 
              className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Image */}
            <div className="aspect-square bg-gradient-to-br from-black/[0.02] to-black/[0.05] rounded-2xl mb-6 flex items-center justify-center border border-black/5">
              <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center">
                <svg className="w-18 h-18 text-black/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between p-4 bg-black/[0.02] rounded-xl"
              >
                <span className="text-sm font-gs font-bold uppercase tracking-[0.25em] text-black/40">Seller</span>
                <span className="text-sm text-black font-mono">
                  {listing.seller.slice(0, 8)}...{listing.seller.slice(-6)}
                </span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className="flex justify-between p-4 bg-black/[0.02] rounded-xl"
              >
                <span className="text-sm font-gs font-bold uppercase tracking-[0.25em] text-black/40">Type</span>
                <span className={`text-sm font-bold ${isAuction ? 'text-black' : 'text-[#DE5127]'}`}>
                  {isAuction ? 'Auction' : 'Fixed Price'}
                </span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-between p-4 bg-gradient-to-r from-[#DE5127]/5 to-[#FF8F6B]/5 rounded-xl border border-[#DE5127]/10"
              >
                <span className="text-sm font-gs font-bold uppercase tracking-[0.25em] text-[#DE5127]">
                  {isAuction ? 'Current Bid' : 'Price'}
                </span>
                <span className="text-2xl font-bold text-black">
                  {isAuction ? formatPrice(listing.highestBid || listing.price) : formatPrice(listing.price)} MATIC
                </span>
              </motion.div>
              {isAuction && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex justify-between p-4 bg-black/[0.02] rounded-xl"
                >
                  <span className="text-sm font-gs font-bold uppercase tracking-[0.25em] text-black/40">Time Left</span>
                  <span className={`text-sm font-bold ${isEnded ? 'text-red-500' : 'text-black'}`}>
                    {getTimeRemaining(listing.endTime)}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            {!isConnected ? (
              <div className="text-center py-6 bg-black/[0.02] rounded-xl">
                <p className="text-sm text-black/60 mb-4 font-gs">Connect wallet to continue</p>
                <WalletConnect />
              </div>
            ) : isAuction && !isEnded ? (
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Enter bid amount (MATIC)"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full bg-white border-2 border-black/10 rounded-xl px-5 py-4 text-black text-lg placeholder:text-black/30 focus:outline-none focus:border-[#DE5127] transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBid(listing)}
                  disabled={isPending || !bidAmount}
                  className="w-full py-4 bg-gradient-to-r from-[#DE5127] to-[#FF8F6B] text-white font-gs font-bold text-xs uppercase tracking-[0.25em] rounded-full hover:from-black hover:to-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-[#DE5127]/30"
                >
                  {isPending ? 'Placing Bid...' : 'Place Bid'}
                </motion.button>
              </div>
            ) : !isAuction ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBuy(listing)}
                disabled={isPending}
                className="w-full py-4 bg-black text-white font-gs font-bold text-xs uppercase tracking-[0.25em] rounded-full hover:bg-gradient-to-r hover:from-[#DE5127] hover:to-[#FF8F6B] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-black/20"
              >
                {isPending ? 'Processing...' : `Buy for ${formatPrice(listing.price)} MATIC`}
              </motion.button>
            ) : (
              <p className="text-center text-black/60 font-gs py-6 bg-black/[0.02] rounded-xl">Auction has ended</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <section ref={sectionRef} onPointerMove={handlePointerMove} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}
      className='relative bg-[#F1F1F1] overflow-hidden selection:bg-[#DE5127] selection:text-white min-h-screen'>
      {/* Enhanced Grid background */}
      <div className='absolute inset-0 pointer-events-none opacity-[0.12]'
        style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
      
      {/* Decorative elements */}
      <div className='absolute top-40 right-20 w-40 h-40 border border-[#DE5127]/10 rounded-full pointer-events-none'></div>
      <div className='absolute bottom-40 left-20 w-24 h-24 border border-black/5 rotate-45 pointer-events-none'></div>
      
      {/* Mouse glow */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        <div ref={spotRef} className='absolute transition-transform duration-500 ease-out' style={{ top: 0, left: 0, transform: 'translate3d(calc(50vw - 150px), calc(50vh - 150px), 0)', willChange: 'transform' }}>
          <div className='w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] rounded-full border border-[#DE5127]/30 flex items-center justify-center'>
            <div className='w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] rounded-full' style={{ background: 'radial-gradient(circle, rgba(222,81,39,0.2) 0%, rgba(222,81,39,0.06) 50%, transparent 70%)' }}></div>
          </div>
        </div>
      </div>

      <div className='relative z-10 px-8 sm:px-12 md:px-20 lg:px-28 pt-28 sm:pt-36 pb-10 sm:pb-14 min-h-screen'>
        {/* Enhanced Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="mb-20 sm:mb-24">
          <div className="flex items-center gap-4 mb-8">
            <span className="w-12 h-[2px] bg-[#DE5127]"></span>
            <span className="font-gs text-[10px] sm:text-[11px] text-[#DE5127] font-bold tracking-[0.4em] uppercase">Discover</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className='font-2 text-[clamp(2.5rem,12vw,6rem)] sm:text-[clamp(3rem,10vw,5rem)] md:text-[clamp(2.5rem,7vw,4rem)] lg:text-[clamp(2rem,5vw,3.5rem)] text-black leading-[0.85] tracking-[-0.02em] text-safe'>Market</h1>
              <div className="flex items-center gap-4 mt-6">
                <span className='w-16 h-px bg-black/20'></span>
                <span className='font-gs text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.4em] text-black/40'>Collect unique sports NFTs</span>
              </div>
            </div>
            
            {/* Live indicator */}
            <div className="flex items-center gap-3 bg-black/[0.03] px-5 py-3">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-gs text-[10px] uppercase tracking-[0.2em] text-black/50">{listings.length} Items Live</span>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-16"
        >
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 bg-black/[0.03] p-2">
            {[
              { id: 'all', label: 'All Items', count: listings.length },
              { id: 'fixed', label: 'Fixed Price' },
              { id: 'auction', label: 'Auctions' },
            ].map((f) => (
              <motion.button
                key={f.id}
                onClick={() => setFilter(f.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 font-gs text-[9px] sm:text-[10px] uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-2 ${
                  filter === f.id
                    ? 'bg-[#DE5127] text-white shadow-md shadow-[#DE5127]/20'
                    : 'text-black/50 hover:text-black hover:bg-black/[0.02]'
                }`}
              >
                {f.label}
                {f.count && <span className="text-[9px] opacity-70">({f.count})</span>}
              </motion.button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent border border-black/[0.08] px-5 py-3 pr-12 font-gs text-[10px] uppercase tracking-widest text-black focus:outline-none focus:border-[#DE5127] transition-colors cursor-pointer hover:bg-black/[0.01]"
              >
                <option value="recent">Recently Listed</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 sm:w-20 sm:h-20 border-2 sm:border-3 border-black/10 border-t-[#DE5127] rounded-full mx-auto mb-6"
              />
              <p className="text-sm font-gs text-black/40 uppercase tracking-widest">Loading...</p>
            </div>
          </div>
        ) : sortedListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {sortedListings.map((listing, index) => (
              <NFTCard key={listing.listingId.toString() + index} listing={listing} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center py-32 sm:py-40"
          >
            <h3 className="font-2 text-3xl sm:text-4xl lg:text-5xl text-black tracking-tight mb-3">
              Market is <span className="text-[#DE5127]">empty</span>
            </h3>
            <p className="font-gs text-sm sm:text-base text-black/40 mb-8 text-center">
              Be the first to list an NFT
            </p>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/mint"
                className="group relative inline-flex items-center px-8 py-3 bg-[#DE5127] text-white font-gs text-sm font-medium overflow-hidden shadow-[0_8px_30px_-10px_rgba(222,81,39,0.4)] hover:shadow-[0_20px_40px_-12px_rgba(222,81,39,0.5)] transition-all duration-500"
              >
                <span className="relative z-10 tracking-wide">Create First NFT</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF8F6B] to-[#DE5127] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Purchase Modal */}
      <AnimatePresence>
        {selectedListing && (
          <PurchaseModal
            listing={selectedListing}
            onClose={() => {
              setSelectedListing(null)
              setBidAmount('')
            }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default Marketplace
