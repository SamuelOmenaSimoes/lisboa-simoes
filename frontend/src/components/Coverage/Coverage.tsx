import React from 'react'
import { REGIONS } from '../../data/company'
import './Coverage.css'

const Coverage: React.FC = () => {
  return (
    <section className="coverage" id="cobertura">
      <div className="container coverage__layout">
        {/* Left content */}
        <div className="coverage__content">
          <span className="section-label">Cobertura</span>
          <h2 className="section-title">
            Presença em toda a<br />
            <span>Região Sul-Sudeste</span>
          </h2>
          <p className="section-subtitle" style={{ marginTop: 20, marginBottom: 40 }}>
            Operamos em mais de 100 municípios com rotas programadas e sob
            demanda, garantindo capilaridade para sua cadeia logística.
          </p>

          <div className="coverage__regions">
            {REGIONS.map((r, i) => (
              <div className="coverage__region" key={i}>
                <div className="coverage__region-dot" />
                <div className="coverage__region-info">
                  <span className="coverage__region-name">{r.region}</span>
                  <span className="coverage__region-detail">{r.detail}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="coverage__note">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" style={{ flexShrink: 0, color: 'var(--orange)', marginTop: 2 }}>
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <span>Consulte disponibilidade para rotas não listadas. Operamos também
              transferências pontuais para demais estados mediante cotação.</span>
          </div>
        </div>

        {/* Right: Map visual */}
        <div className="coverage__map-area">
          <div className="coverage__map-card">
            <div className="coverage__map-img">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80&auto=format"
                alt="Mapa de cobertura"
                loading="lazy"
              />
              <div className="coverage__map-overlay">
                <div className="coverage__map-badge">
                  <span className="coverage__map-badge-value">100+</span>
                  <span className="coverage__map-badge-label">Municípios atendidos</span>
                </div>
              </div>
            </div>
            <div className="coverage__map-stats">
              <div className="coverage__map-stat">
                <span>{new Set(REGIONS.map(r => r.region.includes("São Paulo") || r.region.includes("SP") ? "SP" : r.region)).size}</span>
                <small>Estados</small>
              </div>
              <div className="coverage__map-stat-divider" />
              <div className="coverage__map-stat">
                <span>100+</span>
                <small>Cidades</small>
              </div>
              <div className="coverage__map-stat-divider" />
              <div className="coverage__map-stat">
                <span>48h</span>
                <small>Prazo médio</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Coverage
