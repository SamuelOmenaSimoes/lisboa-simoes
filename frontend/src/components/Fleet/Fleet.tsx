import React from 'react'
import { FLEET } from '../../data/company'
import './Fleet.css'

const Fleet: React.FC = () => {
  return (
    <section className="fleet" id="frota">
      <div className="container">
        <div className="fleet__header">
          <div>
            <span className="section-label">Frota Operacional</span>
            <h2 className="section-title">
              Estrutura para<br />
              <span>qualquer volume</span>
            </h2>
          </div>
          <p className="section-subtitle">
            Frota própria com manutenção preventiva programada e renovação
            constante para garantir confiabilidade operacional.
          </p>
        </div>

        <div className="fleet__photo-strip">
          <div className="fleet__photo fleet__photo--wide">
            <img
              src="/images/fotoc2.jpeg"
              alt="Frota de caminhões Lisboa Simões"
              loading="lazy"
            />
          </div>
          <div className="fleet__photo-col">
            <div className="fleet__photo">
              <img
                src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=500&q=80&auto=format"
                alt="Veículos de entrega"
                loading="lazy"
              />
            </div>
            <div className="fleet__photo">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80&auto=format"
                alt="Operação logística"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Fleet table */}
        <div className="fleet__table">
          <div className="fleet__table-header">
            <span>Tipo de Veículo</span>
            <span>Capacidade</span>
            <span>Unidades</span>
            <span>Aplicação</span>
          </div>
          {FLEET.map((item, i) => (
            <div className="fleet__table-row" key={i}>
              <span className="fleet__table-type">{item.type}</span>
              <span className="fleet__table-cap">{item.capacity}</span>
              <span className="fleet__table-count">{item.count}</span>
              <span className="fleet__table-use">{item.use}</span>
            </div>
          ))}
        </div>

        <p className="fleet__disclaimer">
          Toda a frota passa por revisão preventiva a cada 10.000 km. Manutenção
          realizada em oficina própria com equipe mecânica especializada.
        </p>
      </div>
    </section>
  )
}

export default Fleet
