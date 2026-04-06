import { Link } from 'react-router-dom'

const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Collect', path: '/collect' },
    { name: 'NFT', path: '/marketplace' },
    { name: 'News', path: '/news' },
    { name: 'Contact', path: '/contact' }
];

const Footer = () => {
    return (
        <footer className='relative w-full bg-[#0A0A0A] overflow-hidden' style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 800px' }}>

            {/* Giant background watermark */}
            <div className='font-2 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[35%] text-[clamp(5rem,28vw,18rem)] font-black text-white/[0.02] pointer-events-none select-none whitespace-nowrap leading-none text-safe'>
                HNTRS
            </div>

            {/* Links Grid */}
            <div className='relative z-10 px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-12 sm:py-16 md:py-24 border-t border-white/5'>
                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 sm:gap-x-10 md:gap-12 lg:gap-16'>
                    {/* Navigation */}
                    <div className='col-span-1'>
                        <h4 className='font-gs text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-6 sm:mb-8'>Navigation</h4>
                        <ul className='space-y-4 sm:space-y-5'>
                            {menuItems.map((item, i) => (
                                <li key={i}>
                                    <Link to={item.path} className='group/link font-gs text-sm text-white/60 hover:text-white transition-all duration-300 uppercase tracking-wide flex items-center gap-0 hover:gap-3'>
                                        <span className='w-0 h-[1px] bg-[#DE5127] group-hover/link:w-3 transition-all duration-300'></span>
                                        <span className='relative'>
                                            {item.name}
                                            <span className='absolute -bottom-1 left-0 w-0 h-[1px] bg-[#DE5127] group-hover/link:w-full transition-all duration-300'></span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className='col-span-1'>
                        <h4 className='font-gs text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-6 sm:mb-8'>Expertise</h4>
                        <ul className='space-y-4 sm:space-y-5'>
                            {['Branding', 'Motion', 'Content', 'Product'].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className='group/link font-gs text-sm text-white/60 hover:text-white transition-all duration-300 uppercase tracking-wide flex items-center gap-0 hover:gap-3'>
                                        <span className='w-0 h-[1px] bg-[#DE5127] group-hover/link:w-3 transition-all duration-300'></span>
                                        <span className='relative'>
                                            {item}
                                            <span className='absolute -bottom-1 left-0 w-0 h-[1px] bg-[#DE5127] group-hover/link:w-full transition-all duration-300'></span>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div className='col-span-1'>
                        <h4 className='font-gs text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-6 sm:mb-8'>Connect</h4>
                        <ul className='space-y-4 sm:space-y-5'>
                            {['Instagram', 'LinkedIn', 'Behance', 'Twitter'].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className='group/link font-gs text-sm text-white/60 hover:text-white transition-all duration-300 uppercase tracking-wide flex items-center gap-0 hover:gap-3'>
                                        <span className='w-0 h-[1px] bg-[#DE5127] group-hover/link:w-3 transition-all duration-300'></span>
                                        <span className='relative'>
                                            {item}
                                            <span className='absolute -bottom-1 left-0 w-0 h-[1px] bg-[#DE5127] group-hover/link:w-full transition-all duration-300'></span>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className='col-span-2 sm:col-span-2 md:col-span-1 mt-2 sm:mt-0'>
                        <h4 className='font-gs text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-6 sm:mb-8'>Inquiries</h4>
                        <div className='space-y-4 sm:space-y-5'>
                            <a href="mailto:graphichunters.com" className='block font-gs text-sm text-white/60 hover:text-[#DE5127] transition-all duration-300 tracking-wide break-all'>
                                graphichunters.com
                            </a>
                            <p className='font-gs text-sm text-white/60 tracking-wide'>
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
            <div className='relative z-10 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-6 sm:py-8 border-t border-white/5'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6'>
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
