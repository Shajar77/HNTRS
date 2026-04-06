import { useRef, useEffect, useState } from 'react'

function useInView(options) {
    const ref = useRef(null)
    const [inView, setInView] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
            { threshold: 0.1, ...options }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return [ref, inView]
}

const WhatIsSection = () => {
    const [headerRef, headerInView] = useInView()
    const [leftRef, leftInView] = useInView()
    const [rightRef, rightInView] = useInView()
    const [pillsRef, pillsInView] = useInView()

    return (
        <section className='relative py-28 sm:py-36 px-8 sm:px-12 md:px-20 lg:px-28 overflow-hidden'>
            <div className='absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#DE5127]/5 -translate-y-1/2 translate-x-1/2 pointer-events-none' />
            <div className='absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-black/[0.02] translate-y-1/2 -translate-x-1/2 pointer-events-none' />
            
            <div className='max-w-7xl mx-auto relative z-10'>
                <div
                    ref={headerRef}
                    className={`text-center mb-20 transition-all duration-700 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                >
                    <div className='flex items-center justify-center gap-4 mb-6'>
                        <span className='w-16 h-[2px] bg-[#DE5127]' />
                        <span className='font-gs text-[10px] text-[#DE5127] font-bold tracking-[0.4em] uppercase'>The Platform</span>
                        <span className='w-16 h-[2px] bg-[#DE5127]' />
                    </div>
                    <h2 className='font-2 text-[clamp(2rem,12vw,5rem)] sm:text-[clamp(2.5rem,7vw,4rem)] lg:text-[clamp(2rem,4.5vw,3.5rem)] text-black leading-[0.9] tracking-[-0.02em] text-safe'>
                        What is HNTRS?
                    </h2>
                </div>

                <div className='grid lg:grid-cols-12 gap-8 lg:gap-12'>
                    <div
                        ref={leftRef}
                        className={`lg:col-span-7 transition-all duration-700 ${leftInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                    >
                        <div className='bg-white/60 backdrop-blur-sm border border-black/[0.06] p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]'>
                            <h3 className='font-7 italic text-[#DE5127] text-xl sm:text-2xl md:text-3xl mb-6 sm:mb-8 text-safe'>
                                The Future of Sports Memorabilia
                            </h3>
                            <div className='space-y-4 sm:space-y-6 font-gs text-black/60 leading-relaxed text-sm sm:text-base'>
                                <p className='text-safe'>
                                    <span className='text-black font-medium'>HNTRS</span> is a next-generation decentralized platform 
                                    revolutionizing how sports digital assets are created, traded, and collected. Built on the 
                                    <span className='text-[#DE5127] font-medium'> Polygon blockchain</span>, we provide athletes, 
                                    sports organizations, digital artists, and fans with a seamless ecosystem to mint, buy, sell, 
                                    and showcase NFTs.
                                </p>
                                <p className='text-safe'>
                                    Every NFT minted on HNTRS represents verifiable ownership of unique digital sports memorabilia — 
                                    from iconic moments and player highlights to exclusive artwork and limited edition collectibles. 
                                    Our platform supports all major sports including football, basketball, tennis, cricket, and more.
                                </p>
                                <p className='text-safe'>
                                    With customizable royalty settings, creators earn from secondary sales forever. Our smart contracts 
                                    ensure transparent, secure transactions with near-zero gas fees thanks to Polygon's efficient 
                                    infrastructure.
                                </p>
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-black/[0.06]'>
                                {[
                                    { label: 'Sports Supported', value: '10+' },
                                    { label: 'Blockchain', value: 'Polygon' },
                                    { label: 'Storage', value: 'IPFS' }
                                ].map((item) => (
                                    <div key={item.label} className='text-center'>
                                        <p className='font-2 text-xl sm:text-2xl text-[#DE5127] mb-1'>{item.value}</p>
                                        <p className='font-gs text-[10px] uppercase tracking-[0.15em] text-black/40'>{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div
                        ref={rightRef}
                        className={`lg:col-span-5 flex flex-col gap-6 transition-all duration-700 delay-200 ${rightInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                    >
                        <div className='grid grid-cols-2 gap-4'>
                                {[
                                { value: '100%', label: 'Decentralized', sub: 'On-chain verified' },
                                { value: '0.1s', label: 'Transaction', sub: 'Lightning fast' },
                                { value: '$0.01', label: 'Average Fee', sub: 'Ultra low cost' },
                                { value: '∞', label: 'Royalties', sub: 'Forever earnings' }
                            ].map((stat, i) => (
                                <div
                                    key={stat.label}
                                    className={`p-4 sm:p-5 md:p-6 bg-white/80 backdrop-blur-sm border border-black/[0.06] hover:border-[#DE5127]/30 transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:scale-[1.02] ${i % 2 === 1 ? 'mt-0 sm:mt-4' : ''}`}
                                >
                                    <p className='font-2 text-2xl sm:text-3xl md:text-4xl text-black mb-2 truncate'>
                                        {stat.value === '∞' ? <span className='text-[#DE5127]'>∞</span> : stat.value}
                                    </p>
                                    <p className='font-gs text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-black font-medium mb-1'>{stat.label}</p>
                                    <p className='font-gs text-[9px] sm:text-[10px] text-black/40'>{stat.sub}</p>
                                </div>
                            ))}
                        </div>

                        <div className='flex-1 overflow-hidden min-h-[200px] relative flex items-start justify-center group/box'>
                             <img 
                                src="/images/smart-contract-visual.jpg" 
                                alt="Smart Contract Architecture" 
                                className="w-[90%] h-[90%] object-contain group-hover/box:scale-105 transition-transform duration-700" 
                            />
                        </div>
                    </div>
                </div>

                <div
                    ref={pillsRef}
                    className={`mt-16 flex flex-wrap justify-center gap-4 transition-all duration-700 delay-500 ${pillsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                >
                    {['Mint NFTs', 'Fixed Price', 'Auctions', 'IPFS Storage', 'Custom Royalties', 'Multi-Sport'].map((item) => (
                        <span key={item} className='px-6 py-3 bg-white/60 backdrop-blur-sm border border-black/[0.08] font-gs text-[11px] uppercase tracking-[0.15em] text-black/60'>
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default WhatIsSection
