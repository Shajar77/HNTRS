import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const Entrance = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true)
    const [count, setCount] = useState(0)
    const [phase, setPhase] = useState(1)

    useEffect(() => {
        const counterInterval = setInterval(() => {
            setCount(prev => {
                if (prev >= 100) {
                    clearInterval(counterInterval)
                    return 100
                }
                return prev + 1
            })
        }, 20)

        const phase2Timer = setTimeout(() => setPhase(2), 2500)
        const phase3Timer = setTimeout(() => setPhase(3), 3800)
        const exitTimer = setTimeout(() => {
            setIsVisible(false)
            if (onComplete) onComplete()
        }, 4400)

        return () => {
            clearInterval(counterInterval)
            clearTimeout(phase2Timer)
            clearTimeout(phase3Timer)
            clearTimeout(exitTimer)
        }
    }, [onComplete])

    const letters = ['H', 'N', 'T', 'R', 'S']

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className='fixed inset-0 z-[9999] overflow-hidden bg-black flex items-center justify-center'
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    {/* Animated Grid Background */}
                    <div className='absolute inset-0 opacity-10'>
                        <div className='absolute inset-0' style={{
                            backgroundImage: 'linear-gradient(rgba(222,81,39,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(222,81,39,0.3) 1px, transparent 1px)',
                            backgroundSize: 'clamp(40px, 8vw, 80px) clamp(40px, 8vw, 80px)'
                        }} />
                    </div>

                    {/* Floating Orbs */}
                    <motion.div
                        className='absolute top-1/4 left-1/4 w-64 h-64 bg-[#DE5127] rounded-full blur-[150px] opacity-20'
                        animate={{
                            x: [0, 50, 0],
                            y: [0, -30, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Counter Section */}
                    <motion.div
                        className='relative z-10'
                        animate={{
                            opacity: phase >= 2 ? 0 : 1,
                            scale: phase >= 2 ? 0.8 : 1
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className='text-center'>
                            <motion.p
                                id="font"
                                className='text-white/30 text-[10px] sm:text-xs tracking-[0.5em] mb-4 sm:mb-8 uppercase'
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                Creative Studio
                            </motion.p>

                            <div className='relative inline-block'>
                                <motion.div
                                    className='text-[25vw] sm:text-[20vw] md:text-[15vw] font-black leading-none tracking-tighter text-white'
                                    id='font6'
                                >
                                    {count.toString().padStart(3, '0')}
                                </motion.div>
                                <motion.span
                                    className='absolute -right-[2vw] top-0 text-[5vw] text-[#DE5127] font-bold'
                                    id='font6'
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    %
                                </motion.span>
                            </div>

                            <motion.div
                                className='w-32 sm:w-48 h-[1px] bg-white/10 mx-auto mt-8 overflow-hidden'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <motion.div
                                    className='h-full bg-[#DE5127]'
                                    style={{ width: count + '%' }}
                                />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Logo Reveal */}
                    <motion.div
                        className='absolute inset-0 flex items-center justify-center z-20'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: phase >= 2 ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ pointerEvents: phase >= 2 ? 'auto' : 'none' }}
                    >
                        <div className='text-center px-6'>
                            <div className='flex items-start justify-center'>
                                {letters.map((letter, i) => (
                                    <motion.span
                                        key={i}
                                        id='font2'
                                        className='text-[18vw] sm:text-[15vw] md:text-[12vw] text-white leading-none tracking-tighter inline-block'
                                        initial={{ y: '100%', opacity: 0 }}
                                        animate={{
                                            y: phase >= 2 ? '0%' : '100%',
                                            opacity: phase >= 2 ? 1 : 0
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            delay: phase >= 2 ? i * 0.1 : 0,
                                            ease: [0.76, 0, 0.24, 1]
                                        }}
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                                <motion.span
                                    className='text-[3vw] sm:text-[2vw] border border-white rounded-full w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 flex items-center justify-center mt-2 sm:mt-4 ml-1 text-white'
                                    initial={{ scale: 0 }}
                                    animate={{ scale: phase >= 2 ? 1 : 0 }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                >
                                    R
                                </motion.span>
                            </div>

                            <motion.div
                                id="font"
                                className='mt-6 flex justify-center gap-3 text-lg sm:text-xl md:text-2xl'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: phase >= 2 ? 1 : 0,
                                    y: phase >= 2 ? 0 : 20
                                }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                            >
                                <span className='text-white font-bold'>Sports</span>
                                <span id="font7" className='text-[#DE5127] italic'>Exclusive</span>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Final Wipe */}
                    <motion.div
                        className='absolute inset-0 bg-[#f1f1f1] origin-bottom z-50'
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: phase >= 3 ? 1 : 0 }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    />

                    {/* Corner Info */}
                    <div className='absolute inset-0 p-6 sm:p-10 pointer-events-none opacity-20'>
                        <div className='flex justify-between items-start w-full'>
                            <p id="font" className='text-white text-[10px] tracking-[0.3em] uppercase'>HNTRS®</p>
                            <p id="font" className='text-white text-[10px] tracking-[0.3em] uppercase'>Since 2021</p>
                        </div>
                        <div className='absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex justify-between items-end w-full'>
                            <p id="font" className='text-white text-[10px] tracking-[0.3em] uppercase'>Lahore, PK</p>
                            <p id="font" className='text-white text-[10px] tracking-[0.3em] uppercase'>© 2025</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Entrance
