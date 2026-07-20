import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import FeaturedProducts from './components/FeaturedProducts'
import About from './components/About'
import WhyChoose from './components/WhyChoose'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProductDetail from './pages/ProductDetail'
import ProductsPage from './pages/ProductsPage'

function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <FeaturedProducts />
      <About />
      <WhyChoose />
      <Contact />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
