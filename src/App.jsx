import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './components/Home'
import Football from './components/Football'
import Shirt from './components/Shirt'
import BVB from './components/BVB'
import Services from './components/Services'
import Jordan from './components/Jordan'
import BehindTheHunt from './components/BehindTheHunt'
import Footer from './components/Footer'
import Entrance from './components/Entrance'
import Navbar from './components/Navbar'
import Work from './pages/Work'
import News from './pages/News'
import Contact from './pages/Contact'
import CustomCursor from './components/CustomCursor'

// Home page layout with all sections
const HomePage = () => {
  return (
    <>
      <Entrance />
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
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className="relative">
      <CustomCursor />
      {/* Global Noise Overlay */}
      <div className="noise-overlay" />

      {/* Global Navbar */}
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<><Work /><Footer /></>} />
        <Route path="/news" element={<><News /><Footer /></>} />
        <Route path="/contact" element={<><Contact /><Footer /></>} />
      </Routes>
    </div>
  )
}

export default App