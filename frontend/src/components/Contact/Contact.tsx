import React, { useState, useEffect, useRef } from 'react'
import { CARGO_TYPES } from '../../services/freight'
import { postJson } from '../../services/http'
import { COMPANY } from '../../data/company'
import { ContactForm } from '../../types'
import './Contact.css'

const CARGO_OPTIONS = [...CARGO_TYPES.map(c => c.label), 'Resíduo Líquido Perigoso', 'Carga Dedicada', 'Outro']

const initialForm: ContactForm = {
  name: '', company: '', email: '', phone: '',
  origin: '', destination: '', cargoType: '', message: '',
}

const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactForm>(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [protocol, setProtocol] = useState('')
  const [privacy, setPrivacy] = useState(false)
  const sendingLock = useRef(false)
  const submission = useRef({ payload: '', requestId: '' })

  useEffect(() => {
    const receiveQuote = (event: Event) => {
      const detail = (event as CustomEvent<Partial<ContactForm>>).detail
      setForm(previous => ({ ...previous, ...detail })); setSubmitted(false)
    }
    window.addEventListener('freight-quote', receiveQuote)
    return () => window.removeEventListener('freight-quote', receiveQuote)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sendingLock.current || !privacy) return
    sendingLock.current=true; setSending(true); setError('')
    const payload=JSON.stringify({ ...form, privacyAccepted:privacy })
    if (submission.current.payload !== payload) submission.current={payload,requestId:crypto.randomUUID()}
    try {
      const result=await postJson('contact',{...form,privacyAccepted:privacy,requestId:submission.current.requestId},60000)
      if (!result || typeof result !== 'object' || !('success' in result) || result.success !== true || !('protocol' in result) || typeof result.protocol !== 'string' || !/^[a-f0-9-]{36}$/i.test(result.protocol)) throw new Error('O servidor não confirmou o envio. Aguarde antes de tentar novamente ou utilize o e-mail de contato.')
      setProtocol(result.protocol); setSubmitted(true)
    } catch (err) {setError(err instanceof Error?err.message:'Não foi possível enviar a solicitação.')}
    finally {sendingLock.current=false;setSending(false)}
  }

  return (
    <section className="contact" id="contato">
      <div className="container contact__layout">
        {/* Left info */}
        <div className="contact__info">
          <span className="section-label">Contato</span>
          <h2 className="section-title">
            Vamos conversar<br />
            <span>sobre sua operação</span>
          </h2>
          <p className="contact__intro">
            Nossa equipe comercial está pronta para entender as necessidades
            da sua empresa e apresentar a melhor solução logística.
          </p>

          <div className="contact__channels">
            {[
              {
                icon: (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                ),
                label: 'Telefone',
                value: COMPANY.phone,
                href: `tel:${COMPANY.phone}`,
              },
              {
                icon: (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                ),
                label: 'E-mail',
                value: COMPANY.email,
                href: `mailto:${COMPANY.email}`,
              },
              {
                icon: (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                ),
                label: 'Endereço',
                value: `${COMPANY.address} — ${COMPANY.city}`,
                href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${COMPANY.address} ${COMPANY.city}`)}`,
              },
            ].map((ch, i) => (
              <a href={ch.href} className="contact__channel" key={i}>
                <div className="contact__channel-icon">{ch.icon}</div>
                <div>
                  <span className="contact__channel-label">{ch.label}</span>
                  <span className="contact__channel-value">{ch.value}</span>
                </div>
              </a>
            ))}
          </div>

          <a
            href={`https://wa.me/${COMPANY.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact__whatsapp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Falar no WhatsApp
          </a>
        </div>

        {/* Form */}
        <div className="contact__form-wrap">
          {submitted ? (
            <div className="contact__success" role="status" aria-live="polite">
              <div className="contact__success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3>Solicitação recebida</h3>
              <p>Sua solicitação foi encaminhada à equipe comercial. Protocolo: {protocol}.</p>
              <button className="btn-secondary" onClick={() => { setSubmitted(false); setForm(initialForm); setPrivacy(false); setError(''); submission.current={payload:'',requestId:''} }}>
                Nova solicitação
              </button>
            </div>
          ) : (
            <div className="contact__form-card">
              <h3 className="contact__form-title">Solicitar Orçamento</h3>
              <form className="contact__form" onSubmit={handleSubmit} aria-busy={sending}>
                <fieldset disabled={sending} className="contact__fieldset">
                <div className="contact__form-row">
                  <div className="contact__field">
                    <label className="calc__label" htmlFor="contact-name">Nome completo *</label>
                    <input id="contact-name" name="name" className="calc__input" type="text" placeholder="Seu nome" maxLength={120} autoComplete="name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="contact__field">
                    <label className="calc__label" htmlFor="contact-company">Empresa *</label>
                    <input id="contact-company" name="company" className="calc__input" type="text" placeholder="Nome da empresa" maxLength={160} autoComplete="organization" value={form.company} onChange={handleChange} required />
                  </div>
                </div>
                <div className="contact__form-row">
                  <div className="contact__field">
                    <label className="calc__label" htmlFor="contact-email">E-mail *</label>
                    <input id="contact-email" name="email" className="calc__input" type="email" placeholder="seu@email.com" maxLength={254} autoComplete="email" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="contact__field">
                    <label className="calc__label" htmlFor="contact-phone">Telefone / WhatsApp</label>
                    <input id="contact-phone" name="phone" className="calc__input" type="tel" placeholder="(11) 9 0000-0000" maxLength={40} autoComplete="tel" value={form.phone} onChange={handleChange} />
                  </div>
                </div>
                <div className="contact__form-row">
                  <div className="contact__field">
                    <label className="calc__label" htmlFor="contact-origin">Origem da carga</label>
                    <input id="contact-origin" name="origin" className="calc__input" type="text" placeholder="Cidade / Estado" maxLength={200} value={form.origin} onChange={handleChange} />
                  </div>
                  <div className="contact__field">
                    <label className="calc__label" htmlFor="contact-destination">Destino da carga</label>
                    <input id="contact-destination" name="destination" className="calc__input" type="text" placeholder="Cidade / Estado" maxLength={200} value={form.destination} onChange={handleChange} />
                  </div>
                </div>
                <div className="contact__field">
                  <label className="calc__label" htmlFor="contact-cargoType">Tipo de carga</label>
                    <select id="contact-cargoType" name="cargoType" className="calc__input calc__select" value={form.cargoType} onChange={handleChange}>
                    <option value="">Selecione...</option>
                    {CARGO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="contact__field">
                  <label className="calc__label" htmlFor="contact-message">Informações adicionais</label>
                    <textarea id="contact-message" name="message"
                    className="calc__input contact__textarea"
                    placeholder="Frequência de envios, volume mensal, necessidades específicas..."
                    maxLength={3000} value={form.message}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
                <label className="privacy-choice"><input type="checkbox" required checked={privacy} onChange={e => setPrivacy(e.target.checked)} />
                  <span>Li o <a href="#privacidade">aviso de privacidade</a> e estou ciente do uso dos dados para responder à solicitação.</span>
                </label>
                {error && <div className="freight-calc__error" role="alert"><p>{error} <a href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(`Solicitação de orçamento — ${form.company}`)}&body=${encodeURIComponent(Object.entries(form).map(([key,value]) => `${key}: ${value}`).join('\n'))}`}>Enviar pelo meu e-mail</a></p></div>}
                <button
                  className={`btn-primary btn-lg freight-calc__btn ${sending ? 'loading' : ''}`}
                  type="submit"
                  disabled={sending}
                >
                  {sending ? (
                    <><span className="freight-calc__btn-spinner" /> Enviando...</>
                  ) : (
                    <>Enviar Solicitação</>
                  )}
                </button>
                </fieldset>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Contact
