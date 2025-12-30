import React from 'react'
import { motion } from 'motion/react'

function Boxes(props) {
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <motion.div
            className={`flex flex-col xl:flex-row gap-12 xl:gap-20 border-b border-[#DE5127]/10 px-6 sm:px-10 md:px-16 lg:px-24 py-16 xl:py-20 items-center group hover:bg-white/40 transition-all duration-700 ${props.reversed ? 'xl:flex-row-reverse' : ''}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
        >
            {/* Title & Number Section */}
            <div className={`flex flex-col w-full xl:w-1/4 ${props.reversed ? 'xl:items-end xl:text-right' : 'xl:items-start xl:text-left'} items-center text-center`}>
                <motion.div className='flex items-baseline gap-4 mb-4' variants={fadeInUp}>
                    <span id="font8" className='text-2xl sm:text-3xl opacity-20 group-hover:opacity-100 transition-opacity duration-500'>{props.number}</span>
                    <h3 id="font7" className='text-5xl sm:text-6xl md:text-7xl leading-none tracking-tighter'>{props.title}</h3>
                </motion.div>
                <motion.p
                    id="font9"
                    className='text-lg sm:text-xl text-[#DE5127] italic'
                    variants={fadeInUp}
                >
                    {props.description}
                </motion.p>
            </div>

            {/* Center Text Section */}
            <div className='w-full xl:w-1/2 flex items-center justify-center px-0 xl:px-12'>
                <motion.p
                    id="font"
                    className='text-lg sm:text-xl md:text-2xl font-medium leading-relaxed text-center opacity-60 group-hover:opacity-100 transition-opacity duration-500 max-w-2xl'
                    variants={fadeInUp}
                >
                    {props.text}
                </motion.p>
            </div>

            {/* Image Section */}
            <motion.div
                className='w-full xl:w-1/4 aspect-video overflow-hidden rounded-3xl shadow-xl'
                variants={scaleIn}
            >
                <motion.img
                    src={props.image}
                    className="w-full h-full object-cover grayscale-50 group-hover:grayscale-0 transition-all duration-1000"
                    whileHover={{ scale: 1.1 }}
                />
            </motion.div>
        </motion.div>
    )
}

export default Boxes