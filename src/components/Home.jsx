import { useRef, useCallback, useEffect, useState, startTransition, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'

// ─── PERFORMANCE: Extreme section splitting ───
const WalletConnect = lazy(() => import('./WalletConnect'))
const WhatIsSection = lazy(() => import('./home/WhatIsSection'))
const HowItWorksSection = lazy(() => import('./home/HowItWorksSection'))

const SectionFallback = () => <div className="h-96" />

const Home = () => {
    const { isConnected } = useAccount()
    const [showHeavySections, setShowHeavySections] = useState(false)
    const spotRef = useRef(null)
    const sectionRef = useRef(null)
    const rectRef = useRef(null)
    const rafRef = useRef(null)
    const pointRef = useRef({ x: 0, y: 0 })
    const [isInteractive, setIsInteractive] = useState(false)

    // Unblock the critical LCP path (Hero) by deferring all below-fold logic
    useEffect(() => {
        const timer = setTimeout(() => {
            startTransition(() => setShowHeavySections(true))
        }, 100)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const pointerMedia = window.matchMedia('(pointer: fine)')
        const reduceMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')

        const updateEnabled = () => {
            setIsInteractive(pointerMedia.matches && !reduceMotionMedia.matches)
        }

        updateEnabled()
        pointerMedia.addEventListener('change', updateEnabled)
        reduceMotionMedia.addEventListener('change', updateEnabled)

        return () => {
            pointerMedia.removeEventListener('change', updateEnabled)
            reduceMotionMedia.removeEventListener('change', updateEnabled)
        }
    }, [])

    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [])

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

    const handlePointerEnter = useCallback(() => {
        if (!isInteractive) return
        updateRect()
    }, [isInteractive, updateRect])

    const handlePointerLeave = useCallback(() => {
        if (!spotRef.current) return
        spotRef.current.style.transform = 'translate3d(calc(50vw - 150px), calc(50vh - 150px), 0)'
    }, [])

    const steps = [
        { number: '01', title: 'Connect Wallet', description: 'Link your Web3 wallet to access the platform' },
        { number: '02', title: 'Mint or Browse', description: 'Create your own NFTs or explore the marketplace' },
        { number: '03', title: 'Trade & Collect', description: 'Buy, sell, and build your sports NFT collection' }
    ]

    return (
        <div ref={sectionRef} className='relative bg-[#F1F1F1] overflow-hidden selection:bg-[#DE5127] selection:text-white'>
            {/* Grid background */}
            <div className='absolute inset-0 pointer-events-none opacity-[0.12]'
                style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px)', backgroundSize: '100px 100px' }}
            />

            {/* Mouse glow */}
            <div className='absolute inset-0 pointer-events-none overflow-hidden'>
                <div
                    ref={spotRef}
                    className='absolute transition-transform duration-500 ease-out'
                    style={{ top: 0, left: 0, transform: 'translate3d(calc(50vw - 150px), calc(50vh - 150px), 0)', willChange: 'transform' }}
                >
                    <div className='w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] rounded-full border border-[#DE5127]/30 flex items-center justify-center'>
                        <div className='w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] rounded-full'
                            style={{ background: 'radial-gradient(circle, rgba(222,81,39,0.25) 0%, rgba(222,81,39,0.08) 50%, transparent 70%)' }}
                        />
                    </div>
                </div>
            </div>

            {/* ═══ HERO SECTION — Critical Path ═══ */}
            <section
                onPointerMove={handlePointerMove}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                className='relative min-h-screen flex items-center px-8 sm:px-12 md:px-20 lg:px-28 pt-24 sm:pt-28'
            >
                <div className='relative z-10 max-w-7xl mx-auto w-full py-20'>
                    <div className='grid lg:grid-cols-2 gap-16 lg:gap-24 items-center'>
                        <div className='hero-fade-up'>
                            <div className='flex items-center gap-3 mb-8'>
                                <span className='w-8 h-[2px] bg-[#DE5127]' />
                                <span className='font-gs text-[10px] text-[#DE5127] font-bold tracking-[0.35em] uppercase'>Web3 Sports NFTs</span>
                            </div>

                            <h1 className='font-2 text-[clamp(3rem,14vw,8rem)] sm:text-[clamp(3.5rem,11vw,7rem)] md:text-[clamp(4rem,9vw,6rem)] lg:text-[clamp(3rem,5.5vw,5rem)] text-black leading-[0.85] tracking-[-0.03em] mb-6 text-safe'>
                                HNTRS
                            </h1>
                            
                            <p className='font-7 italic text-[#DE5127] text-lg sm:text-xl md:text-2xl mb-8 text-safe'>
                                The Future of Sports Collectibles
                            </p>

                            <p className='font-gs text-sm text-black/50 mb-12 max-w-md leading-relaxed text-safe'>
                                Create, trade, and collect unique sports NFTs on the blockchain. 
                                Built for athletes, fans, and creators.
                            </p>

                            <div className='flex flex-col sm:flex-row gap-4'>
                                {isConnected ? (
                                    <>
                                        <Link to='/mint'>
                                            <button className='btn-hover-scale px-8 py-4 bg-black text-white font-gs font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-[#DE5127] transition-colors duration-300'>
                                                Start Minting
                                            </button>
                                        </Link>
                                        <Link to='/marketplace'>
                                            <button className='btn-hover-scale px-8 py-4 border border-black/20 text-black font-gs font-bold text-[11px] uppercase tracking-[0.2em] hover:border-black hover:bg-black hover:text-white transition-all duration-300'>
                                                Explore
                                            </button>
                                        </Link>
                                    </>
                                ) : (
                                    <Suspense fallback={
                                        <button className='btn-hover-scale px-8 py-4 bg-black text-white font-gs font-bold text-[11px] uppercase tracking-[0.2em]'>
                                            Connect Wallet
                                        </button>
                                    }>
                                        <WalletConnect />
                                    </Suspense>
                                )}
                            </div>
                        </div>

                        <div className='hero-scale-in relative flex items-center justify-center w-full'>
                            <div className='relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 max-w-full'>
                                <div className='absolute inset-0 border border-[#DE5127]/20 spin-slow-30' />
                                <div className='absolute inset-3 sm:inset-4 border border-black/10 spin-slow-reverse-25' />
                                <div className='absolute inset-6 sm:inset-8 flex flex-col items-center justify-center p-4'>
                                    <img 
                                        src="/images/logo.png" 
                                        alt="HNTRS Logo" 
                                        className="w-full h-full object-contain filter drop-shadow-sm max-w-[120px] sm:max-w-[160px] md:max-w-full" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='hero-fade-in-delayed absolute bottom-8 left-1/2 -translate-x-1/2'>
                    <div className='w-px h-12 bg-gradient-to-b from-[#DE5127] to-transparent' />
                </div>
            </section>

            {/* ═══ BELOW-FOLD SECTIONS — Lazy and Deferred ═══ */}
            {showHeavySections && (
                <Suspense fallback={<SectionFallback />}>
                    <WhatIsSection />
                    <HowItWorksSection steps={steps} />
                </Suspense>
            )}
        </div>
    )
}

export default Home
