import React from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

const Football = () => {
    const { scrollYProgress } = useScroll();
    const yText = useTransform(scrollYProgress, [0, 1], [0, -250]);
    const yImage = useTransform(scrollYProgress, [0, 1], [0, -100]);

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
        <div className='flex flex-col xl:flex-row min-h-screen bg-[#F1F1F1] overflow-hidden relative'>
            {/* Background Watermark */}
            <motion.div
                className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-black text-black/2 pointer-events-none select-none z-0'
                id="font6"
                style={{ y: yText }}
            >
                DERBBY
            </motion.div>

            {/* Content Section */}
            <motion.div
                className='flex flex-col text-center xl:text-left items-center xl:items-start justify-center py-32 px-6 sm:px-10 md:px-16 lg:px-24 w-full xl:w-1/2 relative z-10'
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
            >
                <motion.p
                    className='text-[#DE5127] text-xs font-bold tracking-[0.5em] uppercase mb-16'
                    variants={fadeInUp}
                >
                    Featured Campaign
                </motion.p>

                <motion.h2
                    id="font2"
                    className='text-[10vw] sm:text-[10vw] xl:text-[6vw] text-black leading-none mb-12 tracking-tighter'
                    variants={fadeInUp}
                >
                    DERBBY
                </motion.h2>

                <div className='max-w-lg relative z-10'>
                    <motion.p
                        id="font"
                        className='text-[#DE5127] text-2xl sm:text-3xl font-bold mb-6 uppercase tracking-tight'
                        variants={fadeInUp}
                    >
                        Global Sports Campaign
                    </motion.p>

                    <motion.p
                        id="font7"
                        className='text-black/80 text-3xl sm:text-4xl lg:text-5xl italic leading-[1.1] mb-16 tracking-tight'
                        variants={fadeInUp}
                    >
                        Redefining the visual language of modern football culture.
                    </motion.p>

                    <div className='flex flex-col xl:flex-row items-center gap-12'>
                        <motion.p
                            id="font"
                            className='text-black/30 text-[10px] font-bold tracking-[0.4em] uppercase'
                            variants={fadeInUp}
                        >
                            Campaign / Visual Identity / Digital
                        </motion.p>
                    </div>
                </div>
            </motion.div>

            {/* Image Section */}
            <div className='w-full xl:w-1/2 p-6 sm:p-10 md:p-16 lg:p-20 xl:p-24 flex items-center justify-center'>
                <motion.div
                    className='w-full h-full min-h-[50vh] xl:min-h-0 aspect-square xl:aspect-auto overflow-hidden relative group rounded-[3rem] xl:rounded-[4rem] shadow-2xl'
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                >
                    <motion.div
                        className='w-full h-full'
                        style={{ y: yImage }}
                    >
                        <img
                            src="./ball.webp"
                            alt="Derbby Project"
                            className='w-full h-full object-cover grayscale-30 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s] ease-expo'
                        />
                    </motion.div>
                    <div className='absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-1000' />
                </motion.div>
            </div>
        </div>
    )
}

export default Football