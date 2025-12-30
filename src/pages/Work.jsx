import React from 'react'
import { motion } from 'motion/react'

const Work = () => {
    const projects = [
        {
            title: "Topps & Borussia Dortmund",
            category: "Brand / Content / Product",
            image: "https://cdn.prod.website-files.com/6766a97af7951c214f154267/679cc558eb3dc6e7bb06e52f_9a031345e747b405445bdbb16e748d93_Topps%20Teamset%20BVB%20Thumbnail%202.avif",
            description: "A Bold New Era For Borussia Dortmund Teamset"
        },
        {
            title: "TOTO Dutch Darts Masters",
            category: "Visuals / Campaign",
            image: "https://cdn.prod.website-files.com/6766a97af7951c214f154267/67acf80cb39c5d65b61e696b_TOTO%20Dutch%20Darts%20Masters%20Thumbnail%205.avif",
            description: "Visual Identity for the Dutch Darts Masters"
        },
        {
            title: "Manchester United Hall of Heroes",
            category: "Content / Motion",
            image: "https://cdn.prod.website-files.com/6776815c172cb3537fafa18b/67d1c6a36ee550c98bfe0b71_TOPPS-MUFC-HALLOFHEROES-THUMB.jpg",
            description: "Designing the MUFC Hall of Fame Series"
        },
        {
            title: "Derbby Campaign",
            category: "Campaign / Visuals",
            image: "./ball.webp",
            description: "Global Campaign for Derbby Sports"
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
                        <p className='tracking-tighter'>WORK</p>
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

            {/* Projects Grid */}
            <div className='px-6 sm:px-10 md:px-16 lg:px-24 pb-32 relative z-10'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20'>
                    {projects.map((project, i) => (
                        <motion.div
                            key={i}
                            className='group cursor-pointer'
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className='relative overflow-hidden rounded-[2.5rem] aspect-16/10'>
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className='w-full h-full object-cover grayscale-20 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s] ease-expo'
                                />
                                <div className='absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700' />
                                <div className='absolute top-8 right-8'>
                                    <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0'>
                                        <span className='text-black text-2xl'>→</span>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-10 flex justify-between items-start'>
                                <div>
                                    <p id="font" className='text-[#DE5127] text-xs font-bold tracking-[0.4em] uppercase mb-4'>{project.category}</p>
                                    <h3 id="font" className='text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none'>{project.title}</h3>
                                </div>
                                <p id="font7" className='text-black/20 text-4xl italic font-light'>0{i + 1}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Contact Section */}
            <div className="bg-[#1A1A1A] py-32 px-6 sm:px-10 md:px-16 lg:px-24 relative overflow-hidden">
                <div className='absolute top-0 right-0 w-96 h-96 bg-[#DE5127]/5 rounded-full blur-[100px] pointer-events-none' />
                <div className='absolute bottom-0 left-0 w-96 h-96 bg-white/2 rounded-full blur-[100px] pointer-events-none' />

                <motion.div
                    className="max-w-5xl mx-auto text-center relative z-10"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h2 id="font6" className="text-fluid-large text-white leading-[0.8] mb-16 tracking-tighter uppercase">
                        READY TO <br /> <span className="text-[#DE5127]">HUNT?</span>
                    </h2>
                    <motion.button
                        id="font"
                        className='group relative overflow-hidden bg-[#DE5127] text-white px-16 py-8 rounded-full text-xs font-bold uppercase tracking-[0.4em] transition-all duration-500'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className='relative z-10'>Start a Project</span>
                        <motion.div
                            className='absolute inset-0 bg-white'
                            initial={{ y: '100%' }}
                            whileHover={{ y: 0 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        />
                        <style jsx>{`
                            button:hover span {
                                color: black;
                            }
                        `}</style>
                    </motion.button>
                </motion.div>
            </div>
        </div>
    )
}

export default Work
