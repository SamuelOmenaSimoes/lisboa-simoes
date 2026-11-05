import React from 'react'
import { COMPANY } from '../../data/company'
import './About.css'

const About: React.FC = () => {
  return (
    <section className="about" id="sobre">
      <div className="container about__grid">
        {/* Left: Image block */}
        <div className="about__visual">
          <div className="about__img-main">
            <img
              src="/images/fotoc1.jpeg"
              alt="Operação logística Lisboa Simões"
              loading="lazy"
            />
          </div>
          <div className="about__img-secondary">
            <img
              src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&q=80&auto=format"
              alt="Frota Lisboa Simões"
              loading="lazy"
            />
          </div>
          <div className="about__badge-founded">
            <span className="about__badge-year">{COMPANY.founded}</span>
            <span className="about__badge-text">Fundação</span>
          </div>
        </div>

        {/* Right: Content */}
        <div className="about__content">
          <span className="section-label">Sobre a Empresa</span>
          <h2 className="section-title">
            Solidez operacional<br />
            <span>com experiência e compromisso</span>
          </h2>
          <p className="about__text">
            A Lisboa Simões nasceu da necessidade de oferecer ao mercado uma
            transportadora que entende a logística como ativo estratégico — não
            apenas como custo. Fundada em {COMPANY.founded}, desenvolvemos ao
            longo dos anos uma estrutura robusta, tecnológica e orientada a
            resultados.
          </p>
          <p className="about__text">
            Nosso modelo operacional combina frota própria com gestão inteligente
            de rotas, garantindo eficiência em cada entrega. Atendemos desde
            pequenas indústrias até grandes redes de distribuição com o mesmo
            padrão de excelência.
          </p>

          <div className="about__pillars">
            {[
              { title: 'Missão', text: 'Conectar empresas com eficiência logística, segurança e tecnologia.' },
              { title: 'Visão', text: 'Ser referência nacional em transporte corporativo até 2030.' },
              { title: 'Valores', text: 'Comprometimento, transparência, inovação e segurança acima de tudo.' },
            ].map((p) => (
              <div className="about__pillar" key={p.title}>
                <span className="about__pillar-title">{p.title}</span>
                <span className="about__pillar-text">{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
