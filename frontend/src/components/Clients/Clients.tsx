import { CLIENTS_SEGMENTS } from '../../data/company'
import './Clients.css'

export default function Clients() {
  return (
    <section className="clients" id="segmentos">
      <div className="container">
        <div className="clients__header">
          <span className="section-label">Segmentos atendidos</span>
          <h2 className="section-title">Soluções para diferentes<br /><span>setores da indústria</span></h2>
        </div>
        <p className="clients__intro">Transporte de resíduos com planejamento adequado às necessidades de cada segmento.</p>
        <div className="clients__tags">
          {CLIENTS_SEGMENTS.map(segment => <span className="clients__tag" key={segment}>{segment}</span>)}
        </div>
      </div>
    </section>
  )
}
