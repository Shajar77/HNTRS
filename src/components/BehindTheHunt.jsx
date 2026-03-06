import { Link } from 'react-router-dom'

const cards = [
    {
        date: "April 28, 2025",
        category: "Studio News",
        title: "Welcome to the club: Alex & Merel",
        image: "https://cdn.prod.website-files.com/6776815c172cb3537fafa18b/680f971f63ef26fed12203c5_Dual%20shot.avif",
    },
    {
        date: "February 21, 2025",
        category: "Case Study",
        title: "From Sketch to Stadium: Designing MUFC Hall of Fame",
        image: "https://cdn.prod.website-files.com/6776815c172cb3537fafa18b/67d1c90483bdbb1ce32746aa_TOPPS-MUFC-HALLOFHEROES-THUMB-2.avif",
        featured: true
    },
    {
        date: "August 09, 2025",
        category: "Studio News",
        title: "A new chapter for GRAPHIC HUNTERS",
        image: "https://cdn.prod.website-files.com/6776815c172cb3537fafa18b/67c16b52c29c0bf2116111dd_gh.avif",
    }
];

const BehindTheHunt = () => {
    return (
        <section className='relative bg-[#111111] overflow-hidden' style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 1000px' }}>
            {/* Background watermark */}
            <div className='font-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.015] pointer-events-none select-none whitespace-nowrap'>
                STORIES
            </div>

            <div className='relative z-10 px-8 sm:px-12 md:px-20 lg:px-28 py-28 sm:py-36'>

                {/* Section Header */}
                <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20 sm:mb-28'>
                    <div>
                        <span className='inline-flex items-center gap-3 mb-6'>
                            <span className='w-8 h-px bg-[#74B858]'></span>
                            <span className='font-gs text-[10px] sm:text-xs text-[#74B858] font-bold tracking-[0.5em] uppercase'>Journal</span>
                        </span>
                        <h2 className='font-2 text-[12vw] sm:text-[8vw] md:text-[6vw] lg:text-[5vw] text-white leading-[0.85] tracking-tighter'>
                            BEHIND<br />
                            <span className='text-[#74B858]'>THE</span> HUNT
                        </h2>
                    </div>
                    <Link to="/news" className='group shrink-0 mb-2'>
                        <div className='flex items-center gap-3 font-gs text-[10px] sm:text-xs text-white/40 font-bold tracking-[0.3em] uppercase hover:text-white transition-colors duration-500'>
                            View all stories
                            <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M17 8l4 4m0 0l-4 4m4-4H3' />
                            </svg>
                        </div>
                    </Link>
                </div>

                {/* Cards Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10'>
                    {cards.map((card, i) => (
                        <article
                            key={i}
                            className={`group cursor-pointer relative ${card.featured ? 'md:col-span-2 xl:col-span-1' : ''}`}
                        >
                            {/* Image */}
                            <div className='relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-[4/5] mb-8'>
                                <img
                                    src={card.image}
                                    loading="lazy"
                                    decoding="async"
                                    width="600"
                                    height="750"
                                    className='w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-expo'
                                    alt={card.title}
                                />
                                {/* Gradient overlay */}
                                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700' />

                                {/* Hover arrow */}
                                <div className='absolute top-6 right-6'>
                                    <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/0 border border-white/0 group-hover:bg-white group-hover:border-white flex items-center justify-center transition-all duration-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'>
                                        <svg className='w-4 h-4 text-black -rotate-45' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                            <path strokeLinecap='round' strokeLinejoin='round' d='M17 8l4 4m0 0l-4 4m4-4H3' />
                                        </svg>
                                    </div>
                                </div>

                                {/* Category pill on image */}
                                <div className='absolute bottom-6 left-6'>
                                    <span className='font-gs text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase text-white bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10'>
                                        {card.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className='px-1'>
                                <div className='flex items-center gap-3 mb-4'>
                                    <div className='w-1.5 h-1.5 rounded-full bg-[#74B858]'></div>
                                    <p className='font-7 text-[#74B858] text-sm sm:text-base italic'>{card.date}</p>
                                </div>
                                <h3 className='font-gs text-white text-lg sm:text-xl md:text-2xl font-bold leading-[1.15] tracking-tight group-hover:text-[#74B858] transition-colors duration-500 uppercase'>
                                    {card.title}
                                </h3>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default BehindTheHunt
