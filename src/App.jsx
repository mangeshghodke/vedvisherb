import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import Products from './components/Products'
import About from './components/About'
import WhyChoose from './components/WhyChoose'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <Hero />
      <Ticker />
      <Products />
      <About />
      <WhyChoose />
      <Contact />
      <Footer />
    </div>
  )
}
