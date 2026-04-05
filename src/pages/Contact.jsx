import { useRef, useCallback, useState, useEffect } from 'react'

const Contact = () => {
    const spotRef = useRef(null)
    const sectionRef = useRef(null)
    const rectRef = useRef(null)
    const rafRef = useRef(null)
    const pointRef = useRef({ x: 0, y: 0 })
    const [isInteractive, setIsInteractive] = useState(false)
    const [activeService, setActiveService] = useState(0)
    const [activeBudget, setActiveBudget] = useState(1)

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
        <div className='bg-[#F1F1F1] min-h-screen relative overflow-hidden selection:bg-[#DE5127] selection:text-white'>

            {/* ═══ HERO ═══ */}
            <section
                className='relative min-h-screen overflow-hidden flex flex-col'
                ref={sectionRef}
                onPointerMove={handlePointerMove}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
            >
                {/* Grid */}
                <div className='absolute inset-0 pointer-events-none opacity-[0.12]'
                    style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)', backgroundSize: '120px 120px' }}
                ></div>

                {/* Mouse glow */}
                <div className='absolute inset-0 pointer-events-none overflow-hidden'>
                    <div ref={spotRef} className='absolute transition-transform duration-500 ease-out' style={{ top: 0, left: 0, transform: 'translate3d(calc(50vw - 100px), calc(50vh - 100px), 0)', willChange: 'transform' }}>
                        <div className='w-[200px] h-[200px] rounded-full border border-[#DE5127]/20 flex items-center justify-center'>
                            <div className='w-[120px] h-[120px] rounded-full' style={{ background: 'radial-gradient(circle, rgba(222,81,39,0.25) 0%, rgba(222,81,39,0.08) 50%, transparent 70%)' }}></div>
                        </div>
                    </div>
                </div>

                {/* Giant background text */}
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none'>
                    <span className='font-2 text-[40vw] sm:text-[35vw] md:text-[30vw] text-black/[0.03] leading-none whitespace-nowrap'>SAY HI</span>
                </div>

                {/* Content */}
                <div className='relative z-10 flex flex-col flex-1 px-8 sm:px-12 md:px-20 lg:px-28 pt-28 sm:pt-36 pb-10 sm:pb-14'>

                    {/* Top bar */}
                    <div className='flex justify-between items-start'>
                        <p className='font-gs text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.6em] text-black/15'>04 / Contact</p>
                        <div className='flex items-center gap-3'>
                            <span className='w-10 h-px bg-[#DE5127]'></span>
                            <span className='font-gs text-[9px] sm:text-[10px] text-[#DE5127] font-bold tracking-[0.5em] uppercase'>Get in Touch</span>
                        </div>
                    </div>

                    {/* Center */}
                    <div className='flex-1 flex flex-col items-center justify-center text-center py-12'>
                        <p className='font-gs text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.6em] text-black/20 mb-8 sm:mb-10'>
                            We'd love to hear from you
                        </p>

                        {/* Big email */}
                        <a href="mailto:graphichunters.com" className='group relative mb-6'>
                            <h1 className='font-2 text-[8vw] sm:text-[6vw] md:text-[5vw] lg:text-[4vw] xl:text-[3.5vw] text-black leading-[1] tracking-tighter group-hover:text-[#DE5127] transition-colors duration-700'>
                                GRAPHIC<br className='sm:hidden' />HUNTERS.COM
                            </h1>
                            {/* Underline animation */}
                            <div className='absolute bottom-0 left-0 right-0 h-[2px] bg-[#DE5127] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-expo'></div>
                        </a>

                        {/* Sub info */}
                        <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mt-4'>
                            <span className='font-gs text-xs sm:text-sm text-black/20 font-bold tracking-tight'>+92 321 168 8059</span>
                            <span className='hidden sm:block w-1 h-1 rounded-full bg-[#DE5127]'></span>
                            <span className='font-gs text-xs sm:text-sm text-black/20 font-bold tracking-tight'>Lahore, Pakistan</span>
                        </div>

                        {/* Social row */}
                        <div className='flex gap-8 mt-10'>
                            {['Instagram', 'LinkedIn', 'Behance'].map((s) => (
                                <a key={s} href="#" className='font-gs text-[9px] font-bold uppercase tracking-[0.25em] text-black/15 hover:text-[#DE5127] transition-colors duration-300'>
                                    {s}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Scroll */}
                    <div className='flex justify-center'>
                        <div className='flex flex-col items-center gap-2'>
                            <div className='w-px h-10 relative overflow-hidden'>
                                <div className='absolute inset-0 bg-gradient-to-b from-[#DE5127] to-transparent animate-scroll-line'></div>
                            </div>
                            <span className='font-gs text-[7px] font-bold uppercase tracking-[0.5em] text-black/15'>Scroll</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ FORM — Elevated light card ═══ */}
            <section className='relative z-10 px-4 sm:px-8 md:px-16 lg:px-28 -mt-4' style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 1000px' }}>
                <div className='bg-white rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-black/[0.04]'>
                    <div className='relative z-10 px-8 sm:px-12 md:px-16 lg:px-20 py-12 sm:py-16 lg:py-20'>

                        {/* Form header */}
                        <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14'>
                            <div>
                                <span className='inline-flex items-center gap-3 mb-5'>
                                    <span className='w-8 h-px bg-[#DE5127]'></span>
                                    <span className='font-gs text-[9px] text-[#DE5127] font-bold tracking-[0.5em] uppercase'>Project Inquiry</span>
                                </span>
                                <h2 className='font-2 text-[10vw] sm:text-[6vw] md:text-[4vw] lg:text-[3vw] text-black leading-[0.85] tracking-tighter'>
                                    START A <span className='text-[#DE5127]'>PROJECT</span>
                                </h2>
                            </div>
                            <p className='font-gs text-[10px] sm:text-[11px] font-medium text-black/40 leading-relaxed max-w-xs pb-1'>
                                Fill in your details and we'll respond within 24 hours.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={e => e.preventDefault()} className='space-y-8'>
                            {/* Row 1 — Name + Email */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                                <div className='relative'>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder=" "
                                        className='peer w-full bg-transparent text-black text-base font-medium px-0 py-4 border-b border-black/10 focus:border-[#DE5127] outline-none transition-colors duration-300 placeholder-transparent' 
                                    />
                                    <label className='absolute left-0 top-4 text-black/40 text-sm font-gs font-bold uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#DE5127] peer-valid:top-0 peer-valid:text-[10px]'>
                                        Your Name *
                                    </label>
                                </div>
                                <div className='relative'>
                                    <input 
                                        type="email" 
                                        required 
                                        placeholder=" "
                                        className='peer w-full bg-transparent text-black text-base font-medium px-0 py-4 border-b border-black/10 focus:border-[#DE5127] outline-none transition-colors duration-300 placeholder-transparent' 
                                    />
                                    <label className='absolute left-0 top-4 text-black/40 text-sm font-gs font-bold uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#DE5127] peer-valid:top-0 peer-valid:text-[10px]'>
                                        Email Address *
                                    </label>
                                </div>
                            </div>

                            {/* Row 2 — Company + Subject */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                                <div className='relative'>
                                    <input 
                                        type="text" 
                                        placeholder=" "
                                        className='peer w-full bg-transparent text-black text-base font-medium px-0 py-4 border-b border-black/10 focus:border-[#DE5127] outline-none transition-colors duration-300 placeholder-transparent' 
                                    />
                                    <label className='absolute left-0 top-4 text-black/40 text-sm font-gs font-bold uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#DE5127] peer-valid:top-0 peer-valid:text-[10px]'>
                                        Company
                                    </label>
                                </div>
                                <div className='relative'>
                                    <input 
                                        type="text" 
                                        placeholder=" "
                                        className='peer w-full bg-transparent text-black text-base font-medium px-0 py-4 border-b border-black/10 focus:border-[#DE5127] outline-none transition-colors duration-300 placeholder-transparent' 
                                    />
                                    <label className='absolute left-0 top-4 text-black/40 text-sm font-gs font-bold uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#DE5127] peer-valid:top-0 peer-valid:text-[10px]'>
                                        Subject
                                    </label>
                                </div>
                            </div>

                            {/* Services */}
                            <div className='pt-4'>
                                <label className='font-gs text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 block mb-4'>What do you need?</label>
                                <div className='flex flex-wrap gap-2'>
                                    {['Branding', 'Content', 'Motion', 'Product Design', 'Campaign', 'Social Media'].map((s, i) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setActiveService(i)}
                                            className={`font-gs text-[11px] font-medium tracking-wide px-4 py-2 rounded-lg border transition-all duration-200 ${activeService === i
                                                ? 'border-[#DE5127] text-[#DE5127] bg-[#DE5127]/5'
                                                : 'border-black/10 text-black/50 hover:border-black/20 hover:text-black/70'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Budget */}
                            <div className='pt-4'>
                                <label className='font-gs text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 block mb-4'>Budget Range</label>
                                <div className='flex flex-wrap gap-2'>
                                    {['< Rs. 1M', 'Rs. 1M – 5M', 'Rs. 5M – 10M', 'Rs. 10M+'].map((r, i) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setActiveBudget(i)}
                                            className={`font-gs text-[11px] font-medium tracking-wide px-4 py-2 rounded-lg border transition-all duration-200 ${activeBudget === i
                                                ? 'border-[#DE5127] text-[#DE5127] bg-[#DE5127]/5'
                                                : 'border-black/10 text-black/50 hover:border-black/20 hover:text-black/70'
                                                }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Message */}
                            <div className='relative pt-4'>
                                <textarea 
                                    required 
                                    rows="3" 
                                    placeholder=" "
                                    className='peer w-full bg-transparent text-black text-base font-medium px-0 py-4 border-b border-black/10 focus:border-[#DE5127] outline-none transition-colors duration-300 placeholder-transparent resize-none'
                                ></textarea>
                                <label className='absolute left-0 top-4 text-black/40 text-sm font-gs font-bold uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#DE5127] peer-valid:top-0 peer-valid:text-[10px]'>
                                    Tell us about your project *
                                </label>
                            </div>

                            {/* Submit row */}
                            <div className='flex items-center justify-between gap-6 pt-6'>
                                <button 
                                    type="submit" 
                                    className='group flex items-center gap-3 bg-[#DE5127] text-white rounded-lg px-8 py-4 hover:bg-[#c94520] transition-colors duration-300'
                                >
                                    <span className='font-gs text-[12px] font-bold uppercase tracking-wider'>Send Message</span>
                                    <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M17 8l4 4m0 0l-4 4m4-4H3' />
                                    </svg>
                                </button>
                                <p className='font-gs text-[11px] text-black/40'>
                                    We typically respond within 24 hours
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* ═══ PROCESS ═══ */}
            <section className='relative z-10 px-8 sm:px-12 md:px-20 lg:px-28 py-28 sm:py-36'>
                <div className='max-w-5xl mx-auto'>
                    <div className='flex items-center gap-3 mb-20'>
                        <span className='w-8 h-px bg-[#DE5127]'></span>
                        <span className='font-gs text-[9px] sm:text-[10px] text-black/25 font-bold tracking-[0.5em] uppercase'>How We Work</span>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-0'>
                        {[
                            { n: "01", title: "Discovery", text: "We dive deep into your brand, audience, and goals to find the edge." },
                            { n: "02", title: "Strategy", text: "Every design decision is mapped to a clear, purposeful creative direction." },
                            { n: "03", title: "Execution", text: "Precision craft and relentless quality turn the vision into reality." }
                        ].map((step, i) => (
                            <div key={i} className={`group relative md:px-10 lg:px-14 first:md:pl-0 last:md:pr-0 ${i < 2 ? 'md:border-r border-black/[0.06]' : ''}`}>
                                <div className='flex items-center gap-4 mb-8'>
                                    <span className='font-8 text-4xl text-[#DE5127]/20 group-hover:text-[#DE5127]/50 transition-colors duration-500'>{step.n}</span>
                                    <div className='w-8 h-px bg-black/10 group-hover:w-16 group-hover:bg-[#DE5127]/30 transition-all duration-500'></div>
                                </div>
                                <h3 className='font-gs text-lg sm:text-xl font-bold uppercase tracking-tight mb-4 group-hover:text-[#DE5127] transition-colors duration-500'>
                                    {step.title}
                                </h3>
                                <p className='font-gs text-xs sm:text-sm text-black/30 leading-relaxed'>
                                    {step.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Contact
