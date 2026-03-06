import { lazy, Suspense, useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Football from './components/Football'
import BVB from './components/BVB'
import Services from './components/Services'
import BehindTheHunt from './components/BehindTheHunt'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Entrance from './components/Entrance'

// Lazy-loaded pages — keeps initial bundle lean
const Work = lazy(() => import('./pages/Work'))
const News = lazy(() => import('./pages/News'))
const Contact = lazy(() => import('./pages/Contact'))

// Minimal loading fallback — invisible to avoid layout shift
const PageLoader = () => <div style={{ minHeight: '100vh' }} />

// Home page layout with all sections
const HomePage = () => {
  return (
    <>
      <Home />
      <Football />
      <BVB />
      <Services />
      <BehindTheHunt />
      <Footer />
    </>
  )
}

const App = () => {
  const [showEntrance, setShowEntrance] = useState(true);

  useEffect(() => {
    // Only show Entrance once per session
    const hasSeenEntrance = sessionStorage.getItem('hasSeenEntrance');
    if (hasSeenEntrance) {
      setShowEntrance(false);
    }
  }, []);

  const handleEntranceComplete = () => {
    setShowEntrance(false);
    sessionStorage.setItem('hasSeenEntrance', 'true');
  };

  return (
    <div className="relative">
      {/* Entrance Animation */}
      {showEntrance && <Entrance onComplete={handleEntranceComplete} />}

      {/* Global Navbar */}
      <Navbar />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<><Work /><Footer /></>} />
          <Route path="/news" element={<><News /><Footer /></>} />
          <Route path="/contact" element={<><Contact /><Footer /></>} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
