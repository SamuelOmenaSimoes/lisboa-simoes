import React from 'react'
import { COMPANY } from '../../data/company'
import './Footer.css'

const NAV_COLS = [
  {
    title: 'Serviços',
    links: ['Resíduo Líquido Perigoso', 'Carga Fracionada', 'Carga Dedicada',],
  },
  {
    title: 'Empresa',
    links: ['Sobre a Lisboa Simões', 'Nossa Frota', 'Cobertura', 'Segurança e Rastreabilidade', 'Diferenciais'],
  },
  {
    title: 'Atendimento',
    links: ['Solicitar Orçamento', 'Calculadora de Frete', 'Fale Conosco'],
  },
]

const Footer: React.FC = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        {/* Top */}
        <div className="footer__top">
          {/* Brand col */}
          <div className="footer__brand">
            <div className="footer__logo">
              <img src="/brand/lisitrans-dark.svg" alt="Lisitrans — Soluções em transportes de resíduos" className="brand-logo brand-logo--footer" width="586" height="286" loading="lazy" />
            </div>
            <p className="footer__tagline">
              Logística corporativa com segurança, rastreabilidade e eficiência operacional desde {COMPANY.founded}.
            </p>
            <div className="footer__certifications">
              {['ANTT Habilitado', 'RNTRC Ativo', 'ISO 9001'].map(c => (
                <span className="footer__cert" key={c}>{c}</span>
              ))}
            </div>
          </div>

          {/* Nav cols */}
          {NAV_COLS.map(col => (
            <div className="footer__nav-col" key={col.title}>
              <span className="footer__col-title">{col.title}</span>
              <ul>
                {col.links.map(link => (
                  <li key={link}>
                    <a href={link === "Calculadora de Frete" ? "#calculadora" : link === "Nossa Frota" ? "#frota" : link === "Cobertura" ? "#cobertura" : link === "Segurança e Rastreabilidade" ? "#seguranca" : link === "Diferenciais" ? "#diferenciais" : link === "Sobre a Lisboa Simões" ? "#sobre" : col.title === "Serviços" ? "#servicos" : "#contato"} className="footer__link">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__divider" />

        <details id="privacidade" className="privacy-notice"><summary>Aviso de privacidade</summary><p>Os dados enviados são usados para avaliar sua demanda e responder à solicitação comercial. Para assuntos relacionados aos seus dados, utilize o e-mail de contato do site. Não envie senhas ou informações sensíveis.</p></details>
        {/* Bottom */}
        <div className="footer__bottom">
          <div className="footer__legal">
            <span>© {year} Lisboa Simões Transportes. Todos os direitos reservados.</span>
            <span className="footer__cnpj">CNPJ {COMPANY.cnpj}</span>
          </div>
          <div className="footer__social">
            <a href={COMPANY.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href={COMPANY.instagram || '#'} target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
