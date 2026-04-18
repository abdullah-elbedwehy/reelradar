import Nav from './components/Nav'
import Hero from './components/Hero'
import Features from './components/Features'
import Platforms from './components/Platforms'
import HowItWorks from './components/HowItWorks'
import Install from './components/Install'
import CallToAction from './components/CallToAction'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-rr-bg text-rr-text">
      <Nav />
      <main>
        <Hero />
        <Features />
        <Platforms />
        <HowItWorks />
        <Install />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
