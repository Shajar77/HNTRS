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

const StepCard = ({ step, index }) => {
    const [ref, inView] = useInView()
    
    return (
        <div
            ref={ref}
            className={`relative group transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${index * 200}ms` }}
        >
            <div className='relative bg-white/60 backdrop-blur-sm border border-black/[0.06] hover:border-[#DE5127]/30 p-8 sm:p-10 transition-all duration-500 hover:shadow-[0_30px_60px_-20px_rgba(222,81,39,0.15)] hover:-translate-y-2'>
                <div className='absolute -top-5 left-10'>
                    <div className='w-10 h-10 bg-[#DE5127] flex items-center justify-center shadow-lg shadow-[#DE5127]/30'>
                        <span className='font-gs font-bold text-white text-sm'>{step.number.replace('0', '')}</span>
                    </div>
                </div>
                
                <span className='font-2 text-8xl text-[#DE5127]/5 absolute top-4 right-4 group-hover:text-[#DE5127]/10 transition-colors duration-500'>
                    {step.number}
                </span>
                
                <div className='relative z-10 pt-6'>
                    <div className='w-16 h-16 bg-black/[0.03] flex items-center justify-center mb-6 group-hover:bg-[#DE5127]/10 transition-colors duration-300'>
                        {index === 0 && (
                            <svg className='w-7 h-7 text-[#DE5127]' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                            </svg>
                        )}
                        {index === 1 && (
                            <svg className='w-7 h-7 text-[#DE5127]' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                            </svg>
                        )}
                        {index === 2 && (
                            <svg className='w-7 h-7 text-[#DE5127]' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' />
                            </svg>
                        )}
                    </div>
                    
                    <h3 className='font-2 text-2xl text-black mb-4 group-hover:text-[#DE5127] transition-colors duration-300'>
                        {step.title}
                    </h3>
                    <p className='font-gs text-sm text-black/50 leading-relaxed mb-6'>
                        {step.description}
                    </p>
                    
                    <div className='w-full h-1 bg-black/[0.04] overflow-hidden'>
                        <div 
                            className='h-full bg-[#DE5127] transition-all ease-out'
                            style={{ 
                                width: inView ? '100%' : '0%', 
                                transitionDuration: '800ms',
                                transitionDelay: `${500 + index * 200}ms` 
                            }}
                        />
                    </div>
                </div>
                
                <div className='absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-[#DE5127]/0 group-hover:border-[#DE5127]/20 transition-all duration-500' />
            </div>
            
            {index < 2 && (
                <div className='hidden lg:flex absolute top-[80px] -right-6 w-12 h-12 items-center justify-center'>
                    <svg className='w-6 h-6 text-[#DE5127]/40' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                </div>
            )}
        </div>
    )
}

const HowItWorksSection = ({ steps }) => {
    const [headerRef, headerInView] = useInView()

    return (
        <section className='relative py-28 sm:py-36 px-8 sm:px-12 md:px-20 lg:px-28 overflow-hidden'>
            <div className='absolute top-1/2 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-[#DE5127]/5 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none' />
            <div className='absolute top-1/2 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-black/[0.02] translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none' />
            
            <div className='max-w-6xl mx-auto relative z-10'>
                <div
                    ref={headerRef}
                    className={`text-center mb-20 transition-all duration-700 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                >
                    <div className='flex items-center justify-center gap-4 mb-6'>
                        <span className='w-16 h-[2px] bg-[#DE5127]' />
                        <span className='font-gs text-[10px] text-[#DE5127] font-bold tracking-[0.4em] uppercase'>Getting Started</span>
                        <span className='w-16 h-[2px] bg-[#DE5127]' />
                    </div>
                    <h2 className='font-2 text-[10vw] sm:text-[6vw] lg:text-[4vw] text-black leading-[0.9] tracking-[-0.02em]'>
                        3 Steps to NFTs
                    </h2>
                </div>

                <div className='relative'>
                    <div className='hidden lg:block absolute top-[80px] left-[16.67%] right-[16.67%] h-[2px] bg-gradient-to-r from-[#DE5127]/20 via-[#DE5127]/40 to-[#DE5127]/20' />
                    <div className='grid md:grid-cols-3 gap-8 lg:gap-12'>
                        {steps.map((step, index) => (
                            <StepCard key={step.number} step={step} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorksSection
