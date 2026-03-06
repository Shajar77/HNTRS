import { useRef, useCallback, useEffect, useState } from 'react'

const newsItems = [
    {
        date: "April 28, 2025",
        title: "Welcome to the club: Alex & Merel",
        category: "Studio News",
        image: "https://cdn.prod.website-files.com/6776815c172cb3537fafa18b/680f971f63ef26fed12203c5_Dual%20shot.avif",
        readTime: "4 min read"
    },
    {
        date: "February 21, 2025",
        title: "From Sketch to Stadium: Designing MUFC Hall of Fame",
        category: "Case Study",
        image: "https://cdn.prod.website-files.com/6776815c172cb3537fafa18b/67d1c90483bdbb1ce32746aa_TOPPS-MUFC-HALLOFHEROES-THUMB-2.avif",
        readTime: "6 min read"
    },
    {
        date: "August 09, 2025",
        title: "A new chapter for GRAPHIC HUNTERS",
        category: "Studio News",
        image: "https://cdn.prod.website-files.com/6776815c172cb3537fafa18b/67c16b52c29c0bf2116111dd_gh.avif",
        readTime: "3 min read"
    }
];

const News = () => {
    const spotRef = useRef(null)
    const sectionRef = useRef(null)
    const rectRef = useRef(null)
    const rafRef = useRef(null)
    const pointRef = useRef({ x: 0, y: 0 })
    const [isInteractive, setIsInteractive] = useState(false)

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
        const x = pointRef.current.x - rectRef.current.left - 100
        const y = pointRef.current.y - rectRef.current.top - 100
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
        spotRef.current.style.transform = 'translate3d(calc(50vw - 100px), calc(40vh - 100px), 0)'
    }, [])

    return (
        <div className='bg-[#0A0A0A] min-h-screen relative overflow-hidden'>

            {/* Hero Section */}
            <section
                className='relative min-h-[70vh] sm:min-h-[80vh] overflow-hidden'
                ref={sectionRef}
                onPointerMove={handlePointerMove}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
            >
                {/* Dark grid */}
                <div className='absolute inset-0 pointer-events-none opacity-[0.08]'
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '120px 120px' }}
                ></div>

                {/* Mouse-following glow */}
                <div className='absolute inset-0 pointer-events-none overflow-hidden'>
                    <div
                        ref={spotRef}
                        className='absolute transition-transform duration-500 ease-out'
                        style={{ top: 0, left: 0, transform: 'translate3d(calc(50vw - 100px), calc(40vh - 100px), 0)', willChange: 'transform' }}
                    >
                        <div className='w-[200px] h-[200px] rounded-full border border-[#DE5127]/15 flex items-center justify-center'>
                            <div className='w-[120px] h-[120px] rounded-full'
                                style={{ background: 'radial-gradient(circle, rgba(222,81,39,0.2) 0%, rgba(222,81,39,0.06) 50%, transparent 70%)' }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Hero content */}
                <div className='relative z-10 flex flex-col justify-end min-h-[70vh] sm:min-h-[80vh] px-8 sm:px-12 md:px-20 lg:px-28 pb-16 sm:pb-20 pt-32 sm:pt-40'>
                    {/* Top label */}
                    <div className='absolute top-32 sm:top-40 right-8 sm:right-12 md:right-20 lg:right-28'>
                        <div className='flex items-center gap-3'>
                            <span className='w-10 h-px bg-[#DE5127]'></span>
                            <span className='font-gs text-[9px] sm:text-[10px] text-[#DE5127] font-bold tracking-[0.5em] uppercase'>Journal</span>
                        </div>
                    </div>

                    {/* Title */}
                    <div className='mb-8'>
                        <p className='font-gs text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.6em] text-white/20 mb-6'>
                            Latest Stories
                        </p>
                        <div className='flex items-center'>
                            <h1 className='font-2 text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] xl:text-[10vw] text-white leading-[0.82] tracking-tighter'>
                                NEWS
                            </h1>
                            <div className='w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 rounded-full bg-[#DE5127] flex items-center justify-center shadow-lg shadow-[#DE5127]/20 ml-2 sm:ml-3 md:ml-4'>
                                <span className='font-2 text-white text-[7px] sm:text-[9px] md:text-xs'>R</span>
                            </div>
                        </div>
                    </div>

                    {/* Tagline + count */}
                    <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-6'>
                        <div className='flex items-center gap-4'>
                            <span className='font-gs text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.5em] text-white/15'>Behind the scenes</span>
                            <span className='w-6 sm:w-10 h-px bg-[#DE5127]/40'></span>
                            <span className='font-7 italic text-[#DE5127] text-base sm:text-xl md:text-2xl tracking-tight'>& insights</span>
                        </div>
                        <span className='font-8 text-6xl sm:text-7xl text-white/[0.04] leading-none'>03</span>
                    </div>
                </div>
            </section>

            {/* Featured Article */}
            <section className='px-8 sm:px-12 md:px-20 lg:px-28 py-16 sm:py-24 relative z-10' style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 900px' }}>
                <article className='group cursor-pointer'>
                    <div className='flex flex-col lg:flex-row gap-10 lg:gap-16'>
                        {/* Image */}
                        <div className='w-full lg:w-[60%] relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-[16/10]'>
                            <img
                                src={newsItems[0].image}
                                alt={newsItems[0].title}
                                loading="lazy"
                                decoding="async"
                                width="1000"
                                height="625"
                                className='w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-expo'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700' />

                            {/* Featured badge */}
                            <div className='absolute top-6 left-6'>
                                <span className='font-gs text-[9px] font-bold tracking-[0.3em] uppercase text-white bg-[#DE5127] rounded-full px-4 py-2'>
                                    Featured
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className='w-full lg:w-[40%] flex flex-col justify-center'>
                            <div className='flex items-center gap-3 mb-6'>
                                <span className='font-gs text-[9px] font-bold tracking-[0.2em] uppercase text-[#DE5127]'>{newsItems[0].category}</span>
                                <span className='w-px h-3 bg-white/10'></span>
                                <span className='font-gs text-[9px] font-bold tracking-[0.2em] uppercase text-white/25'>{newsItems[0].readTime}</span>
                            </div>

                            <h2 className='font-gs text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight leading-[1.1] text-white group-hover:text-[#DE5127] transition-colors duration-500 mb-6'>
                                {newsItems[0].title}
                            </h2>

                            <p className='font-7 text-white/40 text-base sm:text-lg italic tracking-tight mb-8'>
                                {newsItems[0].date}
                            </p>

                            <div className='flex items-center gap-3 font-gs text-[10px] text-white/30 font-bold tracking-[0.3em] uppercase group-hover:text-[#DE5127] transition-colors duration-500'>
                                Read Article
                                <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M17 8l4 4m0 0l-4 4m4-4H3' />
                                </svg>
                            </div>
                        </div>
                    </div>
                </article>
            </section>

            {/* Divider */}
            <div className='px-8 sm:px-12 md:px-20 lg:px-28'>
                <div className='h-px bg-white/5'></div>
            </div>

            {/* More Articles */}
            <section className='px-8 sm:px-12 md:px-20 lg:px-28 py-16 sm:py-24 relative z-10' style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 1000px' }}>
                <div className='flex items-center justify-between mb-14 sm:mb-20'>
                    <div className='flex items-center gap-3'>
                        <span className='w-8 h-px bg-[#DE5127]'></span>
                        <span className='font-gs text-[9px] sm:text-[10px] text-white/30 font-bold tracking-[0.5em] uppercase'>More Stories</span>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16'>
                    {newsItems.slice(1).map((item, i) => (
                        <article key={i} className='group cursor-pointer'>
                            {/* Image */}
                            <div className='relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-[4/3] mb-8'>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    loading="lazy"
                                    decoding="async"
                                    width="800"
                                    height="600"
                                    className='w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-expo'
                                />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700' />

                                {/* Hover arrow */}
                                <div className='absolute top-6 right-6'>
                                    <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/0 border border-white/0 group-hover:bg-white group-hover:border-white flex items-center justify-center transition-all duration-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'>
                                        <svg className='w-4 h-4 text-black -rotate-45' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                            <path strokeLinecap='round' strokeLinejoin='round' d='M17 8l4 4m0 0l-4 4m4-4H3' />
                                        </svg>
                                    </div>
                                </div>

                                {/* Category badge */}
                                <div className='absolute bottom-6 left-6'>
                                    <span className='font-gs text-[9px] font-bold tracking-[0.2em] uppercase text-white bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10'>
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className='px-1'>
                                <div className='flex items-center gap-3 mb-4'>
                                    <span className='font-7 text-[#DE5127] text-sm italic'>{item.date}</span>
                                    <span className='w-px h-3 bg-white/10'></span>
                                    <span className='font-gs text-[9px] font-bold tracking-[0.2em] uppercase text-white/20'>{item.readTime}</span>
                                </div>
                                <h3 className='font-gs text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-tight leading-[1.1] text-white group-hover:text-[#DE5127] transition-colors duration-500'>
                                    {item.title}
                                </h3>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className='px-8 sm:px-12 md:px-20 lg:px-28 py-16 sm:py-24 relative z-10' style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 700px' }}>
                <div className='relative rounded-2xl sm:rounded-3xl overflow-hidden'>
                    {/* Background */}
                    <div className='absolute inset-0 bg-gradient-to-br from-[#DE5127]/20 via-[#0A0A0A] to-[#0A0A0A]'></div>
                    <div className='absolute inset-0 border border-white/5 rounded-2xl sm:rounded-3xl'></div>

                    <div className='relative z-10 px-8 sm:px-12 md:px-20 py-16 sm:py-24 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12'>
                        <div className='max-w-lg'>
                            <span className='inline-flex items-center gap-3 mb-6'>
                                <span className='w-8 h-px bg-[#DE5127]'></span>
                                <span className='font-gs text-[10px] text-[#DE5127] font-bold tracking-[0.5em] uppercase'>Newsletter</span>
                            </span>
                            <h2 className='font-2 text-[10vw] sm:text-[6vw] md:text-[5vw] lg:text-[3.5vw] text-white leading-[0.85] tracking-tighter mb-4'>
                                JOIN THE<br />
                                <span className='text-[#DE5127]'>INNER CIRCLE</span>
                            </h2>
                            <p className='font-gs text-sm sm:text-base text-white/30 leading-relaxed'>
                                Get exclusive insights into our process and the latest from the world of sports design.
                            </p>
                        </div>

                        <div className='flex flex-col sm:flex-row gap-4 w-full lg:w-auto lg:min-w-[400px]'>
                            <input
                                type="email"
                                placeholder="YOUR EMAIL"
                                className='flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-5 text-[10px] sm:text-xs font-bold tracking-[0.3em] text-white placeholder:text-white/20 focus:border-[#DE5127]/50 focus:outline-none transition-all duration-300 font-gs'
                            />
                            <button className='group/btn relative bg-white text-black rounded-full px-10 py-5 overflow-hidden shrink-0'>
                                <span className='absolute inset-0 bg-[#DE5127] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-expo'></span>
                                <span className='relative z-10 font-gs text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] group-hover/btn:text-white transition-colors duration-500'>
                                    Subscribe
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default News
