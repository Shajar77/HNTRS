import React from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

const Jordan = () => {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

    return (
        // Changed 'min-w-screen' to 'w-full' and added 'overflow-x-hidden'
        <div className='relative w-full overflow-hidden'>
            <motion.img
                src="https://cdn.prod.website-files.com/6766a97af7951c214f154267/679793f83de24f06c661f467_gh-wallpaper-1.jpg"
                className='w-full h-screen sm:h-[120vh] md:h-[150vh] lg:h-[180vh] object-cover object-top'
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ y, scale }}
            />
        </div>
    )
}

export default Jordan