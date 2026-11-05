import React from 'react'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Services from './components/Services/Services'
import Differentials from './components/Differentials/Differentials'
import Coverage from './components/Coverage/Coverage'
import Safety from './components/Safety/Safety'
import Fleet from './components/Fleet/Fleet'
import Clients from './components/Clients/Clients'
import FreightCalculator from './components/FreightCalculator/FreightCalculator'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'

const App: React.FC = () => {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <About />
        <Services />
        <Differentials />
        <Coverage />
        <Safety />
        <Fleet />
        <Clients />
        <FreightCalculator />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
