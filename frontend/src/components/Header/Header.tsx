import React, { useState, useEffect } from 'react'
import { COMPANY } from '../../data/company'
import './Header.css'

const NAV_ITEMS = [
  { label: 'A Empresa', href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Frota', href: '#frota' },
  { label: 'Cobertura', href: '#cobertura' },
  { label: 'Calculadora', href: '#calculadora' },
  { label: 'Contato', href: '#contato' },
]

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [menuOpen])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__bar container">
        {/* Logo */}
        <a href="#" className="header__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/brand/lisitrans-dark.svg" alt="Lisitrans — Soluções em transportes de resíduos" className="brand-logo brand-logo--header" width="586" height="286" />
        </a>

        {/* Desktop Nav */}
        <nav className="header__nav hide-mobile">
          {NAV_ITEMS.map(item => (
            <button
              key={item.href}
              className="header__nav-link"
              onClick={() => handleNavClick(item.href)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="header__actions hide-mobile">
          <a href={`tel:${COMPANY.phone}`} className="header__phone">
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
            {COMPANY.phone}
          </a>
          <button
            className="btn-primary btn-sm"
            onClick={() => handleNavClick('#contato')}
          >
            Solicitar Orçamento
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className={`header__burger hide-desktop ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div id="mobile-navigation" hidden={!menuOpen} className={`header__mobile-menu ${menuOpen ? 'header__mobile-menu--open' : ''}`}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.href}
            className="header__mobile-link"
            onClick={() => handleNavClick(item.href)}
          >
            {item.label}
          </button>
        ))}
        <a href={`tel:${COMPANY.phone}`} className="header__mobile-phone">{COMPANY.phone}</a>
        <button
          className="btn-primary w-full"
          onClick={() => handleNavClick('#contato')}
        >
          Solicitar Orçamento
        </button>
      </div>
    </header>
  )
}

export default Header
