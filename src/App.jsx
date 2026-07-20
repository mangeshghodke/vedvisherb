import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import Products from './components/Products'
import About from './components/About'
import WhyChoose from './components/WhyChoose'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProductDetail from './pages/ProductDetail'

function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <Products />
      <About />
      <WhyChoose />
      <Contact />
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  )
}
