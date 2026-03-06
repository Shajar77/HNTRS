function Boxes(props) {
    return (
        <div
            className={`flex flex-col xl:flex-row gap-12 xl:gap-20 border-b border-[#DE5127]/10 px-6 sm:px-10 md:px-16 lg:px-24 py-16 xl:py-20 items-center group hover:bg-white/40 transition-all duration-700 ${props.reversed ? 'xl:flex-row-reverse' : ''}`}
        >
            {/* Title & Number Section */}
            <div className={`flex flex-col w-full xl:w-1/4 ${props.reversed ? 'xl:items-end xl:text-right' : 'xl:items-start xl:text-left'} items-center text-center`}>
                <div className='flex items-baseline gap-3 mb-4'>
                    <span className='font-8 text-xl sm:text-2xl md:text-3xl opacity-20 group-hover:opacity-100 transition-opacity duration-500'>{props.number}</span>
                    <h3 className='font-7 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-tighter'>{props.title}</h3>
                </div>
                <p className='font-9 text-lg sm:text-xl text-[#DE5127] italic'>
                    {props.description}
                </p>
            </div>

            {/* Center Text Section */}
            <div className='w-full xl:w-1/2 flex items-center justify-center px-0 xl:px-12'>
                <p className='font-gs text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-relaxed text-center opacity-60 group-hover:opacity-100 transition-opacity duration-500 max-w-2xl'>
                    {props.text}
                </p>
            </div>

            {/* Image Section */}
            <div className='w-full xl:w-1/4 aspect-video overflow-hidden rounded-3xl shadow-xl'>
                <img
                    src={props.image}
                    alt={props.title}
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="225"
                    className="w-full h-full object-cover grayscale-50 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                />
            </div>
        </div>
    )
}

export default Boxes
