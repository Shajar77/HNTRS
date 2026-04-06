import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'motion/react'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { Link } from 'react-router-dom'
import WalletConnect from '../components/WalletConnect'
import { useHNTRSNFT, useHNTRSMarketplace } from '../hooks/useHNTRSContract'

const Profile = () => {
  const { address, isConnected } = useAccount()
  const { useTokensByOwner, useBalanceOf } = useHNTRSNFT()
  const { useListingsBySeller } = useHNTRSMarketplace()

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

  const [activeTab, setActiveTab] = useState('owned')

  const { data: ownedTokens, isLoading: loadingOwned } = useTokensByOwner(address)
  const { data: balance } = useBalanceOf(address)
  const { data: userListings, isLoading: loadingListings } = useListingsBySeller(address)

  const nftCount = balance ? Number(balance) : 0
  const listings = userListings || []

  // Not connected state
  if (!isConnected) {
    return (
      <section ref={sectionRef} onPointerMove={handlePointerMove} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}
        className='relative bg-[#F1F1F1] overflow-hidden selection:bg-[#DE5127] selection:text-white min-h-screen'>
        {/* Enhanced Grid background */}
        <div className='absolute inset-0 pointer-events-none opacity-[0.12]'
          style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
        
        {/* Floating decorative elements */}
        <div className='absolute top-32 left-16 w-48 h-48 border border-[#DE5127]/8 rotate-12 pointer-events-none'></div>
        <div className='absolute bottom-32 right-16 w-32 h-32 border border-black/5 -rotate-12 pointer-events-none'></div>
        
        {/* Mouse glow - hidden on mobile */}
        <div className='hidden sm:block absolute inset-0 pointer-events-none overflow-hidden'>
          <div ref={spotRef} className='absolute transition-transform duration-500 ease-out' style={{ top: 0, left: 0, transform: 'translate3d(calc(50vw - 150px), calc(50vh - 150px), 0)', willChange: 'transform' }}>
            <div className='w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] rounded-full border border-[#DE5127]/30 flex items-center justify-center'>
              <div className='w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] rounded-full' style={{ background: 'radial-gradient(circle, rgba(222,81,39,0.25) 0%, rgba(222,81,39,0.08) 50%, transparent 70%)' }}></div>
            </div>
          </div>
        </div>
        
        <div className='relative z-10 flex flex-col justify-center min-h-screen px-8 sm:px-12 md:px-20 lg:px-28 pt-28 sm:pt-36 pb-10 sm:pb-14'>
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
              {/* Label with line */}
              <div className="flex items-center justify-center gap-4 mb-10">
                <span className='w-12 h-px bg-[#DE5127]/40'></span>
                <p className='font-gs text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.5em] text-black/30'>Your Collection</p>
                <span className='w-12 h-px bg-[#DE5127]/40'></span>
              </div>
              
              {/* Main Title */}
              <div className="relative mb-6 sm:mb-8 overflow-hidden">
                <h1 className='font-2 text-[clamp(1.75rem,10vw,7rem)] sm:text-[clamp(3rem,12vw,6rem)] md:text-[clamp(3.5rem,10vw,5rem)] lg:text-[clamp(3rem,8vw,4rem)] text-black leading-[0.85] tracking-[-0.02em] break-words'>PROFILE</h1>
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className='absolute -top-1 -right-2 sm:top-0 sm:right-8 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-[#DE5127] flex items-center justify-center shadow-lg shadow-[#DE5127]/30'>
                  <span className='font-2 text-white text-[7px] sm:text-[8px] md:text-[10px]'>R</span>
                </motion.div>
              </div>
              
              {/* Subtitle */}
              <p className="font-7 italic text-[#DE5127] text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-tight mb-8 sm:mb-12">manage your assets</p>
              
              {/* Description */}
              <p className="font-gs text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.3em] sm:tracking-[0.4em] text-black/40 mb-12 sm:mb-16 max-w-md mx-auto leading-relaxed text-safe">
                Connect your wallet to view your NFTs and manage listings
              </p>
              
              {/* CTA */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.8 }}
                className="flex justify-center">
                <WalletConnect />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} onPointerMove={handlePointerMove} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}
      className='relative bg-[#F1F1F1] overflow-hidden selection:bg-[#DE5127] selection:text-white min-h-screen'>
      {/* Enhanced Grid background */}
      <div className='absolute inset-0 pointer-events-none opacity-[0.12]'
        style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
      
      {/* Decorative corner elements */}
      <div className='absolute top-32 left-8 w-32 h-32 border-l-2 border-t-2 border-[#DE5127]/20 pointer-events-none'></div>
      <div className='absolute bottom-32 right-8 w-32 h-32 border-r-2 border-b-2 border-black/10 pointer-events-none'></div>
      
      {/* Mouse glow - hidden on mobile */}
      <div className='hidden sm:block absolute inset-0 pointer-events-none overflow-hidden'>
        <div ref={spotRef} className='absolute transition-transform duration-500 ease-out' style={{ top: 0, left: 0, transform: 'translate3d(calc(50vw - 150px), calc(50vh - 150px), 0)', willChange: 'transform' }}>
          <div className='w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] rounded-full border border-[#DE5127]/30 flex items-center justify-center'>
            <div className='w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] rounded-full' style={{ background: 'radial-gradient(circle, rgba(222,81,39,0.2) 0%, rgba(222,81,39,0.06) 50%, transparent 70%)' }}></div>
          </div>
        </div>
      </div>

      <div className='relative z-10 px-8 sm:px-12 md:px-20 lg:px-28 pt-28 sm:pt-36 pb-10 sm:pb-14 min-h-screen'>
        {/* Enhanced Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="w-12 h-[2px] bg-[#DE5127]"></span>
            <span className="font-gs text-[10px] sm:text-[11px] text-[#DE5127] font-bold tracking-[0.4em] uppercase">Profile</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="overflow-hidden">
              <h1 className='font-2 text-[clamp(1.75rem,10vw,6rem)] sm:text-[clamp(2.5rem,10vw,5rem)] md:text-[clamp(2.5rem,7vw,4rem)] lg:text-[clamp(2rem,5vw,3.5rem)] text-black leading-[0.9] tracking-[-0.01em] break-words'>Collection</h1>
              <div className="flex items-center gap-4 mt-6">
                <span className='w-16 h-px bg-black/20'></span>
                <span className='font-gs text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.4em] text-black/40'>Manage your assets</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-14">
          <div className="bg-white/60 backdrop-blur-md border border-black/[0.06] p-10 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col lg:flex-row items-start gap-10">
              {/* Avatar & Basic Info */}
              <div className="flex items-center gap-6">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="w-24 h-24 bg-[#DE5127] flex items-center justify-center text-white text-3xl font-bold font-mono shadow-lg shadow-[#DE5127]/20">
                  {address?.slice(2, 4).toUpperCase()}
                </motion.div>
                <div>
                  <p className="font-gs text-[9px] uppercase tracking-[0.4em] text-black/40 mb-1">Connected Wallet</p>
                  <p className="font-mono text-xl text-black">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="font-gs text-[9px] uppercase tracking-[0.25em] text-black/40">Polygon Network</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1 lg:border-l lg:border-black/[0.06] lg:pl-10">
                <div className="grid grid-cols-2 gap-10">
                  <motion.div whileHover={{ scale: 1.02 }} className="cursor-default">
                    <p className="font-gs text-[9px] uppercase tracking-[0.4em] text-[#DE5127] mb-3">NFTs Owned</p>
                    <p className="font-2 text-6xl text-black">{nftCount}</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} className="cursor-default">
                    <p className="font-gs text-[9px] uppercase tracking-[0.4em] text-black/40 mb-3">Active Listings</p>
                    <p className="font-2 text-6xl text-black">{listings.length}</p>
                  </motion.div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 lg:pl-8">
                <motion.div whileHover={{ scale: 1.02, x: 2 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/mint" className="px-10 py-4 bg-black text-white font-gs font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#DE5127] transition-all duration-300 text-center shadow-lg shadow-black/10 inline-block w-full">
                    Create NFT
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <a href={`https://polygonscan.com/address/${address}`} target="_blank" rel="noopener noreferrer"
                    className="px-10 py-4 border border-black/[0.08] text-black font-gs font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all duration-300 text-center inline-block w-full">
                    View on Explorer →
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex gap-1 bg-black/[0.03] p-1.5 mb-12 w-fit">
          {[
            { id: 'owned', label: 'Owned NFTs', count: nftCount },
            { id: 'listings', label: 'My Listings', count: listings.length },
          ].map((tab) => (
            <motion.button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-7 py-3.5 font-gs text-[10px] uppercase tracking-[0.18em] transition-all duration-300 ${activeTab === tab.id ? 'bg-[#DE5127] text-white shadow-md shadow-[#DE5127]/20' : 'text-black/50 hover:text-black hover:bg-black/[0.02]'}`}>
              {tab.label} <span className="ml-1 opacity-60">({tab.count})</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Content */}
        {activeTab === 'owned' && (
          <div>
            {loadingOwned ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border border-black/10 border-t-[#DE5127] mx-auto mb-4" />
                  <p className="font-gs text-[10px] uppercase tracking-[0.3em] text-black/40">Loading</p>
                </div>
              </div>
            ) : nftCount > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ownedTokens?.map((tokenId, index) => (
                  <motion.div key={tokenId.toString()} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} className="group">
                    <motion.div 
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="bg-white/60 backdrop-blur-sm border border-black/[0.06] overflow-hidden shadow-[0_4px_20px_-5px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-12px_rgba(222,81,39,0.12)] transition-all duration-500">
                      <div className="aspect-[4/5] relative overflow-hidden bg-black/[0.02]">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div 
                            whileHover={{ scale: 1.1, rotate: 3 }}
                            className="w-16 h-16 border border-black/8 flex items-center justify-center group-hover:border-[#DE5127]/25 transition-all duration-500">
                            <svg className="w-8 h-8 text-black/12 group-hover:text-[#DE5127]/35 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </motion.div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#DE5127]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      </div>
                      <div className="p-5">
                        <p className="font-gs text-[9px] uppercase tracking-[0.3em] text-black/30 mb-1">NFT</p>
                        <h3 className="font-2 text-2xl text-black mb-5">#{tokenId.toString()}</h3>
                        <div className="flex gap-2">
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 py-3 bg-black/[0.04] text-black font-gs font-bold text-[9px] uppercase tracking-wider hover:bg-black/10 transition-all">View</motion.button>
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 py-3 bg-[#DE5127] text-white font-gs font-bold text-[9px] uppercase tracking-wider hover:bg-black transition-all shadow-md shadow-[#DE5127]/10">List</motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 border border-black/[0.06] bg-white/30">
                <div className="w-20 h-20 mx-auto mb-8 border border-[#DE5127]/20 flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#DE5127]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="font-2 text-3xl text-black mb-3">No NFTs</h3>
                <p className="font-gs text-[10px] uppercase tracking-[0.3em] text-black/40 mb-10">Start your collection today</p>
                <div className="flex justify-center gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link to="/mint" className="px-10 py-4 bg-black text-white font-gs font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#DE5127] transition-all shadow-lg shadow-black/10 inline-block">Create NFT</Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link to="/marketplace" className="px-10 py-4 border border-black/[0.08] text-black font-gs font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all inline-block">Browse</Link>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'listings' && (
          <div>
            {loadingListings ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border border-black/10 border-t-[#DE5127] mx-auto mb-4" />
                  <p className="font-gs text-[10px] uppercase tracking-[0.3em] text-black/40">Loading</p>
                </div>
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map((listing, index) => {
                  const isAuction = listing.listingType === 1
                  return (
                    <motion.div key={listing.listingId.toString()} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} className="group">
                      <motion.div 
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="bg-white/60 backdrop-blur-sm border border-black/[0.06] overflow-hidden shadow-[0_4px_20px_-5px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-12px_rgba(222,81,39,0.12)] transition-all duration-500">
                        <div className="aspect-[4/5] relative overflow-hidden bg-black/[0.02]">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div 
                              whileHover={{ scale: 1.1, rotate: 3 }}
                              className="w-16 h-16 border border-black/8 flex items-center justify-center group-hover:border-[#DE5127]/25 transition-all duration-500">
                              <svg className="w-8 h-8 text-black/12 group-hover:text-[#DE5127]/35 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </motion.div>
                          </div>
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            <span className={`px-3 py-1.5 text-[9px] font-gs font-bold uppercase tracking-wider ${isAuction ? 'bg-black text-white' : 'bg-[#DE5127] text-white'}`}>
                              {isAuction ? 'Auction' : 'Fixed'}
                            </span>
                            <span className={`px-3 py-1.5 text-[9px] font-gs font-bold ${listing.isActive ? 'bg-green-500 text-white' : 'bg-black/10 text-black/50'}`}>
                              {listing.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#DE5127]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        </div>
                        <div className="p-5">
                          <div className="flex justify-between items-baseline mb-4">
                            <div>
                              <p className="font-gs text-[9px] uppercase tracking-[0.3em] text-black/30 mb-1">Token</p>
                              <h3 className="font-2 text-2xl text-black">#{listing.tokenId.toString()}</h3>
                            </div>
                            <div className="text-right">
                              <p className="font-2 text-2xl text-[#DE5127]">{parseFloat(formatEther(listing.price)).toFixed(3)}</p>
                              <p className="font-gs text-[9px] uppercase tracking-[0.15em] text-black/35">MATIC</p>
                            </div>
                          </div>
                          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full py-3 bg-red-50/80 text-red-600 font-gs font-bold text-[9px] uppercase tracking-wider hover:bg-red-100 transition-all border border-red-100">Cancel Listing</motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 border border-black/[0.06] bg-white/30">
                <div className="w-20 h-20 mx-auto mb-8 border border-[#DE5127]/20 flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#DE5127]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="font-2 text-3xl text-black mb-3">No Listings</h3>
                <p className="font-gs text-[10px] uppercase tracking-[0.3em] text-black/40 mb-10">List your NFTs to sell</p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/marketplace" className="px-10 py-4 bg-black text-white font-gs font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#DE5127] transition-all shadow-lg shadow-black/10 inline-block">Browse Marketplace</Link>
                </motion.div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default Profile
