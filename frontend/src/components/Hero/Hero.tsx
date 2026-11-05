import React from 'react'
import { STATS } from '../../data/company'
import './Hero.css'

const Hero: React.FC = () => {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="inicio">
      {/* Background */}
      <div className="hero__bg">
        <div className="hero__bg-image" />
        <div className="hero__bg-overlay" />
        <div className="hero__bg-grid" />
      </div>

      {/* Accent elements */}
      <div className="hero__accent hero__accent--1" />
      <div className="hero__accent hero__accent--2" />

      <div className="container hero__content">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          Operação 24 horas — 7 dias por semana
        </div>

        <h1 className="hero__title">
          Logística que<br />
          <span>move empresas.</span>
        </h1>

        <p className="hero__subtitle">
          Desde 2017 conectamos indústrias, distribuidoras e varejos
          com soluções de transporte precisas, rastreáveis e sob medida para
          cada operação.
        </p>

        <div className="hero__cta">
          <button
            className="btn-primary btn-lg"
            onClick={() => handleScroll('#contato')}
          >
            Solicitar Orçamento
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
          <button
            className="btn-secondary btn-lg"
            onClick={() => handleScroll('#calculadora')}
          >
            Calcular Frete
          </button>
        </div>

        {/* Stats */}
        <div className="hero__stats">
          {STATS.map((stat, i) => (
            <div className="hero__stat" key={i}>
              <span className="hero__stat-value">{stat.value}</span>
              <span className="hero__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll">
        <div className="hero__scroll-line" />
        <span>Rolar</span>
      </div>
    </section>
  )
}

export default Hero
