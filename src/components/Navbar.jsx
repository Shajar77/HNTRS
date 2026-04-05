import { useState, useEffect, lazy, Suspense } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown } from '../lib/icons'

// Lazy-load WalletConnect — it's heavy (wagmi hooks)
const WalletConnect = lazy(() => import('./WalletConnect'))
const WalletFallback = () => (
    <button className='btn-hover-scale px-5 py-2.5 bg-black text-white font-gs font-bold text-[11px] uppercase tracking-[0.2em]'>
        Connect Wallet
    </button>
)

const mainNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Collect', path: '/collect' },
    { name: 'NFT', path: '/marketplace', hasDropdown: true },
    { name: 'News', path: '/news' },
    { name: 'Contact', path: '/contact' }
];

const web3NavItems = [
    { name: 'Mint', path: '/mint' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Profile', path: '/profile' }
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isWeb3Open, setIsWeb3Open] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const isDark = ['/news', '/collect'].includes(location.pathname);
    const linkColor = isDark ? 'text-[#DE5127]' : 'text-black';
    const linkColorInactive = isDark ? 'text-white/50 hover:text-[#DE5127]' : 'text-black/40 hover:text-black';
    const isWeb3Active = web3NavItems.some(item => location.pathname === item.path);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setIsWeb3Open(false);
    }, [location.pathname]);

    return (
        <>
            {/* Desktop */}
            <nav className={`hidden lg:flex fixed top-0 left-0 right-0 z-50 px-12 py-6 transition-all duration-300 ${scrolled ? isDark ? 'bg-black/60 backdrop-blur-xl border-b border-white/[0.08]' : 'bg-white/70 backdrop-blur-xl border-b border-black/[0.08]' : ''}`}>
                <div className="flex items-center justify-between w-full max-w-[1800px] mx-auto">
                    {/* Left - Logo */}
                    <Link to="/" className="group flex items-center gap-3">
                        <span className={`font-2 text-2xl font-bold tracking-tight transition-colors duration-300 ${isDark ? 'text-white' : 'text-black'} group-hover:text-[#DE5127]`}>HNTRS</span>
                        <span className="w-2 h-2 bg-[#DE5127] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>

                    {/* Right - Nav + Wallet */}
                    <div className="flex items-center gap-8">
                        {/* Nav Links */}
                        <div className="flex items-center gap-8">
                            {mainNavItems.map((item) => (
                                item.hasDropdown ? (
                                    <div key={item.name} className="relative" onMouseEnter={() => setIsWeb3Open(true)} onMouseLeave={() => setIsWeb3Open(false)}>
                                        <button className={`relative flex items-center gap-1.5 text-[12px] font-gs font-bold uppercase tracking-[0.25em] transition-all duration-300 ${isWeb3Active || isWeb3Open ? 'text-[#DE5127]' : linkColorInactive}`}>
                                            {item.name}
                                            <div className={`transition-transform duration-200 ${isWeb3Open ? 'rotate-180' : ''}`}>
                                                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                                            </div>
                                            <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#DE5127] transition-all duration-300 ${isWeb3Active ? 'w-full' : 'w-0'}`} />
                                        </button>
                                        {isWeb3Open && (
                                            <div 
                                                className="absolute top-full right-0 mt-3 w-48 bg-[#DE5127] border border-[#DE5127]/20 shadow-[0_20px_60px_-15px_rgba(222,81,39,0.4)] overflow-hidden z-50 animate-[hero-fade-up_0.2s_ease_both]"
                                            >
                                                <div className="p-2">
                                                    {web3NavItems.map((subItem) => (
                                                        <Link 
                                                            key={subItem.name}
                                                            to={subItem.path} 
                                                            className={`block px-4 py-3 text-[11px] font-gs font-bold uppercase tracking-[0.15em] hover:bg-white/10 transition-colors ${location.pathname === subItem.path ? 'text-white bg-white/20' : 'text-white/90'}`}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={`relative text-[12px] font-gs font-bold uppercase tracking-[0.25em] transition-all duration-300 ${location.pathname === item.path ? linkColor : linkColorInactive}`}
                                    >
                                        {item.name}
                                        <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#DE5127] transition-all duration-300 ${location.pathname === item.path ? 'w-full' : 'w-0'}`} />
                                    </Link>
                                )
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="w-px h-6 bg-black/10" />

                        {/* Connect Wallet Button */}
                        <Suspense fallback={<WalletFallback />}>
                            <WalletConnect />
                        </Suspense>
                    </div>
                </div>
            </nav>

            {/* Tablet */}
            <nav className="hidden md:flex lg:hidden fixed top-0 left-0 right-0 z-50 px-8 py-5 bg-white/90 backdrop-blur-md border-b border-black/[0.06]">
                <div className="flex items-center justify-between w-full">
                    <Link to="/" className="font-2 text-xl font-bold tracking-tight">HNTRS</Link>
                    <div className="flex items-center gap-6">
                        {mainNavItems.slice(0, 3).map((item) => (
                            <Link key={item.name} to={item.path} className={`text-[11px] font-gs font-bold uppercase tracking-[0.2em] ${location.pathname === item.path ? 'text-black' : 'text-black/40'}`}>
                                {item.name}
                            </Link>
                        ))}
                        <button className="text-[11px] font-gs font-bold uppercase tracking-[0.2em] text-black/40">NFT</button>
                        <div className="w-px h-5 bg-black/10" />
                        <Suspense fallback={<WalletFallback />}>
                            <WalletConnect />
                        </Suspense>
                    </div>
                </div>
            </nav>

            {/* Mobile */}
            <nav className="md:hidden fixed top-0 left-0 right-0 z-50 px-5 py-4 bg-white/95 backdrop-blur-md border-b border-black/[0.06]">
                <div className="flex items-center justify-between">
                    <Link to="/" className="font-2 text-xl font-bold tracking-tight">HNTRS</Link>
                    <div className="flex items-center gap-3">
                        <Suspense fallback={<WalletFallback />}>
                            <WalletConnect />
                        </Suspense>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-black/5 transition-colors rounded-md">
                            <div className="w-5 space-y-1">
                                <span className={`block h-0.5 w-full bg-black transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                                <span className={`block h-0.5 w-4 bg-black transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                                <span className={`block h-0.5 w-full bg-black transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu — CSS-only slide (no framer motion) */}
            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-md animate-[hero-fade-in_0.2s_ease_both]"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div
                        className="fixed top-0 right-0 h-full w-[85vw] max-w-[320px] bg-white z-50 md:hidden shadow-2xl"
                        style={{ animation: 'mobile-menu-slide 0.4s cubic-bezier(0.22, 1, 0.36, 1) both' }}
                    >
                        <div className="flex flex-col h-full p-8 pt-24">
                            {/* Main Nav */}
                            <div className="space-y-1">
                                {mainNavItems.map((item, i) => (
                                    <div
                                        key={item.name}
                                        className="animate-[hero-fade-up_0.4s_ease_both]"
                                        style={{ animationDelay: `${i * 100}ms` }}
                                    >
                                        <Link
                                            to={item.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`flex items-center justify-between py-4 text-2xl font-bold uppercase tracking-tight transition-all duration-300 border-b border-black/5 ${location.pathname === item.path ? 'text-[#DE5127]' : 'text-black hover:text-[#DE5127]'}`}
                                        >
                                            {item.name}
                                            <span className="text-xs opacity-30">→</span>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {/* NFT Section */}
                            <div className="mt-8">
                                <p className="font-gs text-[10px] uppercase tracking-[0.4em] text-[#DE5127] mb-4">NFT Platform</p>
                                <div className="space-y-2">
                                    {web3NavItems.map((item, i) => (
                                        <div
                                            key={item.name}
                                            className="animate-[hero-fade-up_0.4s_ease_both]"
                                            style={{ animationDelay: `${400 + i * 100}ms` }}
                                        >
                                            <Link
                                                to={item.path}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={`flex items-center gap-3 py-3 px-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${location.pathname === item.path ? 'text-[#DE5127] bg-[#DE5127]/5' : 'text-black/60 hover:text-[#DE5127] hover:bg-black/[0.02]'}`}
                                            >
                                                <span className="w-1.5 h-1.5 bg-current" />
                                                {item.name}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto space-y-4">
                                <Suspense fallback={<WalletFallback />}>
                                    <WalletConnect onClose={() => setIsMenuOpen(false)} />
                                </Suspense>
                                <Link
                                    to="/contact"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#DE5127] transition-colors duration-300"
                                >
                                    Get in Touch <span>→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Navbar;
