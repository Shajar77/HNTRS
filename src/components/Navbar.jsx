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
    const [isNftOpen, setIsNftOpen] = useState(false);
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
                                                    {web3NavItems.map((subItem, i) => (
                                                        <Link 
                                                            key={subItem.name}
                                                            to={subItem.path} 
                                                            className={`flex items-center gap-3 px-4 py-3 text-[11px] font-gs font-bold uppercase tracking-[0.15em] hover:bg-white/10 transition-colors ${location.pathname === subItem.path ? 'text-white bg-white/20' : 'text-white/90'}`}
                                                        >
                                                            <span className="font-2 text-[10px] tracking-wider text-white/50">
                                                                {String(i + 1).padStart(2, '0')}
                                                            </span>
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
            <nav className="md:hidden fixed top-0 left-0 right-0 z-50 px-5 py-4 bg-white/95 backdrop-blur-xl border-b border-black/[0.06]">
                <div className="flex items-center justify-between">
                    <Link to="/" className="font-2 text-xl font-bold tracking-tight">HNTRS</Link>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
                        <div className="relative w-5 h-4">
                            <span className={`absolute top-0 left-0 block h-[2px] w-full bg-black transition-all duration-300 ${isMenuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : ''}`} />
                            <span className={`absolute top-1/2 left-0 block h-[2px] w-4 bg-black -translate-y-1/2 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`absolute bottom-0 left-0 block h-[2px] w-full bg-black transition-all duration-300 ${isMenuOpen ? 'bottom-1/2 translate-y-1/2 -rotate-45' : ''}`} />
                        </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu — Premium Slide Panel */}
            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm animate-[hero-fade-in_0.3s_ease_both]"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div
                        className="fixed top-0 right-0 h-full w-[88vw] max-w-[340px] bg-[#FAFAFA] z-50 md:hidden shadow-[0_0_60px_-15px_rgba(0,0,0,0.3)]"
                        style={{ animation: 'mobile-menu-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) both' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
                            <span className="font-2 text-lg font-bold tracking-tight">Menu</span>
                            <button onClick={() => setIsMenuOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors">
                                <svg className="w-4 h-4 text-black/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col h-[calc(100%-70px)] px-6 py-8 overflow-y-auto">
                            {/* Main Nav */}
                            <nav className="space-y-2">
                                <p className="font-gs text-[10px] uppercase tracking-[0.3em] text-black/30 mb-3 pl-1">Navigation</p>
                                {mainNavItems.filter(item => !item.hasDropdown).map((item, i) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`group flex items-center justify-between py-3.5 px-4 rounded-xl transition-all duration-300 ${location.pathname === item.path ? 'bg-[#DE5127]/10 text-[#DE5127]' : 'text-black/80 hover:bg-black/5 hover:text-[#DE5127]'}`}
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        <span className="font-2 text-lg font-medium tracking-tight">{item.name}</span>
                                        <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                ))}

                                {/* NFT Dropdown */}
                                <div className="mt-2">
                                    <button 
                                        onClick={() => setIsNftOpen(!isNftOpen)}
                                        className={`w-full group flex items-center justify-between py-3.5 px-4 rounded-xl transition-all duration-300 ${isNftOpen ? 'bg-[#DE5127]/10 text-[#DE5127]' : 'text-black/80 hover:bg-black/5 hover:text-[#DE5127]'}`}
                                    >
                                        <span className="font-2 text-lg font-medium tracking-tight">NFT</span>
                                        <svg className={`w-4 h-4 transition-transform duration-300 ${isNftOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {isNftOpen && (
                                        <div className="mt-2 ml-2 space-y-1.5 p-2 bg-black/[0.03] rounded-xl">
                                            {web3NavItems.map((item, i) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.path}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className={`group flex items-center gap-4 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${location.pathname === item.path ? 'text-[#DE5127] bg-white shadow-sm' : 'text-black/60 hover:text-[#DE5127] hover:bg-white'}`}
                                                    style={{ animation: 'hero-fade-up 0.3s ease both', animationDelay: `${i * 50}ms` }}
                                                >
                                                    <span className={`font-2 text-[10px] tracking-wider transition-colors duration-300 ${location.pathname === item.path ? 'text-[#DE5127]' : 'text-black/30 group-hover:text-[#DE5127]'}`}>
                                                        {String(i + 1).padStart(2, '0')}
                                                    </span>
                                                    <span className="font-2 tracking-tight">{item.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </nav>

                            {/* Bottom Section - Wallet */}
                            <div className="mt-auto pt-8 relative">
                                {/* Wallet Connect - Dropdown opens upward */}
                                <div className="p-4 rounded-xl bg-gradient-to-br from-[#DE5127]/10 to-[#FF8F6B]/5 border border-[#DE5127]/20 relative">
                                    <p className="font-gs text-[10px] uppercase tracking-[0.3em] text-[#DE5127]/60 mb-3">Connect Wallet</p>
                                    <div className="relative wallet-mobile-container">
                                        <Suspense fallback={<WalletFallback />}>
                                            <WalletConnect onClose={() => setIsMenuOpen(false)} dropdownPosition="up" />
                                        </Suspense>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Navbar;
