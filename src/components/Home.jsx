import { useRef, useCallback, useEffect, useState } from 'react'

const Home = () => {
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
        spotRef.current.style.transform = 'translate3d(calc(50vw - 100px), calc(50vh - 100px), 0)'
    }, [])

    return (
        <section
            ref={sectionRef}
            className='relative bg-[#F1F1F1] overflow-hidden selection:bg-[#DE5127] selection:text-white min-h-screen'
            onPointerMove={handlePointerMove}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        >

            {/* Background grid */}
            <div className='absolute inset-0 pointer-events-none opacity-[0.15]'
                style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)', backgroundSize: '120px 120px' }}
            ></div>

            {/* Mouse-following orange glow */}
            <div className='absolute inset-0 pointer-events-none overflow-hidden'>
                <div
                    ref={spotRef}
                    className='absolute transition-transform duration-500 ease-out'
                    style={{ top: 0, left: 0, transform: 'translate3d(calc(50vw - 100px), calc(50vh - 100px), 0)', willChange: 'transform' }}
                >
                    {/* Outer ring */}
                    <div className='w-[200px] h-[200px] rounded-full border border-[#DE5127]/20 flex items-center justify-center'>
                        {/* Inner glow */}
                        <div className='w-[120px] h-[120px] rounded-full'
                            style={{ background: 'radial-gradient(circle, rgba(222,81,39,0.25) 0%, rgba(222,81,39,0.08) 50%, transparent 70%)' }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Main layout */}
            <div className='relative z-10 flex flex-col justify-between min-h-screen px-8 sm:px-12 md:px-20 lg:px-28 pt-28 sm:pt-36 pb-10 sm:pb-14'>

                {/* Top right label */}
                <div className='flex justify-end'>
                    <div className='flex items-center gap-3'>
                        <span className='w-10 h-px bg-[#DE5127]'></span>
                        <span className='font-gs text-[9px] sm:text-[10px] text-[#DE5127] font-bold tracking-[0.5em] uppercase'>Creative Studio</span>
                    </div>
                </div>

                {/* Center — HNTRS */}
                <div className='flex flex-col items-center justify-center flex-1 py-8'>
                    {/* Overline */}
                    <p className='font-gs text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.6em] text-black/25 mb-8 sm:mb-10'>
                        Graphic Hunters®
                    </p>

                    {/* Main title with R at end */}
                    <div className='flex items-center justify-center'>
                        <h1 className='font-2 text-[15vw] sm:text-[18vw] md:text-[15vw] lg:text-[13vw] xl:text-[11vw] text-black leading-[0.82] tracking-tighter'>
                            HNTRS
                        </h1>
                        <div className='w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 rounded-full bg-[#DE5127] flex items-center justify-center shadow-lg shadow-[#DE5127]/20 ml-2 sm:ml-3 md:ml-4'>
                            <span className='font-2 text-white text-[7px] sm:text-[9px] md:text-xs'>R</span>
                        </div>
                    </div>

                    {/* Tagline */}
                    <div className='mt-8 sm:mt-10 flex items-center gap-3 sm:gap-5'>
                        <span className='font-gs text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.5em] text-black/20'>The design studio</span>
                        <span className='w-6 sm:w-10 h-px bg-[#DE5127]/40'></span>
                        <span className='font-7 italic text-[#DE5127] text-base sm:text-xl md:text-2xl tracking-tight'>exclusively in sports</span>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-3'>
                        <div className='w-1.5 h-1.5 rounded-full bg-[#DE5127] animate-pulse'></div>
                        <span className='font-gs text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.4em] text-black/20'>Lahore, PK</span>
                    </div>

                    <div className='flex flex-col items-center gap-2'>
                        <div className='w-px h-10 relative overflow-hidden'>
                            <div className='absolute inset-0 bg-gradient-to-b from-[#DE5127] to-transparent animate-scroll-line'></div>
                        </div>
                        <span className='font-gs text-[7px] font-bold uppercase tracking-[0.5em] text-black/20'>Scroll</span>
                    </div>

                    <span className='font-gs text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.4em] text-black/20'>Est. 2021</span>
                </div>
            </div>
        </section>
    )
}

export default Home
