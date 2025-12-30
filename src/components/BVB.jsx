import React from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

const BVB = () => {
    const { scrollYProgress } = useScroll();
    const yText = useTransform(scrollYProgress, [0, 1], [0, -200]);

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
        <div className='flex flex-col xl:flex-row min-h-screen bg-[#F1F1F1] overflow-hidden'>
            <motion.div
                className='flex flex-col text-center items-center justify-center py-32 px-12 bg-[#1A1A1A] w-full xl:w-1/2 relative overflow-hidden'
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
            >
                {/* Subtle Background Text */}
                <motion.div
                    className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-white/2 pointer-events-none select-none'
                    id="font6"
                    style={{ y: yText }}
                >
                    BVB
                </motion.div>

                <motion.p
                    className='text-[#DE5127] text-xs font-black tracking-[0.5em] uppercase mb-16 relative z-10'
                    variants={fadeInUp}
                >
                    Recent Projects
                </motion.p>

                <motion.p
                    id="font2"
                    className='text-fluid-large text-white leading-none mb-12 tracking-tighter relative z-10'
                    variants={fadeInUp}
                >
                    PICKS
                </motion.p>

                <div className='max-w-lg mx-auto relative z-10'>
                    <motion.p
                        id="font"
                        className='text-[#DE5127] text-2xl sm:text-3xl font-black mb-6 uppercase tracking-tight'
                        variants={fadeInUp}
                    >
                        Topps & Borussia Dortmund
                    </motion.p>

                    <motion.p
                        id="font7"
                        className='text-white/90 text-3xl sm:text-4xl lg:text-5xl italic leading-[1.1] mb-16 tracking-tight'
                        variants={fadeInUp}
                    >
                        A Bold New Era For Borussia Dortmund Teamset
                    </motion.p>

                    <div className='flex flex-col items-center gap-12'>
                        <motion.p
                            id="font"
                            className='text-white/30 text-[10px] font-black tracking-[0.4em] uppercase'
                            variants={fadeInUp}
                        >
                            Brand / Content / Product
                        </motion.p>

                        <motion.button
                            id="font"
                            className='group relative overflow-hidden bg-[#DE5127] text-white py-6 px-14 text-xs font-black uppercase tracking-[0.3em] rounded-full transition-all duration-500'
                            variants={fadeInUp}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className='relative z-10'>View Project</span>
                            <motion.div
                                className='absolute inset-0 bg-white'
                                initial={{ x: '-100%' }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className='w-full xl:w-1/2 h-[60vh] xl:h-auto overflow-hidden relative group'
                initial={{ opacity: 0, scale: 1.1 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            >
                <img
                    src="https://cdn.prod.website-files.com/6766a97af7951c214f154267/679cc558eb3dc6e7bb06e52f_9a031345e747b405445bdbb16e748d93_Topps%20Teamset%20BVB%20Thumbnail%202.avif"
                    alt="BVB Project"
                    className='w-full h-full object-cover grayscale-30 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s] ease-expo'
                />
                <div className='absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-1000' />
            </motion.div>
        </div>
    )
}

export default BVB