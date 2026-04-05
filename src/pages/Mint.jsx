import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAccount } from 'wagmi'
import { Link } from 'react-router-dom'
import WalletConnect from '../components/WalletConnect'
import useIPFS from '../hooks/useIPFS'
import { useHNTRSNFT } from '../hooks/useHNTRSContract'

const Mint = () => {
  const { address, isConnected } = useAccount()
  const { uploadNFT, uploading: ipfsUploading, error: ipfsError } = useIPFS()
  const { mintSingle, isPending: minting, hash } = useHNTRSNFT()

  // Mouse glow effect refs
  const spotRef = useRef(null)
  const sectionRef = useRef(null)
  const rectRef = useRef(null)
  const rafRef = useRef(null)
  const pointRef = useRef({ x: 0, y: 0 })
  const [isInteractive, setIsInteractive] = useState(false)

  useEffect(() => {
    const pointerMedia = window.matchMedia('(pointer: fine)')
    const reduceMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateEnabled = () => setIsInteractive(pointerMedia.matches && !reduceMotionMedia.matches)
    updateEnabled()
    pointerMedia.addEventListener('change', updateEnabled)
    reduceMotionMedia.addEventListener('change', updateEnabled)
    return () => {
      pointerMedia.removeEventListener('change', updateEnabled)
      reduceMotionMedia.removeEventListener('change', updateEnabled)
    }
  }, [])

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  const updateRect = useCallback(() => {
    if (!sectionRef.current) return
    rectRef.current = sectionRef.current.getBoundingClientRect()
  }, [])

  useEffect(() => {
    if (!isInteractive) return
    updateRect()
    window.addEventListener('resize', updateRect, { passive: true })
    window.addEventListener('scroll', updateRect, { passive: true })
    return () => {
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect)
    }
  }, [isInteractive, updateRect])

  const applyTransform = useCallback(() => {
    rafRef.current = null
    if (!spotRef.current || !rectRef.current) return
    const x = pointRef.current.x - rectRef.current.left - 150
    const y = pointRef.current.y - rectRef.current.top - 150
    spotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (!isInteractive) return
    pointRef.current = { x: e.clientX, y: e.clientY }
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(applyTransform)
  }, [applyTransform, isInteractive])

  const handlePointerEnter = useCallback(() => { if (isInteractive) updateRect() }, [isInteractive, updateRect])
  const handlePointerLeave = useCallback(() => { if (spotRef.current) spotRef.current.style.transform = 'translate3d(calc(50vw - 150px), calc(50vh - 150px), 0)' }, [])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'football',
    royaltyPercentage: 10,
    file: null,
    preview: null,
  })
  const [step, setStep] = useState(1)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const categories = [
    { id: 'football', label: 'Football' },
    { id: 'basketball', label: 'Basketball' },
    { id: 'tennis', label: 'Tennis' },
    { id: 'cricket', label: 'Cricket' },
    { id: 'other', label: 'Other' },
  ]

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError('File size must be less than 100MB')
        return
      }
      setFormData({ ...formData, file, preview: URL.createObjectURL(file) })
      setError(null)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleMint = async () => {
    if (!formData.file || !formData.name) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setError(null)
      setSuccess(null)

      const ipfsResult = await uploadNFT(formData.file, {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        creator: address,
        attributes: [
          { trait_type: 'Category', value: formData.category },
          { trait_type: 'Creator', value: address },
        ],
      })

      await mintSingle(
        address,
        ipfsResult.tokenURI,
        formData.name,
        formData.category,
        address,
        formData.royaltyPercentage * 100
      )

      setSuccess({
        hash,
        tokenURI: ipfsResult.tokenURI,
        gatewayUrl: ipfsResult.metadata.gatewayUrl,
      })
      setStep(4)
    } catch (err) {
      setError(err.message || 'Failed to mint NFT')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'football',
      royaltyPercentage: 10,
      file: null,
      preview: null,
    })
    setStep(1)
    setError(null)
    setSuccess(null)
  }

  // Not connected state
  if (!isConnected) {
    return (
      <section ref={sectionRef} onPointerMove={handlePointerMove} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}
        className='relative bg-[#F1F1F1] overflow-hidden selection:bg-[#DE5127] selection:text-white min-h-screen'>
        {/* Enhanced Grid background */}
        <div className='absolute inset-0 pointer-events-none opacity-[0.12]'
          style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
        
        {/* Floating decorative elements */}
        <div className='absolute top-20 left-10 w-64 h-64 border border-[#DE5127]/10 -rotate-12 pointer-events-none'></div>
        <div className='absolute bottom-20 right-10 w-48 h-48 border border-black/5 rotate-12 pointer-events-none'></div>
        
        {/* Mouse glow */}
        <div className='absolute inset-0 pointer-events-none overflow-hidden'>
          <div ref={spotRef} className='absolute transition-transform duration-500 ease-out' style={{ top: 0, left: 0, transform: 'translate3d(calc(50vw - 150px), calc(50vh - 150px), 0)', willChange: 'transform' }}>
            <div className='w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] rounded-full border border-[#DE5127]/30 flex items-center justify-center'>
              <div className='w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] rounded-full' style={{ background: 'radial-gradient(circle, rgba(222,81,39,0.25) 0%, rgba(222,81,39,0.08) 50%, transparent 70%)' }}></div>
            </div>
          </div>
        </div>
        
        <div className='relative z-10 flex flex-col justify-center min-h-screen px-8 sm:px-12 md:px-20 lg:px-28 pt-28 sm:pt-36 pb-10 sm:pb-14'>
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
              {/* Label with line */}
              <div className="flex items-center justify-center gap-4 mb-10">
                <span className='w-12 h-px bg-[#DE5127]/40'></span>
                <p className='font-gs text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.5em] text-black/30'>Mint Your NFT</p>
                <span className='w-12 h-px bg-[#DE5127]/40'></span>
              </div>
              
              {/* Main Title */}
              <div className="relative mb-8">
                <h1 className='font-2 text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[8vw] text-black leading-[0.8] tracking-[-0.03em]'>CREATE</h1>
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className='absolute -top-2 -right-4 sm:top-0 sm:right-8 w-6 h-6 sm:w-8 sm:h-8 bg-[#DE5127] flex items-center justify-center shadow-lg shadow-[#DE5127]/30'>
                  <span className='font-2 text-white text-[8px] sm:text-[10px]'>+</span>
                </motion.div>
              </div>
              
              {/* Subtitle */}
              <p className="font-7 italic text-[#DE5127] text-xl sm:text-2xl md:text-3xl tracking-tight mb-12">on the blockchain</p>
              
              {/* Description */}
              <p className="font-gs text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.4em] text-black/40 mb-16 max-w-lg mx-auto leading-relaxed">
                Connect your wallet to start creating unique sports NFTs
              </p>
              
              {/* CTA */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.8 }}
                className="flex justify-center">
                <WalletConnect />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} onPointerMove={handlePointerMove} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}
      className='relative bg-[#F1F1F1] overflow-hidden selection:bg-[#DE5127] selection:text-white min-h-screen'>
      {/* Enhanced Grid background */}
      <div className='absolute inset-0 pointer-events-none opacity-[0.12]'
        style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
      
      {/* Decorative corner elements */}
      <div className='absolute top-32 left-8 w-32 h-32 border-l-2 border-t-2 border-[#DE5127]/20 pointer-events-none'></div>
      <div className='absolute bottom-32 right-8 w-32 h-32 border-r-2 border-b-2 border-black/10 pointer-events-none'></div>
      
      {/* Mouse glow */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        <div ref={spotRef} className='absolute transition-transform duration-500 ease-out' style={{ top: 0, left: 0, transform: 'translate3d(calc(50vw - 150px), calc(50vh - 150px), 0)', willChange: 'transform' }}>
          <div className='w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] rounded-full border border-[#DE5127]/30 flex items-center justify-center'>
            <div className='w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] rounded-full' style={{ background: 'radial-gradient(circle, rgba(222,81,39,0.2) 0%, rgba(222,81,39,0.06) 50%, transparent 70%)' }}></div>
          </div>
        </div>
      </div>

      <div className='relative z-10 px-8 sm:px-12 md:px-20 lg:px-28 pt-28 sm:pt-36 pb-10 sm:pb-14 min-h-screen'>
        {/* Enhanced Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="mb-20 sm:mb-28">
          <div className="flex items-center gap-4 mb-8">
            <span className="w-12 h-[2px] bg-[#DE5127]"></span>
            <span className="font-gs text-[10px] sm:text-[11px] text-[#DE5127] font-bold tracking-[0.4em] uppercase">Create</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className='font-2 text-[12vw] sm:text-[10vw] md:text-[7vw] lg:text-[5vw] text-black leading-[0.85] tracking-[-0.02em]'>Mint NFT</h1>
              <div className="flex items-center gap-4 mt-6">
                <span className='w-16 h-px bg-black/20'></span>
                <span className='font-gs text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.4em] text-black/40'>Step {step} of 3</span>
              </div>
            </div>
            
            {/* Enhanced Step Indicators */}
            <div className="flex items-center gap-3">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <motion.div 
                    className={`relative w-10 h-10 flex items-center justify-center font-gs font-bold text-xs transition-all duration-500 ${step >= s ? 'bg-[#DE5127] text-white' : 'bg-black/5 text-black/30'}`}>
                    {step > s ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      `0${s}`
                    )}
                    {step === s && (
                      <motion.div layoutId="activeStepDot" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#DE5127]" />
                    )}
                  </motion.div>
                  <span className={`hidden sm:block ml-2 mr-4 font-gs text-[9px] uppercase tracking-[0.15em] ${step >= s ? 'text-black' : 'text-black/30'}`}>
                    {s === 1 ? 'Upload' : s === 2 ? 'Details' : 'Mint'}
                  </span>
                  {s < 3 && <div className={`w-6 sm:w-8 h-[2px] mx-1 ${step > s ? 'bg-[#DE5127]' : 'bg-black/10'}`} />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Upload */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                <div className="bg-white/60 backdrop-blur-md border border-black/[0.06] p-10 sm:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                  <div className={`relative border border-dashed transition-all duration-500 cursor-pointer group min-h-[420px] flex items-center justify-center ${formData.preview ? 'border-[#DE5127]/40 bg-[#DE5127]/[0.015]' : 'border-black/15 hover:border-[#DE5127]/40 hover:bg-black/[0.005]'}`}>
                    {formData.preview ? (
                      <div className="relative p-8 w-full">
                        <motion.img initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} src={formData.preview} alt="Preview" className="max-h-[320px] mx-auto shadow-xl" />
                        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, file: null, preview: null }) }}
                          className="absolute top-0 right-0 w-12 h-12 bg-black text-white flex items-center justify-center hover:bg-[#DE5127] transition-all duration-300 group/btn">
                          <svg className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        </motion.button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6">
                          <p className="font-gs text-[10px] uppercase tracking-[0.3em] text-white/90">Click to replace image</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-12">
                        <motion.div 
                          initial={{ scale: 1 }} 
                          whileHover={{ scale: 1.05, rotate: 2 }} 
                          transition={{ type: "spring", stiffness: 300 }}
                          className="w-28 h-28 mx-auto mb-10 border border-black/10 flex items-center justify-center group-hover:border-[#DE5127]/40 group-hover:bg-[#DE5127]/[0.02] transition-all duration-500">
                          <svg className="w-11 h-11 text-black/20 group-hover:text-[#DE5127]/60 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" /></svg>
                        </motion.div>
                        <p className="font-2 text-3xl text-black mb-4 tracking-tight">Drop or click to upload</p>
                        <div className="flex items-center justify-center gap-4 mb-6">
                          <span className='w-8 h-px bg-black/10'></span>
                          <p className="font-gs text-[10px] uppercase tracking-[0.3em] text-black/40">JPG, PNG, GIF, MP4</p>
                          <span className='w-8 h-px bg-black/10'></span>
                        </div>
                        <p className="font-gs text-[9px] uppercase tracking-[0.25em] text-black/25">Maximum file size 100MB</p>
                      </div>
                    )}
                    <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                  <div className="flex justify-end mt-12">
                    <motion.button 
                      whileHover={{ scale: 1.02, x: 3 }} 
                      whileTap={{ scale: 0.98 }}
                      onClick={() => formData.file && setStep(2)} 
                      disabled={!formData.file}
                      className="group flex items-center gap-4 px-12 py-5 bg-black text-white font-gs font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-[#DE5127] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-black/10">
                      Next Step <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                <div className="bg-white/60 backdrop-blur-md border border-black/[0.06] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                  <div className="grid lg:grid-cols-5 gap-0">
                    {/* Left: Preview */}
                    <div className="lg:col-span-2 bg-black/[0.02] p-10 flex items-center justify-center">
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative">
                        <img src={formData.preview} alt="Preview" className="max-w-full max-h-[380px] shadow-xl" />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-[#DE5127]">
                          <span className="font-gs text-[9px] uppercase tracking-[0.3em] text-white">Preview</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Right: Form */}
                    <div className="lg:col-span-3 p-10 sm:p-14">
                      <div className="space-y-10">
                        {/* Name */}
                        <div className="group">
                          <label className="font-gs text-[9px] uppercase tracking-[0.4em] text-black/40 mb-3 block">Name *</label>
                          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter NFT name"
                            className="w-full bg-transparent border-b border-black/10 py-4 text-3xl font-2 text-black placeholder:text-black/10 focus:outline-none focus:border-[#DE5127] transition-colors duration-300" />
                        </div>

                        {/* Description */}
                        <div className="group">
                          <label className="font-gs text-[9px] uppercase tracking-[0.4em] text-black/40 mb-3 block">Description</label>
                          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your design..." rows={2}
                            className="w-full bg-transparent border-b border-black/10 py-4 text-xl font-2 text-black placeholder:text-black/10 focus:outline-none focus:border-[#DE5127] transition-colors duration-300 resize-none" />
                        </div>

                        {/* Category */}
                        <div>
                          <label className="font-gs text-[9px] uppercase tracking-[0.4em] text-black/40 mb-5 block">Category</label>
                          <div className="flex flex-wrap gap-3">
                            {categories.map((cat) => (
                              <motion.button key={cat.id} onClick={() => setFormData({ ...formData, category: cat.id })} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className={`px-6 py-3 font-gs text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border ${formData.category === cat.id ? 'bg-[#DE5127] border-[#DE5127] text-white shadow-md shadow-[#DE5127]/20' : 'bg-transparent border-black/[0.08] text-black/60 hover:border-black/25'}`}>
                                {cat.label}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Royalty */}
                        <div>
                          <div className="flex justify-between items-center mb-5">
                            <label className="font-gs text-[9px] uppercase tracking-[0.4em] text-black/40">Royalty</label>
                            <motion.span key={formData.royaltyPercentage} initial={{ scale: 1.2, color: '#DE5127' }} animate={{ scale: 1, color: '#DE5127' }} className="font-2 text-4xl text-[#DE5127]">{formData.royaltyPercentage}%</motion.span>
                          </div>
                          <input type="range" name="royaltyPercentage" min="0" max="25" value={formData.royaltyPercentage} onChange={handleInputChange}
                            className="w-full h-[2px] bg-black/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#DE5127] [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all" />
                          <div className="flex justify-between mt-3">
                            <span className="font-gs text-[9px] uppercase tracking-[0.2em] text-black/25">0%</span>
                            <span className="font-gs text-[9px] uppercase tracking-[0.3em] text-black/30">Earn on secondary sales</span>
                            <span className="font-gs text-[9px] uppercase tracking-[0.2em] text-black/25">25%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between mt-14 pt-8 border-t border-black/5">
                        <motion.button whileHover={{ x: -3 }} whileTap={{ scale: 0.98 }} onClick={() => setStep(1)} className="px-10 py-4 border border-black/[0.08] text-black font-gs font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all duration-300">← Back</motion.button>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => formData.name && setStep(3)} disabled={!formData.name}
                          className="px-12 py-4 bg-black text-white font-gs font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#DE5127] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-black/10">
                          Continue →
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                <div className="bg-white/60 backdrop-blur-md border border-black/[0.06] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Left: Preview */}
                    <div className="bg-black/[0.02] p-10 flex items-center justify-center">
                      <motion.img initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} src={formData.preview} alt="Preview" className="max-w-full max-h-[360px] shadow-xl" />
                    </div>

                    {/* Right: Summary */}
                    <div className="p-10 sm:p-14">
                      <h3 className="font-2 text-2xl text-black mb-10 flex items-center gap-3">
                        <span className="w-8 h-px bg-[#DE5127]"></span>
                        Review
                      </h3>
                      <div className="space-y-6">
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex justify-between items-baseline border-b border-black/[0.06] pb-4">
                          <span className="font-gs text-[9px] uppercase tracking-[0.35em] text-black/40">Name</span>
                          <span className="font-2 text-xl text-black max-w-[200px] text-right">{formData.name}</span>
                        </motion.div>
                        {formData.description && (
                          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="flex justify-between items-start border-b border-black/[0.06] pb-4">
                            <span className="font-gs text-[9px] uppercase tracking-[0.35em] text-black/40 pt-1">Description</span>
                            <span className="font-2 text-base text-black/60 max-w-[200px] text-right leading-relaxed">{formData.description}</span>
                          </motion.div>
                        )}
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex justify-between items-baseline border-b border-black/[0.06] pb-4">
                          <span className="font-gs text-[9px] uppercase tracking-[0.35em] text-black/40">Category</span>
                          <span className="font-gs text-[11px] uppercase tracking-[0.2em] text-black">{formData.category}</span>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="flex justify-between items-baseline border-b border-black/[0.06] pb-4">
                          <span className="font-gs text-[9px] uppercase tracking-[0.35em] text-black/40">Royalty</span>
                          <span className="font-2 text-2xl text-[#DE5127]">{formData.royaltyPercentage}%</span>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex justify-between items-baseline">
                          <span className="font-gs text-[9px] uppercase tracking-[0.35em] text-[#DE5127]">Creator</span>
                          <span className="font-mono text-sm text-black/70">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                        </motion.div>
                      </div>

                      {(error || ipfsError) && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 bg-red-50 border-l-2 border-red-400">
                          <p className="text-red-600 font-gs text-[11px]">{error || ipfsError}</p>
                        </motion.div>
                      )}

                      <div className="flex justify-between mt-14 pt-8 border-t border-black/5">
                        <motion.button whileHover={{ x: -3 }} whileTap={{ scale: 0.98 }} onClick={() => setStep(2)} className="px-10 py-4 border border-black/[0.08] text-black font-gs font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all duration-300">← Back</motion.button>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleMint} disabled={ipfsUploading || minting}
                          className="px-12 py-4 bg-[#DE5127] text-white font-gs font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-[#DE5127]/20">
                          {ipfsUploading ? 'Uploading...' : minting ? 'Minting...' : 'Confirm Mint →'}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="bg-white/60 backdrop-blur-md border border-black/[0.06] p-14 sm:p-20 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                  <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="w-24 h-24 mx-auto mb-10 bg-[#DE5127] flex items-center justify-center shadow-lg shadow-[#DE5127]/20">
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </motion.div>
                  <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="font-2 text-5xl text-black mb-4 tracking-tight">Success</motion.h2>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="font-gs text-[10px] uppercase tracking-[0.4em] text-black/40 mb-14">Your NFT has been minted on-chain</motion.p>

                  {success && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="max-w-lg mx-auto mb-14 text-left border border-black/[0.06]">
                      <div className="flex justify-between p-6 border-b border-black/[0.06]">
                        <span className="font-gs text-[9px] uppercase tracking-[0.3em] text-black/40">Transaction</span>
                        <a href={`https://polygonscan.com/tx/${success.hash}`} target="_blank" rel="noopener noreferrer" className="text-[#DE5127] hover:underline font-mono text-xs">{success.hash?.slice(0, 14)}...{success.hash?.slice(-6)}</a>
                      </div>
                      <div className="flex justify-between p-6">
                        <span className="font-gs text-[9px] uppercase tracking-[0.3em] text-black/40">IPFS Metadata</span>
                        <a href={success.gatewayUrl} target="_blank" rel="noopener noreferrer" className="text-[#DE5127] hover:underline text-xs flex items-center gap-2">View →</a>
                      </div>
                    </motion.div>
                  )}

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row justify-center gap-4">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={resetForm} className="px-12 py-4 border border-black/[0.08] text-black font-gs font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all duration-300">Mint Another</motion.button>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link to="/marketplace" className="px-12 py-4 bg-black text-white font-gs font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#DE5127] transition-all duration-300 shadow-lg shadow-black/10 inline-block">View Marketplace →</Link>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

export default Mint
