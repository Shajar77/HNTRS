import { useRef, useEffect, useState, Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'

// Defer WalletConnect inside CTA too
const WalletConnect = lazy(() => import('../WalletConnect'))

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

const CTASection = () => {
    const { isConnected } = useAccount()
    const [ref, inView] = useInView()

    return (
        <section className='relative py-24 sm:py-32 px-8 sm:px-12 md:px-20 lg:px-28 bg-[#0A0A0A] overflow-hidden'>
            <div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#DE5127]/30 to-transparent' />
            
            {/* Dark mode decorative glow */}
            <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-[#DE5127]/5 rounded-full blur-[120px] pointer-events-none' />

            <div className='max-w-4xl mx-auto text-center relative z-10'>
                <div
                    ref={ref}
                    className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <div className='flex items-center justify-center gap-4 mb-6'>
                        <span className='w-16 h-[2px] bg-[#DE5127]' />
                        <span className='font-gs text-[10px] text-[#DE5127] font-bold tracking-[0.35em] uppercase'>Get Started</span>
                        <span className='w-16 h-[2px] bg-[#DE5127]' />
                    </div>
                    <h2 className='font-2 text-[10vw] sm:text-[7vw] lg:text-[4vw] text-white leading-[0.9] tracking-[-0.02em] mb-6'>
                        Ready to Join?
                    </h2>
                    <p className='font-gs text-base text-white/50 mb-12 max-w-lg mx-auto leading-relaxed'>
                        Start minting, trading, and collecting sports NFTs today. 
                        Connect your wallet and explore the future.
                    </p>
                    <div className='flex flex-col sm:flex-row justify-center gap-4'>
                        {isConnected ? (
                            <>
                                <Link to='/mint'>
                                    <button className='btn-hover-scale px-12 py-5 bg-[#DE5127] text-white font-gs font-bold text-[11px] uppercase tracking-[0.25em] hover:bg-white hover:text-black transition-all duration-300 shadow-lg shadow-[#DE5127]/20'>
                                        Mint Your First NFT →
                                    </button>
                                </Link>
                                <Link to='/marketplace'>
                                    <button className='btn-hover-scale px-12 py-5 border border-white/10 text-white font-gs font-bold text-[11px] uppercase tracking-[0.25em] hover:bg-[#DE5127] hover:border-[#DE5127] transition-all duration-300'>
                                        Browse Marketplace
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <div className='flex justify-center'>
                                <Suspense fallback={
                                    <button className='btn-hover-scale px-12 py-5 bg-[#DE5127] text-white font-gs font-bold text-[11px] uppercase tracking-[0.25em]'>
                                        Connect Wallet
                                    </button>
                                }>
                                    <WalletConnect />
                                </Suspense>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTASection
