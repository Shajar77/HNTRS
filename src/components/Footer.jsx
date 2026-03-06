import { Link } from 'react-router-dom'

const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: 'News', path: '/news' },
    { name: 'Contact', path: '/contact' }
];

const Footer = () => {
    return (
        <footer className='relative w-full bg-[#0A0A0A] overflow-hidden' style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 800px' }}>

            {/* Giant background watermark */}
            <div className='font-2 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[35%] text-[28vw] font-black text-white/[0.02] pointer-events-none select-none whitespace-nowrap leading-none'>
                HNTRS
            </div>

            {/* CTA Section */}
            <div className='relative z-10 px-8 sm:px-12 md:px-20 lg:px-28 pt-28 sm:pt-36 md:pt-44 pb-20 sm:pb-28 border-b border-white/5'>
                <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-12 lg:gap-20'>
                    <div>
                        <p className='font-gs text-[10px] sm:text-xs text-[#DE5127] font-bold tracking-[0.5em] uppercase mb-6 flex items-center gap-3'>
                            <span className='w-8 h-px bg-[#DE5127]'></span>
                            Let's work together
                        </p>
                        <h2 className='font-2 text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[6vw] text-white leading-[0.85] tracking-tighter'>
                            READY TO<br />
                            <span className='text-[#DE5127]'>HUNT?</span>
                        </h2>
                    </div>
                    <Link to="/contact" className='group shrink-0 mb-2'>
                        <div className='relative bg-[#DE5127] text-white rounded-full px-10 sm:px-14 py-5 sm:py-6 overflow-hidden'>
                            <span className='absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo'></span>
                            <span className='relative z-10 font-gs text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] group-hover:text-[#DE5127] transition-colors duration-500 flex items-center gap-3'>
                                Start a Project
                                <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M17 8l4 4m0 0l-4 4m4-4H3' />
                                </svg>
                            </span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Links Grid */}
            <div className='relative z-10 px-8 sm:px-12 md:px-20 lg:px-28 py-20 sm:py-28'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16'>
                    {/* Navigation */}
                    <div>
                        <h4 className='font-gs text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-8'>Navigation</h4>
                        <ul className='space-y-5'>
                            {menuItems.map((item, i) => (
                                <li key={i}>
                                    <Link to={item.path} className='group/link font-gs text-sm sm:text-base text-white/60 hover:text-white transition-all duration-300 uppercase tracking-wide flex items-center gap-0 hover:gap-2'>
                                        <span className='w-0 h-px bg-[#DE5127] group-hover/link:w-4 transition-all duration-300'></span>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className='font-gs text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-8'>Expertise</h4>
                        <ul className='space-y-5'>
                            {['Branding', 'Motion', 'Content', 'Product'].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className='group/link font-gs text-sm sm:text-base text-white/60 hover:text-white transition-all duration-300 uppercase tracking-wide flex items-center gap-0 hover:gap-2'>
                                        <span className='w-0 h-px bg-[#DE5127] group-hover/link:w-4 transition-all duration-300'></span>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className='font-gs text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-8'>Connect</h4>
                        <ul className='space-y-5'>
                            {['Instagram', 'LinkedIn', 'Behance', 'Twitter'].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className='group/link font-gs text-sm sm:text-base text-white/60 hover:text-white transition-all duration-300 uppercase tracking-wide flex items-center gap-0 hover:gap-2'>
                                        <span className='w-0 h-px bg-[#DE5127] group-hover/link:w-4 transition-all duration-300'></span>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className='font-gs text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-8'>Inquiries</h4>
                        <div className='space-y-5'>
                            <a href="mailto:graphichunters.com" className='block font-gs text-sm sm:text-base text-white/60 hover:text-[#DE5127] transition-all duration-300 tracking-wide break-all'>
                                graphichunters.com
                            </a>
                            <p className='font-gs text-sm sm:text-base text-white/60 tracking-wide'>
                                +92 321 168 8059
                            </p>
                            <div className='flex items-center gap-2 mt-4'>
                                <div className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse'></div>
                                <p className='font-gs text-[10px] text-white/30 uppercase tracking-[0.3em]'>
                                    Lahore, Pakistan
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className='relative z-10 px-8 sm:px-12 md:px-20 lg:px-28 py-8 border-t border-white/5'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6'>
                    <div className='flex items-center gap-4'>
                        {/* Mini logo */}
                        <span className='font-2 text-xl text-white/20 tracking-tighter'>HNTRS</span>
                        <span className='w-px h-4 bg-white/10'></span>
                        <p className='font-gs text-[9px] text-white/20 uppercase tracking-[0.3em]'>
                            © 2025 All rights reserved
                        </p>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <a href="#" className='font-gs text-[9px] text-white/20 uppercase tracking-[0.3em] hover:text-white/60 transition-colors duration-300'>Privacy</a>
                        <a href="#" className='font-gs text-[9px] text-white/20 uppercase tracking-[0.3em] hover:text-white/60 transition-colors duration-300'>Terms</a>
                        <a href="#" className='font-gs text-[9px] text-white/20 uppercase tracking-[0.3em] hover:text-white/60 transition-colors duration-300'>Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
