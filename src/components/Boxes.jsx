function Boxes(props) {
    return (
        <div
            className={`flex flex-col xl:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20 border-b border-[#DE5127]/10 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-12 sm:py-14 md:py-16 xl:py-20 items-center group hover:bg-white/40 transition-all duration-700 ${props.reversed ? 'xl:flex-row-reverse' : ''}`}
        >
            {/* Title & Number Section */}
            <div className={`flex flex-col w-full xl:w-1/4 ${props.reversed ? 'xl:items-end xl:text-right' : 'xl:items-start xl:text-left'} items-center text-center min-w-0`}>
                <div className='flex items-baseline gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap justify-center'>
                    <span className='font-8 text-lg sm:text-xl md:text-2xl lg:text-3xl opacity-20 group-hover:opacity-100 transition-opacity duration-500'>{props.number}</span>
                    <h3 className='font-7 text-[clamp(2rem,10vw,4.5rem)] sm:text-[clamp(2.5rem,8vw,4rem)] md:text-5xl lg:text-6xl xl:text-7xl leading-none tracking-tighter text-safe'>{props.title}</h3>
                </div>
                <p className='font-9 text-base sm:text-lg md:text-xl text-[#DE5127] italic text-safe'>
                    {props.description}
                </p>
            </div>

            {/* Center Text Section */}
            <div className='w-full xl:w-1/2 flex items-center justify-center px-0 xl:px-8 2xl:px-12 min-w-0'>
                <p className='font-gs text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium leading-relaxed text-center opacity-60 group-hover:opacity-100 transition-opacity duration-500 max-w-2xl text-safe'>
                    {props.text}
                </p>
            </div>

            {/* Image Section */}
            <div className='w-full xl:w-1/4 aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl bg-black/[0.03] flex items-center justify-center min-w-0'>
                <img
                    src={props.image}
                    alt={props.title}
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="225"
                    className="w-full h-full object-contain grayscale-50 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
            </div>
        </div>
    )
}

export default Boxes
