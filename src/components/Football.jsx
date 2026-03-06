const Football = () => {
    return (
        <section className='relative bg-[#F1F1F1] overflow-hidden' style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 1000px' }}>
            {/* Full-width image hero with overlaid content */}
            <div className='relative min-h-screen flex items-end'>
                {/* Background Image */}
                <div className='absolute inset-0 group'>
                    <img
                        src="/ball.webp"
                        alt="Derbby Project"
                        loading="lazy"
                        decoding="async"
                        width="1920"
                        height="1080"
                        className='w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[2s] ease-expo'
                    />
                    {/* Gradient overlays for text readability */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent' />
                    <div className='absolute inset-0 bg-gradient-to-r from-black/30 to-transparent' />
                </div>

                {/* Giant watermark text */}
                <div className='font-6 absolute top-[40%] sm:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[22vw] sm:text-[15vw] xl:text-[25vw] font-black text-white/[0.03] pointer-events-none select-none z-[1] whitespace-nowrap'>
                    DERBBY
                </div>

                {/* Content */}
                <div className='relative z-10 w-full px-6 sm:px-8 md:px-20 lg:px-28 pb-10 sm:pb-14 md:pb-28 pt-40 lg:pt-60'>
                    {/* Top label */}
                    <div className='mb-4 sm:mb-5 md:mb-10'>
                        <span className='inline-flex items-center gap-2.5 md:gap-3'>
                            <span className='w-6 sm:w-6 md:w-8 h-px bg-[#DE5127]'></span>
                            <span className='font-gs text-[10px] sm:text-[10px] md:text-xs text-[#DE5127] font-bold tracking-[0.4em] sm:tracking-[0.5em] uppercase'>Featured Campaign</span>
                        </span>
                    </div>

                    {/* Main title */}
                    <h2 className='font-2 text-[15vw] sm:text-[12vw] lg:text-[8vw] text-white leading-[0.85] tracking-tighter mb-6 sm:mb-8 md:mb-12'>
                        DERBBY
                    </h2>

                    {/* Description */}
                    <div className='mb-8 sm:mb-8 md:mb-0 max-w-[320px] sm:max-w-sm md:max-w-xl'>
                        <p className='font-7 text-white/90 text-xl sm:text-xl md:text-3xl lg:text-4xl italic leading-[1.25] tracking-tight'>
                            Redefining the visual language of modern football culture.
                        </p>
                    </div>

                    {/* Tags row */}
                    <div className='flex flex-wrap items-center gap-4 sm:gap-3 md:gap-10 mt-0 md:mt-10'>
                        <div className='flex items-center gap-2 md:gap-3'>
                            <div className='w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#DE5127]'></div>
                            <span className='font-gs text-white/40 text-[10px] md:text-[10px] font-bold tracking-[0.3em] uppercase'>Campaign</span>
                        </div>
                        <div className='flex items-center gap-2 md:gap-3'>
                            <div className='w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#DE5127]'></div>
                            <span className='font-gs text-white/40 text-[10px] md:text-[10px] font-bold tracking-[0.3em] uppercase'>Visual Identity</span>
                        </div>
                        <div className='flex items-center gap-2 md:gap-3'>
                            <div className='w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#DE5127]'></div>
                            <span className='font-gs text-white/40 text-[10px] md:text-[10px] font-bold tracking-[0.3em] uppercase'>Digital</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Football
