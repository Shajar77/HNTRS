const BVB = () => {
    return (
        <section className='relative bg-[#0A0A0A] overflow-hidden' style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 1000px' }}>
            {/* Stack vertically on mobile, side-by-side on md+ */}
            <div className='relative min-h-screen flex flex-col md:flex-row'>

                {/* Left: Image side */}
                <div className='relative w-full md:w-[55%] min-h-[50vh] md:min-h-screen overflow-hidden group'>
                    <img
                        src="https://cdn.prod.website-files.com/6766a97af7951c214f154267/679cc558eb3dc6e7bb06e52f_9a031345e747b405445bdbb16e748d93_Topps%20Teamset%20BVB%20Thumbnail%202.avif"
                        alt="BVB Topps Borussia Dortmund Teamset"
                        loading="lazy"
                        decoding="async"
                        width="1200"
                        height="800"
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-expo'
                    />
                    {/* Right edge fade into dark bg — only on desktop side-by-side */}
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0A0A0A]/80 hidden lg:block' />
                    {/* Bottom fade on mobile for smooth transition to content below */}
                    <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A] md:hidden' />
                    {/* Floating project number */}
                    <div className='absolute top-4 left-4 md:top-8 md:left-8'>
                        <span className='font-8 text-[12vw] sm:text-[8vw] lg:text-[6vw] text-white/10'>02</span>
                    </div>
                </div>

                {/* Right: Content side */}
                <div className='relative w-full md:w-[45%] flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-20 py-10 sm:py-14 md:py-20 lg:py-32'>

                    {/* Background watermark */}
                    <div className='font-6 absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 text-[30vw] sm:text-[18vw] lg:text-[20vw] font-black text-white/[0.02] pointer-events-none select-none whitespace-nowrap'>
                        BVB
                    </div>

                    <div className='relative z-10'>
                        {/* Label */}
                        <div className='mb-5 sm:mb-6 md:mb-10 lg:mb-14'>
                            <span className='inline-flex items-center gap-2 md:gap-3'>
                                <span className='w-5 sm:w-6 md:w-8 h-px bg-[#FDE100]'></span>
                                <span className='font-gs text-[10px] sm:text-[10px] md:text-[10px] lg:text-xs text-[#FDE100] font-bold tracking-[0.4em] sm:tracking-[0.5em] uppercase'>Recent Project</span>
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className='font-2 text-[14vw] sm:text-[10vw] md:text-[7vw] lg:text-[7vw] text-white leading-[0.85] tracking-tighter mb-4 lg:mb-6'>
                            PICKS
                        </h2>

                        {/* Subtitle */}
                        <p className='font-gs text-[#DE5127] text-sm sm:text-sm md:text-sm lg:text-base font-black uppercase tracking-tight mb-4 lg:mb-8'>
                            Topps &amp; Borussia Dortmund
                        </p>

                        {/* Description */}
                        <p className='font-7 text-white/70 text-lg sm:text-xl md:text-xl lg:text-3xl italic leading-[1.3] tracking-tight mb-6 lg:mb-10 max-w-md'>
                            A Bold New Era For Borussia Dortmund Teamset
                        </p>

                        {/* Category tags */}
                        <div className='flex flex-wrap items-center gap-2 md:gap-2 mb-8 lg:mb-12'>
                            {['Brand', 'Content', 'Product'].map((tag) => (
                                <span key={tag} className='font-gs text-[10px] sm:text-[10px] md:text-[10px] lg:text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 border border-white/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 md:px-4 md:py-2 hover:border-[#FDE100]/40 hover:text-[#FDE100] transition-all duration-500'>
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <button className='group/btn font-gs relative bg-white text-black py-3 px-6 sm:py-3 sm:px-8 md:py-4 md:px-8 lg:py-5 lg:px-12 text-[11px] sm:text-[10px] md:text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.3em] rounded-full overflow-hidden hover:text-white transition-colors duration-500'>
                            <span className='absolute inset-0 bg-[#DE5127] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-expo'></span>
                            <span className='relative z-10 flex items-center gap-2 lg:gap-3'>
                                View Project
                                <svg className='w-3 h-3 sm:w-3 sm:h-3 md:w-3 md:h-3 lg:w-4 lg:h-4 group-hover/btn:translate-x-1 transition-transform duration-300' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M17 8l4 4m0 0l-4 4m4-4H3' />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BVB
