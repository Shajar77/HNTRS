import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react'
import { Link } from 'react-router-dom'

const Home = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    // Parallax effects for hero
    const y1 = useTransform(scrollY, [0, 500], [0, -100]);
    const y2 = useTransform(scrollY, [0, 500], [0, 50]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    // Animation variants
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

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 1,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    return (
        <div className='relative bg-[#F1F1F1] overflow-hidden selection:bg-[#DE5127] selection:text-white'>
            {/* Subtle Animated Background Gradient */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-[#DE5127]/5 rounded-full blur-[120px]"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-[10%] -right-[5%] w-[60%] h-[60%] bg-black/5 rounded-full blur-[100px]"
                    animate={{
                        x: [0, -40, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
            </div>

            {/* Hero Content */}
            <div className='flex flex-col justify-center min-h-screen p-6 sm:p-10 md:p-16 lg:p-24 tracking-tighter relative z-10'>

                {/* Main Content with Parallax */}
                <motion.div
                    className='flex flex-col items-center xl:items-end w-full mt-[-5vh]'
                    style={{ y: y1, opacity }}
                >
                    <motion.div
                        className='flex flex-col items-center xl:items-end'
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div
                            id='font2'
                            className='flex items-baseline text-[18vw] sm:text-[15vw] xl:text-fluid-huge opacity-90 leading-[0.75]'
                            variants={fadeInUp}
                        >
                            <p className='tracking-tighter'>HNTRS</p>
                            <p className='text-[3vw] sm:text-[2vw] xl:text-[1.5vw] 2xl:text-3xl border-2 sm:border-4 border-black rounded-full h-[6vw] w-[6vw] sm:h-[4vw] sm:w-[4vw] 2xl:h-14 2xl:w-14 flex items-center justify-center text-center ml-2 sm:ml-4 mb-[4vw] 2xl:mb-12 font-black'>R</p>
                        </motion.div>

                        <motion.div
                            id="font"
                            className='flex text-[10vw] sm:text-[8vw] xl:text-[8vw] 2xl:text-[11rem] text-[#DE5127] mt-[-2vw] tracking-tighter gap-4 sm:gap-8'
                            variants={fadeInUp}
                        >
                            <p className='font-black uppercase'>Sports</p>
                            <p id="font7" className='italic'>Exclusive</p>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Bottom Section */}
                <div className='flex flex-col xl:flex-row justify-between items-center xl:items-end w-full mt-20 xl:mt-0 gap-12 xl:gap-0'>
                    <motion.div
                        className='max-w-4xl text-center xl:text-left'
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ delay: 1, duration: 1 }}
                        style={{ y: y2 }}
                    >
                        <p className='text-[3.5vw] sm:text-[2vw] xl:text-[1.1vw] 2xl:text-lg leading-none tracking-tight'>
                            <span id="font" className='font-light uppercase opacity-20 block mb-1'>The creative design studio</span>
                            <span id='font7' className='italic text-[#DE5127] text-[5vw] sm:text-[3.5vw] xl:text-[2vw] 2xl:text-3xl'>exclusively in sports</span>
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className='flex flex-col items-center xl:items-end gap-6'
                    >
                        <div className='flex flex-col items-center xl:items-end gap-1'>
                            <p id="font" className='text-[10px] font-black opacity-20 tracking-[0.3em] uppercase'>Est. 2021</p>
                            <div className='w-40 h-px bg-black/10' />
                        </div>

                        {/* Modern Scroll Indicator */}
                        <motion.div
                            className="flex flex-col items-center gap-3"
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <p id="font" className='text-[10px] font-black opacity-40 tracking-widest uppercase xl:vertical-text'>Scroll</p>
                            <div className="w-px h-12 bg-gradient-to-b from-black/40 to-transparent" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Home