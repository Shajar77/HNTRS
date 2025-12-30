import React from 'react'
import { motion } from 'motion/react'

const Shirt = () => {
    return (
        <div className='relative bg-[#E8E8E8] min-h-screen py-20 md:py-32 overflow-hidden flex flex-col justify-center'>
            {/* Main Content Container */}
            <div className='relative w-full px-6 sm:px-10 md:px-16 lg:px-24'>

                {/* Text Container - Stacked Lines */}
                <div className='flex flex-col items-center text-center'>
                    {/* Line 1: WE ARE */}
                    <motion.div
                        className='w-full'
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        <h1 id="font6" className='text-black text-[15vw] xl:text-[12vw] font-black tracking-tighter leading-[0.8] uppercase'>
                            WE ARE
                        </h1>
                    </motion.div>

                    {/* Line 2: THE CREATIVE */}
                    <motion.div
                        className='w-full mt-[-2vw]'
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
                    >
                        <h1 id="font6" className='text-black text-[12vw] xl:text-[10vw] font-black tracking-tighter leading-[0.8] uppercase'>
                            THE CREATIVE
                        </h1>
                    </motion.div>

                    {/* Line 3: DESIGN [SHIRT] STUDIO */}
                    <motion.div
                        className='w-full flex flex-col sm:flex-row items-center justify-center mt-[-1vw] relative'
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
                    >
                        <h1 id="font6" className='text-black text-[10vw] xl:text-[8vw] font-black tracking-tighter leading-[0.8] uppercase'>
                            DESIGN
                        </h1>

                        {/* Shirt Image */}
                        <motion.div
                            className='relative mx-4 my-4 sm:my-0 z-10'
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
                        >
                            <img
                                src="./shirt3.png"
                                alt="Shirt"
                                className='w-[40vw] sm:w-[20vw] xl:w-[15vw] h-auto drop-shadow-2xl'
                            />
                        </motion.div>

                        <h1 id="font6" className='text-black text-[10vw] xl:text-[8vw] font-black tracking-tighter leading-[0.8] uppercase'>
                            STUDIO
                        </h1>
                    </motion.div>
                </div>

                {/* Bottom Info Bar */}
                <div className='mt-20 flex flex-col md:flex-row justify-between items-center md:items-end gap-10'>
                    {/* GLOBAL Badge */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <div className='border-2 border-black rounded-full px-8 py-3'>
                            <p id="font" className='text-black text-xs font-black tracking-[0.3em] uppercase'>GLOBAL REACH</p>
                        </div>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                        className='max-w-xs text-center md:text-right'
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <p id="font5" className='text-black text-xl italic mb-4'>
                            Exclusively in sports
                        </p>
                        <p id="font" className='text-black text-[10px] leading-relaxed font-medium uppercase tracking-wider opacity-60'>
                            <span className='text-[#DE5127] font-black'>GRAPHICHUNTERS®</span> believes in a world where top-tier design and motion can take your brand to the stage it truly deserves.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Shirt