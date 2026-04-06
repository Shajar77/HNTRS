import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { useSwitchChain } from 'wagmi'
import { polygonAmoy } from 'wagmi/chains'
import { useState } from 'react'

const WalletConnect = ({ onClose, dropdownPosition = 'down' }) => {
  const { address, isConnected, connector } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const [showMenu, setShowMenu] = useState(false)

  const isCorrectNetwork = chainId === polygonAmoy.id

  // Dropdown position classes
  const dropdownClasses = dropdownPosition === 'up' 
    ? 'absolute right-0 bottom-full mb-3' 
    : 'absolute right-0 mt-3'

  const formatAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleConnect = (connector) => {
    connect({ connector })
    if (onClose) onClose()
  }

  const handleDisconnect = () => {
    disconnect()
    setShowMenu(false)
    if (onClose) onClose()
  }

  const handleSwitchNetwork = () => {
    switchChain({ chainId: polygonAmoy.id })
  }

  // Not connected state
  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="btn-hover-scale px-5 py-2.5 bg-black text-white font-gs font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-[#DE5127] transition-colors duration-300"
        >
          {isPending ? 'Connecting...' : 'Connect Wallet'}
        </button>

        {showMenu && (
          <div
            className={`${dropdownClasses} w-64 bg-white border border-black/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] overflow-hidden z-50 animate-[hero-fade-up_0.2s_ease_both]`}
          >
            <div className="p-4 border-b border-black/5">
              <h3 className="font-2 text-lg text-black">Connect Wallet</h3>
              <p className="font-gs text-[10px] uppercase tracking-[0.2em] text-black/40 mt-1">Select your wallet</p>
            </div>
            <div className="p-2">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => handleConnect(connector)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-black/[0.02] transition-colors text-left"
                >
                  {connector.icon && (
                    <img src={connector.icon} alt={connector.name} className="w-6 h-6" />
                  )}
                  <span className="font-gs text-[11px] uppercase tracking-[0.15em] text-black">{connector.name}</span>
                </button>
              ))}
            </div>
            {error && (
              <div className="p-3 bg-red-50 border-t border-black/5">
                <p className="text-red-500 text-xs font-gs">{error.message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Connected state
  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        {/* Network indicator */}
        {!isCorrectNetwork && (
          <button
            onClick={handleSwitchNetwork}
            disabled={isSwitching}
            className="btn-hover-scale px-4 py-2.5 bg-[#DE5127]/10 text-[#DE5127] border border-[#DE5127]/30 font-gs text-[11px] uppercase tracking-[0.15em]"
          >
            {isSwitching ? 'Switching...' : 'Switch Network'}
          </button>
        )}

        {/* Wallet info - Clean minimal design */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="btn-hover-scale flex items-center gap-3 px-4 py-2.5 bg-black text-white border border-black hover:border-[#DE5127] transition-colors duration-300"
        >
          <div className="w-6 h-6 bg-[#DE5127] flex items-center justify-center">
            <span className="font-gs text-[10px] font-bold">
              {address?.slice(2, 4).toUpperCase()}
            </span>
          </div>
          <span className="font-gs text-[11px] uppercase tracking-[0.15em]">
            {formatAddress(address)}
          </span>
          <svg className="w-3 h-3 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Dropdown menu - Matching site style */}
      {showMenu && (
        <div
          className={`${dropdownClasses} w-64 bg-white border border-black/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] overflow-hidden z-50 animate-[hero-fade-up_0.2s_ease_both]`}
        >
          <div className="p-4 border-b border-black/5 bg-black">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#DE5127] flex items-center justify-center">
                <span className="text-white font-gs text-sm font-bold">
                  {address?.slice(2, 4).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white font-gs text-sm">{formatAddress(address)}</p>
                <p className="text-white/50 font-gs text-[10px] uppercase tracking-[0.2em]">{connector?.name}</p>
              </div>
            </div>
          </div>
          <div className="p-2">
            <a
              href={`https://amoy.polygonscan.com/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 hover:bg-black/[0.02] transition-colors text-black"
            >
              <svg className="w-4 h-4 text-[#DE5127]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="font-gs text-[11px] uppercase tracking-[0.15em]">View on Explorer</span>
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(address)
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-black/[0.02] transition-colors text-black"
            >
              <svg className="w-4 h-4 text-[#DE5127]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="font-gs text-[11px] uppercase tracking-[0.15em]">Copy Address</span>
            </button>
            <button
              onClick={handleDisconnect}
              className="w-full flex items-center gap-3 p-3 hover:bg-[#DE5127]/5 transition-colors text-[#DE5127]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-gs text-[11px] uppercase tracking-[0.15em]">Disconnect</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default WalletConnect
