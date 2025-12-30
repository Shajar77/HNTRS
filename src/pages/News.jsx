import React from 'react'
import { motion } from 'motion/react'

const News = () => {
    const newsItems = [
        {
            date: "April 28, 2025",
            title: "Welcome to the club: Alex & Merel",
            category: "Studio News",
            image: "https://cdn.prod.website-files.com/6776815c172cb3537fafa18b/680f971f63ef26fed12203c5_Dual%20shot.avif"
        },
        {
            date: "February 21, 2025",
            title: "From Sketch to Stadium: Designing MUFC Hall of Fame",
            category: "Case Study",
            image: "https://cdn.prod.website-files.com/6776815c172cb3537fafa18b/67d1c90483bdbb1ce32746aa_TOPPS-MUFC-HALLOFHEROES-THUMB-2.avif"
        },
        {
            date: "August 09, 2025",
            title: "A new chapter for GRAPHIC HUNTERS",
            category: "Studio News",
            image: "https://cdn.prod.website-files.com/6776815c172cb3537fafa18b/67c16b52c29c0bf2116111dd_gh.avif"
        }
    ];

    return (
        <div className='bg-[#F1F1F1] min-h-screen relative overflow-hidden'>
            {/* Hero Section */}
            <div className='px-6 sm:px-10 md:px-16 lg:px-24 pt-40 pb-24 relative z-10'>
                <div className='flex flex-col items-center text-center'>
                    <motion.div
                        id='font2'
                        className='flex items-start justify-center text-fluid-huge opacity-90 leading-none mb-12'
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <p className='tracking-tighter'>NEWS</p>
                        <motion.span
                            className='text-[4vw] sm:text-[3vw] xl:text-[2vw] border-4 border-black rounded-full w-[8vw] h-[8vw] sm:w-[6vw] sm:h-[6vw] xl:w-[5vw] xl:h-[5vw] flex items-center justify-center mt-[2vw] ml-4 font-black'
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            R
                        </motion.span>
                    </motion.div>

                    <motion.div
                        id="font"
                        className='flex flex-col sm:flex-row items-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#DE5127] tracking-tighter gap-4 sm:gap-8'
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <p className='font-black uppercase'>Sports</p>
                        <p id="font7" className='italic'>Exclusive</p>
                    </motion.div>
                </div>
            </div>

            {/* News Grid */}
            <div className='px-6 sm:px-10 md:px-16 lg:px-24 pb-32 relative z-10'>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 lg:gap-16'>
                    {newsItems.map((item, i) => (
                        <motion.div
                            key={i}
                            className='group cursor-pointer'
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className='relative overflow-hidden rounded-4xl aspect-4/3'>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className='w-full h-full object-cover transition-transform duration-[1.5s] ease-expo group-hover:scale-110'
                                />
                                <div className='absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700' />
                            </div>
                            <div className='mt-10'>
                                <div className='flex items-center gap-4 mb-4'>
                                    <p id="font7" className='text-[#DE5127] text-xl italic'>{item.date}</p>
                                    <div className='w-12 h-px bg-black/10' />
                                </div>
                                <h3 id="font" className='text-3xl font-black uppercase tracking-tight leading-tight group-hover:text-[#DE5127] transition-colors duration-500'>{item.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Newsletter Section */}
            <div className='px-6 sm:px-10 md:px-16 lg:px-24 pb-32 relative z-10'>
                <div className='bg-white rounded-[4rem] p-12 sm:p-24 flex flex-col items-center text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)]'>
                    <div className='absolute top-0 right-0 w-96 h-96 bg-[#DE5127]/5 rounded-full blur-[100px] -mr-48 -mt-48' />
                    <div className='absolute bottom-0 left-0 w-96 h-96 bg-black/2 rounded-full blur-[100px] -ml-48 -mb-48' />

                    <motion.div
                        className='relative z-10'
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <h2 id="font6" className="text-fluid-medium text-black leading-[0.8] mb-10 uppercase tracking-tighter">
                            JOIN THE <br /> <span className="text-[#DE5127]">INNER CIRCLE</span>
                        </h2>
                        <p id="font" className='text-xl sm:text-2xl text-black/60 max-w-2xl mx-auto mb-16 font-medium'>
                            Get exclusive insights into our process, early access to projects, and the latest from the world of sports design.
                        </p>
                        <div className='flex flex-col md:flex-row gap-6 w-full max-w-2xl mx-auto'>
                            <input
                                type="email"
                                placeholder="YOUR EMAIL ADDRESS"
                                className='flex-1 bg-[#F1F1F1] border-none rounded-full px-10 py-8 text-xs font-bold tracking-[0.3em] focus:ring-2 focus:ring-[#DE5127] transition-all outline-none'
                            />
                            <motion.button
                                id="font"
                                className='bg-black text-white px-12 py-8 rounded-full text-xs font-bold uppercase tracking-[0.3em] hover:bg-[#DE5127] transition-all duration-500'
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Subscribe
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default News
