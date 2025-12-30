import React from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

const Footer = () => {
    const menuItems = [
        { name: 'Home', path: '/' },
        { name: 'Work', path: '/work' },
        { name: 'News', path: '/news' },
        { name: 'Contact', path: '/contact' }
    ];

    return (
        <footer className='relative min-w-screen bg-[#F1F1F1] overflow-hidden'>
            {/* Main Section */}
            <div className='px-6 sm:px-10 md:px-16 lg:px-24 pt-32 pb-12 relative z-10'>
                {/* Large HNTRS Logo + Tagline */}
                <motion.div
                    className='mb-32'
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className='flex flex-col xl:flex-row xl:items-end xl:justify-between gap-12'>
                        {/* Logo */}
                        <div className="group cursor-default">
                            <div id='font2' className='flex items-start text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] xl:text-[15vw] leading-[0.75] tracking-tighter opacity-90 transition-transform duration-700 group-hover:scale-[1.02]'>
                                <span className='text-black'>HNTRS</span>
                                <span className='text-[12px] sm:text-[16px] md:text-[20px] border-2 border-black rounded-full h-5 w-5 sm:h-7 sm:w-7 md:h-10 md:w-10 flex items-center justify-center mt-4 sm:mt-6 font-normal'>R</span>
                            </div>
                            <div id="font4" className='flex gap-4 text-3xl sm:text-4xl md:text-5xl text-[#DE5127] mt-6 tracking-tighter'>
                                <span className='font-normal uppercase'>Sports</span>
                                <span id="font7" className='italic'>Exclusive</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Links Grid */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-12 mb-32 border-t border-black/10 pt-20'>
                    {/* Navigation */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.1 }}
                    >
                        <h4 id="font4" className='text-[10px] font-normal uppercase tracking-[0.4em] text-black/20 mb-10'>Navigation</h4>
                        <ul id="font4" className='space-y-4'>
                            {menuItems.map((item, i) => (
                                <li key={i}>
                                    <Link to={item.path} className='text-xl font-normal text-black hover:text-[#DE5127] transition-all duration-300 uppercase tracking-tight'>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Services */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <h4 id="font4" className='text-[10px] font-normal uppercase tracking-[0.4em] text-black/20 mb-10'>Expertise</h4>
                        <ul id="font4" className='space-y-4'>
                            {['Branding', 'Motion', 'Content', 'Product'].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className='text-xl font-normal text-black hover:text-[#DE5127] transition-all duration-300 uppercase tracking-tight'>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Social */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        <h4 id="font4" className='text-[10px] font-normal uppercase tracking-[0.4em] text-black/20 mb-10'>Connect</h4>
                        <ul id="font4" className='space-y-4'>
                            {['Instagram', 'LinkedIn', 'Behance', 'Twitter'].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className='text-xl font-normal text-black hover:text-[#DE5127] transition-all duration-300 uppercase tracking-tight'>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        <h4 id="font4" className='text-[10px] font-normal uppercase tracking-[0.4em] text-black/20 mb-10'>Inquiries</h4>
                        <div id="font4" className='space-y-6'>
                            <a href="mailto:hello@graphichunters.com" className='block text-xl font-normal text-black hover:text-[#DE5127] transition-all duration-300 uppercase tracking-tight'>
                                hello@graphichunters.com
                            </a>
                            <p className='text-xl font-normal text-black uppercase tracking-tight'>
                                +92 321 168 8059
                            </p>
                            <p className='text-xs font-normal text-black/40 mt-6 uppercase tracking-widest'>
                                Lahore, Pakistan
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 pt-12 border-t border-black/10'>
                    <p id="font4" className='text-[10px] font-normal text-black/20 uppercase tracking-[0.3em]'>
                        © 2025 GRAPHICHUNTERS®. All rights reserved.
                    </p>
                    <div id="font4" className='flex gap-10 text-[10px] font-normal text-black/20 uppercase tracking-[0.3em]'>
                        <a href="#" className='hover:text-black transition-colors duration-300'>Privacy Policy</a>
                        <a href="#" className='hover:text-black transition-colors duration-300'>Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer