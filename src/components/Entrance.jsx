import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const Entrance = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Prevent scrolling while the entrance animation is playing
        document.body.style.overflow = 'hidden';

        // Start exit animation after 0.8 seconds — fast enough to not tank LCP
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 800);

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <AnimatePresence onExitComplete={onComplete}>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#111111]"
                    initial={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                >
                    <div className="overflow-hidden flex items-baseline">
                        <motion.h1
                            className="font-2 text-[15vw] sm:text-[12vw] md:text-[10vw] text-[#F1F1F1] leading-none tracking-tighter"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ opacity: 0, y: "-20%" }}
                            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                        >
                            HNTRS
                        </motion.h1>
                        <motion.div
                            className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-[#DE5127] ml-2 sm:ml-4 shadow-lg shadow-[#DE5127]/20"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.5, ease: "backOut", delay: 0.6 }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Entrance;
