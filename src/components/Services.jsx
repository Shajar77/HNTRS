import React from 'react'
import { motion } from 'motion/react'
import Boxes from './Boxes'

const Services = () => {
    return (
        <div className='flex flex-col bg-[#F1F1F1] py-32 overflow-hidden'>
            <div className='px-6 sm:px-10 md:px-16 lg:px-24 mb-24'>
                <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-8'>
                    <motion.p
                        id="font6"
                        className='text-fluid-huge opacity-90 leading-[0.8] tracking-tighter text-center xl:text-left uppercase'
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        SERVICES
                    </motion.p>
                    <motion.p
                        id="font"
                        className='text-xs font-black tracking-[0.5em] uppercase text-[#DE5127] mb-4 text-center xl:text-right'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        What we do best
                    </motion.p>
                </div>
                <motion.div
                    className='w-full h-px bg-black/10 mt-12'
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                />
            </div>

            <div className='flex flex-col'>
                <Boxes number="01" title="Brand" description="Look core Elements" text="We create engaging brand and campaign identities that resonate with your target audience, from logo design to complete brand experience." image="https://cdn.prod.website-files.com/6766a97af7951c214f154267/67acf80cb39c5d65b61e696b_TOTO%20Dutch%20Darts%20Masters%20Thumbnail%205.avif" />
                <Boxes number="02" title="Visuals" description="Key visuals Campaign" text="We craft your campaign’s creative identity—key visuals, messaging, and adaptable designs across all touchpoints. From partnerships to events, we connect fans, brands, and unforgettable moments." image="https://cdn.prod.website-files.com/6766a97af7951c214f154267/67bb183bde30948f369ea54c_CAMPAIGN%20THUMBNAIL.avif" reversed={true} />
                <Boxes number="03" title="Content" description="Out of Home Motion" text="We create tailored content for every stage of your strategy, from awareness visuals to engaging social media assets. Think videos, motion graphics, and impactful designs that inspire and drive action." image="https://cdn.prod.website-files.com/6776815c172cb3537fafa18b/67d1c6a36ee550c98bfe0b71_TOPPS-MUFC-HALLOFHEROES-THUMB.jpg" />
                <Boxes number="04" title="Product" description="Printables & Packaging" text="We craft innovative products that merge design and functionality, delivering tangible solutions that elevate your brand and connect with your audience." image="https://cdn.prod.website-files.com/6766a97af7951c214f154267/679cc558eb3dc6e7bb06e52f_9a031345e747b405445bdbb16e748d93_Topps%20Teamset%20BVB%20Thumbnail%202.avif" reversed={true} />
            </div>
        </div>
    )
}

export default Services