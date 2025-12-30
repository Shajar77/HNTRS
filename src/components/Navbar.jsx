import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Work', path: '/work' },
        { name: 'News', path: '/news' },
        { name: 'Contact', path: '/contact' }
    ];

    const slideInLeft = {
        hidden: { opacity: 0, x: -30 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.25, 0.1, 0.25, 1]
            }
        })
    };

    const menuVariants = {
        closed: { x: '100%' },
        open: {
            x: 0,
            transition: { type: 'spring', damping: 25, stiffness: 200 }
        }
    };

    const menuItemVariants = {
        closed: { opacity: 0, x: 30 },
        open: (i) => ({
            opacity: 1,
            x: 0,
            transition: { delay: 0.1 + i * 0.1, duration: 0.4 }
        })
    };

    return (
        <>
            {/* Desktop Navigation */}
            <motion.nav
                className={`hidden xl:flex fixed top-0 left-0 right-0 z-50 px-16 py-8 transition-all duration-700 ${isScrolled
                    ? 'bg-[#F1F1F1]/80 backdrop-blur-xl shadow-sm border-b border-black/5'
                    : 'bg-transparent'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-16" id="font">
                        {navItems.map((item, i) => (
                            <motion.div
                                key={item.name}
                                custom={i}
                                initial="hidden"
                                animate="visible"
                                variants={slideInLeft}
                            >
                                <Link
                                    to={item.path}
                                    className={`text-xs font-bold uppercase tracking-[0.5em] relative group transition-all duration-500 ${location.pathname === item.path
                                        ? 'text-[#DE5127]'
                                        : 'text-black hover:text-[#DE5127]'
                                        }`}
                                >
                                    <span className="mr-2 opacity-20 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
                                    {item.name}
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <Link to="/contact" className="relative group">
                        <motion.div
                            className={`px-6 py-2.5 rounded-full transition-all duration-700 border flex items-center gap-2 ${isScrolled
                                ? 'bg-black text-white border-black'
                                : 'bg-white/5 backdrop-blur-md text-black border-black/20'}`}
                            whileHover={{
                                scale: 1.05,
                                backgroundColor: '#DE5127',
                                color: '#fff',
                                borderColor: '#DE5127',
                                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span id="font" className='relative z-10 text-[10px] font-bold uppercase tracking-[0.25em]'>
                                Start a Project
                            </span>

                            <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-[#DE5127] group-hover:bg-white transition-colors duration-500" />
                        </motion.div>
                    </Link>
                </div>
            </motion.nav>

            {/* Tablet Navigation */}
            <motion.nav
                className={`hidden md:flex xl:hidden fixed top-0 left-0 right-0 z-50 justify-center px-10 py-6 transition-all duration-700 ${isScrolled
                    ? 'bg-[#F1F1F1]/80 backdrop-blur-xl shadow-sm border-b border-black/5'
                    : 'bg-transparent'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
                    <div className="flex items-center gap-10" id="font">
                        {navItems.map((item, i) => (
                            <motion.div
                                key={item.name}
                                custom={i}
                                initial="hidden"
                                animate="visible"
                                variants={slideInLeft}
                            >
                                <Link
                                    to={item.path}
                                    className={`text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-500 ${location.pathname === item.path
                                        ? 'text-[#DE5127]'
                                        : 'text-black hover:text-[#DE5127]'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <Link to="/contact" className="relative group">
                        <motion.div
                            className={`px-5 py-2 rounded-full transition-all duration-700 border flex items-center gap-2 overflow-hidden ${isScrolled
                                ? 'bg-black text-white border-black'
                                : 'bg-white/5 backdrop-blur-md text-black border-black/20'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-[#DE5127]"
                                initial={{ y: "100%" }}
                                whileHover={{ y: 0 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            />
                            <span id="font" className='relative z-10 text-[9px] font-bold uppercase tracking-[0.2em]'>
                                Start a Project
                            </span>
                            <div className="relative z-10 w-1 h-1 rounded-full bg-[#DE5127] group-hover:bg-white transition-colors duration-500" />
                        </motion.div>
                    </Link>
                </div>
            </motion.nav>

            {/* Mobile Hamburger */}
            <div className="md:hidden fixed top-8 right-8 z-50">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`flex flex-col gap-2 p-5 rounded-full transition-all duration-500 ${isMenuOpen || isScrolled ? 'bg-white shadow-2xl' : 'bg-white/10 backdrop-blur-md'
                        }`}
                    aria-label="Toggle menu"
                >
                    <span className={`block w-6 h-0.5 bg-black transition-all duration-500 ease-expo ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
                    <span className={`block w-4 h-0.5 bg-black self-end transition-all duration-500 ease-expo ${isMenuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-black transition-all duration-500 ease-expo ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.div
                            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 md:hidden shadow-2xl"
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                        >
                            <div className="flex flex-col gap-10 p-16 pt-40" id="font">
                                {navItems.map((item, i) => (
                                    <motion.div
                                        key={item.name}
                                        custom={i}
                                        variants={menuItemVariants}
                                        initial="closed"
                                        animate="open"
                                    >
                                        <Link
                                            to={item.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`text-6xl sm:text-7xl font-bold uppercase tracking-tighter transition-all duration-500 flex items-center gap-6 group ${location.pathname === item.path
                                                ? 'text-[#DE5127]'
                                                : 'text-black hover:text-[#DE5127]'
                                                }`}
                                        >
                                            <span className="text-xs opacity-20 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Mobile CTA */}
                                <motion.div
                                    custom={navItems.length}
                                    variants={menuItemVariants}
                                    initial="closed"
                                    animate="open"
                                    className="mt-8"
                                >
                                    <Link
                                        to="/contact"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="inline-flex items-center gap-4 bg-[#DE5127] text-white px-10 py-5 rounded-full text-xl font-black uppercase tracking-widest hover:bg-black transition-colors duration-500"
                                    >
                                        Start a Project <span>→</span>
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Mobile Menu Footer */}
                            <div className="absolute bottom-16 left-16 right-16 pt-10 border-t border-black/5">
                                <div className="flex flex-col gap-6">
                                    <p id="font" className="text-[10px] font-black uppercase tracking-[0.5em] text-black/20">© 2025 HNTRS® / Creative Studio</p>
                                    <div className="flex gap-8">
                                        {['Instagram', 'LinkedIn', 'Behance'].map(social => (
                                            <span key={social} id="font" className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-[#DE5127] cursor-pointer transition-colors">{social}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
