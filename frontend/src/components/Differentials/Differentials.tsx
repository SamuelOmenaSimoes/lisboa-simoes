import React from 'react'
import { DIFFERENTIALS } from '../../data/company'
import './Differentials.css'

const Differentials: React.FC = () => {
  return (
    <section className="differentials" id="diferenciais">
      <div className="differentials__bg-strip" />
      <div className="container">
        <div className="differentials__header">
          <span className="section-label">Diferenciais</span>
          <h2 className="section-title">
            Por que escolher a<br />
            <span>Lisboa Simões</span>
          </h2>
        </div>

        <div className="differentials__grid">
          {DIFFERENTIALS.map((item, i) => (
            <div className="diff-card" key={i}>
              <div className="diff-card__number">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="diff-card__body">
                <h3 className="diff-card__title">{item.title}</h3>
                <p className="diff-card__desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Banner CTA */}
        <div className="differentials__cta-banner">
          <div className="differentials__cta-content">
            <span className="differentials__cta-label">Pronto para otimizar sua logística?</span>
            <h3 className="differentials__cta-title">
              Fale com nosso time comercial
            </h3>
          </div>
          <button
            className="btn-primary btn-lg"
            onClick={() => document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Solicitar Proposta Comercial
          </button>
        </div>
      </div>
    </section>
  )
}

export default Differentials
