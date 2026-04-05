import { useState } from 'react'
import { motion } from 'motion/react'
import { useAccount } from 'wagmi'
import { Sparkles, Wallet } from '../lib/icons'

const GachaButton = ({ onClick, disabled, isPending }) => {
  const { isConnected } = useAccount()
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (!isConnected) {
      // Trigger wallet connect modal
      return
    }
    onClick()
  }

  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute -inset-1 rounded-2xl blur-xl opacity-0"
        animate={{ 
          opacity: isHovered && !disabled ? 0.6 : 0,
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ duration: 0.3 }}
        style={{ 
          background: 'linear-gradient(135deg, #DE5127, #FB923C, #DE5127)',
        }}
      />

      {/* Main Button */}
      <motion.button
        onClick={handleClick}
        disabled={disabled || isPending}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={`
          relative w-full sm:w-auto px-8 py-5 rounded-xl font-gs text-[13px] font-bold uppercase tracking-[0.2em]
          transition-all duration-300 overflow-hidden
          ${disabled || isPending
            ? 'bg-white/[0.05] text-white/30 border border-white/[0.1] cursor-not-allowed'
            : isConnected
              ? 'bg-gradient-to-r from-[#DE5127] to-orange-500 text-white border-0 shadow-[0_10px_40px_rgba(222,81,39,0.4)] hover:shadow-[0_15px_50px_rgba(222,81,39,0.5)]'
              : 'bg-white/[0.08] text-white border border-white/[0.15] hover:bg-white/[0.12]'
          }
        `}
      >
        {/* Animated Background */}
        {!disabled && isConnected && (
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                'linear-gradient(90deg, transparent, rgba(255,255,255,0), transparent)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-3">
          {isPending ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              Summoning...
            </>
          ) : !isConnected ? (
            <>
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Try Your Luck - FREE
            </>
          )}
        </span>
      </motion.button>

      {/* Floating particles */}
      {isHovered && !disabled && isConnected && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#DE5127]"
              initial={{ 
                x: 50 + i * 30, 
                y: 20, 
                opacity: 0,
                scale: 0
              }}
              animate={{ 
                y: -30 - i * 10, 
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: 'easeOut'
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  )
}

export default GachaButton
