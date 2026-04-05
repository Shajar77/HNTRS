import { Link } from 'react-router-dom'
import { motion } from 'motion/react'

const collections = [
    {
        id: '01',
        title: 'Premier',
        subtitle: 'Premier League Legends',
        description: 'Own iconic moments from the greatest football league. Limited edition NFTs featuring legendary goals and match-winning performances.',
        image: 'https://images.unsplash.com/photo-1522778119026-d647f0565c6a?w=1200&q=80',
        supply: '500',
        price: '50 MATIC',
        tags: ['Football', 'Limited']
    },
    {
        id: '02',
        title: 'Hoops',
        subtitle: 'NBA Moments',
        description: 'Basketball history on the blockchain. From slam dunks to buzzer beaters, collect the most electrifying NBA moments.',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80',
        supply: '750',
        price: '75 MATIC',
        tags: ['Basketball', 'Rare']
    },
    {
        id: '03',
        title: 'Cricket',
        subtitle: 'Cricket Icons',
        description: "The gentleman's game meets digital collectibles. Centuries, wickets, and unforgettable moments from worldwide cricket.",
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80',
        supply: '300',
        price: '40 MATIC',
        tags: ['Cricket', 'Premium']
    },
    {
        id: '04',
        title: 'Courts',
        subtitle: 'Grand Slam Series',
        description: 'Grand Slam champions and historic match points. Collect NFTs celebrating the elegance of professional tennis.',
        image: 'https://images.unsplash.com/photo-1622163642998-1ea38b1ade5b?w=1200&q=80',
        supply: '400',
        price: '45 MATIC',
        tags: ['Tennis', 'Champions']
    }
]

const Work = () => {
    return (
        <div className='min-h-screen bg-[#F1F1F1]'>
            {/* Hero */}
            <section className='px-8 sm:px-12 md:px-20 lg:px-28 py-20 sm:py-28 lg:py-36 border-b border-black/5'>
                <div className='max-w-7xl mx-auto'>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className='flex items-center gap-3 mb-8'>
                            <span className='w-12 h-[2px] bg-[#DE5127]'></span>
                            <span className='font-gs text-[10px] text-[#DE5127] font-bold tracking-[0.4em] uppercase'>Collections</span>
                        </div>
                        
                        <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16'>
                            <h1 className='font-2 text-[15vw] sm:text-[12vw] lg:text-[10vw] text-black leading-[0.85] tracking-tighter'>
                                NFT<br />
                                <span className='text-[#DE5127]'>DROPS</span>
                            </h1>
                            <p className='font-gs text-black/40 text-base lg:text-lg max-w-sm lg:pb-4'>
                                Exclusive sports NFT collections minted on Polygon. Own a piece of sporting history.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className='flex flex-wrap gap-12 sm:gap-16 pt-8 border-t border-black/10'>
                            <div>
                                <p className='font-2 text-4xl sm:text-5xl text-black'>04</p>
                                <p className='font-gs text-[10px] text-black/40 uppercase tracking-[0.2em] mt-1'>Collections</p>
                            </div>
                            <div>
                                <p className='font-2 text-4xl sm:text-5xl text-black'>1950</p>
                                <p className='font-gs text-[10px] text-black/40 uppercase tracking-[0.2em] mt-1'>Total NFTs</p>
                            </div>
                            <div>
                                <p className='font-2 text-4xl sm:text-5xl text-[#DE5127]'>40+</p>
                                <p className='font-gs text-[10px] text-black/40 uppercase tracking-[0.2em] mt-1'>MATIC Floor</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Collections Grid */}
            <section className='px-8 sm:px-12 md:px-20 lg:px-28 py-16 sm:py-24'>
                <div className='max-w-7xl mx-auto'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
                        {collections.map((collection, index) => (
                            <motion.article
                                key={collection.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`group relative ${index === 0 || index === 3 ? 'lg:translate-y-12' : ''}`}
                            >
                                {/* Image */}
                                <div className='relative aspect-[4/5] overflow-hidden bg-black mb-6'>
                                    <img
                                        src={collection.image}
                                        alt={collection.title}
                                        loading="lazy"
                                        className='w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700'
                                    />
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
                                    
                                    {/* Number */}
                                    <div className='absolute top-6 left-6'>
                                        <span className='font-2 text-7xl sm:text-8xl text-white/20'>{collection.id}</span>
                                    </div>

                                    {/* Hover overlay */}
                                    <div className='absolute inset-0 bg-[#DE5127]/0 group-hover:bg-[#DE5127]/10 transition-colors duration-500' />

                                    {/* CTA */}
                                    <Link to="/marketplace">
                                        <div className='absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500'>
                                            <div className='bg-white text-black px-6 py-3 font-gs text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-[#DE5127] hover:text-white transition-colors'>
                                                View Collection
                                                <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                </div>

                                {/* Content */}
                                <div className='flex justify-between items-start'>
                                    <div>
                                        <div className='flex items-center gap-2 mb-2'>
                                            {collection.tags.map((tag, i) => (
                                                <span key={tag} className='font-gs text-[9px] text-[#DE5127] font-bold uppercase tracking-[0.15em]'>
                                                    {tag}
                                                    {i < collection.tags.length - 1 && <span className='text-black/20 ml-2'>/</span>}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className='font-2 text-3xl sm:text-4xl text-black mb-1 group-hover:text-[#DE5127] transition-colors'>
                                            {collection.title}
                                        </h3>
                                        <p className='font-gs text-sm text-black/50 mb-3'>{collection.subtitle}</p>
                                        <p className='font-gs text-sm text-black/40 leading-relaxed max-w-sm'>
                                            {collection.description}
                                        </p>
                                    </div>
                                    
                                    <div className='text-right'>
                                        <p className='font-2 text-xl text-black'>{collection.price}</p>
                                        <p className='font-gs text-[10px] text-black/30 uppercase tracking-[0.1em]'>{collection.supply} items</p>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className='px-8 sm:px-12 md:px-20 lg:px-28 py-20 sm:py-28 bg-black'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='max-w-4xl mx-auto text-center'
                >
                    <p className='font-gs text-[10px] text-[#DE5127] font-bold tracking-[0.5em] uppercase mb-6'>Start Hunting</p>
                    <h2 className='font-2 text-[10vw] sm:text-[8vw] lg:text-[5vw] text-white leading-[0.9] tracking-tighter mb-8'>
                        Ready to Collect?
                    </h2>
                    <div className='flex flex-col sm:flex-row justify-center gap-4'>
                        <Link to="/marketplace">
                            <button className='group font-gs bg-[#DE5127] text-white px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-white hover:text-black transition-colors duration-300'>
                                Browse All
                                <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                                </svg>
                            </button>
                        </Link>
                        <Link to="/mint">
                            <button className='font-gs border border-white/20 text-white px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] hover:border-[#DE5127] hover:text-[#DE5127] transition-colors duration-300'>
                                Mint Yours
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    )
}

export default Work
