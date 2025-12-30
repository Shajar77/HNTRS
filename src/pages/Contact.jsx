import React from 'react'
import { motion } from 'motion/react'

const Contact = () => {
    const processSteps = [
        {
            number: "01",
            title: "Discovery",
            text: "We dive deep into your brand, audience, and goals to find the unique angle that will set you apart."
        },
        {
            number: "02",
            title: "Strategy",
            text: "We map out the creative path, ensuring every design decision serves a clear purpose."
        },
        {
            number: "03",
            title: "Execution",
            text: "Our team brings the vision to life with precision, craft, and a relentless focus on quality."
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
                        <p className='tracking-tighter'>CONTACT</p>
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

            {/* Contact Content */}
            <div className='px-6 sm:px-10 md:px-16 lg:px-24 pb-32 relative z-10'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32'>
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <h2 id="font" className='text-xs font-black uppercase tracking-[0.5em] text-black/20 mb-12'>Inquiries</h2>
                        <div className='space-y-12'>
                            <div>
                                <p id="font" className='text-xs font-black uppercase tracking-[0.3em] text-[#DE5127] mb-4'>Email us</p>
                                <a href="mailto:hello@graphichunters.com" className='text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight hover:text-[#DE5127] transition-colors duration-500'>
                                    hello@graphichunters.com
                                </a>
                            </div>
                            <div>
                                <p id="font" className='text-xs font-black uppercase tracking-[0.3em] text-[#DE5127] mb-4'>Call us</p>
                                <p className='text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight'>
                                    +92 321 168 8059
                                </p>
                            </div>
                            <div>
                                <p id="font" className='text-xs font-black uppercase tracking-[0.3em] text-[#DE5127] mb-4'>Visit us</p>
                                <p className='text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight'>
                                    Lahore, Pakistan
                                </p>
                            </div>
                        </div>

                        <div className='mt-24'>
                            <h2 id="font" className='text-xs font-black uppercase tracking-[0.5em] text-black/20 mb-12'>Social</h2>
                            <div className='flex flex-wrap gap-8'>
                                {['Instagram', 'LinkedIn', 'Behance', 'Twitter'].map((social, i) => (
                                    <a key={i} href="#" className='text-xl font-black uppercase tracking-tight hover:text-[#DE5127] transition-colors duration-300'>
                                        {social}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className='bg-white rounded-[3rem] p-10 sm:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)]'
                    >
                        <form className='space-y-10'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
                                <div className='space-y-4'>
                                    <label id="font" className='text-[10px] font-bold uppercase tracking-[0.3em] text-black/40'>Your Name</label>
                                    <input type="text" className='w-full bg-[#F1F1F1] border-none rounded-2xl px-8 py-6 text-sm font-bold tracking-widest outline-none focus:ring-2 focus:ring-[#DE5127] transition-all' placeholder="JOHN DOE" />
                                </div>
                                <div className='space-y-4'>
                                    <label id="font" className='text-[10px] font-bold uppercase tracking-[0.3em] text-black/40'>Your Email</label>
                                    <input type="email" className='w-full bg-[#F1F1F1] border-none rounded-2xl px-8 py-6 text-sm font-bold tracking-widest outline-none focus:ring-2 focus:ring-[#DE5127] transition-all' placeholder="HELLO@EXAMPLE.COM" />
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <label id="font" className='text-[10px] font-bold uppercase tracking-[0.3em] text-black/40'>Subject</label>
                                <input type="text" className='w-full bg-[#F1F1F1] border-none rounded-2xl px-8 py-6 text-sm font-bold tracking-widest outline-none focus:ring-2 focus:ring-[#DE5127] transition-all' placeholder="PROJECT INQUIRY" />
                            </div>
                            <div className='space-y-4'>
                                <label id="font" className='text-[10px] font-bold uppercase tracking-[0.3em] text-black/40'>Message</label>
                                <textarea rows="5" className='w-full bg-[#F1F1F1] border-none rounded-3xl px-8 py-6 text-sm font-bold tracking-widest outline-none focus:ring-2 focus:ring-[#DE5127] transition-all resize-none' placeholder="TELL US ABOUT YOUR PROJECT..."></textarea>
                            </div>
                            <motion.button
                                id="font"
                                className='w-full bg-[#DE5127] text-white py-8 rounded-full text-xs font-bold uppercase tracking-[0.4em] hover:bg-black transition-all duration-500'
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Send Message
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Process Section */}
            <div className='px-6 sm:px-10 md:px-16 lg:px-24 pb-32 relative z-10'>
                <div className='bg-black rounded-[4rem] p-12 sm:p-24 text-white relative overflow-hidden'>
                    <div className='absolute top-0 left-0 w-full h-full opacity-5'>
                        <div className='absolute inset-0' style={{
                            backgroundImage: 'linear-gradient(rgba(222,81,39,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(222,81,39,0.3) 1px, transparent 1px)',
                            backgroundSize: '80px 80px'
                        }} />
                    </div>

                    <div className='relative z-10'>
                        <div className='flex flex-col lg:flex-row gap-20 items-start'>
                            <div className='lg:w-1/3'>
                                <h2 id="font6" className="text-fluid-medium leading-[0.85] tracking-tighter uppercase mb-12">
                                    THE <br /> <span className="text-[#DE5127]">HUNT</span> <br /> PROCESS
                                </h2>
                            </div>
                            <div className='lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-16'>
                                {processSteps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <p id="font8" className='text-5xl text-[#DE5127] mb-8'>{step.number}</p>
                                        <h3 id="font" className='text-3xl font-black uppercase tracking-tighter mb-6'>{step.title}</h3>
                                        <p id="font" className='text-white/40 text-lg leading-relaxed font-medium'>{step.text}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
