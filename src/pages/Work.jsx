import { Link } from 'react-router-dom'
import { useRef, useCallback, useEffect, useState } from 'react'

const projects = [
    {
        title: "Topps & Borussia Dortmund",
        category: "Brand",
        tags: ["Content", "Product"],
        image: "https://cdn.prod.website-files.com/6766a97af7951c214f154267/679cc558eb3dc6e7bb06e52f_9a031345e747b405445bdbb16e748d93_Topps%20Teamset%20BVB%20Thumbnail%202.avif",
        year: "2024"
    },
    {
        title: "TOTO Dutch Darts Masters",
        category: "Visuals",
        tags: ["Campaign"],
        image: "https://cdn.prod.website-files.com/6766a97af7951c214f154267/67acf80cb39c5d65b61e696b_TOTO%20Dutch%20Darts%20Masters%20Thumbnail%205.avif",
        year: "2024"
    },
    {
        title: "Manchester United Hall of Heroes",
        category: "Content",
        tags: ["Motion"],
        image: "https://cdn.prod.website-files.com/6776815c172cb3537fafa18b/67d1c6a36ee550c98bfe0b71_TOPPS-MUFC-HALLOFHEROES-THUMB.jpg",
        year: "2025"
    },
    {
        title: "Derbby Campaign",
        category: "Campaign",
        tags: ["Visuals", "Digital"],
        image: "/ball.webp",
        year: "2025"
    }
];

const Work = () => {
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
        <div className='bg-[#F1F1F1] min-h-screen relative overflow-hidden'>

            {/* Hero Section */}
            <section
                className='relative min-h-[70vh] sm:min-h-[80vh] overflow-hidden'
                ref={sectionRef}
                onPointerMove={handlePointerMove}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
            >
                {/* Background grid */}
                <div className='absolute inset-0 pointer-events-none opacity-[0.15]'
                    style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)', backgroundSize: '120px 120px' }}
                ></div>

                {/* Mouse-following glow */}
                <div className='absolute inset-0 pointer-events-none overflow-hidden'>
                    <div
                        ref={spotRef}
                        className='absolute transition-transform duration-500 ease-out'
                        style={{ top: 0, left: 0, transform: 'translate3d(calc(50vw - 100px), calc(40vh - 100px), 0)', willChange: 'transform' }}
                    >
                        <div className='w-[200px] h-[200px] rounded-full border border-[#DE5127]/20 flex items-center justify-center'>
                            <div className='w-[120px] h-[120px] rounded-full'
                                style={{ background: 'radial-gradient(circle, rgba(222,81,39,0.25) 0%, rgba(222,81,39,0.08) 50%, transparent 70%)' }}
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
                            <span className='font-gs text-[9px] sm:text-[10px] text-[#DE5127] font-bold tracking-[0.5em] uppercase'>Portfolio</span>
                        </div>
                    </div>

                    {/* Title */}
                    <div className='mb-8'>
                        <p className='font-gs text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.6em] text-black/25 mb-6'>
                            Selected Works
                        </p>
                        <div className='flex items-center'>
                            <h1 className='font-2 text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] xl:text-[10vw] text-black leading-[0.82] tracking-tighter'>
                                WORK
                            </h1>
                            <div className='w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 rounded-full bg-[#DE5127] flex items-center justify-center shadow-lg shadow-[#DE5127]/20 ml-2 sm:ml-3 md:ml-4'>
                                <span className='font-2 text-white text-[7px] sm:text-[9px] md:text-xs'>R</span>
                            </div>
                        </div>
                    </div>

                    {/* Tagline + count */}
                    <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-6'>
                        <div className='flex items-center gap-4'>
                            <span className='font-gs text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.5em] text-black/20'>Sports</span>
                            <span className='w-6 sm:w-10 h-px bg-[#DE5127]/40'></span>
                            <span className='font-7 italic text-[#DE5127] text-base sm:text-xl md:text-2xl tracking-tight'>Exclusive</span>
                        </div>
                        <span className='font-8 text-6xl sm:text-7xl text-black/[0.06] leading-none'>04</span>
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className='px-8 sm:px-12 md:px-20 lg:px-28 py-20 sm:py-28 relative z-10' style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 1200px' }}>

                {/* Filter bar */}
                <div className='flex flex-wrap items-center gap-3 mb-16 sm:mb-20'>
                    {['All', 'Brand', 'Campaign', 'Content', 'Motion', 'Visuals'].map((filter, i) => (
                        <button key={filter} className={`font-gs text-[10px] font-bold tracking-[0.2em] uppercase rounded-full px-5 py-2.5 border transition-all duration-300 ${i === 0 ? 'bg-black text-white border-black' : 'bg-transparent text-black/40 border-black/10 hover:border-[#DE5127] hover:text-[#DE5127]'}`}>
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-20 lg:gap-y-28'>
                    {projects.map((project, i) => (
                        <article key={i} className={`group cursor-pointer ${i % 3 === 1 ? 'md:mt-16' : ''}`}>
                            {/* Image */}
                            <div className='relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-[4/3] mb-8'>
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    loading="lazy"
                                    decoding="async"
                                    width="800"
                                    height="600"
                                    className='w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-expo'
                                />
                                {/* Gradient overlay */}
                                <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700' />

                                {/* Hover arrow */}
                                <div className='absolute top-6 right-6'>
                                    <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/0 border border-white/0 group-hover:bg-white group-hover:border-white flex items-center justify-center transition-all duration-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'>
                                        <svg className='w-4 h-4 text-black -rotate-45' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                            <path strokeLinecap='round' strokeLinejoin='round' d='M17 8l4 4m0 0l-4 4m4-4H3' />
                                        </svg>
                                    </div>
                                </div>

                                {/* Year badge */}
                                <div className='absolute bottom-6 left-6'>
                                    <span className='font-gs text-[9px] font-bold tracking-[0.2em] uppercase text-white bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10'>
                                        {project.year}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className='flex justify-between items-start gap-4 px-1'>
                                <div>
                                    {/* Tags */}
                                    <div className='flex flex-wrap items-center gap-2 mb-4'>
                                        <span className='font-gs text-[9px] font-bold tracking-[0.2em] uppercase text-[#DE5127]'>{project.category}</span>
                                        {project.tags.map((tag) => (
                                            <span key={tag} className='font-gs text-[9px] font-bold tracking-[0.2em] uppercase text-black/25 before:content-["/"] before:mr-2 before:text-black/10'>{tag}</span>
                                        ))}
                                    </div>
                                    {/* Title */}
                                    <h3 className='font-gs text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-tight leading-[1.1] group-hover:text-[#DE5127] transition-colors duration-500'>
                                        {project.title}
                                    </h3>
                                </div>
                                {/* Number */}
                                <span className='font-8 text-3xl sm:text-4xl text-black/[0.06] leading-none shrink-0'>0{i + 1}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* CTA Section — reuse footer CTA style */}
            <section className='relative bg-[#0A0A0A] overflow-hidden'>
                <div className='font-2 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[40%] text-[25vw] font-black text-white/[0.02] pointer-events-none select-none whitespace-nowrap leading-none'>
                    HNTRS
                </div>

                <div className='relative z-10 px-8 sm:px-12 md:px-20 lg:px-28 py-28 sm:py-36'>
                    <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-12 lg:gap-20'>
                        <div>
                            <span className='inline-flex items-center gap-3 mb-6'>
                                <span className='w-8 h-px bg-[#DE5127]'></span>
                                <span className='font-gs text-[10px] sm:text-xs text-[#DE5127] font-bold tracking-[0.5em] uppercase'>Let's work together</span>
                            </span>
                            <h2 className='font-2 text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[6vw] text-white leading-[0.85] tracking-tighter'>
                                READY TO<br />
                                <span className='text-[#DE5127]'>HUNT?</span>
                            </h2>
                        </div>
                        <Link to="/contact" className='group shrink-0 mb-2'>
                            <div className='relative bg-[#DE5127] text-white rounded-full px-10 sm:px-14 py-5 sm:py-6 overflow-hidden'>
                                <span className='absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo'></span>
                                <span className='relative z-10 font-gs text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] group-hover:text-[#DE5127] transition-colors duration-500 flex items-center gap-3'>
                                    Start a Project
                                    <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M17 8l4 4m0 0l-4 4m4-4H3' />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Work
