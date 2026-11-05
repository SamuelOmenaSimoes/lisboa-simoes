import React from 'react'
import './Safety.css'

const SAFETY_ITEMS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="m4.9 4.9 14.2 14.2"/>
        <path d="M12 8v4l2 2"/>
      </svg>
    ),
    title: 'Monitoramento em Tempo Real',
    text: 'Central de rastreamento para ocorrências críticas.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    title: 'Documentação e Conformidade',
    text: 'Toda a operação atende às normas do ANTT, RNTRC e legislação estadual.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Motoristas Certificados',
    text: 'Processo rigoroso de seleção, com certificação MOPP.',
  },
]

const Safety: React.FC = () => {
  return (
    <section className="safety" id="seguranca">
      <div className="container">
        <div className="safety__header">
          <span className="section-label">Segurança e Rastreabilidade</span>
          <h2 className="section-title">
            Operação com<br />
            <span>zero tolerância ao risco</span>
          </h2>
          <p className="section-subtitle" style={{ marginTop: 20 }}>
            Investimos continuamente em tecnologia, treinamento e processos para
            garantir a integridade de cada carga e a segurança de cada entrega.
          </p>
        </div>

        <div className="safety__grid">
          {SAFETY_ITEMS.map((item, i) => (
            <div className="safety-item" key={i}>
              <div className="safety-item__icon">{item.icon}</div>
              <div>
                <h3 className="safety-item__title">{item.title}</h3>
                <p className="safety-item__text">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Safety
