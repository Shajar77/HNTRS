import { lazy, Suspense, useState, startTransition } from 'react'
import { Routes, Route } from 'react-router-dom'
import Entrance from './components/Entrance'

// ─── PERFORMANCE: Lazy load only heavy components ───
const Home = lazy(() => import('./components/Home'))
const Services = lazy(() => import('./components/Services'))
const Footer = lazy(() => import('./components/Footer'))
const Navbar = lazy(() => import('./components/Navbar'))

// Pages
const Work = lazy(() => import('./pages/Work'))
const News = lazy(() => import('./pages/News'))
const Contact = lazy(() => import('./pages/Contact'))
const Mint = lazy(() => import('./pages/Mint'))
const Marketplace = lazy(() => import('./pages/Marketplace'))
const Profile = lazy(() => import('./pages/Profile'))
const Collect = lazy(() => import('./pages/Collect'))

const CTASection = lazy(() => import('./components/home/CTASection'))

// Minimal loading fallback — matches light modern aesthetic
const PageLoader = () => (
  <div className='min-h-screen bg-[#F1F1F1] flex items-center justify-center'>
    <div className='flex flex-col items-center gap-4'>
      <div className='w-12 h-[2px] bg-[#DE5127] animate-pulse' />
      <span className='font-gs text-[10px] uppercase tracking-[0.4em] text-black/30'>Loading</span>
    </div>
  </div>
)

// Home page layout with all sections
const HomePage = () => (
  <>
    <Home />
    <Services />
    <CTASection />
    <Footer />
  </>
)

const App = () => {
  const [showEntrance, setShowEntrance] = useState(() => {
    if (typeof window === 'undefined') return true
    return !sessionStorage.getItem('hasSeenEntrance')
  })

  const handleEntranceComplete = () => {
    startTransition(() => {
      setShowEntrance(false);
      sessionStorage.setItem('hasSeenEntrance', 'true');
    });
  };

  return (
    <div className="relative">
      {/* Entrance Animation — Immediate availability for LCP stability */}
      {showEntrance && (
          <Entrance onComplete={handleEntranceComplete} />
      )}

      {/* Global Navbar — Lazy loaded to avoid blocking initial paint */}
      <Suspense fallback={<div className="h-20" />}>
        <Navbar />
      </Suspense>

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<><Work /><Footer /></>} />
          <Route path="/news" element={<><News /><Footer /></>} />
          <Route path="/contact" element={<><Contact /><Footer /></>} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/collect" element={<Collect />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
