import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: 'News', path: '/news' },
    { name: 'Contact', path: '/contact' }
];

const menuVariants = {
    closed: { x: '100%' },
    open: {
        x: 0,
        transition: { type: 'spring', damping: 25, stiffness: 200 }
    }
};

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const isDark = ['/news'].includes(location.pathname);
    const textColor = isDark ? 'text-white' : 'text-black';
    const borderColor = isDark ? 'border-white/20' : 'border-black/20';

    return (
        <>
            {/* Desktop Navigation */}
            <nav className="hidden xl:flex absolute top-0 left-0 right-0 z-50 px-16 py-8 bg-transparent">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-16 font-gs">
                        {navItems.map((item, i) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`text-xs font-bold uppercase tracking-[0.5em] relative group transition-all duration-500 ${location.pathname === item.path
                                    ? 'text-[#DE5127]'
                                    : `${textColor} hover:text-[#DE5127]`
                                    }`}
                            >
                                <span className="mr-2 opacity-20 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <Link to="/contact" className="relative group">
                        <div className={`px-6 py-2.5 rounded-full transition-all duration-700 border flex items-center gap-2 bg-white/5 backdrop-blur-md ${textColor} ${borderColor} hover:bg-[#DE5127] hover:text-white hover:border-[#DE5127]`}>
                            <span className='font-gs relative z-10 text-[10px] font-bold uppercase tracking-[0.25em]'>
                                Start a Project
                            </span>
                            <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-[#DE5127] group-hover:bg-white transition-colors duration-500" />
                        </div>
                    </Link>
                </div>
            </nav>

            {/* Tablet Navigation */}
            <nav className="hidden md:flex xl:hidden absolute top-0 left-0 right-0 z-50 justify-center px-10 py-6 bg-transparent">
                <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
                    <div className="flex items-center gap-10 font-gs">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-500 ${location.pathname === item.path
                                    ? 'text-[#DE5127]'
                                    : `${textColor} hover:text-[#DE5127]`
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <Link to="/contact" className="relative group">
                        <div className={`px-5 py-2 rounded-full transition-all duration-700 border flex items-center gap-2 overflow-hidden bg-white/5 backdrop-blur-md ${textColor} ${borderColor} hover:bg-[#DE5127] hover:text-white hover:border-[#DE5127]`}>
                            <span className='font-gs relative z-10 text-[9px] font-bold uppercase tracking-[0.2em]'>
                                Start a Project
                            </span>
                            <div className="relative z-10 w-1 h-1 rounded-full bg-[#DE5127] group-hover:bg-white transition-colors duration-500" />
                        </div>
                    </Link>
                </div>
            </nav>

            {/* Mobile Hamburger */}
            <div className="md:hidden absolute top-8 right-8 z-50">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`flex flex-col gap-2 p-5 rounded-full transition-all duration-500 ${isMenuOpen ? 'bg-white shadow-2xl' : isDark ? 'bg-white/10 backdrop-blur-md' : 'bg-white/10 backdrop-blur-md'}`}
                    aria-label="Toggle menu"
                >
                    <span className={`block w-6 h-0.5 transition-all duration-500 ease-expo ${isMenuOpen ? 'bg-black rotate-45 translate-y-2.5' : isDark ? 'bg-white' : 'bg-black'}`} />
                    <span className={`block w-4 h-0.5 self-end transition-all duration-500 ease-expo ${isMenuOpen ? 'bg-black opacity-0' : isDark ? 'bg-white' : 'bg-black'}`} />
                    <span className={`block w-6 h-0.5 transition-all duration-500 ease-expo ${isMenuOpen ? 'bg-black -rotate-45 -translate-y-2.5' : isDark ? 'bg-white' : 'bg-black'}`} />
                </button>
            </div>

            {/* Mobile Menu Overlay — keeping AnimatePresence for menu open/close only */}
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
                            <div className="flex flex-col gap-10 p-8 sm:p-12 pt-28 sm:pt-36 font-gs">
                                {navItems.map((item, i) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tighter transition-all duration-500 flex items-center gap-6 group ${location.pathname === item.path
                                            ? 'text-[#DE5127]'
                                            : 'text-black hover:text-[#DE5127]'
                                            }`}
                                    >
                                        <span className="text-xs opacity-20 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
                                        {item.name}
                                    </Link>
                                ))}

                                {/* Mobile CTA */}
                                <div className="mt-8">
                                    <Link
                                        to="/contact"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="inline-flex items-center gap-4 bg-[#DE5127] text-white px-6 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-xl font-black uppercase tracking-[0.3em] hover:bg-black transition-colors duration-500"
                                    >
                                        Start a Project <span>→</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Mobile Menu Footer */}
                            <div className="absolute bottom-10 left-8 right-8 sm:bottom-16 sm:left-16 sm:right-16 pt-10 border-t border-black/5">
                                <div className="flex flex-col gap-6">
                                    <p className="font-gs text-[10px] font-black uppercase tracking-[0.5em] text-black/20">© 2025 HNTRS® / Creative Studio</p>
                                    <div className="flex flex-wrap gap-6">
                                        {['Instagram', 'LinkedIn', 'Behance'].map(social => (
                                            <span key={social} className="font-gs text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-[#DE5127] cursor-pointer transition-colors">{social}</span>
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
