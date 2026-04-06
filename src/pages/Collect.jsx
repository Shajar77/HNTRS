import { lazy, Suspense, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Store, ShoppingBag, Package } from '../lib/icons'
import { useCardMarketplace } from '../hooks/useCardMarketplace'

const CardStore = lazy(() => import('../components/CardStore'))
const Marketplace = lazy(() => import('../components/Marketplace'))
const MyCards = lazy(() => import('../components/MyCards'))

const Collect = () => {
  const [activeTab, setActiveTab] = useState('store')
  const { ownedCards } = useCardMarketplace()

  const tabs = [
    { id: 'store', name: 'Store', mobileName: 'Store', icon: Store },
    { id: 'marketplace', name: 'Market', mobileName: 'Market', icon: ShoppingBag },
    { id: 'collection', name: 'Collection', mobileName: 'My Cards', icon: Package }
  ]

  return (
    <div className="min-h-screen bg-[#050505] relative">
      {/* Premium Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] rounded-full blur-[200px] opacity-[0.08]" style={{ background: '#DE5127' }} />
        <div className="absolute bottom-[-20%] right-[10%] w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.06]" style={{ background: '#A855F7' }} />
        <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[150px] opacity-[0.05]" style={{ background: '#3B82F6' }} />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      {/* Header */}
      <section className="relative px-6 sm:px-12 md:px-20 lg:px-28 pt-28 pb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-[2px] bg-[#DE5127]" />
              <span className="font-gs text-[11px] text-[#DE5127] font-bold uppercase tracking-[0.3em]">NFT Marketplace</span>
            </div>

            {/* Title */}
            <h1 className="font-2 text-[8vw] sm:text-[5vw] lg:text-[3.5vw] text-white leading-none tracking-tight mb-4">
              Collect <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DE5127] to-[#FB923C]">Anime Legends</span>
            </h1>
            <p className="font-gs text-white/40 text-sm max-w-xl tracking-wide mb-8">
              Buy exclusive anime hero NFTs directly from the store or trade with other collectors on the marketplace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="relative px-4 sm:px-8 md:px-12 lg:px-20 xl:px-28 pb-6">
        <div className="max-w-lg">
          <div className="flex bg-white/5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex items-center justify-center px-4 sm:px-6 py-3 transition-all duration-300 flex-1
                    ${isActive 
                      ? 'bg-[#DE5127] text-white' 
                      : 'text-white/40 hover:text-white/60'
                    }
                  `}
                >
                  <span className="font-gs text-[10px] sm:text-xs font-medium uppercase tracking-[0.3em]">
                    {tab.name}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative px-6 sm:px-12 md:px-20 lg:px-28 py-8 pb-28">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'store' && (
              <motion.div
                key="store"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<div className="min-h-[420px]" />}>
                  <CardStore />
                </Suspense>
              </motion.div>
            )}
            
            {activeTab === 'marketplace' && (
              <motion.div
                key="marketplace"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<div className="min-h-[420px]" />}>
                  <Marketplace />
                </Suspense>
              </motion.div>
            )}
            
            {activeTab === 'collection' && (
              <motion.div
                key="collection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<div className="min-h-[420px]" />}>
                  <MyCards />
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

export default Collect
