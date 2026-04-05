import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react'

// Detailed News Articles with Content
const newsArticles = [
    {
        id: 1,
        date: "April 3, 2025",
        title: "HNTRS Anime Legends Collection Launch",
        category: "Collection Drop",
        image: "/anime/news-goku.jpg",
        readTime: "5 min",
        author: "HNTRS Team",
        trending: true,
        views: "12.5K",
        excerpt: "Discover the latest anime character collection featuring legendary heroes from Dragon Ball, Naruto, One Piece and more.",
        content: [
            {
                type: "intro",
                text: "The wait is finally over. HNTRS is proud to announce the launch of our most anticipated collection yet — the Anime Legends series. This exclusive drop features 50 unique NFT cards representing the most iconic characters from the world of anime."
            },
            {
                type: "heading",
                text: "What's in the Collection?"
            },
            {
                type: "paragraph",
                text: "The Anime Legends Collection is divided into four tiers: Common, Rare, Epic, and Legendary. Each tier represents characters with varying levels of popularity and power within their respective universes. The Legendary tier features only 5 characters — Goku, Naruto, Luffy, Ichigo, and Gon — each with only 100 editions available."
            },
            {
                type: "heading",
                text: "Exclusive Benefits for Collectors"
            },
            {
                type: "paragraph",
                text: "Owning cards from this collection unlocks exclusive benefits on the HNTRS platform. Collectors will receive early access to future drops, special discounts on marketplace fees, and entry into exclusive holder-only events. Legendary card holders will also receive a physical limited edition print of their character."
            },
            {
                type: "heading",
                text: "Drop Details"
            },
            {
                type: "list",
                items: [
                    "Drop Date: April 10, 2025 at 12:00 PM UTC",
                    "Total Cards: 5,000 unique NFTs",
                    "Pricing: Common 0.05 ETH | Rare 0.15 ETH | Epic 0.5 ETH | Legendary 2 ETH",
                    "Minting: First come, first served via HNTRS platform",
                    "Secondary: Instant trading available on HNTRS Marketplace"
                ]
            },
            {
                type: "paragraph",
                text: "Don't miss your chance to own a piece of anime history. Set your reminders and prepare your wallets — this collection is expected to sell out within minutes."
            }
        ]
    },
    {
        id: 2,
        date: "March 28, 2025",
        title: "New Marketplace Features: Bulk Buying & Offers",
        category: "Platform Update",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
        readTime: "3 min",
        author: "Alex Chen",
        trending: true,
        views: "8.2K",
        excerpt: "Introducing advanced trading features including bulk purchases, offer systems, and improved filtering.",
        content: [
            {
                type: "intro",
                text: "We're thrilled to roll out the biggest platform update since launch. Based on your feedback, we've built powerful new tools to make trading on HNTRS faster, smarter, and more efficient."
            },
            {
                type: "heading",
                text: "Bulk Buying"
            },
            {
                type: "paragraph",
                text: "Now you can purchase up to 20 cards in a single transaction. Our new bulk buying interface lets you select multiple cards from the same collection, automatically calculates total costs including gas optimization, and completes all purchases with one signature. Save time and save on transaction fees."
            },
            {
                type: "heading",
                text: "Make Offers System"
            },
            {
                type: "paragraph",
                text: "Tired of waiting for the right price? Now you can make offers on any listed item. Set your desired price and duration — if the seller accepts, the transaction completes automatically. You can have up to 50 active offers at any time."
            },
            {
                type: "heading",
                text: "Advanced Filtering"
            },
            {
                type: "paragraph",
                text: "Find exactly what you're looking for with our enhanced filtering system. Filter by trait rarity, price range, collection, seller reputation, and more. Save your favorite filters as presets for quick access."
            },
            {
                type: "heading",
                text: "Coming Soon"
            },
            {
                type: "list",
                items: [
                    "Sweep mode: Buy entire floors with one click",
                    "Collection offers: Make offers on entire collections",
                    "Price alerts: Get notified when items hit your target price",
                    "Portfolio analytics: Track your collection value over time"
                ]
            }
        ]
    },
    {
        id: 3,
        date: "March 15, 2025",
        title: "Partnership with Top Football Clubs",
        category: "Partnership",
        image: "https://images.unsplash.com/photo-1522778119026-d647f0565c6a?w=800&q=80",
        readTime: "4 min",
        author: "Sarah Williams",
        trending: false,
        views: "6.8K",
        excerpt: "Exclusive partnerships with Barcelona, Real Madrid, and other elite clubs for upcoming collections.",
        content: [
            {
                type: "intro",
                text: "HNTRS is entering the world of football. We're proud to announce official partnerships with some of the biggest clubs in the world, bringing exclusive football collectibles to our platform."
            },
            {
                type: "heading",
                text: "Partner Clubs"
            },
            {
                type: "paragraph",
                text: "Our initial partner lineup includes FC Barcelona, Real Madrid, Manchester United, Bayern Munich, and Paris Saint-Germain. These partnerships grant HNTRS exclusive rights to create and distribute official NFT collections featuring club legends, current stars, and historic moments."
            },
            {
                type: "heading",
                text: "First Drop: El Clásico Collection"
            },
            {
                type: "paragraph",
                text: "The first collection launching under these partnerships is the El Clásico Collection, celebrating the greatest moments from the rivalry between Barcelona and Real Madrid. The collection will feature 100 legendary moments from matches spanning the last 50 years, with video highlights, commentary, and exclusive behind-the-scenes content."
            },
            {
                type: "heading",
                text: "Fan Benefits"
            },
            {
                type: "list",
                items: [
                    "Official club licensing with authentic branding",
                    "Video highlights and exclusive content",
                    "Match ticket giveaways for card holders",
                    "VIP stadium tour access for legendary tier holders",
                    "Meet & greet opportunities with club legends"
                ]
            },
            {
                type: "paragraph",
                text: "This is just the beginning. We're in discussions with clubs across Europe, South America, and Asia to bring more football content to HNTRS. Stay tuned for announcements about Formula 1, NBA, and esports partnerships coming later this year."
            }
        ]
    },
    {
        id: 4,
        date: "March 8, 2025",
        title: "Collector Rewards Program Announced",
        category: "Rewards",
        image: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&q=80",
        readTime: "6 min",
        author: "Marcus Johnson",
        trending: false,
        views: "4.5K",
        excerpt: "Earn exclusive rewards, early access, and special discounts based on your collection.",
        content: [
            {
                type: "intro",
                text: "At HNTRS, we believe in rewarding our loyal community. Today we're unveiling the HNTRS Collector Rewards Program — a comprehensive loyalty system designed to give back to the collectors who make our platform thrive."
            },
            {
                type: "heading",
                text: "How It Works"
            },
            {
                type: "paragraph",
                text: "The program has five tiers: Bronze, Silver, Gold, Platinum, and Diamond. Your tier is determined by your Collection Score, which is calculated based on the number of cards you hold, their rarity, and how long you've held them. The higher your tier, the better the rewards."
            },
            {
                type: "heading",
                text: "Tier Benefits"
            },
            {
                type: "list",
                items: [
                    "Bronze (5+ cards): 5% marketplace fee discount, monthly newsletter",
                    "Silver (20+ cards): 10% fee discount, early access to drops (24h)",
                    "Gold (50+ cards): 15% fee discount, early access (48h), exclusive airdrops",
                    "Platinum (100+ cards): 20% fee discount, early access (72h), priority support",
                    "Diamond (250+ cards): 25% fee discount, guaranteed whitelist, quarterly physical rewards"
                ]
            },
            {
                type: "heading",
                text: "Additional Perks"
            },
            {
                type: "paragraph",
                text: "Beyond tier benefits, all participants earn HNTRS Points for every transaction. These points can be redeemed for free mints, merchandise, or converted to ETH. Referring friends also earns you bonus points, creating a compounding reward system for active community members."
            },
            {
                type: "heading",
                text: "Program Launch"
            },
            {
                type: "paragraph",
                text: "The rewards program goes live on April 1st. All existing collections will be retroactively counted toward your Collection Score. Check your profile on launch day to see your initial tier and start claiming rewards immediately."
            }
        ]
    },
    {
        id: 5,
        date: "February 22, 2025",
        title: "Mobile App Beta Launch",
        category: "Product",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
        readTime: "3 min",
        author: "Tech Team",
        trending: false,
        views: "3.2K",
        excerpt: "Take your NFT collection on the go with our new mobile app. Trade and collect from anywhere.",
        content: [
            {
                type: "intro",
                text: "Your NFT collection now fits in your pocket. After months of development, we're excited to announce the beta release of the HNTRS mobile app for iOS and Android."
            },
            {
                type: "heading",
                text: "Features at Launch"
            },
            {
                type: "paragraph",
                text: "The mobile app brings the core HNTRS experience to your phone. Browse collections, buy and sell cards, manage your portfolio, and receive push notifications for drops and offers. The app is built with React Native for smooth performance and a native feel."
            },
            {
                type: "heading",
                text: "Mobile-First Features"
            },
            {
                type: "list",
                items: [
                    "Instant push notifications for price alerts and offers",
                    "Quick buy with Apple Pay and Google Pay integration",
                    "AR card viewer: See your cards in augmented reality",
                    "Social sharing: Share your pulls directly to Instagram and Twitter",
                    "Offline mode: View your collection even without internet"
                ]
            },
            {
                type: "heading",
                text: "Beta Access"
            },
            {
                type: "paragraph",
                text: "The beta is currently open to 5,000 users. Download the app and connect your wallet to join. Beta testers will receive an exclusive 'Beta Tester' badge NFT and priority access to all future app features. Your feedback during this phase will directly shape the final version."
            },
            {
                type: "heading",
                text: "Security"
            },
            {
                type: "paragraph",
                text: "Security is our top priority. The app uses secure enclave key storage on supported devices, biometric authentication, and optional transaction signing notifications. Your private keys never leave your device, and all transactions require your explicit approval."
            }
        ]
    },
    {
        id: 6,
        date: "February 10, 2025",
        title: "Ethereum Layer 2 Integration Complete",
        category: "Platform Update",
        image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80",
        readTime: "4 min",
        author: "Dev Team",
        trending: false,
        views: "5.1K",
        excerpt: "Faster transactions and lower gas fees with Polygon integration. 90% reduced costs.",
        content: [
            {
                type: "intro",
                text: "Gas fees are no longer a barrier to entry. HNTRS has completed integration with Polygon, bringing lightning-fast transactions and near-zero fees to our entire platform."
            },
            {
                type: "heading",
                text: "Why Polygon?"
            },
            {
                type: "paragraph",
                text: "Polygon is a Layer 2 scaling solution for Ethereum that maintains the security of the mainnet while offering dramatically improved speed and cost. Transactions on Polygon cost a fraction of a cent and confirm in under 2 seconds, compared to potentially $50+ and minutes on mainnet during peak times."
            },
            {
                type: "heading",
                text: "What Changed?"
            },
            {
                type: "list",
                items: [
                    "Minting fees reduced by 95% — from ~$30 to ~$0.01",
                    "Marketplace transactions now cost less than $0.001",
                    "Transaction confirmation time: under 2 seconds",
                    "Same security as Ethereum mainnet",
                    "Easy bridging from Ethereum via our built-in bridge"
                ]
            },
            {
                type: "heading",
                text: "Migration Details"
            },
            {
                type: "paragraph",
                text: "All existing collections have been migrated to Polygon with no action required from users. Your NFTs remain exactly the same — same metadata, same images, same ownership history. The only difference is they're now on a faster, cheaper network. New collections will launch exclusively on Polygon."
            },
            {
                type: "heading",
                text: "Cross-Chain Future"
            },
            {
                type: "paragraph",
                text: "While Polygon is now our primary network, we're building multi-chain support. Soon you'll be able to trade assets across Polygon, Ethereum mainnet, Arbitrum, and Optimism seamlessly. This ensures your collection remains accessible regardless of which chain you prefer."
            }
        ]
    }
]

const filters = [
    { id: 'all', label: 'All Stories' },
    { id: 'Collection Drop', label: 'Drops' },
    { id: 'Platform Update', label: 'Updates' },
    { id: 'Partnership', label: 'Partners' },
    { id: 'Rewards', label: 'Rewards' },
    { id: 'Product', label: 'Product' }
]

const categoryColors = {
    'Collection Drop': { bg: '#DE5127', text: '#fff' },
    'Platform Update': { bg: '#3B82F6', text: '#fff' },
    'Partnership': { bg: '#A855F7', text: '#fff' },
    'Rewards': { bg: '#FBBF24', text: '#000' },
    'Product': { bg: '#10B981', text: '#fff' }
}

const News = () => {
    const [filter, setFilter] = useState('all')
    const [hoveredCard, setHoveredCard] = useState(null)
    const [selectedArticle, setSelectedArticle] = useState(null)
    const { scrollYProgress } = useScroll()
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

    const filteredNews = filter === 'all' 
        ? newsArticles 
        : newsArticles.filter(item => item.category === filter)

    const featuredNews = newsArticles[0]
    const regularNews = filter === 'all' ? filteredNews.slice(1) : filteredNews

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedArticle) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [selectedArticle])

    return (
        <div className='min-h-screen bg-[#020202] relative'>
            {/* Progress Bar */}
            <motion.div className='fixed top-0 left-0 right-0 h-[2px] bg-[#DE5127] z-50 origin-left' style={{ scaleX: smoothProgress }} />

            {/* Background Grid */}
            <div className='fixed inset-0 pointer-events-none opacity-[0.02]'>
                <div className='absolute inset-0' style={{ 
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', 
                    backgroundSize: '100px 100px' 
                }} />
            </div>

            {/* Hero Section */}
            <section className='relative px-8 sm:px-12 md:px-20 lg:px-28 pt-40 pb-32'>
                <div className='max-w-7xl mx-auto relative z-10'>
                    <motion.div className='inline-flex items-center gap-3 mb-12' initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                        <div className='relative'>
                            <span className='absolute inset-0 w-3 h-3 rounded-full bg-[#DE5127] animate-ping' />
                            <span className='relative block w-3 h-3 rounded-full bg-[#DE5127]' />
                        </div>
                        <span className='font-gs text-[12px] text-[#DE5127] font-bold uppercase tracking-[0.3em]'>Live Updates</span>
                    </motion.div>

                    <div className='relative mb-16'>
                        <motion.h1 className='font-2 text-[20vw] sm:text-[16vw] lg:text-[12vw] text-white leading-[0.75] tracking-tighter' initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>NEWS</motion.h1>
                        <motion.div className='absolute -bottom-4 left-0 h-2 bg-gradient-to-r from-[#DE5127] via-orange-500 to-transparent rounded-full' initial={{ width: 0 }} animate={{ width: "40%" }} transition={{ duration: 1, delay: 0.8 }} />
                    </div>

                    <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12'>
                        <motion.p className='font-gs text-white/50 text-xl lg:text-2xl max-w-2xl leading-relaxed' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                            Stay ahead of the curve with the latest drops, platform updates, and exclusive announcements.
                        </motion.p>

                        <motion.div className='flex gap-12' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                            {[{ num: '6', label: 'Articles' }, { num: '50K+', label: 'Readers' }, { num: '3', label: 'This Week' }].map((stat, i) => (
                                <div key={i} className='text-right'>
                                    <span className='font-2 text-4xl lg:text-5xl text-white block'>{stat.num}</span>
                                    <span className='font-gs text-[10px] text-white/30 uppercase tracking-widest'>{stat.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className='sticky top-0 z-40 bg-[#020202]/80 backdrop-blur-xl border-y border-white/[0.05]'>
                <div className='max-w-7xl mx-auto px-8 sm:px-12 md:px-20 lg:px-28 py-6'>
                    <div className='flex items-center gap-2 overflow-x-auto scrollbar-hide'>
                        {filters.map((f, index) => (
                            <motion.button key={f.id} onClick={() => setFilter(f.id)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={`relative px-6 py-3 rounded-full font-gs text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${filter === f.id ? 'text-white' : 'text-white/40 hover:text-white/70'}`}>
                                {filter === f.id && <motion.div layoutId="activePill" className='absolute inset-0 bg-white/[0.1] border border-white/[0.2] rounded-full' transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                                <span className='relative z-10'>{f.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Article */}
            <AnimatePresence mode='wait'>
                {filter === 'all' && (
                    <motion.section key="featured" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='px-8 sm:px-12 md:px-20 lg:px-28 py-20'>
                        <div className='max-w-7xl mx-auto'>
                            <article onClick={() => setSelectedArticle(featuredNews)} className='group relative cursor-pointer'>
                                <div className='grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden bg-white/[0.02] border border-white/[0.08] group-hover:border-[#DE5127]/30 transition-all duration-700'>
                                    <div className='relative aspect-[4/3] lg:aspect-auto overflow-hidden'>
                                        <motion.img src={featuredNews.image} alt={featuredNews.title} className='w-full h-full object-cover' whileHover={{ scale: 1.05 }} transition={{ duration: 0.7 }} />
                                        {featuredNews.trending && (
                                            <div className='absolute top-6 left-6'>
                                                <motion.span className='flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase bg-[#DE5127] text-white' initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}>
                                                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'><path d='M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z' /></svg>Trending
                                                </motion.span>
                                            </div>
                                        )}
                                        <div className='absolute bottom-6 left-6 flex items-center gap-2 text-white/70'>
                                            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' /></svg>
                                            <span className='font-gs text-[11px]'>{featuredNews.views} views</span>
                                        </div>
                                    </div>

                                    <div className='relative p-8 lg:p-12 flex flex-col justify-center'>
                                        <div className='flex items-center gap-3 mb-6'>
                                            <span className='px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase' style={{ background: categoryColors[featuredNews.category].bg, color: categoryColors[featuredNews.category].text }}>{featuredNews.category}</span>
                                            <span className='w-1 h-1 rounded-full bg-white/30' />
                                            <span className='font-gs text-[11px] text-white/40'>{featuredNews.readTime} read</span>
                                        </div>

                                        <h2 className='font-2 text-3xl lg:text-4xl xl:text-5xl text-white leading-tight mb-4 group-hover:text-[#DE5127] transition-colors duration-500'>{featuredNews.title}</h2>
                                        <p className='font-7 text-[#DE5127] italic mb-6'>{featuredNews.date}</p>
                                        <p className='font-gs text-white/50 text-base lg:text-lg leading-relaxed mb-8 max-w-lg'>{featuredNews.excerpt}</p>

                                        <motion.div className='self-start flex items-center gap-3' whileHover={{ x: 5 }}>
                                            <span className='font-gs text-sm font-bold uppercase tracking-wider text-white group-hover:text-[#DE5127] transition-colors'>Read Full Story</span>
                                            <div className='w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#DE5127] group-hover:bg-[#DE5127]/10 transition-all'>
                                                <svg className='w-4 h-4 text-white group-hover:text-[#DE5127] transition-colors' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' /></svg>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* News Grid */}
            <section className='px-8 sm:px-12 md:px-20 lg:px-28 py-20 border-t border-white/[0.05]'>
                <div className='max-w-7xl mx-auto'>
                    <div className='flex items-center justify-between mb-12'>
                        <motion.div className='flex items-center gap-4' initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <div className='w-12 h-[2px] bg-[#DE5127]' />
                            <span className='font-2 text-2xl text-white'>{filter === 'all' ? 'Latest' : filter}</span>
                        </motion.div>
                        <span className='font-gs text-[11px] text-white/30'>{regularNews.length} articles</span>
                    </div>

                    <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                        <AnimatePresence mode='popLayout'>
                            {regularNews.map((item, index) => (
                                <motion.article key={`${item.id}-${filter}`} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5, delay: index * 0.1 }} onMouseEnter={() => setHoveredCard(index)} onMouseLeave={() => setHoveredCard(null)} onClick={() => setSelectedArticle(item)} className='group cursor-pointer'>
                                    <div className='relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.06] group-hover:border-white/[0.15] transition-all duration-500'>
                                        <div className='relative aspect-[16/10] overflow-hidden'>
                                            <motion.img src={item.image} alt={item.title} className='w-full h-full object-cover' animate={{ scale: hoveredCard === index ? 1.05 : 1 }} transition={{ duration: 0.6 }} />
                                            <div className='absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-40' />

                                            <div className='absolute top-4 left-4'>
                                                <span className='px-3 py-1 rounded-lg text-[9px] font-bold uppercase' style={{ background: categoryColors[item.category].bg, color: categoryColors[item.category].text }}>{item.category}</span>
                                            </div>
                                            <div className='absolute top-4 right-4 flex items-center gap-1.5 text-white/50'>
                                                <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>
                                                <span className='font-gs text-[10px]'>{item.readTime}</span>
                                            </div>
                                        </div>

                                        <div className='p-6'>
                                            <div className='flex items-center justify-between mb-3'>
                                                <span className='font-7 text-white/40 text-sm'>{item.date}</span>
                                                <span className='font-gs text-[10px] text-white/30 flex items-center gap-1'>
                                                    <svg className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' /></svg>
                                                    {item.views}
                                                </span>
                                            </div>
                                            <h3 className='font-2 text-xl text-white leading-tight mb-3 group-hover:text-[#DE5127] transition-colors line-clamp-2'>{item.title}</h3>
                                            <p className='font-gs text-white/40 text-sm leading-relaxed line-clamp-2'>{item.excerpt}</p>
                                            <div className='flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.05] text-white/30 group-hover:text-[#DE5127] transition-colors'>
                                                <span className='font-gs text-[10px] uppercase tracking-wider'>Read More</span>
                                                <motion.svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' animate={{ x: hoveredCard === index ? 4 : 0 }}><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' /></motion.svg>
                                            </div>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className='px-8 sm:px-12 md:px-20 lg:px-28 py-20 border-t border-white/[0.05]'>
                <div className='max-w-3xl mx-auto'>
                    <motion.div className='flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08]' initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <div className='text-center sm:text-left'>
                            <h3 className='font-2 text-2xl text-white mb-1'>Join the <span className='text-[#DE5127]'>Hunt</span></h3>
                            <p className='font-gs text-white/40 text-sm'>Early access to drops & rewards</p>
                        </div>
                        <div className='flex gap-3 w-full sm:w-auto'>
                            <input type="email" placeholder="Email" className='flex-1 sm:w-48 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#DE5127]/50 focus:outline-none font-gs' />
                            <motion.button className='px-6 py-3 bg-[#DE5127] text-white rounded-lg font-gs text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all whitespace-nowrap' whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Subscribe</motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Article Modal */}
            <AnimatePresence>
                {selectedArticle && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8'>
                        {/* Backdrop */}
                        <div className='absolute inset-0 bg-black/95 backdrop-blur-sm' onClick={() => setSelectedArticle(null)} />

                        {/* Modal - Clean Content Focus */}
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className='relative w-full max-w-3xl max-h-[85vh] bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/[0.08]'>
                            {/* Close Button */}
                            <button onClick={() => setSelectedArticle(null)} className='absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all'>
                                <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /></svg>
                            </button>

                            {/* Content */}
                            <div className='overflow-y-auto max-h-[85vh] p-8 sm:p-12'>
                                {/* Meta Header */}
                                <div className='flex items-center gap-3 mb-6'>
                                    <span className='px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase' style={{ background: categoryColors[selectedArticle.category].bg, color: categoryColors[selectedArticle.category].text }}>{selectedArticle.category}</span>
                                    <span className='font-gs text-[11px] text-white/30'>{selectedArticle.date}</span>
                                    <span className='font-gs text-[11px] text-white/30'>•</span>
                                    <span className='font-gs text-[11px] text-white/30'>{selectedArticle.readTime}</span>
                                </div>

                                {/* Title */}
                                <h1 className='font-2 text-2xl sm:text-3xl text-white leading-tight mb-8 pb-8 border-b border-white/[0.08]'>{selectedArticle.title}</h1>

                                {/* Article Content - Clean Format */}
                                <div className='space-y-8'>
                                    {selectedArticle.content.map((section, idx) => {
                                        if (section.type === 'intro') {
                                            return <p key={idx} className='font-gs text-white/70 text-base leading-relaxed'>{section.text}</p>
                                        }
                                        if (section.type === 'heading') {
                                            return <h2 key={idx} className='font-2 text-lg text-[#DE5127] uppercase tracking-wider mt-10'>{section.text}</h2>
                                        }
                                        if (section.type === 'paragraph') {
                                            return <p key={idx} className='font-gs text-white/50 text-sm leading-relaxed'>— {section.text}</p>
                                        }
                                        if (section.type === 'list') {
                                            return (
                                                <div key={idx} className='space-y-2 pl-4'>
                                                    {section.items.map((item, i) => (
                                                        <div key={i} className='flex items-start gap-3 font-gs text-white/60 text-sm py-2 border-b border-white/[0.03] last:border-0'>
                                                            <span className='text-[#DE5127] font-bold'>›</span>
                                                            <span>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                        }
                                        return null
                                    })}
                                </div>

                                {/* Footer */}
                                <div className='flex items-center justify-between mt-12 pt-6 border-t border-white/[0.08]'>
                                    <span className='font-gs text-[10px] text-white/20'>By {selectedArticle.author}</span>
                                    <button onClick={() => setSelectedArticle(null)} className='font-gs text-[11px] text-white/40 hover:text-[#DE5127] transition-colors uppercase tracking-wider'>Close Article</button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default News
