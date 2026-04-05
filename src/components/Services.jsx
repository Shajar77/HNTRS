import Boxes from './Boxes'

const Services = () => {
    return (
        <div className='flex flex-col bg-[#F1F1F1] py-32 overflow-hidden' style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 1000px' }}>
            <div className='px-6 sm:px-10 md:px-16 lg:px-24 mb-24'>
                <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-8'>
                    <p className='font-6 text-[13vw] sm:text-fluid-huge opacity-90 leading-[0.8] tracking-tighter text-center xl:text-left uppercase'>
                        SERVICES
                    </p>
                    <p className='font-gs text-xs font-black tracking-[0.5em] uppercase text-[#DE5127] mb-4 text-center xl:text-right'>
                        What HNTRS Offers
                    </p>
                </div>
                <div className='w-full h-px bg-black/10 mt-12' />
            </div>

            <div className='flex flex-col'>
                <Boxes 
                    number="01" 
                    title="Mint" 
                    description="Create Sports NFTs" 
                    text="Transform your sports moments into unique digital collectibles. Upload artwork, set metadata, configure royalties, and mint directly on Polygon blockchain with minimal gas fees." 
                    image="/images/mint-nft.jpg" 
                />
                <Boxes 
                    number="02" 
                    title="Trade" 
                    description="Buy & Sell NFTs" 
                    text="Access a decentralized marketplace for sports NFTs. List with fixed price or auction formats, browse collections by sport, and discover rare digital memorabilia from athletes worldwide." 
                    image="/images/trade-nft.jpg" 
                    reversed={true} 
                />
                <Boxes 
                    number="03" 
                    title="Collect" 
                    description="Build Your Collection" 
                    text="Curate your personal sports NFT gallery. Track your assets, showcase rare finds, and connect with a community of collectors who share your passion for sports and digital art." 
                    image="/images/collect-nft.jpg" 
                />
                <Boxes 
                    number="04" 
                    title="Earn" 
                    description="Royalties & Rewards" 
                    text="Creators earn from every secondary sale through customizable royalty settings. Build passive income streams while fans trade your sports moments in the marketplace forever." 
                    image="/images/earn-nft.jpg" 
                    reversed={true} 
                />
            </div>
        </div>
    )
}

export default Services
