import React from 'react'
import { motion } from 'motion/react'

const BehindTheHunt = () => {
    const cards = [
        {
            word: "Behind",
            date: "April 28, 2025",
            title: "Welcome to the club: Alex & Merel",
            image: "https://cdn.prod.website-files.com/6776815c172cb3537fafa18b/680f971f63ef26fed12203c5_Dual%20shot.avif",
        },
        {
            word: "The",
            date: "February 21, 2025",
            title: "From Sketch to Stadium: Designing MUFC Hall of Fame",
            image: "https://cdn.prod.website-files.com/6776815c172cb3537fafa18b/67d1c90483bdbb1ce32746aa_TOPPS-MUFC-HALLOFHEROES-THUMB-2.avif",
            isAccent: true
        },
        {
            word: "Hunt",
            date: "August 09, 2025",
            title: "A new chapter for GRAPHIC HUNTERS",
            image: "https://cdn.prod.website-files.com/6776815c172cb3537fafa18b/67c16b52c29c0bf2116111dd_gh.avif",
        }
    ];

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <div className='flex flex-col bg-[#1A1A1A] min-h-screen py-32 px-6 sm:px-10 md:px-16 lg:px-24 overflow-hidden relative'>
            {/* Subtle Background Elements */}
            <div className='absolute top-0 right-0 w-96 h-96 bg-[#74B858]/5 rounded-full blur-[120px] pointer-events-none' />
            <div className='absolute bottom-0 left-0 w-96 h-96 bg-white/2 rounded-full blur-[100px] pointer-events-none' />

            {/* Cards Grid with Integrated Heading */}
            <motion.div
                className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 lg:gap-x-20 gap-y-24 relative z-10'
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={staggerContainer}
            >
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        variants={fadeInUp}
                        className='flex flex-col group cursor-pointer'
                    >
                        {/* Integrated Heading Word */}
                        <div id="font6" className={`text-[12vw] sm:text-[10vw] xl:text-[8vw] leading-none tracking-tighter uppercase mb-8 text-center ${card.isAccent ? 'text-[#74B858]' : 'text-white'}`}>
                            {card.word}
                        </div>

                        <div className='relative overflow-hidden rounded-[2.5rem] aspect-square mb-8 shadow-2xl'>
                            <img
                                src={card.image}
                                className='w-full h-full object-cover grayscale-30 transition-transform duration-[1.5s] ease-expo group-hover:scale-110 group-hover:grayscale-0'
                                alt={card.title}
                            />
                            <div className='absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700' />
                        </div>
                        <div className='mt-4 flex flex-col items-center text-center'>
                            <div className='flex items-center gap-4 mb-6'>
                                <div className='w-8 h-px bg-white/10' />
                                <p id="font7" className='text-[#74B858] text-2xl italic'>{card.date}</p>
                                <div className='w-8 h-px bg-white/10' />
                            </div>
                            <h3 id="font" className='text-white text-4xl font-bold leading-[1.1] tracking-tight group-hover:text-[#74B858] transition-colors duration-500 uppercase max-w-[90%]'>
                                {card.title}
                            </h3>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}

export default BehindTheHunt