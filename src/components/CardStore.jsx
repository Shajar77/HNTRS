import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAccount, useConnect } from 'wagmi'
import { ShoppingCart, Check, Wallet, Star, Diamond, Zap, Crown, ChevronDown, Info, X, TrendingUp } from '../lib/icons'
import { useCardMarketplace } from '../hooks/useCardMarketplace'

const tierIcons = {
  common: Star,
  rare: Diamond,
  epic: Zap,
  legendary: Crown
}

const tierColors = {
  common: { primary: '#64748B', accent: '#94A3B8', bg: 'from-slate-600/20 to-slate-800/20' },
  rare: { primary: '#3B82F6', accent: '#60A5FA', bg: 'from-blue-600/20 to-blue-800/20' },
  epic: { primary: '#A855F7', accent: '#C084FC', bg: 'from-purple-600/20 to-purple-800/20' },
  legendary: { primary: '#F59E0B', accent: '#FCD34D', bg: 'from-amber-600/20 to-amber-800/20' }
}

const CARD_THEMES = {
  Killua: { primary: '#94A3B8', accent: '#E2E8F0', border: '#94A3B8', bg: '#13171a' },
  Zenitsu: { primary: '#FDE047', accent: '#FEF08A', border: '#FACC15', bg: '#1a1805' },
  Bakugo: { primary: '#FB923C', accent: '#FED7AA', border: '#F97316', bg: '#1a1205' },
  Nobara: { primary: '#EC4899', accent: '#F9A8D4', border: '#F472B6', bg: '#1a0a14' },
  Deku: { primary: '#3B82F6', accent: '#93C5FD', border: '#2563EB', bg: '#0a121a' },
  Itachi: { primary: '#EF4444', accent: '#FCA5A5', border: '#DC2626', bg: '#1a0a0a' },
  Tanjiro: { primary: '#60A5FA', accent: '#BFDBFE', border: '#3B82F6', bg: '#0a141a' },
  Levi: { primary: '#FFFFFF', accent: '#E5E5E5', border: '#A3A3A3', bg: '#0d0d0d' },
  Gojo: { primary: '#3B82F6', accent: '#60A5FA', border: '#2563EB', bg: '#0a121a' },
  Goku: { primary: '#F59E0B', accent: '#FCD34D', border: '#F59E0B', bg: '#1a1505' },
}

const stringHash = (value) => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

const CardStore = () => {
  const { isConnected } = useAccount()
  const { connect, connectors, isPending: isConnecting } = useConnect()
  const { getAllCards, buyCard, getCardsByTier, error: marketplaceError, clearError } = useCardMarketplace()
  const [selectedTier, setSelectedTier] = useState('all')
  const [buyingCard, setBuyingCard] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [purchasedCard, setPurchasedCard] = useState(null)
  const [showTierInfo, setShowTierInfo] = useState(false)
  const [flippedCard, setFlippedCard] = useState(null)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const allCards = getAllCards()
  const cards = selectedTier === 'all' ? allCards : getCardsByTier(selectedTier)
  const { dynamicPrices, popularityData } = useMemo(() => {
    const prices = {}
    const popularity = {}

    for (const card of allCards) {
      const hash = stringHash(card.id)
      const tierMultiplier =
        card.tier === 'legendary' ? 1.5 :
        card.tier === 'epic' ? 1.2 :
        card.tier === 'rare' ? 1.0 : 0.8
      const randomVariation = ((hash % 41) - 20) / 100 // deterministic +/- 20%
      const dynamicPrice = 25 * tierMultiplier * (1 + randomVariation)

      prices[card.id] = Math.max(10, Math.min(200, dynamicPrice)).toFixed(2)
      popularity[card.id] = {
        mintCount: 50 + (hash % 500),
        tradeVolume: 10 + (hash % 100),
        uniqueOwners: 20 + (hash % 200),
        popularityScore: hash % 100,
      }
    }

    return { dynamicPrices: prices, popularityData: popularity }
  }, [allCards])

  const tiers = [
    { id: 'all', name: 'All Cards', count: allCards.length },
    { id: 'common', name: 'Common', count: allCards.filter(c => c.tier === 'common').length },
    { id: 'rare', name: 'Rare', count: allCards.filter(c => c.tier === 'rare').length },
    { id: 'epic', name: 'Epic', count: allCards.filter(c => c.tier === 'epic').length },
    { id: 'legendary', name: 'Legendary', count: allCards.filter(c => c.tier === 'legendary').length }
  ]

  const handleBuy = async (card) => {
    if (!isConnected) {
      if (connectors?.length > 0) {
        connect({ connector: connectors[0] })
      }
      return
    }
    
    setBuyingCard(card.id)
    clearError()
    try {
      const purchased = await buyCard(card.id, card.price)
      setPurchasedCard(purchased)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Purchase failed:', error)
      setErrorMessage(error?.message || 'Transaction failed. Please try again.')
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
        clearError()
      }, 5000)
    }
    setBuyingCard(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-2 text-2xl text-white mb-1">Card Store</h2>
          <p className="text-white/40 text-sm">Buy collectable cards directly with MATIC</p>
        </div>
        
        {/* Tier Filter */}
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-xs uppercase tracking-wider">Filter:</span>
          <div className="relative">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="appearance-none bg-white/[0.03] text-white text-sm px-4 py-2 pr-10 rounded-lg border border-white/[0.08] focus:border-white/20 focus:outline-none cursor-pointer min-w-[140px]"
            >
              {tiers.map(tier => (
                <option key={tier.id} value={tier.id} className="bg-[#0a0a0a]">
                  {tier.name} ({tier.count})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
          <button
            onClick={() => setShowTierInfo(true)}
            className="p-2 rounded-lg bg-white/[0.03] text-white/40 hover:text-white/60 hover:bg-white/[0.06] transition-all"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => {
            const colors = tierColors[card.tier]
            const TierIcon = tierIcons[card.tier]
            const isBuying = buyingCard === card.id
            const isFlipped = flippedCard === card.id
            
            const theme = CARD_THEMES[card.name] || { primary: colors.primary, accent: colors.accent, border: 'white', bg: '#0f0f0f' }
            const isCustomTheme = !!CARD_THEMES[card.name]
            
            return (
              <div
                key={card.id}
                className="group relative h-[380px]"
                onMouseEnter={() => setFlippedCard(card.id)}
                onMouseLeave={() => setFlippedCard(null)}
              >
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ perspective: '1000px', height: '100%' }}
                >
                  {/* Flip Container */}
                  <div 
                    className="relative w-full h-full transition-transform duration-700"
                    style={{ 
                      transformStyle: 'preserve-3d',
                      transform: flippedCard === card.id ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                  >
                  {/* FRONT FACE */}
                  <div 
                    className={`absolute inset-0 rounded-md border overflow-hidden backdrop-blur-sm ${isCustomTheme ? `hover:shadow-[0_8px_32px_-8px_${theme.primary}50]` : 'hover:shadow-[0_8px_32px_-8px_rgba(255,255,255,0.1)]'}`}
                    style={{
                      backfaceVisibility: 'hidden',
                      pointerEvents: isFlipped ? 'none' : 'auto',
                      background: `linear-gradient(165deg, ${theme.bg}90 0%, #0a0a0a 50%, ${theme.bg}80 100%)`,
                      borderColor: isCustomTheme ? `${theme.border}50` : 'rgba(255,255,255,0.08)',
                      boxShadow: '0 4px 24px -1px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
                    }}
                  >
                    {/* Premium Edge Highlight */}
                    <div className="absolute inset-0 rounded-md pointer-events-none z-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.2) 100%)',
                      }}
                    />

                    {/* Rarity Crown */}
                    {(card.tier === 'legendary' || card.tier === 'epic') && (
                      <div className="absolute top-4 right-4 z-30">
                        <Crown className="w-5 h-5" style={{ 
                          color: theme.accent, 
                          filter: `drop-shadow(0 0 8px ${theme.primary}80)`
                        }} />
                      </div>
                    )}

                    {/* Flip Indicator */}
                    <div className="absolute top-4 left-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
                        <svg className="w-3 h-3 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-[9px] text-white/60 uppercase tracking-wider">Flip</span>
                      </div>
                    </div>

                    {/* Image - 60% */}
                    <div className="relative h-[60%] overflow-hidden">
                      <img 
                        src={card.image} 
                        alt={card.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
                    </div>

                    {/* Content - 40% */}
                    <div className="h-[40%] px-5 py-4 flex flex-col relative z-10">
                      <div className="flex justify-end mb-1">
                        <span className="text-[10px] text-white/50 uppercase tracking-wider">{card.anime}</span>
                      </div>
                      <h3 className="font-2 text-xl text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{card.name}</h3>
                      <div className="flex items-center gap-1.5 mt-2 mb-3">
                        <TierIcon className="w-3 h-3" style={{ color: theme.accent }} />
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border"
                          style={{ background: `${theme.primary}20`, color: theme.accent, borderColor: `${theme.primary}40` }}
                        >{card.tier}</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/[0.1]">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Zap className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                          <span style={{ color: `${theme.accent}80` }}>{card.power}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-2 text-lg font-bold" style={{ color: theme.accent }}>
                            {dynamicPrices[card.id] || card.price}
                          </span>
                          <span style={{ color: `${theme.primary}70` }}>MATIC</span>
                        </div>
                      </div>
                    </div>

                    {/* Buy Button */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBuy(card)
                      }}
                      disabled={isBuying || isConnecting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 text-[11px] font-semibold uppercase tracking-[0.15em]"
                      style={{
                        background: !isConnected ? 'rgba(255,255,255,0.02)' : `linear-gradient(to bottom, ${theme.primary}30, transparent)`,
                        color: !isConnected ? 'rgba(255,255,255,0.3)' : theme.accent,
                        borderTop: `1px solid ${isConnected ? `${theme.primary}60` : 'rgba(255,255,255,0.04)'}`,
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
                      }}
                    >
                      {isBuying ? (
                        <>
                          <motion.div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                          <span>Processing</span>
                        </>
                      ) : !isConnected ? (
                        <>
                          <Wallet className="w-3.5 h-3.5" />
                          <span>Connect Wallet</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Buy Now</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* BACK FACE - Clean Story Design */}
                  <div 
                    className="absolute inset-0 rounded-md border overflow-hidden backdrop-blur-sm"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      pointerEvents: isFlipped ? 'auto' : 'none',
                      background: `linear-gradient(165deg, ${theme.bg}90 0%, #0a0a0a 100%)`,
                      borderColor: `${theme.border}50`,
                      boxShadow: '0 4px 24px -1px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
                    }}
                  >
                    {/* Premium Edge Highlight */}
                    <div className="absolute inset-0 rounded-md pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.2) 100%)',
                      }}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col p-6">
                      {/* Name */}
                      <h3 className="font-2 text-2xl text-white mb-6" style={{ textShadow: `0 2px 12px ${theme.primary}50` }}>
                        {card.name}
                      </h3>

                      {/* Story */}
                      <div className="flex-1 overflow-y-auto">
                        <p className="text-[13px] leading-relaxed" style={{ color: `${theme.accent}cc` }}>
                          {card.description}
                        </p>
                      </div>

                      {/* Subtle footer line with Score */}
                      <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest">{card.anime}</span>
                        {popularityData[card.id] && (
                          <div className="flex items-center gap-1 text-[10px]" style={{ color: `${theme.accent}70` }}>
                            <TrendingUp className="w-3 h-3" />
                            <span>Score: {popularityData[card.id].popularityScore}</span>
                          </div>
                        )}
                      </div>

                      {/* Buy Now Button on Back */}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleBuy(card)
                        }}
                        disabled={isBuying || isConnecting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] rounded-lg border transition-all cursor-pointer"
                        style={{
                          background: isConnected ? `${theme.primary}20` : 'rgba(255,255,255,0.02)',
                          color: isConnected ? theme.accent : 'rgba(255,255,255,0.3)',
                          borderColor: isConnected ? `${theme.primary}50` : 'rgba(255,255,255,0.08)',
                        }}
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
                        ) : isConnecting ? (
                          <>
                            <motion.div 
                              className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                            <span>Connecting...</span>
                          </>
                        ) : !isConnected ? (
                          <>
                            <Wallet className="w-3.5 h-3.5" />
                            <span>Connect Wallet</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Buy Now</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
            </motion.div>
          </div>
        )
      })}
    </AnimatePresence>
  </div>

      {/* Error Modal */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowError(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#1a1a1a] border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="font-2 text-xl text-white">Transaction Failed</h3>
              </div>
              <p className="text-white/60 text-sm mb-6">{errorMessage}</p>
              <button
                onClick={() => setShowError(false)}
                className="w-full py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-gs text-xs uppercase tracking-wider hover:bg-red-500/30 transition-colors"
              >
                Dismiss
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && purchasedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSuccess(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#1a1a1a] border border-[#DE5127]/30 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-2 text-xl text-white">Purchase Successful!</h3>
              </div>
              <p className="text-white/60 text-sm mb-2">You now own</p>
              <p className="font-2 text-2xl text-[#DE5127] mb-6">{purchasedCard.name}</p>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full py-3 bg-[#DE5127] text-white rounded-lg font-gs text-xs uppercase tracking-wider hover:bg-[#c44520] transition-colors"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tier Info Modal */}
      <AnimatePresence>
        {showTierInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowTierInfo(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-gradient-to-b from-[#18181b] to-[#0c0c0e] rounded-3xl border border-white/[0.08] p-6 max-w-md w-full"
            >
              <button 
                onClick={() => setShowTierInfo(false)}
                className="absolute top-4 right-4 p-1 text-white/30 hover:text-white/60"
              >
                <X className="w-4 h-4" />
              </button>
              
              <h3 className="font-2 text-xl text-white mb-4">Card Tiers</h3>
              
              <div className="space-y-3">
                {[
                  { tier: 'common', price: '10-12', supply: '800-1000', color: '#64748B' },
                  { tier: 'rare', price: '25-30', supply: '400-500', color: '#3B82F6' },
                  { tier: 'epic', price: '50-60', supply: '150-200', color: '#A855F7' },
                  { tier: 'legendary', price: '100', supply: '50', color: '#F59E0B' }
                ].map(t => (
                  <div key={t.tier} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ background: t.color }}
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium capitalize">{t.tier}</p>
                      <p className="text-[10px] text-white/40">{t.supply} cards max</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm font-medium">{t.price} MATIC</p>
                      <p className="text-[10px] text-white/40">Base price</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CardStore
